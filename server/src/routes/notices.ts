import { Router } from "express";
import { z } from "zod";
import { NoticeModel } from "../models/Notice.js";
import { adminOnly, authRequired } from "../middleware/auth.js";

const NoticeUpsertSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
  urgent: z.boolean().default(false),
  hasPDF: z.boolean().default(false),
  pdfMedia: z
    .object({
      publicId: z.string(),
      secureUrl: z.string(),
      resourceType: z.string(),
      bytes: z.number().optional(),
      format: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
});

export function noticesRouter(jwtSecret: string) {
  const router = Router();

  router.get("/", async (req, res) => {
    const q = z
      .object({
        category: z.string().optional(),
        search: z.string().optional(),
        urgent: z.coerce.boolean().optional(),
        limit: z.coerce.number().optional(),
        skip: z.coerce.number().optional(),
      })
      .safeParse(req.query);

    if (!q.success) return res.status(400).json({ error: "Invalid query" });
    const { category, search, urgent, limit, skip } = q.data;

    const filter: any = {};
    if (category && category !== "All") filter.category = category;
    if (typeof urgent === "boolean") filter.urgent = urgent;
    if (search) filter.title = { $regex: search, $options: "i" };

    const docs = await NoticeModel.find(filter)
      .sort({ urgent: -1, createdAt: -1 })
      .skip(skip ?? 0)
      .limit(limit ?? 200);

    return res.json(docs);
  });

  router.post("/", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const parsed = NoticeUpsertSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
    const created = await NoticeModel.create(parsed.data);
    return res.status(201).json(created);
  });

  router.put("/:id", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const parsed = NoticeUpsertSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });
    const updated = await NoticeModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json(updated);
  });

  router.delete("/:id", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const deleted = await NoticeModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  });

  return router;
}

