import { Router } from "express";
import { UserModel } from "../models/User.js";
import { adminOnly, authRequired } from "../middleware/auth.js";

export function usersRouter(jwtSecret: string) {
  const router = Router();

  router.get("/me", authRequired(jwtSecret), async (req, res) => {
    const user = await UserModel.findById((req as any).user.sub).populate("savedUniversities");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  });

  router.put("/profile", authRequired(jwtSecret), async (req, res) => {
    const { name, phone, sscGpa, hscGpa, subject } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      (req as any).user.sub,
      { $set: { name, phone, sscGpa, hscGpa, subject } },
      { new: true }
    );
    return res.json(user);
  });

  router.post("/saved-universities/:id", authRequired(jwtSecret), async (req, res) => {
    const userId = (req as any).user.sub;
    const uniId = req.params.id;
    
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.savedUniversities.findIndex((id: any) => id.toString() === uniId);
    if (index > -1) {
      user.savedUniversities.splice(index, 1);
    } else {
      user.savedUniversities.push(uniId as any);
    }
    
    await user.save();
    return res.json({ savedUniversities: user.savedUniversities });
  });

  router.post("/documents", authRequired(jwtSecret), async (req, res) => {
    const { name, url } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      (req as any).user.sub,
      { $push: { documents: { name, url, status: "Pending", uploadedAt: new Date() } } },
      { new: true }
    );
    return res.json(user);
  });

  router.get("/", authRequired(jwtSecret), adminOnly, async (_req, res) => {
    const users = await UserModel.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });
    return res.json(users);
  });

  router.delete("/:id", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  });

  return router;
}

