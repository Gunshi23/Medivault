import Document from "../models/Document.js";
import Patient from "../models/Patient.js";

export const getDocuments = async (req, res) => {
  try {
    const { documentType, search, patientId } = req.query;
    let query = {};

    if (documentType && documentType !== "All") {
      query.documentType = documentType;
    }

    if (patientId) {
      query.patient = patientId;
    }

    if (search) {
      query.$or = [
        { documentName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const documents = await Document.find(query)
      .populate("patient", "name phone age")
      .sort({ uploadDate: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical documents", error: error.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { documentName, documentType, patient, description, fileSize } = req.body;

    if (!documentName || !documentType || !patient) {
      return res.status(400).json({ message: "Document name, type, and patient are required" });
    }

    const patientObj = await Patient.findById(patient);
    if (!patientObj) return res.status(404).json({ message: "Patient not found" });

    const document = await Document.create({
      documentName,
      documentType,
      patient,
      patientName: patientObj.name,
      description: description || "",
      fileSize: fileSize || "1.2 MB",
      fileUrl: "#"
    });

    const populated = await Document.findById(document._id).populate("patient");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Failed to create document record", error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.json({ message: "Document record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete document record", error: error.message });
  }
};
