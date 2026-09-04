import Patient from "../models/Patient.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Appointment from "../models/Appointment.js";
import Document from "../models/Document.js";

export const getPatients = async (req, res) => {
  try {
    const { search, gender, bloodGroup } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    if (gender && gender !== "All") {
      query.gender = gender;
    }

    if (bloodGroup && bloodGroup !== "All") {
      query.bloodGroup = bloodGroup;
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients", error: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const records = await MedicalRecord.find({ patient: patient._id }).sort({ visitDate: -1 });
    const appointments = await Appointment.find({ patient: patient._id }).sort({ date: -1 });
    const documents = await Document.find({ patient: patient._id }).sort({ uploadDate: -1 });

    res.json({
      ...patient.toObject(),
      records,
      appointments,
      documents
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient details", error: error.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    if (!name || age === undefined || !gender) {
      return res.status(400).json({ message: "Name, age, and gender are required" });
    }

    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: "Failed to create patient", error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: "Failed to update patient", error: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Clean up linked data
    await MedicalRecord.deleteMany({ patient: req.params.id });
    await Appointment.deleteMany({ patient: req.params.id });
    await Document.deleteMany({ patient: req.params.id });

    res.json({ message: "Patient and all associated records deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete patient", error: error.message });
  }
};
