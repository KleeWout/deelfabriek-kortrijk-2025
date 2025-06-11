"use client";

import { useState, useEffect } from "react";
import { PencilSimpleLine, Trash, Wrench } from "phosphor-react";
import LockerProps from "@/models/LockerProps";
import { getLockersDashboard, updateLocker, createLocker, deleteLocker, setLockerToMaintenance } from "@/app/api/lockers";
import { getItemsDashboard } from "@/app/api/items";
import ItemProps from "@/models/ItemProps";

export default function LockersPage() {
  const [lockers, setLockers] = useState<LockerProps[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [editingLocker, setEditingLocker] = useState<LockerProps | null>(null);
  const [formData, setFormData] = useState({
    lockerNumber: 0,
    status: "Beschikbaar" as "Beschikbaar" | "Bezet" | "Onderhoud",
    itemId: null as number | null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add form validation and error handling
  const [formError, setFormError] = useState<string | null>(null);
  // Map isOpen to status for compatibility with UI
  const mapLockerStatus = (locker: LockerProps): LockerProps => {
    let status: "Beschikbaar" | "Bezet" | "Onderhoud";

    if (!locker.isOpen) {
      status = "Onderhoud"; // If locker is not open, it's in maintenance
    } else if (locker.itemId) {
      status = "Bezet"; // If locker has an item, it's occupied
    } else {
      status = "Beschikbaar"; // Otherwise it's available
    }

    return {
      ...locker,
      status,
    };
  };

  // Fetch lockers and items data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch locker data and map to our format
        const lockersData = await getLockersDashboard();
        const mappedLockers = lockersData.map(mapLockerStatus); // Fetch items for dropdown
        const itemsData = await getItemsDashboard();

        // Filter items to only include those without a lockerId (available items)
        const availableItems = itemsData.filter((item) => item.lockerId === null || item.lockerId === undefined);

        setLockers(mappedLockers);
        setItems(availableItems); // Log the data we received (for debugging)
        console.log("Lockers data:", lockersData);
        console.log("All items data:", itemsData);
        console.log("Available items (no locker assigned):", availableItems);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddLocker = () => {
    setEditingLocker(null);
    setFormData({
      lockerNumber: 0,
      status: "Beschikbaar",
      itemId: null,
    });
    setCurrentView("form");
  };

  const handleEditLocker = (locker: LockerProps) => {
    setEditingLocker(locker);
    setFormData({
      lockerNumber: locker.lockerNumber,
      status: locker.status || "Beschikbaar",
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

      // Validate form data
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Convert our UI status to API isOpen value
      const isOpen = formData.status !== "Onderhoud";

      const lockerData = {
        lockerNumber: formData.lockerNumber,
        isOpen: isOpen,
        itemId: formData.itemId,
        // These fields are for UI only and won't be sent to API
        status: formData.status,
        itemTitle: formData.itemId ? items.find((i) => i.id === formData.itemId)?.title : undefined,
      };
      if (editingLocker) {
        // Update existing locker
        await updateLocker(editingLocker.id, lockerData);
      } else {
        // Add new locker
        const newLocker = {
          ...lockerData,
        };
        await createLocker(newLocker);
      } // Refresh the lockers list from the server
      const lockersData = await getLockersDashboard();
      const mappedLockers = lockersData.map(mapLockerStatus);

      // Also refresh the items list to update available items
      const itemsData = await getItemsDashboard();
      const availableItems = itemsData.filter((item) => item.lockerId === null || item.lockerId === undefined);

      setLockers(mappedLockers);
      setItems(availableItems);

      setCurrentView("list");
      setEditingLocker(null);
    } catch (err) {
      console.error("Error saving locker:", err);
      alert("Failed to save locker. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSetMaintenance = async (lockerId: number) => {
    try {
      setLoading(true);

      // For maintenance, we set isOpen to false
      await updateLocker(lockerId, { isOpen: false });

      // Refresh the lockers list from the server
      const lockersData = await getLockersDashboard();
      const mappedLockers = lockersData.map(mapLockerStatus);

      // Also refresh the items list to update available items
      const itemsData = await getItemsDashboard();
      const availableItems = itemsData.filter((item) => item.lockerId === null || item.lockerId === undefined);

      setLockers(mappedLockers);
      setItems(availableItems);
    } catch (err) {
      console.error("Error setting locker to maintenance:", err);
      alert("Failed to set locker to maintenance. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteLocker = async (lockerId: number) => {
    if (window.confirm("Weet je zeker dat je deze Locker wilt verwijderen?")) {
      try {
        setLoading(true);
        await deleteLocker(lockerId);

        // Refresh the lockers list from the server
        const lockersData = await getLockersDashboard();
        const mappedLockers = lockersData.map(mapLockerStatus);

        // Also refresh the items list to update available items
        const itemsData = await getItemsDashboard();
        const availableItems = itemsData.filter((item) => item.lockerId === null || item.lockerId === undefined);

        setLockers(mappedLockers);
        setItems(availableItems);
      } catch (err) {
        console.error("Error deleting locker:", err);
        alert("Failed to delete locker. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "itemId" ? (value === "" ? null : parseInt(value)) : value,
    }));
  };
  const validateForm = () => {
    if (formData.lockerNumber <= 0) {
      setFormError("Lockernummer moet groter zijn dan 0");
      return false;
    }

    // Check if the locker number is already in use (except for the current locker being edited)
    const existingLocker = lockers.find((l) => l.lockerNumber === formData.lockerNumber && (!editingLocker || l.id !== editingLocker.id));

    if (existingLocker) {
      setFormError(`Lockernummer ${formData.lockerNumber} bestaat al`);
      return false;
    }

    if (formData.status === "Bezet" && !formData.itemId) {
      setFormError("Een bezette locker moet een item toegewezen hebben");
      return false;
    }

    setFormError(null);
    return true;
  };

  if (currentView === "list") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lockers</h1>
          <button className="bg-[#004431] text-white px-4 py-2 rounded-lg hover:bg-[#003422] transition-colors" onClick={handleAddLocker}>
            Voeg Locker toe
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004431]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
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
                  {" "}
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
                            }[locker.status || (locker.isOpen ? (locker.itemId ? "Bezet" : "Beschikbaar") : "Onderhoud")]
                          }`}
                        >
                          {locker.status || (locker.isOpen ? (locker.itemId ? "Bezet" : "Beschikbaar") : "Onderhoud")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{locker.itemTitle || "-"}</div>
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
          <h1 className="text-2xl font-bold text-gray-800">Lockers</h1>
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
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => handleInputChange("status", e.target.value as "Beschikbaar" | "Bezet" | "Onderhoud")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1">
                <option value="Beschikbaar">Beschikbaar</option>
                <option value="Bezet">Bezet</option>
                <option value="Onderhoud">Onderhoud</option>
              </select>
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Toegewezen Item</label>
              <select value={formData.itemId || ""} onChange={(e) => handleInputChange("itemId", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1" disabled={loading}>
                <option value="">Geen item toegewezen</option>
                {loading ? (
                  <option disabled>Items laden...</option>
                ) : items.length === 0 ? (
                  <option disabled>Geen items beschikbaar</option>
                ) : (
                  items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))
                )}
              </select>{" "}
              {items.length === 0 && !loading && (
                <p className="mt-1 text-sm text-amber-600">
                  Geen items beschikbaar om toe te wijzen.
                  <span className="font-light italic ml-1">(Alleen items zonder toegewezen locker worden getoond)</span>
                </p>
              )}
            </div>{" "}
            {formError && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">{formError}</div>}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
