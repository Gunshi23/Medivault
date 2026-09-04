import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    instructions: { type: String, trim: true, default: "" }
  },
  { _id: true }
);

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    doctor: { type: String, required: true, trim: true },
    visitDate: { type: Date, default: Date.now },
    symptoms: { type: String, required: true, trim: true },
    diagnosis: { type: String, required: true, trim: true },
    prescriptions: [prescriptionSchema],
    testResults: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    followUpDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
