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
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
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

        <div className="flex gap-2 overflow-x-auto px-6 py-2 hide-scrollbar">
          {loading ? (
            <div className="flex justify-center w-full py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primarygreen-1"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 px-4">{error}</div>
          ) : (
            <>
              <CategoryCard key="all" title="Alle items" onClick={() => setSelectedCategoryId(null)} isSelected={selectedCategoryId === null} />
              {categories.map((category) => (
                <CategoryCard key={category.id} iconName={category.iconName} title={category.name} onClick={() => handleCategoryClick(category.id)} isSelected={selectedCategoryId === category.id} />
              ))}
            </>
          )}
        </div>

        <ItemPage selectedCategoryId={selectedCategoryId} categories={categories} />
      </main>

      {/* Footer immediately after main, no margin/padding on main */}
      <Footer />
    </div>
  );
}
