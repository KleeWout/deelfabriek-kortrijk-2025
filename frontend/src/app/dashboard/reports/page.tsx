"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/app/api/config";

type Report = {
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rapporten</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opmerking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locker</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004431] mb-4"></div>
                      <p className="text-gray-600 font-medium">Rapporten laden...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-red-600">{error}</p>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-gray-600">Geen rapporten gevonden.</p>
                  </td>
                </tr>
              ) : (
                reports.map((report, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{report.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.itemTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.rating} / 5</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.remark ?? <span className="text-gray-400">Geen opmerking</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.lockerId}</td>
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