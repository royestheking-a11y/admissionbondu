import { Router } from "express";
import { z } from "zod";
import { UniversityModel } from "../models/University";
import { adminOnly, authRequired } from "../middleware/auth";

const UniversityUpsertSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  type: z.enum(["public", "private"]),
  city: z.string().min(1),
  division: z.string().min(1),
  subjects: z.array(z.string()).default([]),
  tuitionMin: z.number(),
  tuitionMax: z.number(),
  admissionFee: z.number(),
  hostelMin: z.number(),
  hostelMax: z.number(),
  totalCostMin: z.number(),
  totalCostMax: z.number(),
  gpaMin: z.number(),
  duration: z.string().min(1),
  seats: z.number(),
  website: z.string().min(1),
  hasScholarship: z.boolean(),
  scholarshipPercent: z.string().min(1),
  hasFFQuota: z.boolean(),
  hasIndigenousQuota: z.boolean(),
  rating: z.number(),
  established: z.number(),
  logo: z.string().min(1),
  logoMedia: z
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
  description: z.string().min(1),
  departments: z.array(z.string()).default([]),
  deadline: z.string().min(1),
  category: z.string().min(1),
  programs: z
    .array(
      z.object({
        name: z.string(),
        degree: z.string(),
        tuitionPerCredit: z.number(),
        totalCredits: z.number(),
        admissionFee: z.number(),
        totalFee0Waiver: z.number(),
        totalFee25Waiver: z.number(),
      })
    )
    .optional(),
  diplomaFriendly: z.boolean().optional(),
});

export function universitiesRouter(jwtSecret: string) {
  const router = Router();

  router.get("/", async (req, res) => {
    const q = z
      .object({
        type: z.enum(["public", "private"]).optional(),
        city: z.string().optional(),
        division: z.string().optional(),
        category: z.string().optional(),
        subject: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["rating", "fee-low", "fee-high", "name"]).optional(),
        limit: z.coerce.number().optional(),
        skip: z.coerce.number().optional(),
      })
      .safeParse(req.query);

    if (!q.success) return res.status(400).json({ error: "Invalid query" });
    const { type, city, division, category, subject, search, sortBy, limit, skip } = q.data;

    const filter: any = {};
    if (type) filter.type = type;
    if (city) filter.city = city;
    if (division) filter.division = division;
    if (category) filter.category = category;
    if (subject) filter.subjects = subject;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortName: { $regex: search, $options: "i" } },
      ];
    }

    let sort: any = { rating: -1 };
    if (sortBy === "fee-low") sort = { tuitionMin: 1 };
    else if (sortBy === "fee-high") sort = { tuitionMax: -1 };
    else if (sortBy === "name") sort = { name: 1 };
    else if (sortBy === "rating") sort = { rating: -1 };

    const docs = await UniversityModel.find(filter)
      .sort(sort)
      .skip(skip ?? 0)
      .limit(limit ?? 500);

    return res.json(docs);
  });

  router.get("/:id", async (req, res) => {
    const doc = await UniversityModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    return res.json(doc);
  });

  router.post("/", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const parsed = UniversityUpsertSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
    const created = await UniversityModel.create(parsed.data);
    return res.status(201).json(created);
  });

  router.put("/:id", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const parsed = UniversityUpsertSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });
    const updated = await UniversityModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json(updated);
  });

  router.delete("/:id", authRequired(jwtSecret), adminOnly, async (req, res) => {
    const deleted = await UniversityModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  });

  return router;
}

