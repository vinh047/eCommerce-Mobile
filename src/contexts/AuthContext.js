"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Ví dụ: load user từ API hoặc localStorage
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/admin/auth/me");
        const data = await res.json();
        setUser(data.staff);
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const hasPermission = (key) => {
    if (!user || !Array.isArray(user.permissions)) return false;
    return user.permissions.includes(key);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tiện dụng
export const useAuth = () => useContext(AuthContext);
