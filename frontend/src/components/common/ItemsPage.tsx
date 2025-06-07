import { useEffect, useState } from "react";
import { ItemCard } from "@/components/common/ItemCard";
import { getItems } from "@/app/api/items";
import ItemProps from "@/models/ItemProps";

interface ItemPageProps {
  baseRoute?: string; // Optional prop to specify the base route
}

export function ItemPage({ baseRoute }: ItemPageProps) {

  const [items, setItems] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load items");
        setLoading(false);
      }
    };

    fetchItems();
  }, []);



  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area that will expand to fill space */}
      <main className="flex-1">
        {loading ? (
          <div className="text-center py-8 min-h-96">Loading items...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 min-h-96">{error}</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-9 p-4 w-fit mx-auto mb-8">
            {items.map((item, index) => (
              <ItemCard key={item.id} id={item.id} title={item.title} pricePerWeek={item.pricePerWeek} status={item.status} imageSrc={item.imageSrc} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 min-h-96 text-gray-500">
            <p>Geen items beschikbaar</p>
          </div>
        )}
      </main>
    </div>
  );
}
