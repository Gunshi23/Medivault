import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    bloodGroup: { type: String, trim: true, default: "Unknown" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    address: { type: String, trim: true, default: "" },
    emergencyContact: { type: String, trim: true, default: "" },
    allergies: { type: [String], default: [] },
    existingConditions: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
