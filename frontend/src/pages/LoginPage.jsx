import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Medical Staff" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = (email, role) => {
    setForm({
      name: role === "Admin" ? "Dr. Admin User" : "Nurse Staff",
      email,
      password: "password123",
      role
    });
    setIsRegister(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let res;
    if (isRegister) {
      res = await register(form);
    } else {
      res = await login(form.email, form.password);
    }

    setLoading(false);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand large">
          <span className="brand-icon">✚</span>
          <div>
            <span className="brand-name">MediVault</span>
            <span className="brand-tag">Medical Record Management System</span>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isRegister ? "tab-btn active" : "tab-btn"}
            onClick={() => { setIsRegister(false); setError(""); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={isRegister ? "tab-btn active" : "tab-btn"}
            onClick={() => { setIsRegister(true); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Sharma"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                Role
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="Medical Staff">Medical Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email Address
            <input
              type="email"
              placeholder="e.g. admin@medivault.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button className="btn-primary btn-full" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In to Workspace"}
          </button>
        </form>

        <div className="demo-credentials-card">
          <p className="demo-title">⚡ Quick Internship Demo Accounts (Click to Fill):</p>
          <div className="demo-buttons">
            <button type="button" className="btn-demo-chip" onClick={() => fillDemo("admin@medivault.com", "Admin")}>
              🔑 Admin: admin@medivault.com
            </button>
            <button type="button" className="btn-demo-chip" onClick={() => fillDemo("staff@medivault.com", "Medical Staff")}>
              🩺 Staff: staff@medivault.com
            </button>
            <button type="button" className="btn-demo-chip" onClick={() => fillDemo("gunshikaagarwaldpr@gmail.com", "Admin")}>
              👤 User: gunshikaagarwaldpr@gmail.com
            </button>
          </div>
          <span className="demo-pass">Password for all accounts: <code>password123</code></span>
        </div>
      </div>
    </div>
  );
}
