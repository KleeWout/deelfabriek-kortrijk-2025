"use client";

import { useState, useEffect } from "react";
import { PencilSimpleLine, Trash } from "phosphor-react";
import LockerProps from "@/models/LockerProps";
import { getLockersDashboard, updateLocker, createLocker, deleteLocker } from "@/app/api/lockers";
import { getItemsDashboard } from "@/app/api/items";
import ItemProps from "@/models/ItemProps";

export default function LockersPage() {
  const [lockers, setLockers] = useState<LockerProps[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [editingLocker, setEditingLocker] = useState<LockerProps | null>(null);
  const [selectedLockers, setSelectedLockers] = useState<number[]>([]); // Track selected locker IDs
  const [formData, setFormData] = useState({
    lockerNumber: 0,
    status: "Beschikbaar" as "Beschikbaar" | "Bezet",
    itemId: null as number | null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOpenConfirmation, setShowOpenConfirmation] = useState(false);
  const [openingSuccess, setOpeningSuccess] = useState<boolean | null>(null);

  // Add form validation and error handling
  const [formError, setFormError] = useState<string | null>(null);
  // Map isOpen to status for compatibility with UI
  const mapLockerStatus = (locker: LockerProps): LockerProps => {
    let status: "Beschikbaar" | "Bezet";

    if (locker.itemId) {
      status = "Bezet"; // If locker has an item, it's occupied
    } else {
      status = "Beschikbaar"; // Otherwise it's available
    }

    return {
      ...locker,
      status,
      isOpen: true, // We always set isOpen to true since we removed maintenance
    };
  };
  // Fetch lockers and items data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch locker data and map to our format
        const lockersData = await getLockersDashboard();
        const mappedLockers = lockersData.map(mapLockerStatus);

        // Fetch items for dropdown
        const itemsData = await getItemsDashboard();

        // Filter items to only include those without a lockerId (available items)
        const availableItems = itemsData.filter((item) => item.lockerId === null || item.lockerId === undefined);

        // If we're currently editing a locker, make sure its item is included in the list
        if (editingLocker && editingLocker.itemId) {
          const currentItemExists = availableItems.some((item) => item.id === editingLocker.itemId);

          if (!currentItemExists) {
            const currentItem = itemsData.find((item) => item.id === editingLocker.itemId);
            if (currentItem) {
              setItems([...availableItems, currentItem]);
            } else {
              setItems(availableItems);
            }
          } else {
            setItems(availableItems);
          }
        } else {
          setItems(availableItems);
        }

        setLockers(mappedLockers);
        // Clear selected lockers when data is refreshed
        setSelectedLockers([]);
        // Log the data we received (for debugging)
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
  }, [editingLocker]);

  const handleAddLocker = () => {
    setEditingLocker(null);
    setFormData({
      lockerNumber: 0,
      status: "Beschikbaar",
      itemId: null,
    });
    setCurrentView("form");
  };
  const handleEditLocker = async (locker: LockerProps) => {
    setEditingLocker(locker);
    setFormData({
      lockerNumber: locker.lockerNumber,
      status: locker.status || "Beschikbaar",
      itemId: locker.itemId,
    });

    // If the locker has an item assigned, ensure it's in our items list for the dropdown
    if (locker.itemId && locker.itemTitle) {
      // Get the latest items data to ensure we have the most up-to-date list
      try {
        const itemsData = await getItemsDashboard();

        // Filter to get available items (no locker assigned)
        const availableItems = itemsData.filter((item) => item.lockerId === null || item.lockerId === undefined);

        // Check if the current item is already in the list
        const currentItemExists = availableItems.some((item) => item.id === locker.itemId);

        // If not, find it in the full list and add it to our available items
        if (!currentItemExists) {
          const currentItem = itemsData.find((item) => item.id === locker.itemId);
          if (currentItem) {
            setItems([...availableItems, currentItem]);
          } else {
            setItems(availableItems);
          }
        } else {
          setItems(availableItems);
        }
      } catch (err) {
        console.error("Error fetching items for edit:", err);
      }
    }

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
      } // isOpen is always true now (no maintenance status)
      const isOpen = true;

      // Check if we're removing an item from a locker
      const isRemovingItem = editingLocker && editingLocker.itemId && !formData.itemId;

      // Ensure status is consistent with item presence
      let status = formData.status;
      if (!formData.itemId && status === "Bezet") {
        status = "Beschikbaar";
      } else if (formData.itemId && status === "Beschikbaar") {
        status = "Bezet";
      }

      const lockerData = {
        lockerNumber: formData.lockerNumber,
        isOpen: isOpen,
        itemId: formData.itemId,
        // These fields are for UI only and won't be sent to API
        status: status,
        itemTitle: formData.itemId ? items.find((i) => i.id === formData.itemId)?.title : undefined,
      };

      if (editingLocker) {
        // Update existing locker
        await updateLocker(editingLocker.id, lockerData);

        // Show a message if an item was removed
        if (isRemovingItem) {
          console.log(`Item ${editingLocker.itemTitle} removed from locker ${editingLocker.lockerNumber}`);
        }
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
        // Clear selected lockers after refresh
        setSelectedLockers([]);
      } catch (err) {
        console.error("Error deleting locker:", err);
        alert("Failed to delete locker. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle selection of a locker
  const handleToggleSelectLocker = (lockerId: number) => {
    setSelectedLockers((prev) => {
      if (prev.includes(lockerId)) {
        return prev.filter((id) => id !== lockerId);
      } else {
        return [...prev, lockerId];
      }
    });
  };

  // Toggle selection of all lockers
  const handleToggleSelectAll = () => {
    if (selectedLockers.length === lockers.length) {
      // If all are selected, deselect all
      setSelectedLockers([]);
    } else {
      // Otherwise, select all
      setSelectedLockers(lockers.map((locker) => locker.id));
    }
  };
  // Show confirmation dialog for opening lockers
  const handleOpenSelectedLockers = () => {
    if (selectedLockers.length === 0) {
      alert("Selecteer eerst één of meerdere lockers om te openen.");
      return;
    }

    // Show the confirmation dialog
    setShowOpenConfirmation(true);
  };

  // Process the actual opening of lockers after confirmation
  const confirmOpenLockers = async () => {
    try {
      setLoading(true);
      setOpeningSuccess(null);

      // This would be replaced with the actual API call when implemented
      console.log(`Opening lockers with IDs: ${selectedLockers.join(", ")}`);

      // Simulate API call success
      // In a real implementation, this would be the result of the API call
      setTimeout(() => {
        setOpeningSuccess(true);

        // Clear selection after success
        setTimeout(() => {
          setSelectedLockers([]);
          setShowOpenConfirmation(false);
          setOpeningSuccess(null);
        }, 2000);
      }, 1000);

      // Here you would add the actual API call to open the lockers
      // const result = await openLockers(selectedLockers);
      // setOpeningSuccess(result.success);

      // And then refresh the data if needed
      // const lockersData = await getLockersDashboard();
      // const mappedLockers = lockersData.map(mapLockerStatus);
      // setLockers(mappedLockers);
    } catch (err) {
      console.error("Error opening lockers:", err);
      setOpeningSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [field]: field === "itemId" ? (value === "" ? null : parseInt(value)) : value,
      }; // Auto-update status based on item selection
      if (field === "itemId") {
        // If an item is selected, set status to "Bezet"
        if (value !== "") {
          updatedData.status = "Bezet";
        }
        // If item is removed, set status to "Beschikbaar"
        else {
          updatedData.status = "Beschikbaar";
        }
      }

      return updatedData;
    });
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

    // If status is "Bezet" but there's no item ID, set status to "Beschikbaar"
    if (formData.status === "Bezet" && !formData.itemId) {
      // Auto-update the status to "Beschikbaar" since there's no item
      setFormData((prev) => ({
        ...prev,
        status: "Beschikbaar",
      }));
    }

    setFormError(null);
    return true;
  };
  if (currentView === "list") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        {showOpenConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{openingSuccess === null ? <>Lockers openen</> : openingSuccess ? <>Lockers succesvol geopend</> : <>Fout bij openen van lockers</>}</h3>

              {openingSuccess === null && !loading && (
                <>
                  <p className="mb-6 text-gray-600">
                    Weet u zeker dat u {selectedLockers.length} locker{selectedLockers.length > 1 ? "s" : ""} wilt openen?
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors" onClick={() => setShowOpenConfirmation(false)}>
                      Annuleren
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={confirmOpenLockers}>
                      Bevestigen
                    </button>
                  </div>
                </>
              )}

              {loading && (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              )}

              {openingSuccess === true && (
                <div className="text-center py-4">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-600">De geselecteerde lockers zijn succesvol geopend.</p>
                </div>
              )}

              {openingSuccess === false && (
                <div className="text-center py-4">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-600 mb-4">Er is een fout opgetreden bij het openen van de lockers.</p>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors" onClick={() => setShowOpenConfirmation(false)}>
                      Sluiten
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lockers</h1>
          <div className="flex space-x-3">
            {selectedLockers.length > 0 && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center" onClick={handleOpenSelectedLockers} disabled={loading}>
                <span>Open locker{selectedLockers.length > 1 ? "s" : ""}</span>
              </button>
            )}
            <button className="bg-[#004431] text-white px-4 py-2 rounded-lg hover:bg-[#003422] transition-colors" onClick={handleAddLocker}>
              Voeg Locker toe
            </button>
          </div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedLockers.length > 0 && selectedLockers.length === lockers.length} onChange={handleToggleSelectAll} title="Selecteer alle lockers" />
                        <span className="ml-2">Selecteer</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lockernummer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toegewezen Item</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lockers.map((locker) => (
                    <tr key={locker.id} className={selectedLockers.includes(locker.id) ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedLockers.includes(locker.id)} onChange={() => handleToggleSelectLocker(locker.id)} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{locker.lockerNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {" "}
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            {
                              Beschikbaar: "bg-green-100 text-green-800",
                              Bezet: "bg-blue-100 text-blue-800",
                            }[locker.status || (locker.itemId ? "Bezet" : "Beschikbaar")]
                          }`}
                        >
                          {locker.status || (locker.itemId ? "Bezet" : "Beschikbaar")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{locker.itemTitle || "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#004431] hover:text-[#003422] mr-2" onClick={() => handleEditLocker(locker)}>
                          <PencilSimpleLine size={20} />
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
            {/* <div>
              {" "}
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => handleInputChange("status", e.target.value as "Beschikbaar" | "Bezet")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1">
                <option value="Beschikbaar">Beschikbaar</option>
                <option value="Bezet">Bezet</option>
              </select>
            </div>{" "} */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Toegewezen Item</label>{" "}
              <select value={formData.itemId || ""} onChange={(e) => handleInputChange("itemId", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1" disabled={loading}>
                <option value="">Geen item toegewezen</option>
                
                {loading ? (
                  <option disabled>Items laden...</option>
                ) : items.length === 0 && (!editingLocker || !editingLocker.itemId) ? (
                  <option disabled>Geen items beschikbaar</option>
                ) : (
                  <>
                    {/* Show current item at the top if it exists and not in the regular items list */}
                    {editingLocker && editingLocker.itemId && !items.some((item) => item.id === editingLocker.itemId) && (
                      <option key={editingLocker.itemId} value={editingLocker.itemId} className="font-medium text-green-700 bg-green-100">
                        {editingLocker.itemTitle} (huidig item)
                      </option>
                    )}
                    {/* Regular items */}
                    {items.map((item) => (
                      <option key={item.id} value={item.id} className={editingLocker && editingLocker.itemId === item.id ? "font-medium text-green-700 bg-green-100" : ""}>
                        {item.title}
                        {editingLocker && editingLocker.itemId === item.id ? " (huidig item)" : ""}
                      </option>
                    ))}
                  </>
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
