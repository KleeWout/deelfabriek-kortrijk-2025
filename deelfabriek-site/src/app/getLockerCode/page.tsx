"use client";
import { stat } from "fs";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import ProtectedRoute from "@/components/ProtectedRoute";

type Locker = {
  status: number;
  code: string | null;
  idLocker: number;
  itemName: string;
};

export default function GetLockerCode() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [generatedCodes, setGeneratedCodes] = useState<{
    [id: number]: number;
  }>({});
  const { user } = useAuth();
  const { fetchWithAuth } = useApi();

  const fetchLockers = () => {
    fetchWithAuth("http://192.168.129.59:5000/lockers")
      .then((res) => res.json())
      .then((json) => setLockers(json))
      .catch((err) => console.error("Failed to fetch lockers:", err));
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  async function randomCode(lockers: Locker[]): Promise<number> {
    const existingCodes = lockers.map((locker) => locker.code).filter((code): code is string => !!code);
    let code: number;
    do {
      code = Math.floor(10000 + Math.random() * 90000);
    } while (existingCodes.includes(code.toString()));
    return code;
  }

  const reserveLocker = async (locker: Locker) => {
    setLoading(locker.idLocker);
    const code = await randomCode(lockers);
    await fetch(`http://192.168.129.59:5000/lockers/${locker.idLocker}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setGeneratedCodes((prev) => ({ ...prev, [locker.idLocker]: code }));
    fetchLockers();
    setLoading(null);
  };

  const releaseLocker = async (locker: Locker) => {
    setLoading(locker.idLocker);
    const test = await fetch(`http://192.168.129.59:5000/lockers/${locker.idLocker}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    console.log(test);
    fetchLockers();
    setLoading(null);
  };
  return (
    <ProtectedRoute>
      <div style={{ padding: "2rem" }}>
        <h1 style={{ textAlign: "center" }}>Lockers</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          {lockers.map((locker) => {
            let statusText = "Beschikbaar";
            let statusColor = "#388e3c";
            let bgColor = "#e8f5e9";
            if (locker.status === 0) {
              statusText = "Niet beschikbaar";
              statusColor = "#d32f2f";
              bgColor = "#ffebee";
            } else if (locker.status === 1 && locker.code) {
              statusText = "Gereserveerd";
              statusColor = "#fbc02d";
              bgColor = "#fffde7";
            }

            return (
              <div
                key={locker.idLocker}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  background: bgColor,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  textAlign: "center",
                  transition: "transform 0.2s",
                }}
              >
                <h2 style={{ margin: 0, fontSize: "2rem" }}>{locker.idLocker}</h2>
                <p
                  style={{
                    color: statusColor,
                    fontWeight: "bold",
                    marginTop: "1rem",
                    fontSize: "1.1rem",
                  }}
                >
                  {statusText}
                </p>
                {locker.status === 1 && !locker.code && (
                  <>
                    <button
                      style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1.2rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#1976d2",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: loading === locker.idLocker ? "wait" : "pointer",
                        opacity: loading === locker.idLocker ? 0.7 : 1,
                      }}
                      disabled={loading === locker.idLocker}
                      onClick={() => reserveLocker(locker)}
                    >
                      {loading === locker.idLocker ? "Reserveren..." : "Reserveer"}
                    </button>
                  </>
                )}
                {/* Toon de code als locker.status 1 of 0 is én er een code is */}
                {(locker.status === 0 || locker.status === 1) && locker.code && (
                  <div
                    style={{
                      marginTop: "1rem",
                      fontWeight: "bold",
                      color: "#1976d2",
                    }}
                  >
                    Code: {locker.code}
                  </div>
                )}
                {locker.status === 0 && (
                  <>
                    <button
                      style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1.2rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#d32f2f",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: loading === locker.idLocker ? "wait" : "pointer",
                        opacity: loading === locker.idLocker ? 0.7 : 1,
                      }}
                      disabled={loading === locker.idLocker}
                      onClick={() => releaseLocker(locker)}
                    >
                      {loading === locker.idLocker ? "Vrijgeven..." : "Vrijgeven"}
                    </button>
                  </>
                )}
              </div>
            );
          })}{" "}
        </div>
      </div>
    </ProtectedRoute>
  );
}
