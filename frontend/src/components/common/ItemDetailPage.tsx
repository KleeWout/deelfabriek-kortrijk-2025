"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getGradientClassForBackground } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { getItemById, ItemResponse } from "@/app/api/items";

export default function ItemDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const router = useRouter();
  const pathname = usePathname();
  const isTabletRoute = pathname.includes("/tablet/");
  const [isReserving, setIsReserving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gradientClass = getGradientClassForBackground(id);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getItemById(id);
        localStorage.setItem(`item`, JSON.stringify(data)); 
        setItem(data);
      } catch (err) {
        setError("Er ging iets mis bij het ophalen van dit item.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);
  const handleReservation = () => {
    // Use the pathname from Next.js hooks instead of window.location
    if (isTabletRoute) {
      router.push(`/tablet/reserveer/${id}`);
    } else {
      router.push(`/mobile/reserveer/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold">Laden...</h1>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          {/* <ReturnButton href="/mobile/items" /> */}
          <h1 className="text-2xl font-bold text-red-500">Item niet gevonden</h1>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  // Parse accessories from string to array if needed
  const howToUse = item.howToUse ? item.howToUse.split(",").map((item) => item.trim()) : [];
  const accessories = item.accesories ? item.accesories.split(",").map((item) => item.trim()) : [];

  // Use default image if none provided
  const imageSrc = item.imageSrc || "/placeholder-image.jpg";

  return (
    <div>
      {/* <div className="py-7 px-4">
        <ReturnButton href="/mobile/items" />
      </div> */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="w-full lg:w-1/2 mb-4">
              <div className={`${gradientClass} p-4 rounded-lg flex items-center justify-center h-[350px]`}>
                <Image src={imageSrc} width={350} height={350} alt={item.title} className="object-contain max-w-full max-h-full" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm ${item.status === "Beschikbaar" ? "bg-primarygreen-1" : item.status === "Uitgeleend" ? "bg-amber-600" : "bg-primarypink-1"}`}>{item.status.toUpperCase()}</span>

                <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm">{item.category}</span>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-primarytext-1">{item.title}</h1>
                <p className="text-xl text-primarygreen-1 font-medium my-2">€ {item.pricePerWeek.toFixed(2).replace(".", ",")} per week</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primarytext-1">Beschrijving</h2>
                <p className="text-gray-700 mt-1" style={{ whiteSpace: "pre-line" }}>
                  {item.description || "Geen beschrijving beschikbaar."}
                </p>
              </div>

              {howToUse && howToUse.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-primarytext-1">Gebruiksinstructies</h2>
                  <ul className="mt-1 text-gray-700">
                    {howToUse.map((howToUse, index) => (
                      <li key={index}>{howToUse}</li>
                    ))}
                  </ul>
                </div>
              )}

              {accessories && accessories.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-primarytext-1">Accessoires</h2>
                  <ul className="mt-1 list-disc list-inside text-gray-700">
                    {accessories.map((accessory, index) => (
                      <li key={index}>{accessory}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primarytext-1">Gewicht en afmeting</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {item.dimensions && (
                    <>
                      {item.dimensions.length && (
                        <div className="flex">
                          <span className="font-medium text-gray-600">Lengte:</span>
                          <span className="ml-2 text-gray-700">{item.dimensions.length} cm</span>
                        </div>
                      )}
                      {item.dimensions.width && (
                        <div className="flex">
                          <span className="font-medium text-gray-600">Breedte:</span>
                          <span className="ml-2 text-gray-700">{item.dimensions.width} cm</span>
                        </div>
                      )}
                      {item.dimensions.height && (
                        <div className="flex">
                          <span className="font-medium text-gray-600">Hoogte:</span>
                          <span className="ml-2 text-gray-700">{item.dimensions.height} cm</span>
                        </div>
                      )}
                    </>
                  )}

                  {item.weight > 0 && (
                    <div className="flex">
                      <span className="font-medium text-gray-600">Gewicht:</span>
                      <span className="ml-2 text-gray-700">{item.weight} kg</span>
                    </div>
                  )}
                </div>
              </div>

              {item.tip && (
                <div className="mb-6 p-3 bg-pink-50 border-l-4 border-pink-500 rounded">
                  <h2 className="text-lg font-semibold text-pink-700">Tip</h2>
                  <p className="text-pink-700">{item.tip}</p>
                </div>
              )}

              {item.status === "Beschikbaar" ? (
                <button onClick={handleReservation} className="w-full bg-primarygreen-1 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  {isTabletRoute ? "Huur nu" : "Reserveren"}
                </button>
              ) : (
                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <p className="text-amber-700">Dit item is momenteel niet beschikbaar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
