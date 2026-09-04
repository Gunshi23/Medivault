import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import PrescriptionForm from "../components/PrescriptionForm";
import { useAuth } from "../context/AuthContext";

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [diagnosisFilter, setDiagnosisFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    visitDate: new Date().toISOString().split("T")[0],
    symptoms: "",
    diagnosis: "",
    testResults: "",
    notes: "",
    followUpDate: ""
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRecords = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (diagnosisFilter) params.append("diagnosis", diagnosisFilter);
    if (doctorFilter) params.append("doctor", doctorFilter);
    if (dateFilter) params.append("date", dateFilter);

    api.get(`/records?${params.toString()}`)
      .then((res) => setRecords(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRecords();
    api.get("/patients").then((res) => setPatients(res.data)).catch(console.error);
  }, [diagnosisFilter, doctorFilter, dateFilter]);

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/records", {
        ...form,
        prescriptions
      });
      setMessage("Medical record created successfully!");
      setIsAddOpen(false);
      setForm({
        patient: "",
        doctor: "",
        visitDate: new Date().toISOString().split("T")[0],
        symptoms: "",
        diagnosis: "",
        testResults: "",
        notes: "",
        followUpDate: ""
      });
      setPrescriptions([]);
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create medical record.");
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!confirm("Are you sure you want to delete this medical record?")) return;
    try {
      await api.delete(`/records/${id}`);
      setMessage("Medical record deleted.");
      loadRecords();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete record.");
    }
  };

  return (
    <div className="page-content">
      <Navbar title="Medical Records Repository" subtitle="Centralized clinical consultations, diagnoses, and prescriptions." />

      {message && <div className="success-box">{message}</div>}

      <div className="filter-bar card">
        <div className="form-grid-3" style={{ width: "100%" }}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by diagnosis..."
              value={diagnosisFilter}
              onChange={(e) => setDiagnosisFilter(e.target.value)}
            />
          </div>

          <div className="search-box">
            <span className="search-icon">👨‍⚕️</span>
            <input
              type="text"
              placeholder="Search by doctor..."
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <input
              type="date"
              className="date-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button className="btn-sm btn-secondary" onClick={() => setDateFilter("")}>
                Clear Date
              </button>
            )}
            <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
              + Add Record
            </button>
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-header">
          <h3>📋 Medical Consultations & History ({records.length})</h3>
        </div>

        {loading ? (
          <div className="loading-state">Loading medical records...</div>
        ) : records.length === 0 ? (
          <div className="empty-state">No medical records match your criteria.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Visit Date</th>
                  <th>Patient</th>
                  <th>Diagnosis</th>
                  <th>Attending Doctor</th>
                  <th>Prescribed Medicines</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <span className="date-badge">{new Date(r.visitDate).toLocaleDateString()}</span>
                    </td>
                    <td>
                      <Link to={`/patients/${r.patient?._id}`} className="patient-name-link">
                        <strong>{r.patient?.name || "Patient"}</strong>
                      </Link>
                      <div className="sub-text">{r.patient?.gender}, {r.patient?.age} yrs</div>
                    </td>
                    <td>
                      <span className="diagnosis-tag">{r.diagnosis}</span>
                    </td>
                    <td>{r.doctor}</td>
                    <td>
                      {r.prescriptions?.length > 0 ? (
                        <span className="rx-count-badge">💊 {r.prescriptions.length} Medicine(s)</span>
                      ) : (
                        <span className="muted small">None</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-sm btn-outline" onClick={() => setSelectedRecord(r)}>
                          View Detail
                        </button>
                        {user?.role === "Admin" && (
                          <button className="btn-sm btn-danger-text" onClick={() => handleDeleteRecord(r._id)}>
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

      {/* Add Record Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="➕ Create New Medical Record">
        <form onSubmit={handleCreateRecord}>
          {error && <div className="error-box">{error}</div>}

          <label>
            Select Patient *
            <select
              required
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.gender}, {p.age} yrs) - {p.phone}
                </option>
              ))}
            </select>
          </label>

          <div className="form-grid-2">
            <label>
              Attending Doctor *
              <input
                type="text"
                placeholder="e.g. Dr. Sunita Rao"
                required
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
              />
            </label>
            <label>
              Visit Date *
              <input
                type="date"
                required
                value={form.visitDate}
                onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
              />
            </label>
          </div>

          <label>
            Symptoms Observed *
            <textarea
              rows="2"
              required
              placeholder="e.g. Fever, cough for 3 days..."
              value={form.symptoms}
              onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            />
          </label>

          <label>
            Diagnosis *
            <input
              type="text"
              required
              placeholder="e.g. Acute Bronchitis"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            />
          </label>

          <hr className="divider" />
          <PrescriptionForm prescriptions={prescriptions} setPrescriptions={setPrescriptions} />
          <hr className="divider" />

          <label>
            Test Results
            <textarea
              rows="2"
              placeholder="Lab / Imaging observations..."
              value={form.testResults}
              onChange={(e) => setForm({ ...form, testResults: e.target.value })}
            />
          </label>

          <div className="form-grid-2">
            <label>
              Notes / Advice
              <input
                type="text"
                placeholder="Doctor's notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
            <label>
              Follow-up Date
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
              />
            </label>
          </div>

          <div className="modal-footer mt-2">
            <button type="button" className="btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Record</button>
          </div>
        </form>
      </Modal>

      {/* Record Details Modal */}
      <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title={`📋 Consultation Detail: ${selectedRecord?.diagnosis}`}>
        {selectedRecord && (
          <div>
            <div className="info-list">
              <div className="info-item">
                <span className="label">Patient:</span>
                <span className="val"><strong>{selectedRecord.patient?.name}</strong> ({selectedRecord.patient?.gender}, {selectedRecord.patient?.age} yrs)</span>
              </div>
              <div className="info-item">
                <span className="label">Doctor:</span>
                <span className="val">{selectedRecord.doctor}</span>
              </div>
              <div className="info-item">
                <span className="label">Visit Date:</span>
                <span className="val">{new Date(selectedRecord.visitDate).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Symptoms:</span>
                <span className="val">{selectedRecord.symptoms}</span>
              </div>
              {selectedRecord.testResults && (
                <div className="info-item">
                  <span className="label">Test Results:</span>
                  <span className="val">{selectedRecord.testResults}</span>
                </div>
              )}
            </div>

            {selectedRecord.prescriptions?.length > 0 && (
              <div className="prescription-display-card mt-2">
                <h5>💊 Prescribed Medications</h5>
                <table className="rx-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.prescriptions.map((rx, idx) => (
                      <tr key={idx}>
                        <td><strong>{rx.medicineName}</strong></td>
                        <td>{rx.dosage}</td>
                        <td>{rx.frequency}</td>
                        <td>{rx.duration}</td>
                        <td>{rx.instructions || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedRecord.notes && <p className="mt-2">💡 <em>Notes: {selectedRecord.notes}</em></p>}

            <div className="modal-footer mt-2">
              <button className="btn-primary" onClick={() => setSelectedRecord(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
