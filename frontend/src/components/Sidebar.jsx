import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">✚</span>
        <div>
          <span className="brand-name">MediVault</span>
          <span className="brand-tag">Medical Record System</span>
        </div>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/patients" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon">👥</span> Patients
        </NavLink>
        <NavLink to="/records" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon">📋</span> Medical Records
        </NavLink>
        <NavLink to="/appointments" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon">📅</span> Appointments
        </NavLink>
        <NavLink to="/documents" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon">📁</span> Documents
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon">👤</span> My Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info-mini">
          <div className="avatar-circle">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
          <div className="user-details">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role-badge">{user?.role || "Staff"}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>
          <span className="icon">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
