import { Router } from "express";
import { z } from "zod";
import { AccommodationModel } from "../models/Accommodation";
import { adminOnly, authRequired } from "../middleware/auth";

const AccommodationUpsertSchema = z.object({
  cityData: z.record(z.any()),
  accomTypes: z.array(
    z.object({
      title: z.string(),
      pros: z.array(z.string()),
      cons: z.array(z.string()),
      cost: z.string(),
      icon: z.string(),
    })
  ),
});

export function accommodationRouter(jwtSecret: string) {
  const router = Router();

  router.get("/", async (_req, res) => {
    const doc = await AccommodationModel.findOne().sort({ createdAt: -1 });
    if (!doc) return res.json(null);
    return res.json(doc);
  });

  router.put("/", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const parsed = AccommodationUpsertSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });

    const existing = await AccommodationModel.findOne().sort({ createdAt: -1 });
    if (!existing) {
      const created = await AccommodationModel.create(parsed.data);
      return res.status(201).json(created);
    }

    existing.cityData = parsed.data.cityData as any;
    existing.accomTypes = parsed.data.accomTypes as any;
    await existing.save();
    return res.json(existing);
  });

  return router;
}

