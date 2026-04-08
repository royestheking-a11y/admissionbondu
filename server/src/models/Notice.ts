import mongoose, { Schema } from "mongoose";
import type { CloudinaryMedia } from "./University.js";

export interface NoticeDoc {
  legacyId?: number;
  title: string;
  category: string;
  date: string;
  description: string;
  urgent: boolean;
  hasPDF: boolean;
  pdfMedia?: CloudinaryMedia;
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

const NoticeSchema = new Schema<NoticeDoc>(
  {
    legacyId: { type: Number, index: true },
    title: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    date: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    urgent: { type: Boolean, required: true, default: false, index: true },
    hasPDF: { type: Boolean, required: true, default: false },
    pdfMedia: { type: CloudinaryMediaSchema, required: false },
  },
  { timestamps: true }
);

export const NoticeModel = mongoose.models.Notice || mongoose.model<NoticeDoc>("Notice", NoticeSchema);

