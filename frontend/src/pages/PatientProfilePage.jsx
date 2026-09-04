import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import PrescriptionForm from "../components/PrescriptionForm";
import { useAuth } from "../context/AuthContext";

export default function PatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Patient State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Add Record State
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({
    doctor: "",
    visitDate: new Date().toISOString().split("T")[0],
    symptoms: "",
    diagnosis: "",
    testResults: "",
    notes: "",
    followUpDate: ""
  });
  const [prescriptions, setPrescriptions] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPatientProfile = () => {
    setLoading(true);
    api.get(`/patients/${id}`)
      .then((res) => {
        setPatient(res.data);
        setEditForm({
          name: res.data.name || "",
          age: res.data.age || "",
          gender: res.data.gender || "Male",
          bloodGroup: res.data.bloodGroup || "O+",
          phone: res.data.phone || "",
          email: res.data.email || "",
          address: res.data.address || "",
          emergencyContact: res.data.emergencyContact || "",
          allergies: res.data.allergies ? res.data.allergies.join(", ") : "",
          existingConditions: res.data.existingConditions ? res.data.existingConditions.join(", ") : ""
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Patient not found.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPatientProfile();
  }, [id]);

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...editForm,
        age: Number(editForm.age),
        allergies: editForm.allergies ? editForm.allergies.split(",").map((s) => s.trim()) : [],
        existingConditions: editForm.existingConditions ? editForm.existingConditions.split(",").map((s) => s.trim()) : []
      };

      await api.put(`/patients/${id}`, payload);
      setMessage("Patient profile updated successfully!");
      setIsEditOpen(false);
      loadPatientProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update patient profile.");
    }
  };

  const handleDeletePatient = async () => {
    if (!confirm(`Are you sure you want to delete patient '${patient.name}'?`)) return;
    try {
      await api.delete(`/patients/${id}`);
      navigate("/patients");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete patient");
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...recordForm,
        patient: id,
        prescriptions
      };

      await api.post("/records", payload);
      setMessage("Medical record added successfully!");
      setIsRecordOpen(false);
      setRecordForm({
        doctor: "",
        visitDate: new Date().toISOString().split("T")[0],
        symptoms: "",
        diagnosis: "",
        testResults: "",
        notes: "",
        followUpDate: ""
      });
      setPrescriptions([]);
      loadPatientProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add medical record.");
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Navbar title="Patient Profile" />
        <div className="loading-state">Loading patient profile details...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="page-content">
        <Navbar title="Patient Profile" />
        <div className="error-box mt-2">Patient record not found. <Link to="/patients">Back to Directory</Link></div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Navbar title={`Patient: ${patient.name}`} subtitle="Comprehensive clinical profile & medical record timeline." />

      {message && <div className="success-box">{message}</div>}

      <div className="profile-top-actions">
        <Link to="/patients" className="btn-secondary">
          ← Back to Patients
        </Link>
        <div className="action-buttons">
          <button className="btn-outline" onClick={() => setIsEditOpen(true)}>
            ✏️ Edit Patient
          </button>
          <button className="btn-primary" onClick={() => setIsRecordOpen(true)}>
            ➕ Add Medical Record
          </button>
          {user?.role === "Admin" && (
            <button className="btn-danger" onClick={handleDeletePatient}>
              🗑️ Delete Patient
            </button>
          )}
        </div>
      </div>

      <div className="profile-grid">
        {/* Demographics Card */}
        <div className="card profile-info-card">
          <div className="profile-header-banner">
            <div className="profile-avatar-lg">{patient.name.charAt(0).toUpperCase()}</div>
            <div>
              <h2>{patient.name}</h2>
              <p className="muted">{patient.age} Yrs • {patient.gender} • Blood Group: <strong>{patient.bloodGroup}</strong></p>
            </div>
          </div>

          <hr className="divider" />

          <div className="info-list">
            <div className="info-item">
              <span className="label">📞 Phone</span>
              <span className="val">{patient.phone || "Not provided"}</span>
            </div>
            <div className="info-item">
              <span className="label">✉️ Email</span>
              <span className="val">{patient.email || "Not provided"}</span>
            </div>
            <div className="info-item">
              <span className="label">🏠 Address</span>
              <span className="val">{patient.address || "Not provided"}</span>
            </div>
            <div className="info-item">
              <span className="label">🚨 Emergency Contact</span>
              <span className="val highlight">{patient.emergencyContact || "Not provided"}</span>
            </div>
          </div>

          <hr className="divider" />

          <div className="tag-section">
            <h4>⚠️ Known Allergies</h4>
            {patient.allergies?.length > 0 ? (
              <div className="tag-wrap">
                {patient.allergies.map((a, i) => (
                  <span key={i} className="pill red-pill">{a}</span>
                ))}
              </div>
            ) : (
              <p className="muted small">No known drug/food allergies reported.</p>
            )}
          </div>

          <div className="tag-section mt-2">
            <h4>🩺 Pre-existing Conditions</h4>
            {patient.existingConditions?.length > 0 ? (
              <div className="tag-wrap">
                {patient.existingConditions.map((c, i) => (
                  <span key={i} className="pill orange-pill">{c}</span>
                ))}
              </div>
            ) : (
              <p className="muted small">No pre-existing conditions logged.</p>
            )}
          </div>
        </div>

        {/* Medical History Timeline */}
        <div className="profile-history-column">
          <div className="card">
            <div className="card-header">
              <h3>📋 Medical History Timeline ({patient.records?.length || 0})</h3>
              <button className="btn-sm btn-primary" onClick={() => setIsRecordOpen(true)}>
                + New Record
              </button>
            </div>

            {patient.records?.length === 0 ? (
              <div className="empty-state">
                <p>No medical records logged for this patient yet.</p>
                <button className="btn-secondary btn-sm mt-1" onClick={() => setIsRecordOpen(true)}>
                  Create First Medical Record
                </button>
              </div>
            ) : (
              <div className="timeline">
                {patient.records?.map((record) => (
                  <div key={record._id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-card card">
                      <div className="timeline-header">
                        <div>
                          <span className="diagnosis-title">{record.diagnosis}</span>
                          <div className="doctor-sub">Attending: <strong>{record.doctor}</strong></div>
                        </div>
                        <span className="date-badge">
                          {new Date(record.visitDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="record-detail-block">
                        <strong>Symptoms:</strong> {record.symptoms}
                      </div>

                      {record.testResults && (
                        <div className="record-detail-block">
                          <strong>Test Results:</strong> {record.testResults}
                        </div>
                      )}

                      {/* Prescriptions Section */}
                      {record.prescriptions?.length > 0 && (
                        <div className="prescription-display-card">
                          <h5>💊 Prescribed Medication ({record.prescriptions.length})</h5>
                          <div className="rx-table-wrap">
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
                                {record.prescriptions.map((rx, idx) => (
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
                        </div>
                      )}

                      {record.notes && (
                        <div className="record-notes">
                          💡 <em>Notes: {record.notes}</em>
                        </div>
                      )}

                      {record.followUpDate && (
                        <div className="followup-badge">
                          🗓️ Follow-up Scheduled: {new Date(record.followUpDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="✏️ Edit Patient Profile">
        <form onSubmit={handleUpdatePatient}>
          {error && <div className="error-box">{error}</div>}

          <div className="form-grid-2">
            <label>
              Full Name *
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </label>
            <label>
              Age *
              <input
                type="number"
                required
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Gender *
              <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Blood Group
              <select value={editForm.bloodGroup} onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}>
                <option>O+</option>
                <option>A+</option>
                <option>B+</option>
                <option>AB+</option>
                <option>O-</option>
                <option>A-</option>
                <option>B-</option>
                <option>AB-</option>
              </select>
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Phone
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </label>
          </div>

          <label>
            Address
            <input
              type="text"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            />
          </label>

          <label>
            Emergency Contact
            <input
              type="text"
              value={editForm.emergencyContact}
              onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
            />
          </label>

          <label>
            Allergies (comma separated)
            <input
              type="text"
              value={editForm.allergies}
              onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
            />
          </label>

          <label>
            Existing Conditions (comma separated)
            <input
              type="text"
              value={editForm.existingConditions}
              onChange={(e) => setEditForm({ ...editForm, existingConditions: e.target.value })}
            />
          </label>

          <div className="modal-footer mt-2">
            <button type="button" className="btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Update Profile</button>
          </div>
        </form>
      </Modal>

      {/* Add Medical Record Modal */}
      <Modal isOpen={isRecordOpen} onClose={() => setIsRecordOpen(false)} title={`➕ Add Medical Record for ${patient.name}`}>
        <form onSubmit={handleAddRecord}>
          {error && <div className="error-box">{error}</div>}

          <div className="form-grid-2">
            <label>
              Attending Doctor Name *
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Gupta"
                required
                value={recordForm.doctor}
                onChange={(e) => setRecordForm({ ...recordForm, doctor: e.target.value })}
              />
            </label>
            <label>
              Visit Date *
              <input
                type="date"
                required
                value={recordForm.visitDate}
                onChange={(e) => setRecordForm({ ...recordForm, visitDate: e.target.value })}
              />
            </label>
          </div>

          <label>
            Observed Symptoms *
            <textarea
              rows="2"
              placeholder="e.g. High blood pressure, headache..."
              required
              value={recordForm.symptoms}
              onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
            />
          </label>

          <label>
            Clinical Diagnosis *
            <input
              type="text"
              placeholder="e.g. Stage 1 Essential Hypertension"
              required
              value={recordForm.diagnosis}
              onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
            />
          </label>

          <hr className="divider" />

          {/* Embedded Prescriptions Dynamic Form Component */}
          <PrescriptionForm prescriptions={prescriptions} setPrescriptions={setPrescriptions} />

          <hr className="divider" />

          <label>
            Laboratory / Diagnostic Test Results
            <textarea
              rows="2"
              placeholder="e.g. BP 140/90, Fasting blood sugar 110 mg/dL..."
              value={recordForm.testResults}
              onChange={(e) => setRecordForm({ ...recordForm, testResults: e.target.value })}
            />
          </label>

          <div className="form-grid-2">
            <label>
              Clinical Notes / Lifestyle Advice
              <input
                type="text"
                placeholder="e.g. Salt restriction advised"
                value={recordForm.notes}
                onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
              />
            </label>
            <label>
              Follow-up Date
              <input
                type="date"
                value={recordForm.followUpDate}
                onChange={(e) => setRecordForm({ ...recordForm, followUpDate: e.target.value })}
              />
            </label>
          </div>

          <div className="modal-footer mt-2">
            <button type="button" className="btn-secondary" onClick={() => setIsRecordOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Medical Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
