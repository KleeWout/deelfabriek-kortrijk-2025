"use client";

import { useState, useEffect } from "react";
import { ItemPage } from "@/components/common/ItemsPage";
import { CategoryCard } from "@/components/mobile/CategoryCard";
import { clearAllAppData } from "@/utils/storage";
import { getCategories, CategoryResponse } from "@/app/api/categories";
import Footer from "@/components/mobile/footer";

export default function MobileItemPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    clearAllAppData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content takes exactly screen height minus footer height */}
      <main className="h-dvh flex flex-col overflow-y-auto">
        <h1 className="text-primarygreen-1 font-bold text-xl px-6 pb-2 pt-6 mb-0">Bekijk onze items</h1>

        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-6 py-2 scrollbar-hidden flex-shrink-0">
            <CategoryCard key="all" title="Alle items" onClick={() => setSelectedCategoryId(null)} isSelected={selectedCategoryId === null} />
            {categories.map((category) => (
              <CategoryCard key={category.id} iconName={category.iconName} title={category.name} onClick={() => handleCategoryClick(category.id)} isSelected={selectedCategoryId === category.id} />
            ))}
          </div>
        )}

        <ItemPage selectedCategoryId={selectedCategoryId} categories={categories} />
      </main>

      {/* Footer immediately after main, no margin/padding on main */}
      <Footer />
    </div>
  );
}
