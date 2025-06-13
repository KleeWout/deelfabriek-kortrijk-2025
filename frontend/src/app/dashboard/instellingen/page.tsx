"use client";

import { useState, useEffect } from "react";
import { CategoryManagement } from "./components/CategoryManagement";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "hours" | "users">("categories");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Instellingen</h1>
      </div>
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("categories")}
              className={`
                py-4 px-6 border-b-2 font-medium text-sm
                ${activeTab === "categories" ? "border-primarygreen-1 text-primarygreen-1" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
            >
              Categorieën
            </button>
          </nav>
        </div>
      </div>{" "}
      {/* Tab Content */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === "categories" && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Categorieën beheren</h2>
            <CategoryManagement />
          </section>
        )}
      </div>
    </div>
  );
}
