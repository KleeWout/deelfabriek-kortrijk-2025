import { useEffect, useState, useMemo } from "react";
import { ItemCard } from "@/components/common/ItemCard";
import { getItems } from "@/app/api/items";
import ItemProps from "@/models/ItemProps";
import { CategoryResponse } from "@/app/api/categories";
import { getApiUrl } from "@/app/api/config";

interface ItemPageProps {
  baseRoute?: string; // Optional prop to specify the base route
  selectedCategoryId?: number | null; // Optional selected category ID for filtering
  categories?: CategoryResponse[]; // Categories for filtering
}

export function ItemPage({
  baseRoute,
  selectedCategoryId,
  categories = [],
}: ItemPageProps) {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        // console.log(data);
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load items");
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) {
      return items; // No filter, return all items
    }

    // Return items that match the selected category
    // We need to check if the category name matches what we're looking for
    return items.filter((item) => {
      // Check if item has a category and if it might match our selected category ID
      const categoryStr = item.category?.toLowerCase() || "";
      const selectedCategoryObj = categories.find(
        (c) => c.id === selectedCategoryId
      );

      return selectedCategoryObj
        ? categoryStr.includes(selectedCategoryObj.name.toLowerCase())
        : false;
    });
  }, [items, selectedCategoryId, categories]);
// normal grid
// grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-9 p-4 w-fit mx-auto mb-8

//cursed grid:
// grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-9 p-4 w-fit mx-auto mb-8
  return (
    <div className=" bg-primarybackground">
      {/* Main content area */}
      <main className="flex-1 w-full mx-auto px-2 sm:px-6 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 min-h-96">
            <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primarygreen-1 mb-4"></span>
            <span className="text-lg text-primarygreen-1 font-semibold">
              Items laden...
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 min-h-96">
            <span className="text-center text-red-500 text-lg font-semibold">
              {error}
            </span>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-9 p-4 w-full mx-auto mb-8">
            {filteredItems.map((item, index) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                pricePerWeek={item.pricePerWeek}
                status={item.status}
                imageSrc={
                  item.imageSrc ? getApiUrl(`/images/${item.imageSrc}`) : ""
                }
                lockerId={item.lockerId}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 min-h-96 text-gray-500">
            <span className="text-3xl mb-2">🔍</span>
            <p className="text-lg">Geen items beschikbaar</p>
          </div>
        )}
      </main>
    </div>
  );
}
