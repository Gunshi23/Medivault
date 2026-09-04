import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";

export const getAppointments = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { doctor: { $regex: search, $options: "i" } }
      ];
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name phone age gender")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patient, patientName, doctor, date, time, reason } = req.body;

    if (!doctor || !date || !time) {
      return res.status(400).json({ message: "Doctor, date, and time are required" });
    }

    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res.status(400).json({ message: "Appointment date cannot be in the past" });
    }

    let resolvedPatientName = patientName;
    if (patient) {
      const pObj = await Patient.findById(patient);
      if (pObj) resolvedPatientName = pObj.name;
    }

    if (!resolvedPatientName) {
      return res.status(400).json({ message: "Patient name or valid Patient selection is required" });
    }

    const appointment = await Appointment.create({
      patient: patient || undefined,
      patientName: resolvedPatientName,
      doctor,
      date: appointmentDate,
      time,
      reason: reason || "General Checkup",
      status: "Scheduled"
    });

    const populated = await Appointment.findById(appointment._id).populate("patient");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Failed to schedule appointment", error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { status, date } = req.body;

    if (date) {
      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today && status === "Scheduled") {
        return res.status(400).json({ message: "Scheduled date cannot be in the past" });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("patient");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: "Failed to update appointment", error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete appointment", error: error.message });
  }
};
