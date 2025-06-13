"use client";

import React, { useState, useEffect } from "react";
import { getCategories, CategoryResponse } from "@/app/api/categories";
import { CaretDown } from "@phosphor-icons/react";
import { getIconByName } from "@/utils/iconUtils";

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Kon categorieën niet laden");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category selection
  const handleSelectCategory = (category: string) => {
    onChange(category);
    setIsOpen(false);
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarygreen-1 bg-white">
        <span className={value ? "text-gray-900" : "text-gray-500"}>{value || "Selecteer categorie"}</span>
        <CaretDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <div className="max-h-60 overflow-y-auto py-1">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Laden...</div>
            ) : error ? (
              <div className="px-4 py-2 text-sm text-red-500">{error}</div>
            ) : categories.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">Geen categorieën gevonden</div>
            ) : (
              <>
                {/* Option to clear selection */}
                <div className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${value === "" ? "bg-gray-100 text-primarygreen-1" : "text-gray-700"}`} onClick={() => handleSelectCategory("")}>
                  Geen categorie
                </div>
                {/* Category options */}{" "}
                {categories.map((category) => (
                  <div key={category.id} className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${value === category.name ? "bg-gray-100 text-primarygreen-1" : "text-gray-700"}`} onClick={() => handleSelectCategory(category.name)}>
                    {category.iconName && <span className="flex items-center justify-center w-5 h-5 text-gray-500">{React.createElement(getIconByName(category.iconName), { size: 16 })}</span>}
                    {category.name}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
