"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = {
  userId: string;
  token: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setUser({ userId, token });
    }
  }, []);

  // Login function
  const login = (userId: string, token: string) => {
    // Store in state for current session
    setUser({ userId, token });

    // Also store in localStorage for persistence across page refreshes
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
