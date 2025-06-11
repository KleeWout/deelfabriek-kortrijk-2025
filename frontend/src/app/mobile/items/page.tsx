"use client";

import { useEffect } from "react";
import { ItemPage } from "@/components/common/ItemsPage";
import { CategoryCard } from "@/components/mobile/CategoryCard";
import categoriesData from "@/data/categories.json";
import { clearAllAppData } from "@/utils/storage";

export default function MobileItemPage() {
  // Clear all app data when browsing items
  // This ensures the user has a clean state when starting a new reservation
  useEffect(() => {
    clearAllAppData();
  }, []);

  return (
    <div>
      <h1 className="text-primarygreen-1 font-bold text-xl px-4 py-2">Bekijk onze items</h1>

      <div className="flex gap-2 overflow-x-auto px-4 py-2 hide-scrollbar">
        {categoriesData.map((category) => (
          <CategoryCard key={category.id} iconName={category.iconName} title={category.title} />
        ))}
      </div>
      <ItemPage />
    </div>
  );
}
