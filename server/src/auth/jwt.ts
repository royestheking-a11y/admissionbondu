import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  role: "student" | "admin";
  email: string;
  name: string;
}

export function signJwt(payload: JwtPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

