import Patient from "../models/Patient.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Appointment from "../models/Appointment.js";
import Document from "../models/Document.js";

export const getAnalytics = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalRecords = await MedicalRecord.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalDocuments = await Document.countDocuments();
    const upcomingCount = await Appointment.countDocuments({ status: "Scheduled" });

    const recentPatients = await Patient.find().sort({ createdAt: -1 }).limit(5);

    const upcomingAppointments = await Appointment.find({ status: "Scheduled" })
      .populate("patient", "name phone")
      .sort({ date: 1 })
      .limit(5);

    const recentRecords = await MedicalRecord.find()
      .populate("patient", "name age gender")
      .sort({ visitDate: -1 })
      .limit(5);

    const scheduledCount = await Appointment.countDocuments({ status: "Scheduled" });
    const completedCount = await Appointment.countDocuments({ status: "Completed" });
    const cancelledCount = await Appointment.countDocuments({ status: "Cancelled" });

    const chartData = [
      { status: "Scheduled", count: scheduledCount },
      { status: "Completed", count: completedCount },
      { status: "Cancelled", count: cancelledCount }
    ];

    res.json({
      stats: {
        totalPatients,
        totalRecords,
        totalAppointments,
        totalDocuments,
        upcomingAppointments: upcomingCount
      },
      chartData,
      recentPatients,
      upcomingAppointments,
      recentRecords
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard analytics", error: error.message });
  }
};
