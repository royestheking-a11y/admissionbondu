import mongoose, { Schema } from "mongoose";

export interface CloudinaryMedia {
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video" | "raw" | string;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
}

export interface Program {
  name: string;
  degree: string;
  tuitionPerCredit: number;
  totalCredits: number;
  admissionFee: number;
  totalFee0Waiver: number;
  totalFee25Waiver: number;
}

export interface UniversityDoc {
  legacyId?: number;
  name: string;
  shortName: string;
  type: "public" | "private";
  city: string;
  division: string;
  subjects: string[];
  tuitionMin: number;
  tuitionMax: number;
  admissionFee: number;
  hostelMin: number;
  hostelMax: number;
  totalCostMin: number;
  totalCostMax: number;
  gpaMin: number;
  duration: string;
  seats: number;
  website: string;
  hasScholarship: boolean;
  scholarshipPercent: string;
  hasFFQuota: boolean;
  hasIndigenousQuota: boolean;
  rating: number;
  established: number;
  logo: string;
  logoMedia?: CloudinaryMedia;
  description: string;
  departments: string[];
  deadline: string;
  category: string;
  programs?: Program[];
  diplomaFriendly?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryMediaSchema = new Schema<CloudinaryMedia>(
  {
    publicId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    resourceType: { type: String, required: true },
    bytes: { type: Number },
    format: { type: String },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const ProgramSchema = new Schema<Program>(
  {
    name: { type: String, required: true },
    degree: { type: String, required: true },
    tuitionPerCredit: { type: Number, required: true },
    totalCredits: { type: Number, required: true },
    admissionFee: { type: Number, required: true },
    totalFee0Waiver: { type: Number, required: true },
    totalFee25Waiver: { type: Number, required: true },
  },
  { _id: false }
);

const UniversitySchema = new Schema<UniversityDoc>(
  {
    legacyId: { type: Number, index: true },
    name: { type: String, required: true, trim: true, index: true },
    shortName: { type: String, required: true, trim: true, index: true },
    type: { type: String, required: true, enum: ["public", "private"], index: true },
    city: { type: String, required: true, trim: true, index: true },
    division: { type: String, required: true, trim: true, index: true },
    subjects: { type: [String], required: true, default: [] },
    tuitionMin: { type: Number, required: true },
    tuitionMax: { type: Number, required: true },
    admissionFee: { type: Number, required: true },
    hostelMin: { type: Number, required: true },
    hostelMax: { type: Number, required: true },
    totalCostMin: { type: Number, required: true },
    totalCostMax: { type: Number, required: true },
    gpaMin: { type: Number, required: true },
    duration: { type: String, required: true },
    seats: { type: Number, required: true },
    website: { type: String, required: true },
    hasScholarship: { type: Boolean, required: true },
    scholarshipPercent: { type: String, required: true },
    hasFFQuota: { type: Boolean, required: true },
    hasIndigenousQuota: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    established: { type: Number, required: true },
    logo: { type: String, required: true },
    logoMedia: { type: CloudinaryMediaSchema, required: false },
    description: { type: String, required: true },
    departments: { type: [String], required: true, default: [] },
    deadline: { type: String, required: true },
    category: { type: String, required: true, index: true },
    programs: { type: [ProgramSchema], required: false },
    diplomaFriendly: { type: Boolean, required: false },
  },
  { timestamps: true }
);

UniversitySchema.index({ name: 1, shortName: 1 }, { unique: true });

export const UniversityModel =
  mongoose.models.University || mongoose.model<UniversityDoc>("University", UniversitySchema);

