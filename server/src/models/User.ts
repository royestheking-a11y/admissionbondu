import mongoose, { Schema } from "mongoose";

export type UserRole = "student" | "admin";

export interface UserDoc {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  role: UserRole;
  passwordHash: string;
  sscGpa?: string;
  hscGpa?: string;
  subject?: string;
  savedUniversities: mongoose.Types.ObjectId[];
  documents: Array<{
    name: string;
    url: string;
    status: "Pending" | "Verified" | "Rejected";
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true, index: true },
    role: { type: String, required: true, enum: ["student", "admin"], default: "student" },
    passwordHash: { type: String, required: true },
    sscGpa: { type: String },
    hscGpa: { type: String },
    subject: { type: String },
    savedUniversities: [{ type: Schema.Types.ObjectId, ref: "University" }],
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);

