import MedicalRecord from "../models/MedicalRecord.js";
import Patient from "../models/Patient.js";

export const getRecords = async (req, res) => {
  try {
    const { diagnosis, doctor, date } = req.query;
    let query = {};

    if (diagnosis) {
      query.diagnosis = { $regex: diagnosis, $options: "i" };
    }
    if (doctor) {
      query.doctor = { $regex: doctor, $options: "i" };
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.visitDate = { $gte: startDate, $lt: endDate };
    }

    const records = await MedicalRecord.find(query)
      .populate("patient", "name age gender bloodGroup phone")
      .sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical records", error: error.message });
  }
};

export const getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).populate("patient");
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch record", error: error.message });
  }
};

export const getPatientRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate("patient", "name age gender")
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient medical history", error: error.message });
  }
};

export const createRecord = async (req, res) => {
  try {
    const { patient, doctor, symptoms, diagnosis, prescriptions } = req.body;
    if (!patient || !doctor || !symptoms || !diagnosis) {
      return res.status(400).json({ message: "Patient, doctor, symptoms, and diagnosis are required" });
    }

    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) return res.status(404).json({ message: "Associated patient not found" });

    const record = await MedicalRecord.create(req.body);
    const populatedRecord = await MedicalRecord.findById(record._id).populate("patient");

    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({ message: "Failed to create medical record", error: error.message });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("patient");

    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: "Failed to update medical record", error: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete medical record", error: error.message });
  }
};
