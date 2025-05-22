"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Account() {
  const router = useRouter();
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Account</h1>
        <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-xs">
          <p className="text-lg">Je bent ingelogd!</p>
          {user && <p className="text-md">Gebruiker ID: {user.userId}</p>}
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            onClick={() => {
              logout();
            }}
          >
            Uitloggen
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}
