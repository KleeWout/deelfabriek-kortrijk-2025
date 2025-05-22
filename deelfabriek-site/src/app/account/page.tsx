"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Reservation {
  enddate: string;
  ispayed: number;
  itemid: number;
  itemname: string;
  registrationid: number;
  reservationcode: number;
  startdate: string;
  userid: string;
}

export default function Account() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { fetchWithAuth } = useApi();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!user?.userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`http://localhost:5000/registrations/${user.userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch reservations: ${response.status}`);
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Er is een fout opgetreden bij het ophalen van je reserveringen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchReservations();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-BE");
  };

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center p-8">
        <h1 className="text-4xl font-bold mb-8">Account</h1>
        <div className="flex flex-col items-center gap-4 mb-8 w-full max-w-xs">
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

        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Jouw reserveringen</h2>
            <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center" onClick={fetchReservations} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Laden...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Vernieuwen
                </>
              )}
            </button>
          </div>

          {error && <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

          {reservations.length === 0 && !loading && !error ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Je hebt nog geen reserveringen.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                {" "}
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reserveringscode
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Startdatum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Einddatum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Betaalstatus
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <p>Reserveringen laden...</p>
                      </td>
                    </tr>
                  ) : (
                    reservations.map((reservation) => (
                      <tr key={reservation.registrationid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{reservation.itemname || `Item ${reservation.itemid}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.reservationcode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(reservation.startdate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(reservation.enddate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.ispayed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{reservation.ispayed ? "Betaald" : "Nog niet betaald"}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
