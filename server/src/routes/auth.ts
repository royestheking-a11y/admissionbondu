import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserModel } from "../models/User.js";
import { signJwt } from "../auth/jwt.js";
import { OAuth2Client } from "google-auth-library";

export function authRouter(jwtSecret: string, googleClientId?: string) {
  const router = Router();
  const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

  router.post("/register", async (req, res) => {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      password: z.string().min(6),
      role: z.enum(["student", "admin"]).optional(),
      sscGpa: z.string().optional(),
      hscGpa: z.string().optional(),
      subject: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });

    const email = parsed.data.email.toLowerCase();
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const studentId = `BD-${Date.now().toString().slice(-8)}`;
    const user = await UserModel.create({
      name: parsed.data.name,
      email,
      phone: parsed.data.phone,
      role: parsed.data.role ?? "student",
      studentId,
      passwordHash,
      sscGpa: parsed.data.sscGpa,
      hscGpa: parsed.data.hscGpa,
      subject: parsed.data.subject,
    });

    return res.json({ success: true, id: user._id.toString() });
  });

  router.post("/login", async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

    const email = parsed.data.email.toLowerCase();
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = signJwt(
      { sub: user._id.toString(), role: user.role, email: user.email, name: user.name },
      jwtSecret
    );

    return res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        role: user.role,
        sscGpa: user.sscGpa,
        hscGpa: user.hscGpa,
        subject: user.subject,
      },
    });
  });

  router.post("/google", async (req, res) => {
    if (!googleClient) return res.status(400).json({ error: "Google auth not configured" });

    const schema = z.object({
      idToken: z.string().min(1),
      phone: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

    const ticket = await googleClient.verifyIdToken({
      idToken: parsed.data.idToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(401).json({ error: "Google token missing email" });

    const email = payload.email.toLowerCase();
    const name = payload.name || payload.given_name || "Google User";

    let user = await UserModel.findOne({ email });
    if (!user) {
      // For Google accounts, we still store a passwordHash (random) to satisfy schema.
      // Users authenticate via Google, so password is not used.
      const passwordHash = await bcrypt.hash(`google:${payload.sub}:${Date.now()}`, 10);
      const studentId = `BD-${Date.now().toString().slice(-8)}`;
      user = await UserModel.create({
        name,
        email,
        phone: parsed.data.phone || "N/A",
        role: "student",
        studentId,
        passwordHash,
      });
    }

    const token = signJwt(
      { sub: user._id.toString(), role: user.role, email: user.email, name: user.name },
      jwtSecret
    );

    return res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        role: user.role,
        sscGpa: user.sscGpa,
        hscGpa: user.hscGpa,
        subject: user.subject,
      },
    });
  });

  return router;
}

