import type { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../auth/jwt.js";

export function authRequired(jwtSecret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const payload = verifyJwt(token, jwtSecret);
      (req as any).user = payload;
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const u = (req as any).user as { role?: string } | undefined;
  if (!u || u.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}

