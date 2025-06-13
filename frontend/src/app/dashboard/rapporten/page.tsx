"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/app/api/config";
import { Trash } from "phosphor-react";

type Report = {
  id: number;
  email: string;
  itemTitle: string;
  rating: number;
  remark: string | null;
  status: string;
  createdAt: string;
  lockerId: number;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedItem, setSelectedItem] = useState<string>("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch(getApiUrl("/dashboard/reports"));
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError("Kon rapporten niet laden.");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  // Sort reports by itemTitle
  const sortedReports = [...reports].sort((a, b) => {
    if (a.itemTitle < b.itemTitle) return sortOrder === "asc" ? -1 : 1;
    if (a.itemTitle > b.itemTitle) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Get unique item titles for the dropdown
  const itemTitles = Array.from(new Set(reports.map((r) => r.itemTitle)));

  // Filter reports based on selected item
  const filteredReports = selectedItem
    ? sortedReports.filter((r) => r.itemTitle === selectedItem)
    : sortedReports;

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Add this handler inside your ReportsPage component
  const handleDelete = async (report: Report) => {
    if (!window.confirm("Weet je zeker dat je dit rapport wilt verwijderen?"))
      return;
    try {
      // Adjust the API endpoint as needed
      const res = await fetch(getApiUrl(`/dashboard/reports/${report.id}`), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Verwijderen mislukt");
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch {
      alert("Verwijderen mislukt");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rapporten</h1>
        <div className="flex items-center gap-2">
          <label
            htmlFor="itemFilter"
            className="text-gray-700 text-sm font-medium"
          >
            Filter op item:
          </label>
          <div className="bg-white border border-gray-300 pr-3 rounded focus-within:ring-2 focus-within:ring-[#004431]">
            <select
              id="itemFilter"
              className="border-0 outline-none rounded px-3 py-2 pr-12 bg-white w-full"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">Alle items</option>
              {itemTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Opmerking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004431] mb-4"></div>
                      <p className="text-gray-600 font-medium">
                        Rapporten laden...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-red-600">{error}</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-gray-600">Geen rapporten gevonden.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.itemTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.rating && report.rating > 0 ? (
                        `${report.rating} / 5`
                      ) : (
                        <span className="text-gray-400">Geen rating</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.remark && report.remark.trim() !== "" ? (
                        report.remark
                      ) : (
                        <span className="text-gray-400">Geen opmerking</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(report)}
                        className="text-red-600 hover:text-red-800"
                        title="Verwijder rapport"
                      >
                        <Trash size={20} />
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
