"use client";

import { useParams } from "next/navigation";
import itemsDetails from "@/data/itemDetails.json";

import Image from "next/image";
import { ReturnButton } from "@/components/common/ReturnButton";
import Navigation from "@/components/mobile/nav";
import { getGradientClassForBackground } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function ItemDetailPage() {
  const params = useParams(); //get item id from URL params
  const id = parseInt(params.id as string);
  const router = useRouter();
  const [isReserving, setIsReserving] = useState(false);

   const gradientClass = getGradientClassForBackground(id);

  //later veranderen naar api call
  const item = itemsDetails.find((item) => item.id === id);

  if (!item) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <ReturnButton href="/mobile/items" />
          <h1 className="text-2xl font-bold text-red-500">Item niet gevonden</h1>
        </div>
      </div>
    );
  }

  const handleReservation = () => {
    //navigeer naar reservatie pagine met item id
    router.push(`/mobile/reserveer/${id}`);
  }


  return (
    <div>
      <Navigation />
      <div className="py-7 px-4">
        <ReturnButton href="/mobile/items" />
      </div>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="w-full lg:w-1/2 mb-4">
              <div className={`${gradientClass} p-4 rounded-lg flex items-center justify-center h-[300px]`}>
                <Image src={item.imageSrc} width={300} height={300} alt={item.title} className="object-contain max-w-full max-h-full" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm ${item.status === "Beschikbaar" ? "bg-primarygreen-1" : item.status === "Uitgeleend" ? "bg-amber-600" : "bg-primarypink-1"}`}>{item.status.toUpperCase()}</span>
                <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm">{item.category}</span>
              </div>

              <div className="mt-4">
                <h1 className="text-3xl font-bold text-primarytext-1">{item.title}</h1>
                <p className="text-xl text-primarygreen-1 font-medium my-2">€ {item.price.toFixed(2).replace(".", ",")} per week</p>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-semibold text-primarytext-1">Beschrijving</h2>
                <p className="text-gray-700 mt-1" style={{ whiteSpace: "pre-line" }}>
                  {item.description}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              {item.howToUse && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-primarytext-1">Hoe gebruiken?</h2>
                  <div className="text-gray-700 mt-1" style={{ whiteSpace: "pre-line" }}>
                    {item.howToUse}
                  </div>
                </div>
              )}

              {item.accessories && item.accessories.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-primarytext-1">Accessoires</h2>
                  <ul className="mt-1 list-disc list-inside text-gray-700">
                    {item.accessories.map((accessory, index) => (
                      <li key={index}>{accessory}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-primarytext-1">Gewicht en afmeting</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {item.dimensions && (
                    <>
                      <div className="flex">
                        <span className="font-medium text-gray-600">Lengte:</span>
                        <span className="ml-2 text-gray-700">{item.dimensions.length} cm</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600">Breedte:</span>
                        <span className="ml-2 text-gray-700">{item.dimensions.width} cm</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600">Hoogte:</span>
                        <span className="ml-2 text-gray-700">{item.dimensions.height} cm</span>
                      </div>
                    </>
                  )}

                  {item.weight && (
                    <div className="flex">
                      <span className="font-medium text-gray-600">Gewicht:</span>
                      <span className="ml-2 text-gray-700">{item.weight} kg</span>
                    </div>
                  )}
                </div>
              </div>

              {item.tip && (
                <div className="mt-6 p-3 bg-pink-50 border-l-4 border-pink-500 rounded">
                  <h2 className="text-lg font-semibold text-pink-700">Tip</h2>
                  <p className="text-pink-700">{item.tip}</p>
                </div>
              )}

              {item.status === "Beschikbaar" ? (
                //reserveer button
                <button onClick={handleReservation} className="mt-6 w-full bg-primarygreen-1 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Reserveren</button>
              ) : (
                <div className="mt-6 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <p className="text-amber-700">Weer beschikbaar vanaf: {new Date(item.availability.end).toLocaleDateString("nl-BE")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
