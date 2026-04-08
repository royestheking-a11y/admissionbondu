import { Router } from "express";
import { UniversityModel } from "../models/University";

export function medicalRouter() {
  const router = Router();

  router.get("/", async (_req, res) => {
    const docs = await UniversityModel.find({
      $or: [{ category: { $regex: "medical", $options: "i" } }, { subjects: "MBBS" }],
    }).sort({ rating: -1 });
    return res.json(docs);
  });

  return router;
}

