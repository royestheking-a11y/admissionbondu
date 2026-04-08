import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { getEnv } from "./env.js";
import { connectDb } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { universitiesRouter } from "./routes/universities.js";
import { noticesRouter } from "./routes/notices.js";
import { applicationsRouter } from "./routes/applications.js";
import { accommodationRouter } from "./routes/accommodation.js";
import { usersRouter } from "./routes/users.js";
import { medicalRouter } from "./routes/medical.js";

const env = getEnv();

async function main() {
  await connectDb(env.MONGODB_URI);

  const app = express();
  app.use(morgan("dev"));
  const allowedOrigins = env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  app.use(
    cors({
      origin:
        allowedOrigins === "*"
          ? true
          : (origin, cb) => {
              // Allow non-browser requests (no origin) and allowlisted origins.
              if (!origin) return cb(null, true);
              if ((allowedOrigins as string[]).includes(origin)) return cb(null, true);
              return cb(new Error("CORS blocked"));
            },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter(env.JWT_SECRET, env.GOOGLE_CLIENT_ID));
  app.use("/api/universities", universitiesRouter(env.JWT_SECRET));
  app.use("/api/notices", noticesRouter(env.JWT_SECRET));
  app.use("/api/applications", applicationsRouter(env.JWT_SECRET));
  app.use("/api/accommodation", accommodationRouter(env.JWT_SECRET));
  app.use("/api/users", usersRouter(env.JWT_SECRET));
  app.use("/api/medical", medicalRouter());

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

