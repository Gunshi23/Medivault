import { useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, updateUserData } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || ""
  });

  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");

    try {
      const { data } = await api.put("/auth/profile", profileForm);
      updateUserData(data.user);
      setProfileMsg("Profile updated successfully!");
    } catch (err) {
      setProfileErr(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassErr("");

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassErr("New password and confirmation do not match.");
      return;
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      setPassMsg("Password changed successfully!");
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPassErr(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="page-content">
      <Navbar title="User Profile & Security Settings" subtitle="Manage your account credentials and system privileges." />

      <div className="grid-2">
        {/* User Card */}
        <div className="card">
          <div className="card-header">
            <h3>👤 Account Overview</h3>
            <span className="user-role-badge lg">{user?.role || "Staff"}</span>
          </div>

          <div className="info-list mt-2">
            <div className="info-item">
              <span className="label">Full Name:</span>
              <span className="val"><strong>{user?.name}</strong></span>
            </div>
            <div className="info-item">
              <span className="label">Email Address:</span>
              <span className="val">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">System Role:</span>
              <span className="val highlight">{user?.role}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone Number:</span>
              <span className="val">{user?.phone || "Not set"}</span>
            </div>
          </div>

          <hr className="divider" />

          <h4>✏️ Update Personal Details</h4>
          <form onSubmit={handleUpdateProfile} className="mt-1">
            {profileMsg && <div className="success-box">{profileMsg}</div>}
            {profileErr && <div className="error-box">{profileErr}</div>}

            <label>
              Full Name
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </label>

            <label>
              Phone Number
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </label>

            <button type="submit" className="btn-primary mt-1">
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <div className="card-header">
            <h3>🔒 Security & Password</h3>
          </div>

          <form onSubmit={handleChangePassword}>
            {passMsg && <div className="success-box">{passMsg}</div>}
            {passErr && <div className="error-box">{passErr}</div>}

            <label>
              Current Password *
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passForm.currentPassword}
                onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
              />
            </label>

            <label>
              New Password *
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
              />
            </label>

            <label>
              Confirm New Password *
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
              />
            </label>

            <button type="submit" className="btn-primary mt-1">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
