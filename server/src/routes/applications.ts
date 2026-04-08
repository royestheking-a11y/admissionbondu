import { Router } from "express";
import { z } from "zod";
import { ApplicationModel } from "../models/Application";
import { adminOnly, authRequired } from "../middleware/auth";

const ApplicationCreateSchema = z.object({
  studentName: z.string().min(1),
  studentEmail: z.string().email(),
  phone: z.string().min(1),
  gpa: z.string().min(1),
  sscRoll: z.string().min(1),
  hscRoll: z.string().min(1),
  regNumber: z.string().min(1),
  subject: z.string().min(1),
  universities: z.array(z.string()).min(1),
  package: z.string().min(1),
  packagePrice: z.number(),
  paymentMethod: z.string().min(1),
  transactionId: z.string().min(1),
});

export function applicationsRouter(jwtSecret: string) {
  const router = Router();

  router.get("/", authRequired(jwtSecret), async (req, res) => {
    const q = z
      .object({
        studentEmail: z.string().email().optional(),
        limit: z.coerce.number().optional(),
        skip: z.coerce.number().optional(),
      })
      .safeParse(req.query);
    if (!q.success) return res.status(400).json({ error: "Invalid query" });
    const { studentEmail, limit, skip } = q.data;

    const user = (req as any).user as { role: string; email: string };
    const filter: any = {};
    if (user.role !== "admin") {
      filter.studentEmail = user.email;
    } else if (studentEmail) {
      filter.studentEmail = studentEmail.toLowerCase();
    }

    const docs = await ApplicationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip ?? 0)
      .limit(limit ?? 500);

    return res.json(docs);
  });

  router.post("/", async (req, res) => {
    const parsed = ApplicationCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });

    const ref = `BD${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const created = await ApplicationModel.create({
      ref,
      ...parsed.data,
      studentEmail: parsed.data.studentEmail.toLowerCase(),
      status: "Pending",
      progress: 20,
      submittedDate: now,
      lastUpdate: now,
      steps: [
        { name: "Application Submitted", done: true, date: "Today" },
        { name: "Payment Verified", done: false, date: "Pending" },
        { name: "Documents Verified", done: false, date: "Pending" },
        { name: "Form Filled by Agent", done: false, date: "Pending" },
        { name: "Admission Confirmed", done: false, date: "Pending" },
      ],
    });

    return res.status(201).json(created);
  });

  router.put("/:id", authRequired(jwtSecret), async (req, res) => {
    const user = (req as any).user as { role: string; email: string };
    const parsed = z
      .object({
        status: z.enum(["Pending", "Processing", "Submitted", "Approved", "Rejected"]).optional(),
        progress: z.number().optional(),
        lastUpdate: z.string().optional(),
        steps: z
          .array(z.object({ name: z.string(), done: z.boolean(), date: z.string() }))
          .optional(),
      })
      .safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

    const existing = await ApplicationModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (user.role !== "admin" && existing.studentEmail !== user.email) return res.status(403).json({ error: "Forbidden" });

    const updated = await ApplicationModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    return res.json(updated);
  });

  router.delete("/:id", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const deleted = await ApplicationModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  });

  return router;
}

