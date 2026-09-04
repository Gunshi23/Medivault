import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="page-header">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>

      <div className="topbar-actions">
        <div className="badge-demo">Demo Workspace</div>
        <Link to="/profile" className="user-profile-chip">
          <div className="chip-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
          <span className="chip-name">{user?.name}</span>
          <span className="chip-role">({user?.role})</span>
        </Link>
      </div>
    </header>
  );
}
