import { Router } from "express";
import { UserModel } from "../models/User.js";
import { adminOnly, authRequired } from "../middleware/auth.js";

export function usersRouter(jwtSecret: string) {
  const router = Router();

  router.get("/", authRequired(jwtSecret), adminOnly, async (_req, res) => {
    const users = await UserModel.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });
    return res.json(
      users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        studentId: u.studentId,
        role: u.role,
        sscGpa: u.sscGpa,
        hscGpa: u.hscGpa,
        subject: u.subject,
      }))
    );
  });

  router.delete("/:id", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  });

  return router;
}

