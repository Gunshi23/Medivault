import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [statusTab, setStatusTab] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    patient: "",
    patientName: "",
    doctor: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    reason: "General Checkup"
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAppointments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusTab !== "All") params.append("status", statusTab);
    if (search) params.append("search", search);

    api.get(`/appointments?${params.toString()}`)
      .then((res) => setAppointments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
    api.get("/patients").then((res) => setPatients(res.data)).catch(console.error);
  }, [statusTab, search]);

  const handlePatientSelect = (patientId) => {
    if (!patientId) {
      setForm({ ...form, patient: "", patientName: "" });
      return;
    }
    const found = patients.find((p) => p._id === patientId);
    setForm({
      ...form,
      patient: patientId,
      patientName: found ? found.name : ""
    });
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Date Validation
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Appointment date cannot be in the past.");
      return;
    }

    try {
      await api.post("/appointments", form);
      setMessage("Appointment scheduled successfully!");
      setIsModalOpen(false);
      setForm({
        patient: "",
        patientName: "",
        doctor: "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00 AM",
        reason: "General Checkup"
      });
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule appointment.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setMessage(`Appointment status updated to ${status}.`);
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      setMessage("Appointment deleted.");
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete appointment.");
    }
  };

  return (
    <div className="page-content">
      <Navbar title="Appointment Management" subtitle="Schedule consultations and track patient status." />

      {message && <div className="success-box">{message}</div>}

      <div className="filter-bar card">
        <div className="auth-tabs" style={{ margin: 0 }}>
          {["All", "Scheduled", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={statusTab === tab ? "tab-btn active" : "tab-btn"}
              onClick={() => setStatusTab(tab)}
            >
              {tab === "Scheduled" ? "Upcoming" : tab}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search doctor or patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Schedule Appointment
          </button>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-header">
          <h3>📆 Appointments Directory ({appointments.length})</h3>
        </div>

        {loading ? (
          <div className="loading-state">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">No appointments found under this filter.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Attending Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <strong>{a.patientName}</strong>
                    </td>
                    <td>{a.doctor}</td>
                    <td>
                      <span className="date-badge">
                        {new Date(a.date).toLocaleDateString()} at {a.time}
                      </span>
                    </td>
                    <td>{a.reason || "Checkup"}</td>
                    <td>
                      <select
                        className={`status-select status-${a.status.toLowerCase()}`}
                        value={a.status}
                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {a.status === "Scheduled" && (
                          <button
                            className="btn-sm btn-outline"
                            onClick={() => handleStatusChange(a._id, "Completed")}
                          >
                            Mark Complete
                          </button>
                        )}
                        {user?.role === "Admin" && (
                          <button
                            className="btn-sm btn-danger-text"
                            onClick={() => handleDeleteAppointment(a._id)}
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

      {/* Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="📆 Schedule New Appointment">
        <form onSubmit={handleCreateAppointment}>
          {error && <div className="error-box">{error}</div>}

          <label>
            Select Existing Patient (Optional)
            <select
              value={form.patient}
              onChange={(e) => handlePatientSelect(e.target.value)}
            >
              <option value="">-- Choose Registered Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </label>

          <label>
            Patient Name *
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              required
              value={form.patientName}
              onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            />
          </label>

          <div className="form-grid-2">
            <label>
              Attending Doctor *
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Gupta"
                required
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
              />
            </label>
            <label>
              Appointment Date *
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Appointment Time *
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </label>
            <label>
              Reason / Consultation Topic
              <input
                type="text"
                placeholder="e.g. Hypertension Follow-up"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </label>
          </div>

          <div className="modal-footer mt-2">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Schedule Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
