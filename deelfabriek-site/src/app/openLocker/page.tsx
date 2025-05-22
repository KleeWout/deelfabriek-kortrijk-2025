"use client";
import { FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OpenLocker() {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { fetchWithAuth } = useApi();

  const controlCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector("input[type='text']") as HTMLInputElement | null;
    const code = input?.value || "";

    try {
      const response = await fetchWithAuth("http://localhosts:5000/lockers");
      const lockers = await response.json();
      const locker = lockers.find((locker: any) => locker.code === code);

      if (locker) {
        // You can use fetchWithAuth here too to automatically include the auth token
        // await fetchWithAuth("http://172.30.82.165:5000/open_locker", {
        //   method: "POST",
        //   body: JSON.stringify({ relay: locker.idLocker }),
        // });
        setMessage("Locker geopend!");
        console.log("Locker opened");
      } else {
        setMessage("Code niet gevonden. Probeer opnieuw.");
        console.log("Locker not found");
      }
    } catch (error) {
      setMessage("Er is een fout opgetreden bij het controleren van de code.");
      console.error("Error checking locker code:", error);
    }
  };
  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Enter locker code</h1>
        <form onSubmit={controlCode} className="flex flex-col items-center gap-4 mt-8 w-full max-w-xs">
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" placeholder="Voer je locker code in" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
            Controleer code
          </button>
          {message && <div className={message.includes("fout") || message.includes("niet") ? "text-red-500" : "text-green-500"}>{message}</div>}
        </form>
      </main>
    </ProtectedRoute>
  );
}
