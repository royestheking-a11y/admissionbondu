/// <reference types="node" />
import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "../db";
import { getEnv } from "../env";
import { UniversityModel } from "../models/University";
import { NoticeModel } from "../models/Notice";
import { AccommodationModel } from "../models/Accommodation";
import { UserModel } from "../models/User";

// Seed sources come from the existing frontend TS files.
import * as UniversitiesModule from "../../../src/app/data/universities";
import * as NoticeModule from "../../../src/app/data/notices";
import * as AccommodationModule from "../../../src/app/data/accommodation";

const seedUniversitiesData = (UniversitiesModule as any).universities as any[] | undefined;
const seedNoticesData = (NoticeModule as any).initialNotices as any[] | undefined;
const initialCityData = (AccommodationModule as any).initialCityData as any;
const initialAccomTypes = (AccommodationModule as any).initialAccomTypes as any[] | undefined;

function toUniUpsertKey(u: any) {
  return { name: u.name, shortName: u.shortName };
}

async function seedUsers() {
  const adminEmail = "admin@admissionbondu.com";

  const admin = await UserModel.findOne({ email: adminEmail });
  if (!admin) {
    await UserModel.create({
      name: "System Admin",
      email: adminEmail,
      phone: "+880 1999-999999",
      studentId: "ADMIN-001",
      role: "admin",
      passwordHash: await bcrypt.hash("admin123", 10),
    });
  }
}

async function seedUniversities() {
  if (!Array.isArray(seedUniversitiesData)) {
    throw new Error("Seed universities not found (expected export const universities: []).");
  }
  // Upsert by (name, shortName) to prevent duplicates when re-running.
  for (const u of seedUniversitiesData) {
    const update = {
      legacyId: u.id,
      ...u,
    };
    delete (update as any).id;
    await UniversityModel.updateOne(toUniUpsertKey(u), { $set: update }, { upsert: true });
  }
}

async function seedNotices() {
  if (!Array.isArray(seedNoticesData)) {
    throw new Error("Seed notices not found (expected export const initialNotices: []).");
  }
  // Seed in reverse order so that notices at the start of the array (newest)
  // are created last, giving them a later createdAt timestamp.
  for (const n of [...seedNoticesData].reverse()) {
    const filter = { legacyId: n.id };
    const update = {
      legacyId: n.id,
      title: n.title,
      category: n.category,
      date: n.date,
      description: n.description,
      urgent: !!n.urgent,
      hasPDF: !!n.hasPDF,
    };
    await NoticeModel.updateOne(filter, { $set: update }, { upsert: true });
  }
}

async function seedAccommodation() {
  if (!initialCityData || !Array.isArray(initialAccomTypes)) {
    throw new Error("Seed accommodation not found (expected initialCityData + initialAccomTypes exports).");
  }
  const existing = await AccommodationModel.findOne();
  const payload = {
    cityData: initialCityData as any,
    accomTypes: initialAccomTypes as any,
  };

  if (!existing) {
    await AccommodationModel.create(payload);
    return;
  }

  existing.cityData = payload.cityData;
  existing.accomTypes = payload.accomTypes;
  await existing.save();
}

async function main() {
  const env = getEnv();
  await connectDb(env.MONGODB_URI);

  await seedUsers();
  await seedUniversities();
  await seedNotices();
  await seedAccommodation();

  // eslint-disable-next-line no-console
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

