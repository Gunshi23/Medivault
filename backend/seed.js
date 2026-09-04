import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Patient from "./models/Patient.js";
import MedicalRecord from "./models/MedicalRecord.js";
import Appointment from "./models/Appointment.js";
import Document from "./models/Document.js";

dotenv.config();

export async function seedData() {
  console.log("Seeding internship demo data into database...");

  // Reset existing demo collections
  await User.deleteMany({});
  await Patient.deleteMany({});
  await MedicalRecord.deleteMany({});
  await Appointment.deleteMany({});
  await Document.deleteMany({});

  // 1. Create Users
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const adminUser = await User.create({
    name: "Dr. Admin User",
    email: "admin@medivault.com",
    password: passwordHash,
    role: "Admin",
    phone: "+91 98765 43210"
  });

  const staffUser = await User.create({
    name: "Nurse Staff",
    email: "staff@medivault.com",
    password: passwordHash,
    role: "Medical Staff",
    phone: "+91 98765 12345"
  });

  const customUser = await User.create({
    name: "Gunshika Agarwal",
    email: "gunshikaagarwaldpr@gmail.com",
    password: passwordHash,
    role: "Admin",
    phone: "+91 91234 56789"
  });

  // 2. Create Patients
  const aarav = await Patient.create({
    name: "Aarav Sharma",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98111 22233",
    email: "aarav.sharma@example.com",
    address: "B-12, Sector 62, Noida, UP",
    emergencyContact: "+91 98111 99999 (Wife: Neha)",
    allergies: ["Penicillin", "Dust"],
    existingConditions: ["Hypertension"]
  });

  const priya = await Patient.create({
    name: "Priya Verma",
    age: 28,
    gender: "Female",
    bloodGroup: "A+",
    phone: "+91 98222 33344",
    email: "priya.verma@example.com",
    address: "Flat 402, Green Valley Apts, New Delhi",
    emergencyContact: "+91 98222 88888 (Father: Suresh)",
    allergies: ["Peanuts"],
    existingConditions: ["Mild Asthma"]
  });

  const rohan = await Patient.create({
    name: "Rohan Mehta",
    age: 45,
    gender: "Male",
    bloodGroup: "B-",
    phone: "+91 98333 44455",
    email: "rohan.mehta@example.com",
    address: "105, MG Road, Gurugram, HR",
    emergencyContact: "+91 98333 77777 (Brother: Amit)",
    allergies: ["Sulfa Drugs"],
    existingConditions: ["Type 2 Diabetes", "High Cholesterol"]
  });

  const ananya = await Patient.create({
    name: "Ananya Kapoor",
    age: 22,
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+91 98444 55566",
    email: "ananya.k@example.com",
    address: "78-A, Vasant Vihar, New Delhi",
    emergencyContact: "+91 98444 66666 (Mother: Ritu)",
    allergies: ["None"],
    existingConditions: ["Migraine"]
  });

  // 3. Create Medical Records & Prescriptions
  await MedicalRecord.create([
    {
      patient: aarav._id,
      doctor: "Dr. Rajesh Gupta (Cardiology)",
      visitDate: new Date("2026-07-15"),
      symptoms: "Elevated blood pressure, mild dizziness in morning",
      diagnosis: "Essential Stage 1 Hypertension",
      prescriptions: [
        { medicineName: "Amlodipine", dosage: "5 mg", frequency: "1 time/day", duration: "30 days", instructions: "Take in the morning with water" },
        { medicineName: "Telmisartan", dosage: "40 mg", frequency: "1 time/day", duration: "30 days", instructions: "After breakfast" }
      ],
      testResults: "BP: 142/92 mmHg, Lipid profile normal, ECG Normal sinus rhythm",
      notes: "Advised salt restriction (<3g/day) and 30 min daily brisk walking.",
      followUpDate: new Date("2026-08-30")
    },
    {
      patient: priya._id,
      doctor: "Dr. Sunita Rao (Pulmonology)",
      visitDate: new Date("2026-08-02"),
      symptoms: "Seasonal wheezing, chest tightness during evening jog",
      diagnosis: "Mild Intermittent Asthma",
      prescriptions: [
        { medicineName: "Levosalbutamol Inhaler", dosage: "100 mcg", frequency: "As needed", duration: "14 days", instructions: "2 puffs before physical exertion" },
        { medicineName: "Montelukast", dosage: "10 mg", frequency: "1 time/day", duration: "14 days", instructions: "At bedtime" }
      ],
      testResults: "Spirometry: FEV1 84% predicted (Reversible with bronchodilator)",
      notes: "Avoid allergen triggers. Peak flow meter training provided.",
      followUpDate: new Date("2026-09-10")
    },
    {
      patient: rohan._id,
      doctor: "Dr. Vikram Seth (Endocrinology)",
      visitDate: new Date("2026-08-10"),
      symptoms: "Increased thirst, fatigue, post-prandial glucose spike",
      diagnosis: "Type 2 Diabetes Mellitus Uncontrolled",
      prescriptions: [
        { medicineName: "Metformin ER", dosage: "500 mg", frequency: "2 times/day", duration: "60 days", instructions: "With morning and evening meals" },
        { medicineName: "Atorvastatin", dosage: "10 mg", frequency: "1 time/day", duration: "60 days", instructions: "After dinner" }
      ],
      testResults: "HbA1c: 7.8%, Fasting Blood Sugar: 145 mg/dL, PPBS: 210 mg/dL",
      notes: "Referred to clinical dietitian for low GI meal planning.",
      followUpDate: new Date("2026-10-10")
    }
  ]);

  // 4. Create Appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  await Appointment.create([
    {
      patient: aarav._id,
      patientName: "Aarav Sharma",
      doctor: "Dr. Rajesh Gupta",
      date: tomorrow,
      time: "10:30 AM",
      reason: "Hypertension Follow-up Checkup",
      status: "Scheduled"
    },
    {
      patient: priya._id,
      patientName: "Priya Verma",
      doctor: "Dr. Sunita Rao",
      date: nextWeek,
      time: "02:00 PM",
      reason: "Asthma Evaluation",
      status: "Scheduled"
    },
    {
      patient: rohan._id,
      patientName: "Rohan Mehta",
      doctor: "Dr. Vikram Seth",
      date: new Date("2026-08-10"),
      time: "11:00 AM",
      reason: "Diabetes Consultation",
      status: "Completed"
    },
    {
      patient: ananya._id,
      patientName: "Ananya Kapoor",
      doctor: "Dr. Meenakshi Sundaram",
      date: new Date("2026-08-05"),
      time: "04:30 PM",
      reason: "Migraine Symptom Review",
      status: "Cancelled"
    }
  ]);

  // 5. Create Documents
  await Document.create([
    {
      documentName: "Lipid_Profile_Report_Aarav.pdf",
      documentType: "Blood Test",
      patient: aarav._id,
      patientName: "Aarav Sharma",
      description: "Fasting lipid panel and CBC test results.",
      fileSize: "1.4 MB"
    },
    {
      documentName: "Chest_XRay_Priya.png",
      documentType: "X-Ray",
      patient: priya._id,
      patientName: "Priya Verma",
      description: "PA view chest radiography for asthma evaluation.",
      fileSize: "3.2 MB"
    },
    {
      documentName: "HbA1c_Lab_Report_Rohan.pdf",
      documentType: "Medical Report",
      patient: rohan._id,
      patientName: "Rohan Mehta",
      description: "Glycated hemoglobin lab analysis.",
      fileSize: "850 KB"
    }
  ]);

  console.log("Demo seed data successfully generated!");
}

if (process.argv[1].endsWith("seed.js")) {
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}
