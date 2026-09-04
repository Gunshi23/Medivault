import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import ChartOverview from "../components/ChartOverview";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then((res) => {
        setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <Navbar title="Dashboard" subtitle="Overview of your MediVault workspace" />
        <div className="loading-state">Loading dashboard analytics from database...</div>
      </div>
    );
  }

  const { stats, chartData, recentPatients, upcomingAppointments, recentRecords } = data || {};

  return (
    <div className="page-content">
      <Navbar title="Dashboard Overview" subtitle="Real-time analytics and patient activity tracking." />

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-label">Total Patients</span>
            <strong className="stat-value">{stats?.totalPatients || 0}</strong>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-label">Medical Records</span>
            <strong className="stat-value">{stats?.totalRecords || 0}</strong>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-label">Total Appointments</span>
            <strong className="stat-value">{stats?.totalAppointments || 0}</strong>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Upcoming Scheduled</span>
            <strong className="stat-value">{stats?.upcomingAppointments || 0}</strong>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>📈 Appointments Overview</h3>
            <span className="card-tag">MongoDB Live Data</span>
          </div>
          <ChartOverview data={chartData} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📆 Upcoming Appointments</h3>
            <Link to="/appointments" className="link-action">View All</Link>
          </div>
          {upcomingAppointments?.length === 0 ? (
            <p className="muted">No upcoming appointments scheduled.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments?.map((apt) => (
                    <tr key={apt._id}>
                      <td>
                        <strong>{apt.patientName}</strong>
                      </td>
                      <td>{apt.doctor}</td>
                      <td>
                        <span className="date-badge">
                          {new Date(apt.date).toLocaleDateString()} at {apt.time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid-2 mt-2">
        <div className="card">
          <div className="card-header">
            <h3>👥 Recent Patients</h3>
            <Link to="/patients" className="link-action">View Directory</Link>
          </div>
          {recentPatients?.length === 0 ? (
            <p className="muted">No patients recorded yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Blood Group</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients?.map((p) => (
                    <tr key={p._id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.age} yrs</td>
                      <td><span className="blood-badge">{p.bloodGroup || "N/A"}</span></td>
                      <td>
                        <Link to={`/patients/${p._id}`} className="btn-sm btn-outline">Profile</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📋 Recent Medical Records</h3>
            <Link to="/records" className="link-action">View All Records</Link>
          </div>
          {recentRecords?.length === 0 ? (
            <p className="muted">No medical records created yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Diagnosis</th>
                    <th>Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords?.map((r) => (
                    <tr key={r._id}>
                      <td><strong>{r.patient?.name || "Patient"}</strong></td>
                      <td><span className="diagnosis-tag">{r.diagnosis}</span></td>
                      <td>{r.doctor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
