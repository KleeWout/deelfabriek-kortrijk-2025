"use client";

import { ItemCard } from "@/components/common/ItemCard";
import { CategoryCard } from "@/components/mobile/CategoryCard";
import Footer from "@/components/mobile/footer";
import Navigation from "@/components/mobile/nav";
import categoriesData from "@/data/categories.json";
import itemsData from "@/data/items.json";

export default function MobileItemPage() {
  return (
    <div>
      {" "}
      <Navigation />
      <h1 className="text-primarygreen-1 font-bold text-xl px-4 py-2">Bekijk onze items</h1>
      <div className="flex gap-2 overflow-x-auto px-4 py-2 hide-scrollbar">
        {categoriesData.map((category) => (
          <CategoryCard key={category.id} iconName={category.iconName} title={category.title} />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-9 p-4 w-fit mx-auto mb-8">
        {itemsData.map((item, index) => (
          <ItemCard
            key={item.id}
            title={item.title}
            price={item.price}
            status={item.status}
            imageSrc={item.imageSrc}
            index={index}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}
