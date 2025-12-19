import { createContext, useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import {jwtDecode} from "jwt-decode";

export const AdminAuthContext = createContext();

const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore admin on refresh
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdmin({ id: decoded.id, role: decoded.role });
      } catch {
        localStorage.removeItem("admin_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await adminApi.post("/admin/login", { email, password });

    localStorage.setItem("admin_token", res.data.token);
    setAdmin(res.data.admin);

    return res.data.admin;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  if (loading) return null; // or loader

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
