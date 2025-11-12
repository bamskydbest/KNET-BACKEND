import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  message?: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", ContactSchema);
