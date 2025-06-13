"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/app/api/config";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  totalFine: number;
  createdAt: string;
  street: string;
  city: string;
  bus: string | null;
  postalCode: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(getApiUrl("/users"));
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Kon gebruikers niet laden.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete user handler
  const handleDelete = async (id: number) => {
    if (!confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?"))
      return;
    try {
      const res = await fetch(getApiUrl(`/users/${id}`), { method: "DELETE" });
      if (!res.ok) throw new Error("Verwijderen mislukt");
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      alert("Gebruiker kon niet verwijderd worden.");
    }
  };

  // Block/unblock user handler
  const handleBlock = async (id: number, block: boolean) => {
    try {
      const res = await fetch(getApiUrl(`/users/${id}/block`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: block }),
      });
      if (!res.ok) throw new Error("Blokkeren mislukt");
      setUsers(
        users.map((u) => (u.id === id ? { ...u, isBlocked: block } : u))
      );
    } catch {
      alert("Gebruiker kon niet geblokkeerd/gedeblokkeerd worden.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gebruikers</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Naam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Telefoon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Adres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Boete (€)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aangemaakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Geblokkeerd
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004431] mb-4"></div>
                      <p className="text-gray-600 font-medium">
                        Gebruikers laden...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <p className="text-red-600">{error}</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <p className="text-gray-600">Geen gebruikers gevonden.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.street}, {user.bus ? `bus ${user.bus}, ` : ""}
                      {user.postalCode} {user.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.totalFine.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isBlocked ? "Ja" : "Nee"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleBlock(user.id, !user.isBlocked)}
                        className="p-2 rounded hover:bg-gray-100"
                        title={user.isBlocked ? "Deblokkeer" : "Blokkeer"}
                      >
                        {user.isBlocked ? (
                          // Unlock icon
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6V9a6 6 0 10-12 0v2m12 0v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m12 0H6"
                            />
                          </svg>
                        ) : (
                          // Lock icon
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6V9a6 6 0 10-12 0v2m12 0v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m12 0H6"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded hover:bg-gray-100"
                        title="Verwijder"
                      >
                        {/* Trash icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
