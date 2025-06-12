"use client";
import { useEffect, useState } from "react";
import { Clock, Check } from "phosphor-react";

const days = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];

const BACKEND_URL = "http://localhost:3001/dashboard/openingshours";

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

function timeStr(date: string | null) {
  if (!date) return "";
  const d = new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTime(val: string) {
  if (!val) return "";
  const [h, m] = val.split(":");
  return `${h?.padStart(2, "0") || "00"}:${m?.padStart(2, "0") || "00"}`;
}

const dayMap: Record<string, string> = {
  Monday: "Maandag",
  Tuesday: "Dinsdag",
  Wednesday: "Woensdag",
  Thursday: "Donderdag",
  Friday: "Vrijdag",
  Saturday: "Zaterdag",
  Sunday: "Zondag",
};

const reverseDayMap: Record<string, string> = Object.fromEntries(
  Object.entries(dayMap).map(([key, value]) => [value, key])
);

export default function OpeningsurenPage() {
  const [openingHours, setOpeningHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(BACKEND_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error("Fout bij ophalen openingsuren");
        const data = await res.json();
        // Map backend English days to Dutch days
        const dataMap = Object.fromEntries(
          data.map((h: any) => [dayMap[h.idDay] ?? h.idDay, h])
        );
        const mapped = days.map((day) => {
          const h = dataMap[day] || {};
          return {
            idDay: day,
            openTimeVm: h.openTimeMorning ?? "",
            closeTimeVm: h.closeTimeMorning ?? "",
            openTimeNm: h.openTimeAfternoon ?? "",
            closeTimeNm: h.closeTimeAfternoon ?? "",
            gesloten: h.open === false,
          };
        });
        setOpeningHours(mapped);
      })
      .catch(() => setError("Fout bij ophalen openingsuren"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (
    idx: number,
    field: string,
    value: string | boolean
  ) => {
    setOpeningHours((hours) =>
      hours.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    );
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    // Validation: check for open days with all empty times
    const invalidDay = openingHours.find(
      (h) =>
        !h.gesloten &&
        !h.openTimeVm &&
        !h.closeTimeVm &&
        !h.openTimeNm &&
        !h.closeTimeNm
    );
    if (invalidDay) {
      setError(
        `Vul minstens één openingsuur in voor ${invalidDay.idDay} of markeer als gesloten.`
      );
      return;
    }

    // Validation: check for half-filled periods
    const invalidPeriodDay = openingHours.find((h) => {
      if (h.gesloten) return false;
      // Ochtend: only one filled
      const ochtendOneFilled = !!h.openTimeVm !== !!h.closeTimeVm;
      // Middag: only one filled
      const middagOneFilled = !!h.openTimeNm !== !!h.closeTimeNm;
      return ochtendOneFilled || middagOneFilled;
    });
    if (invalidPeriodDay) {
      setError(
        `Vul zowel begin- als einduur in voor ochtend of middag op ${invalidPeriodDay.idDay}, of laat beide leeg.`
      );
      return;
    }

    try {
      await Promise.all(
        openingHours.map(async (h) => {
          const isClosed = h.gesloten;
          const body = {
            openTimeMorning: h.openTimeVm || null,
            closeTimeMorning: h.closeTimeVm || null,
            openTimeAfternoon: h.openTimeNm || null,
            closeTimeAfternoon: h.closeTimeNm || null,
            open: !isClosed,
          };
          // Use English day name for backend
          const backendDay = reverseDayMap[h.idDay] || h.idDay;
          const res = await fetch(`${BACKEND_URL}/${backendDay}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error();
        })
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError("Fout bij opslaan openingsuren");
    }
  };

  if (loading) return <div className="p-8">Laden...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Openingsuren</h1>
        <button
          className="px-8 py-2 rounded-lg bg-primarygreen-1 text-white text-lg font-bold shadow hover:bg-[#00664f] transition flex items-center gap-2"
          onClick={handleSave}
        >
          Opslaan
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ochtend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Middag
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gesloten
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {openingHours.map((h, idx) => (
                <tr key={h.idDay}>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {h.idDay}
                  </td>
                  {/* Ochtend */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className={`w-28 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition ${
                          h.gesloten
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-50"
                        }`}
                        value={formatTime(h.openTimeVm) || ""}
                        onChange={(e) =>
                          handleChange(idx, "openTimeVm", e.target.value)
                        }
                        disabled={h.gesloten}
                      />
                      <span className="text-gray-400">tot</span>
                      <input
                        type="time"
                        className={`w-28 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition ${
                          h.gesloten
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-50"
                        }`}
                        value={formatTime(h.closeTimeVm) || ""}
                        onChange={(e) =>
                          handleChange(idx, "closeTimeVm", e.target.value)
                        }
                        disabled={h.gesloten}
                      />
                    </div>
                  </td>
                  {/* Middag */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className={`w-28 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition ${
                          h.gesloten
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-50"
                        }`}
                        value={formatTime(h.openTimeNm) || ""}
                        onChange={(e) =>
                          handleChange(idx, "openTimeNm", e.target.value)
                        }
                        disabled={h.gesloten}
                      />
                      <span className="text-gray-400">tot</span>
                      <input
                        type="time"
                        className={`w-28 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition ${
                          h.gesloten
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-50"
                        }`}
                        value={formatTime(h.closeTimeNm) || ""}
                        onChange={(e) =>
                          handleChange(idx, "closeTimeNm", e.target.value)
                        }
                        disabled={h.gesloten}
                      />
                    </div>
                  </td>
                  {/* Gesloten */}
                  <td className="px-6 py-4 text-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={h.gesloten}
                        onChange={(e) =>
                          handleChange(idx, "gesloten", e.target.checked)
                        }
                        className="w-5 h-5 accent-primarygreen-1 rounded border-2 border-primarygreen-1 focus:ring-2 focus:ring-primarygreen-1"
                      />
                      <span className="ml-2 text-gray-700 font-semibold">
                        Gesloten
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {success && (
          <div className="absolute right-10 bottom-24 bg-green-100 border border-green-400 text-green-800 px-6 py-3 rounded-xl font-semibold shadow-lg">
            Openingsuren succesvol opgeslagen!
          </div>
        )}
        {error && (
          <div className="absolute right-10 bottom-10 bg-red-100 border border-red-400 text-red-800 px-6 py-3 rounded-xl font-semibold shadow-lg z-50">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
