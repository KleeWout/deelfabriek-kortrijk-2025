"use client";

import { ItemPage } from "@/components/common/ItemsPage";
import { CategoryCard } from "@/components/mobile/CategoryCard";
import categoriesData from "@/data/categories.json";

export default function MobileItemPage() {
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
