import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [bloodFilter, setBloodFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    allergies: "",
    existingConditions: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPatients = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (genderFilter !== "All") params.append("gender", genderFilter);
    if (bloodFilter !== "All") params.append("bloodGroup", bloodFilter);

    api.get(`/patients?${params.toString()}`)
      .then((res) => setPatients(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPatients();
  }, [search, genderFilter, bloodFilter]);

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        allergies: form.allergies ? form.allergies.split(",").map((s) => s.trim()) : [],
        existingConditions: form.existingConditions ? form.existingConditions.split(",").map((s) => s.trim()) : []
      };

      await api.post("/patients", payload);
      setMessage("Patient added successfully!");
      setIsModalOpen(false);
      setForm({
        name: "",
        age: "",
        gender: "Male",
        bloodGroup: "O+",
        phone: "",
        email: "",
        address: "",
        emergencyContact: "",
        allergies: "",
        existingConditions: ""
      });
      loadPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add patient");
    }
  };

  const handleDeletePatient = async (id, name) => {
    if (!confirm(`Are you sure you want to delete patient '${name}'? This will also remove associated records.`)) return;

    try {
      await api.delete(`/patients/${id}`);
      setMessage(`Patient '${name}' deleted successfully.`);
      loadPatients();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete patient");
    }
  };

  return (
    <div className="page-content">
      <Navbar title="Patient Management" subtitle="Search, filter, and manage digital patient profiles." />

      {message && <div className="success-box">{message}</div>}

      <div className="filter-bar card">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by patient name or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)}>
            <option value="All">All Blood Groups</option>
            <option value="O+">O+</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="O-">O-</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="AB-">AB-</option>
          </select>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add New Patient
          </button>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-header">
          <h3>👥 Patient Directory ({patients.length})</h3>
        </div>

        {loading ? (
          <div className="loading-state">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="empty-state">
            <p>No patients matching your search criteria.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age & Gender</th>
                  <th>Blood Group</th>
                  <th>Phone Number</th>
                  <th>Emergency Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <Link to={`/patients/${p._id}`} className="patient-name-link">
                        <strong>{p.name}</strong>
                      </Link>
                      {p.email && <div className="sub-text">{p.email}</div>}
                    </td>
                    <td>
                      {p.age} yrs • {p.gender}
                    </td>
                    <td>
                      <span className="blood-badge">{p.bloodGroup || "N/A"}</span>
                    </td>
                    <td>{p.phone || "—"}</td>
                    <td>{p.emergencyContact || "—"}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/patients/${p._id}`} className="btn-sm btn-primary">
                          View Profile
                        </Link>
                        {user?.role === "Admin" && (
                          <button
                            className="btn-sm btn-danger-text"
                            onClick={() => handleDeletePatient(p._id, p.name)}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="➕ Add New Patient Profile">
        <form onSubmit={handleCreatePatient}>
          {error && <div className="error-box">{error}</div>}

          <div className="form-grid-2">
            <label>
              Full Name *
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Age (Years) *
              <input
                type="number"
                min="0"
                placeholder="e.g. 34"
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Gender *
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Blood Group
              <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                <option>O+</option>
                <option>A+</option>
                <option>B+</option>
                <option>AB+</option>
                <option>O-</option>
                <option>A-</option>
                <option>B-</option>
                <option>AB-</option>
                <option>Unknown</option>
              </select>
            </label>
          </div>

          <div className="form-grid-2">
            <label>
              Phone Number
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                placeholder="patient@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
          </div>

          <label>
            Residential Address
            <input
              type="text"
              placeholder="House/Street, City, State"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>

          <label>
            Emergency Contact Person & Phone
            <input
              type="text"
              placeholder="+91 98765 00000 (Spouse/Relative)"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
            />
          </label>

          <div className="form-grid-2">
            <label>
              Known Allergies (comma separated)
              <input
                type="text"
                placeholder="e.g. Penicillin, Dust, Peanuts"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              />
            </label>
            <label>
              Existing Conditions (comma separated)
              <input
                type="text"
                placeholder="e.g. Asthma, Hypertension, Diabetes"
                value={form.existingConditions}
                onChange={(e) => setForm({ ...form, existingConditions: e.target.value })}
              />
            </label>
          </div>

          <div className="modal-footer mt-2">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Patient Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
