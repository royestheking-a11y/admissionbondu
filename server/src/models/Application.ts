import mongoose, { Schema, Types } from "mongoose";

export type ApplicationStatus = "Pending" | "Processing" | "Submitted" | "Approved" | "Rejected";

export interface ApplicationStep {
  name: string;
  done: boolean;
  date: string;
}

export interface ApplicationDoc {
  ref: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  gpa: string;
  sscRoll: string;
  hscRoll: string;
  regNumber: string;
  subject: string;
  universities: string[];
  package: string;
  packagePrice: number;
  paymentMethod: string;
  transactionId: string;
  status: ApplicationStatus;
  progress: number;
  submittedDate: string;
  lastUpdate: string;
  steps: ApplicationStep[];
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationStepSchema = new Schema<ApplicationStep>(
  {
    name: { type: String, required: true },
    done: { type: Boolean, required: true },
    date: { type: String, required: true },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<ApplicationDoc>(
  {
    ref: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String, required: true },
    gpa: { type: String, required: true },
    sscRoll: { type: String, required: true },
    hscRoll: { type: String, required: true },
    regNumber: { type: String, required: true },
    subject: { type: String, required: true },
    universities: { type: [String], required: true, default: [] },
    package: { type: String, required: true },
    packagePrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, required: true },
    progress: { type: Number, required: true },
    submittedDate: { type: String, required: true },
    lastUpdate: { type: String, required: true },
    steps: { type: [ApplicationStepSchema], required: true, default: [] },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

export const ApplicationModel =
  mongoose.models.Application || mongoose.model<ApplicationDoc>("Application", ApplicationSchema);

