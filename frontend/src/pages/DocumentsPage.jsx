import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    documentName: "",
    documentType: "Blood Test",
    patient: "",
    description: "",
    fileSize: "1.2 MB"
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDocuments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter !== "All") params.append("documentType", typeFilter);
    if (search) params.append("search", search);

    api.get(`/documents?${params.toString()}`)
      .then((res) => setDocuments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDocuments();
    api.get("/patients").then((res) => setPatients(res.data)).catch(console.error);
  }, [typeFilter, search]);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/documents", form);
      setMessage("Document record uploaded successfully!");
      setIsModalOpen(false);
      setForm({
        documentName: "",
        documentType: "Blood Test",
        patient: "",
        description: "",
        fileSize: "1.2 MB"
      });
      loadDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    }
  };

  const handleDeleteDocument = async (id, name) => {
    if (!confirm(`Are you sure you want to delete document '${name}'?`)) return;
    try {
      await api.delete(`/documents/${id}`);
      setMessage("Document record deleted.");
      loadDocuments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete document.");
    }
  };

  return (
    <div className="page-content">
      <Navbar title="Medical Documents Repository" subtitle="Organize patient reports, imaging, and diagnostic files." />

      {message && <div className="success-box">{message}</div>}

      <div className="filter-bar card">
        <div className="search-box">
          <span className="search-icon">📁</span>
          <input
            type="text"
            placeholder="Search document name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Document Types</option>
            <option value="Blood Test">Blood Test</option>
            <option value="Prescription">Prescription</option>
            <option value="X-Ray">X-Ray</option>
            <option value="Scan">Scan</option>
            <option value="Medical Report">Medical Report</option>
          </select>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Upload Document
          </button>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-header">
          <h3>📂 Medical Files ({documents.length})</h3>
        </div>

        {loading ? (
          <div className="loading-state">Loading medical documents...</div>
        ) : documents.length === 0 ? (
          <div className="empty-state">No documents matching your criteria.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Patient</th>
                  <th>Upload Date</th>
                  <th>File Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <strong>📄 {doc.documentName}</strong>
                      {doc.description && <div className="sub-text">{doc.description}</div>}
                    </td>
                    <td>
                      <span className="doc-type-pill">{doc.documentType}</span>
                    </td>
                    <td>
                      <strong>{doc.patient?.name || doc.patientName || "Patient"}</strong>
                    </td>
                    <td>
                      <span className="date-badge">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </td>
                    <td>{doc.fileSize || "1.2 MB"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-sm btn-outline"
                          onClick={() => alert(`Demo Action: Downloading ${doc.documentName} metadata file.`)}
                        >
                          Download
                        </button>
                        {user?.role === "Admin" && (
                          <button
                            className="btn-sm btn-danger-text"
                            onClick={() => handleDeleteDocument(doc._id, doc.documentName)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="📤 Upload Medical Document Metadata">
        <form onSubmit={handleUploadDocument}>
          {error && <div className="error-box">{error}</div>}

          <label>
            Select Patient *
            <select
              required
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </label>

          <label>
            Document File Name *
            <input
              type="text"
              placeholder="e.g. Lipid_Profile_Report_Aarav.pdf"
              required
              value={form.documentName}
              onChange={(e) => setForm({ ...form, documentName: e.target.value })}
            />
          </label>

          <div className="form-grid-2">
            <label>
              Document Category / Type *
              <select
                value={form.documentType}
                onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              >
                <option>Blood Test</option>
                <option>Prescription</option>
                <option>X-Ray</option>
                <option>Scan</option>
                <option>Medical Report</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Simulated File Size
              <input
                type="text"
                placeholder="e.g. 1.8 MB"
                value={form.fileSize}
                onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
              />
            </label>
          </div>

          <label>
            Document Summary / Description
            <textarea
              rows="2"
              placeholder="e.g. Fasting lipid panel lab report..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="modal-footer mt-2">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Upload Document Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
