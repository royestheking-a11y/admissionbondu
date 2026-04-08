import mongoose, { Schema } from "mongoose";

export interface LifestyleCosts {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
}

export interface CityData {
  name: string;
  lifestyle: {
    budget: LifestyleCosts;
    standard: LifestyleCosts;
    premium: LifestyleCosts;
  };
  hostelRent: { min: number; max: number };
  privateRent: { min: number; max: number };
  description: string;
}

export interface AccommodationTypeCard {
  title: string;
  pros: string[];
  cons: string[];
  cost: string;
  icon: string;
}

export interface AccommodationDoc {
  cityData: Record<string, CityData>;
  accomTypes: AccommodationTypeCard[];
  createdAt: Date;
  updatedAt: Date;
}

const LifestyleCostsSchema = new Schema<LifestyleCosts>(
  {
    rent: { type: Number, required: true },
    food: { type: Number, required: true },
    transport: { type: Number, required: true },
    utilities: { type: Number, required: true },
  },
  { _id: false }
);

const CityDataSchema = new Schema<CityData>(
  {
    name: { type: String, required: true },
    lifestyle: {
      budget: { type: LifestyleCostsSchema, required: true },
      standard: { type: LifestyleCostsSchema, required: true },
      premium: { type: LifestyleCostsSchema, required: true },
    },
    hostelRent: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    privateRent: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    description: { type: String, required: true },
  },
  { _id: false }
);

const AccommodationTypeCardSchema = new Schema<AccommodationTypeCard>(
  {
    title: { type: String, required: true },
    pros: { type: [String], required: true, default: [] },
    cons: { type: [String], required: true, default: [] },
    cost: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { _id: false }
);

const AccommodationSchema = new Schema<AccommodationDoc>(
  {
    cityData: { type: Schema.Types.Mixed, required: true },
    accomTypes: { type: [AccommodationTypeCardSchema], required: true, default: [] },
  },
  { timestamps: true }
);

export const AccommodationModel =
  mongoose.models.Accommodation || mongoose.model<AccommodationDoc>("Accommodation", AccommodationSchema);

