"use client";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- import your AuthProvider

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          window.location.reload(); // Force update everywhere
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    };
    checkToken();
  }, []);

  // Wrap children with AuthProvider so useAuth works everywhere
  return <AuthProvider>{children}</AuthProvider>;
}
