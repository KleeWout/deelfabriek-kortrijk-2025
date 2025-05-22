"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Reservation {
  enddate: string;
  ispayed: number;
  itemid: number;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Use a ref to track if the fetch has been performed
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Skip if we've already fetched or no user ID is available
    if (fetchedRef.current || !user?.userId) return;

    // Create a flag to track if the component is mounted
    let isMounted = true;
    fetchedRef.current = true;

    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`http://localhost:5000/registrations/${user.userId}`);
        if (!response.ok) {
          throw new Error("Kon reserveringen niet ophalen");
        }
        const data = await response.json();
        // Only update state if component is still mounted
        if (isMounted) {
          setReservations(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching reservations:", err);
        // Only update state if component is still mounted
        if (isMounted) {
          setError("Er is een fout opgetreden bij het ophalen van je reserveringen.");
          setLoading(false);
        }
      }
    };

    fetchReservations();

    // Cleanup function to handle unmounting
    return () => {
      isMounted = false;
    };
  }, [user?.userId, fetchWithAuth]); // Include dependencies but use the ref to control execution

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("nl-NL").format(date);
  };

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Account</h1>
        <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-3xl">
          <p className="text-lg">Je bent ingelogd!</p>
          {user && <p className="text-md">Gebruiker ID: {user.userId}</p>}

          {/* Reservations Section */}
          <div className="w-full mt-8">
            <h2 className="text-2xl font-semibold mb-4">Jouw Reserveringen</h2>

            {loading ? (
              <p>Reserveringen laden...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : reservations.length === 0 ? (
              <p>Je hebt nog geen reserveringen gemaakt.</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">Reservering ID</th>
                      <th className="py-3 px-4 text-left">Item ID</th>
                      <th className="py-3 px-4 text-left">Startdatum</th>
                      <th className="py-3 px-4 text-left">Einddatum</th>
                      <th className="py-3 px-4 text-left">Reserveringscode</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.registrationid} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{reservation.registrationid}</td>
                        <td className="py-3 px-4">{reservation.itemid}</td>
                        <td className="py-3 px-4">{formatDate(reservation.startdate)}</td>
                        <td className="py-3 px-4">{formatDate(reservation.enddate)}</td>
                        <td className="py-3 px-4">{reservation.reservationcode}</td>
                        <td className="py-3 px-4">{reservation.ispayed ? <span className="text-green-600 font-medium">Betaald</span> : <span className="text-amber-600 font-medium">Niet betaald</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button
            type="button"
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors mt-8"
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
