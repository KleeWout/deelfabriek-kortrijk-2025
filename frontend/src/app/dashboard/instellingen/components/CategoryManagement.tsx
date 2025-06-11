"use client";

import React, { useState, useEffect } from "react";
import { CategoryResponse, getCategories, createCategory, deleteCategory } from "@/app/api/categories";
import { IconSelector } from "./IconSelector";
import { Pencil, Trash, Plus, X, Check } from "@phosphor-icons/react";
import { getIconByName } from "@/utils/iconUtils";

export function CategoryManagement() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState({ name: "", iconName: "Folder" });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [currentIconTarget, setCurrentIconTarget] = useState<"new" | number | null>(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Kan categorieën niet laden");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setError("Categorie naam is verplicht");
      return;
    }

    try {
      setLoading(true);
      await createCategory(newCategory);
      // Reset form
      setNewCategory({ name: "", iconName: "Folder" });
      setIsAddingCategory(false);
      // Refresh categories
      await fetchCategories();
      setError(null);
    } catch (err: any) {
      console.error("Failed to add category:", err);
      setError(err.message || "Fout bij het toevoegen van categorie");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (categoryName: string) => {
    if (!confirm(`Weet u zeker dat u de categorie "${categoryName}" wilt verwijderen?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteCategory(categoryName);
      // Refresh categories
      await fetchCategories();
      setError(null);
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      setError(err.message || "Fout bij het verwijderen van categorie");
    } finally {
      setLoading(false);
    }
  };

  // Open the icon selector
  const openIconSelector = (target: "new" | number) => {
    setCurrentIconTarget(target);
    setIsIconSelectorOpen(true);
  };

  // Handle icon selection
  const handleIconSelected = (iconName: string) => {
    if (currentIconTarget === "new") {
      setNewCategory({ ...newCategory, iconName });
    } else if (typeof currentIconTarget === "number") {
      const updatedCategories = [...categories];
      const categoryIndex = categories.findIndex((cat) => cat.id === currentIconTarget);
      if (categoryIndex > -1) {
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          iconName,
        };
        setCategories(updatedCategories);
      }
    }
    setIsIconSelectorOpen(false);
    setCurrentIconTarget(null);
  };

  // Handle editing a category (In a real implementation, you would add an API call to update the category)
  // Since there's no update endpoint in the provided API, I'm leaving this as a visual mock
  const handleSaveEdit = async (category: CategoryResponse) => {
    setEditingCategory(null);
    // Mock update - In a real scenario, you'd call an API endpoint here
    alert(`In een echte implementatie zou dit categorie ${category.name} updaten met icon ${category.iconName}`);
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-100 p-3 rounded text-red-700 mb-4">{error}</div>}

      {/* Add Category Form */}
      {isAddingCategory ? (
        <div className="border p-4 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Nieuwe Categorie</h3>
            <button onClick={() => setIsAddingCategory(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                Naam
              </label>
              <input id="categoryName" type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primarygreen-1 focus:ring focus:ring-primarygreen-1 focus:ring-opacity-50" placeholder="Categorie naam" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Icoon</label>
              <div onClick={() => openIconSelector("new")} className="mt-1 flex items-center border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  {" "}
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md">{React.createElement(getIconByName(newCategory.iconName), { size: 20 })}</div>
                  <span className="text-sm text-gray-500">{newCategory.iconName}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setIsAddingCategory(false)} className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Annuleren
              </button>
              <button onClick={handleAddCategory} disabled={loading || !newCategory.name.trim()} className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primarygreen-1 hover:bg-primarygreen-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primarygreen-1 disabled:opacity-50">
                Toevoegen
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAddingCategory(true)} className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primarygreen-1 hover:bg-primarygreen-2">
          <Plus size={20} className="mr-2" />
          Categorie toevoegen
        </button>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primarygreen-1"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-8 text-center text-gray-500">Geen categorieën gevonden</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id} className="p-4 hover:bg-gray-50">
                {editingCategory?.id === category.id ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {" "}
                      <div onClick={() => openIconSelector(category.id)} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md cursor-pointer">
                        {React.createElement(getIconByName(category.iconName), { size: 24 })}
                      </div>
                      <input
                        type="text"
                        value={categories.find((c) => c.id === category.id)?.name}
                        onChange={(e) => {
                          const updatedCategories = categories.map((c) => (c.id === category.id ? { ...c, name: e.target.value } : c));
                          setCategories(updatedCategories);
                        }}
                        className="block rounded-md border-gray-300 shadow-sm focus:border-primarygreen-1 focus:ring focus:ring-primarygreen-1 focus:ring-opacity-50"
                        placeholder="Categorie naam"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingCategory(null)} className="p-2 text-gray-500 hover:text-gray-700">
                        <X size={20} weight="bold" />
                      </button>
                      <button onClick={() => handleSaveEdit(category)} className="p-2 text-primarygreen-1 hover:text-primarygreen-2">
                        <Check size={20} weight="bold" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {" "}
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">{React.createElement(getIconByName(category.iconName), { size: 24 })}</div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingCategory(category)} className="p-2 text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDeleteCategory(category.name)} className="p-2 text-red-600 hover:text-red-800">
                        <Trash size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Icon Selector Modal */}
      {isIconSelectorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {" "}
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <IconSelector
              onSelect={handleIconSelected}
              onClose={() => {
                setIsIconSelectorOpen(false);
                setCurrentIconTarget(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
