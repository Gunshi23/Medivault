import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Medical Staff"],
      default: "Medical Staff"
    },
    phone: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
