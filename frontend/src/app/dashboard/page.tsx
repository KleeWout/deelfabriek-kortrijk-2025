"use client";

import { useState, useEffect } from "react";
import StatisticsCard from "./components/StatisticsCard";
import LockerTable from "./components/LockerTable";
import ActivityLog from "./components/ActivityLog";
import { getLockersDashboard } from "@/app/api/lockers";

export default function Dashboard() {
  const [lockerData, setLockerData] = useState<{ id: number; locker: string; product: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lockers data from API
  useEffect(() => {
    const fetchLockers = async () => {
      try {
        setLoading(true);
        const data = await getLockersDashboard();

        // Transform locker data for the table
        const formattedData = data.map((locker) => ({
          id: locker.id,
          locker: `${locker.lockerNumber}`,
          product: locker.itemTitle || "Geen item",
          status: locker.itemId ? "Bezet" : "Beschikbaar",
        }));

        setLockerData(formattedData);
      } catch (err) {
        console.error("Failed to fetch lockers:", err);
        setError("Failed to load lockers");
      } finally {
        setLoading(false);
      }
    };

    fetchLockers();
  }, []);

  // Statistics data - will be updated with real data later
  const statistics = [
    { id: 1, label: "Beschikbare items", value: "1", iconName: "CheckCircle" },
    { id: 2, label: "Ontleende producten", value: "2", iconName: "Basket" },
    { id: 3, label: "Te laat", value: "2", iconName: "Timer" },
    { id: 4, label: "Totaal ontleende producten", value: "33", iconName: "UsersThree" },
  ];

  const activityLogs = [{ id: 1, message: "Item #45678 werd teruggebracht door user_123.", timestamp: "01/06/2025 18:29" }];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statistics.map((stat) => (
          <StatisticsCard key={stat.id} label={stat.label} value={stat.value} iconName={stat.iconName} />
        ))}
      </div>{" "}
      {/* Lockers */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Lockers</h2>
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primarygreen-1"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 text-red-500">{error}</div>
        ) : (
          <LockerTable data={lockerData} />
        )}
      </section>
      {/* Raporten */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Rapporten</h2>
        <ActivityLog logs={activityLogs} />
      </section>
    </div>
  );
}
