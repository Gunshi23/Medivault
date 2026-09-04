import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import recordRoutes from "./routes/records.js";
import appointmentRoutes from "./routes/appointments.js";
import documentRoutes from "./routes/documents.js";
import dashboardRoutes from "./routes/dashboard.js";

import Patient from "./models/Patient.js";
import { seedData } from "./seed.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ message: "MediVault API is running smoothly", timestamp: new Date() });
});

// Mounted Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  // Auto-seed database if empty (e.g. MongoMemoryServer instance)
  try {
    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      console.log("Database is empty. Auto-populating internship demo data...");
      await seedData();
    }
  } catch (seedErr) {
    console.error("Auto-seed error:", seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`✚ MediVault Backend Server running on http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer();
