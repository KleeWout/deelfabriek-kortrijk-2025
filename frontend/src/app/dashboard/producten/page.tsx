"use client";

import { useEffect, useState } from "react";
import item from "@/data/items.json";
import ItemProps from "@/models/ItemProps";
import { PencilSimpleLine, Trash } from "phosphor-react";
import { ItemCard } from "@/components/common/ItemCard";
import {
  createItem,
  deleteItem,
  getItemsDashboard,
  updateItem,
} from "@/app/api/items";

// interface Item {
//   id: number;
//   title: string;
//   price: number;
//   status: "Beschikbaar" | "Gereserveerd" | "Uitgeleend";
//   imageSrc: string;
//   categoryId: string;
// }

export default function ItemsPage() {
  // const [items, setItems] = useState<ItemProps[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);

  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [editingItem, setEditingItem] = useState<ItemProps | null>(null);
  const [formData, setFormData] = useState({
    id: undefined as number | undefined, // <-- add id to initial state
    title: "",
    category: "",
    price: "",
    description: "",
    howToUse: "",
    whatsIncluded: "",
    tip: "",
    weight: 0,
    dimensions: "",
    imageSrc: "",
    imageFile: null as File | null,
  });
  useEffect(() => {
    setItems(item);
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItemsDashboard();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load items");
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      id: undefined, // <-- reset id when adding new
      title: "",
      category: "",
      price: "0",
      description: "",
      howToUse: "",
      whatsIncluded: "",
      tip: "",
      weight: 0,
      dimensions: "",
      imageSrc: "",
      imageFile: null,
    });
    setCurrentView("form");
  };

  const handleEditItem = (item: ItemProps) => {
    setEditingItem(item);
    setFormData({
      id: item.id, // <-- set id when editing
      title: item.title || "",
      category: item.category || "",
      price: item.pricePerWeek?.toString() || "",
      description: item.description || "",
      howToUse: item.howToUse || "",
      whatsIncluded: item.whatsIncluded || "",
      tip: item.tip || "",
      weight: item.weight || 0,
      dimensions: item.dimensions || "",
      imageSrc: item.imageSrc || "",
      imageFile: null,
    });
    setCurrentView("form");
  };

  const handleCancel = () => {
    setCurrentView("list");
    setEditingItem(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Convert form data to the right format
      const itemData = {
        file: formData.imageFile ?? undefined,
        title: formData.title,
        pricePerWeek: parseFloat(formData.price),
        howToUse: formData.howToUse,
        accessories: formData.whatsIncluded,
        weight: formData.weight,
        dimensions: formData.dimensions,
        tip: formData.tip,
        status: "Beschikbaar",
        description: formData.description,
      };

      if (editingItem) {
        // Update existing item
        console.log("Updating item:", editingItem.id, itemData);
        console.log("Form data:", itemData);
        await updateItem(editingItem.id, itemData);
      } else {
        // Add new item
        await createItem(itemData);
      }

      // Refresh the item list
      const updatedItems = await getItemsDashboard();
      setItems(updatedItems);

      setCurrentView("list");
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Failed to save item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteItem = async (productId: number) => {
    // Show confirmation dialog
    if (window.confirm("Weet je zeker dat je dit item wilt verwijderen?")) {
      try {
        setLoading(true);

        // Delete from the API
        await deleteItem(productId);

        // Remove the item from the local state
        setItems(items.filter((item) => item.id !== productId));
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Failed to delete item. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const [fetchedTableImgs, setFetchedTableImgs] = useState<{
    [id: number]: string | null;
  }>({});
  const [fetchedFormImg, setFetchedFormImg] = useState<string | null>(null);

  // Fetch images for table
  useEffect(() => {
    const fetchImages = async () => {
      const newImgs: { [id: number]: string | null } = {};
      await Promise.all(
        items.map(async (item) => {
          if (item.imageSrc) {
            try {
              const res = await fetch(
                `http://localhost:3001/photo?src=${encodeURIComponent(item.imageSrc)}`
              );
              const blob = await res.blob();
              newImgs[item.id] = URL.createObjectURL(blob);
            } catch {
              newImgs[item.id] = null;
            }
          }
        })
      );
      setFetchedTableImgs(newImgs);
    };
    if (items.length > 0) fetchImages();
  }, [items]);

  // Fetch image for form preview
  useEffect(() => {
    let isMounted = true;
    if (formData.imageSrc) {
      fetch(`/photo?src=${encodeURIComponent(formData.imageSrc)}`)
        .then((res) => res.blob())
        .then((blob) => {
          if (isMounted) setFetchedFormImg(URL.createObjectURL(blob));
        })
        .catch(() => {
          if (isMounted) setFetchedFormImg(null);
        });
    } else {
      setFetchedFormImg(null);
    }
    return () => {
      isMounted = false;
    };
  }, [formData.imageSrc]);

  if (currentView === "list") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Itemen</h1>
          <button
            className="bg-[#004431] text-white px-4 py-2 rounded-lg hover:bg-[#003422] transition-colors"
            onClick={handleAddItem}
          >
            Voeg item toe
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prijs per week
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={
                              fetchedTableImgs[item.id] ||
                              "/assets/items/naaimachine.png"
                            }
                            alt={item.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(item.category ?? "Geen categorie")
                          .charAt(0)
                          .toUpperCase() +
                          (item.category ?? "Geen categorie").slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        €{item.pricePerWeek?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "Beschikbaar" ? "bg-green-100 text-green-800" : item.status === "Gereserveerd" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-[#004431] hover:text-[#003422] mr-4"
                        onClick={() => handleEditItem(item)}
                      >
                        <PencilSimpleLine size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  if (currentView === "form") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header */}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Itemen</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={handleSave}
              className="bg-[#004431] text-white px-4 py-2 rounded-lg hover:bg-[#003422] transition-colors"
            >
              Opslaan
            </button>
          </div>
        </div>
        {/* Form Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {editingItem ? "Item bewerken" : "Item aanmaken en bewerken"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ">
                  Item naam
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                  placeholder="naaimachine"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorie
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                    placeholder="Spelletjes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prijs
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                    placeholder="€15.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoe gebruiken?
                </label>
                <textarea
                  value={formData.howToUse}
                  onChange={(e) =>
                    handleInputChange("howToUse", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wat zit erbij?
                </label>
                <textarea
                  value={formData.whatsIncluded}
                  onChange={(e) =>
                    handleInputChange("whatsIncluded", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip
                </label>
                <textarea
                  value={formData.tip}
                  onChange={(e) => handleInputChange("tip", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item foto
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                  {formData.imageSrc ? (
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        className="h-32 w-32 rounded-lg object-cover"
                        src={
                          formData.imageFile
                            ? URL.createObjectURL(formData.imageFile) // Show local preview if new file selected
                            : formData.id && fetchedTableImgs[formData.id]
                              ? fetchedTableImgs[formData.id] ||
                                "/assets/items/naaimachine.png"
                              : "/assets/items/naaimachine.png"
                        }
                        alt="Item foto"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 text-sm underline"
                        onClick={() => handleInputChange("imageSrc", "")}
                      >
                        Verwijder foto
                      </button>
                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-gray-700 font-medium"
                      >
                        <svg
                          className="mx-auto h-12 w-12 mb-2 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload foto
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleInputChange(
                                "imageSrc",
                                reader.result as string
                              );
                              setFormData((prev) => ({
                                ...prev,
                                imageFile: file, // <-- sla het bestand op
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </>
                  )}
                </div>
                {/* <input type="url" value={formData.imageSrc} onChange={(e) => handleInputChange("imageSrc", e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1" placeholder="Image URL" /> */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gewicht (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Afmetingen
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) =>
                    handleInputChange("dimensions", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
