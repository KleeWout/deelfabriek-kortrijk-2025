"use client";

import { useState } from "react";
import StatisticsCard from "./components/StatisticsCard";
import LockerTable from "./components/LockerTable";
import ActivityLog from "./components/ActivityLog";
import itemsData from "../../data/items.json";

export default function Dashboard() {
  // Later data fetchen van de API
  const statistics = [
    { id: 1, label: "Beschikbare items", value: "1", iconName: "CheckCircle" },
    { id: 2, label: "Ontleende producten", value: "2", iconName: "Basket" },
    { id: 3, label: "Te laat", value: "2", iconName: "Timer" },
    { id: 4, label: "Totaal ontleende producten", value: "33", iconName: "UsersThree" },
  ];

  // Transform items data into locker data format
  const lockerData = itemsData.map((item, index) => ({
    id: item.id,
    locker: `${index + 1}`,
    product: item.title,
    status: item.status
  }));


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
      </div>

      {/* Lockers */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Lockers</h2>
        <LockerTable data={lockerData} />
      </section>

      {/* Raporten */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Rapporten</h2>
        <ActivityLog logs={activityLogs} />
      </section>
    </div>
  );
}