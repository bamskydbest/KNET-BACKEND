import mongoose, { Schema } from "mongoose";
const ContactSchema = new Schema({
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    message: { type: String },
}, { timestamps: true });
export default mongoose.model("Contact", ContactSchema);
