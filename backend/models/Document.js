import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    documentName: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      required: true,
      enum: ["Blood Test", "Prescription", "X-Ray", "Scan", "Medical Report", "Other"]
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    patientName: { type: String, trim: true },
    uploadDate: { type: Date, default: Date.now },
    description: { type: String, trim: true, default: "" },
    fileSize: { type: String, default: "1.2 MB" },
    fileUrl: { type: String, default: "#" }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
