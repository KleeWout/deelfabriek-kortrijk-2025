"use client";

import { useState, useEffect } from "react";
import { PencilSimpleLine, Trash, Wrench } from "phosphor-react";
import LockerProps from "@/models/LockerProps";

// Sample data for testing
const sampleLockers: LockerProps[] = [
  { id: 1, lockerNumber: 1, status: "Beschikbaar", itemId: null },
  { id: 2, lockerNumber: 2, status: "Bezet", itemId: 5, itemName: "Boormachine" },
  { id: 3, lockerNumber: 3, status: "Onderhoud", itemId: null },
  { id: 4, lockerNumber: 4, status: "Beschikbaar", itemId: null },
  { id: 5, lockerNumber: 5, status: "Bezet", itemId: 8, itemName: "Verfspuit" },
];

// Sample items for dropdown
const sampleItems = [
  { id: 1, name: "Naaimachine" },
  { id: 5, name: "Boormachine" },
  { id: 8, name: "Verfspuit" },
  { id: 12, name: "Zaag" },
  { id: 15, name: "Mixer" },
];

export default function LockersPage() {
  const [lockers, setLockers] = useState<LockerProps[]>([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [editingLocker, setEditingLocker] = useState<LockerProps | null>(null);
  const [formData, setFormData] = useState({
    lockerNumber: 0,
    status: "Available",
    itemId: null as number | null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    // This would be replaced with actual API call
    setLockers(sampleLockers);
    setLoading(false);
  }, []);

  const handleAddLocker = () => {
    setEditingLocker(null);
    setFormData({
      lockerNumber: 0,
      status: "Available",
      itemId: null,
    });
    setCurrentView("form");
  };

  const handleEditLocker = (locker: LockerProps) => {
    setEditingLocker(locker);
    setFormData({
      lockerNumber: locker.lockerNumber,
      status: locker.status,
      itemId: locker.itemId,
    });
    setCurrentView("form");
  };

  const handleCancel = () => {
    setCurrentView("list");
    setEditingLocker(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const lockerData = {
        lockerNumber: formData.lockerNumber,
        status: formData.status,
        itemId: formData.itemId,
        // Add itemName for display purposes in this example
        itemName: formData.itemId ? sampleItems.find((i) => i.id === formData.itemId)?.name : undefined,
      };

      // For now, just update the state directly
      if (editingLocker) {
        // Update existing locker
        // setLockers((prevLockers) => prevLockers.map((locker) => (locker.id === editingLocker.id ? { ...locker, ...lockerData } : locker)));
      } else {
        // Add new locker
        const newLocker = {
          id: Math.max(0, ...lockers.map((l) => l.id)) + 1,
          ...lockerData,
        };
        // setLockers((prevLockers) => [...prevLockers, newLocker]);
      }

      setCurrentView("list");
      setEditingLocker(null);
    } catch (err) {
      console.error("Error saving locker:", err);
      alert("Failed to save locker. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetMaintenance = (lockerId: number) => {
    // setLockers((prevLockers) => prevLockers.map((locker) => (locker.id === lockerId ? { ...locker, status: "Maintenance" } : locker)));
  };

  const handleDeleteLocker = (lockerId: number) => {
    if (window.confirm("Weet je zeker dat je deze Locker wilt verwijderen?")) {
      //   setLockers((prevLockers) => prevLockers.filter((locker) => locker.id !== lockerId));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "itemId" ? (value === "" ? null : parseInt(value)) : value,
    }));
  };

  if (currentView === "list") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kluizen</h1>
          <button className="bg-[#004431] text-white px-4 py-2 rounded-lg hover:bg-[#003422] transition-colors" onClick={handleAddLocker}>
            Voeg Locker toe
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004431]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lockernummer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toegewezen Item</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lockers.map((locker) => (
                    <tr key={locker.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{locker.lockerNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            {
                              Beschikbaar: "bg-green-100 text-green-800",
                              Bezet: "bg-blue-100 text-blue-800",
                              Onderhoud: "bg-red-100 text-red-800",
                            }[locker.status]
                          }`}
                        >
                          {locker.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{locker.itemName || "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#004431] hover:text-[#003422] mr-2" onClick={() => handleEditLocker(locker)}>
                          <PencilSimpleLine size={20} />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800 mr-2" onClick={() => handleSetMaintenance(locker.id)} disabled={locker.status === "Onderhoud"}>
                          <Wrench size={20} />
                        </button>
                        <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteLocker(locker.id)}>
                          <Trash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentView === "form") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kluizen</h1>
          <div className="flex space-x-3">
            <button onClick={handleCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
              Annuleren
            </button>
            <button onClick={handleSave} className="bg-[#004431] text-white px-4 py-2 rounded-lg hover:bg-[#003422] transition-colors">
              Opslaan
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">{editingLocker ? "Locker bewerken" : "Locker aanmaken"}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lockernummer</label>
              <input type="number" value={formData.lockerNumber} onChange={(e) => handleInputChange("lockerNumber", parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1" placeholder="101" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1">
                <option value="Available">Beschikbaar</option>
                <option value="Occupied">Bezet</option>
                <option value="Maintenance">Onderhoud</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Toegewezen Item</label>
              <select value={formData.itemId || ""} onChange={(e) => handleInputChange("itemId", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1" disabled={formData.status === "Maintenance"}>
                <option value="">Geen item toegewezen</option>
                {sampleItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formData.status === "Maintenance" && <p className="mt-1 text-sm text-red-600">Items kunnen niet worden toegewezen aan kluizen in onderhoud</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
