import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("medivault_user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("medivault_token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.get("/auth/profile")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("medivault_user", JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("medivault_token", data.token);
      localStorage.setItem("medivault_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await api.post("/auth/register", userData);
      return await login(userData.email, userData.password);
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("medivault_token");
    localStorage.removeItem("medivault_user");
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("medivault_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
