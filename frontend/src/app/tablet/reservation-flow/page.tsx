"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, MagnifyingGlass, User, CreditCard } from "phosphor-react";
import { ItemCard } from "@/components/common/ItemCard";
import Stepper from "@/components/Stepper";

type StatusType = "Beschikbaar" | "Uitgeleend" | "Gereserveerd";

const staticItems = [
  {
    id: 1,
    title: "Naaimachine",
    description: "Professionele naaimachine voor alle soorten stoffen",
    imageSrc: "/assets/items/naaimachine.png",
    pricePerWeek: 5.0,
    status: "Beschikbaar" as StatusType,
    bg: "bg-green-100",
  },
  {
    id: 2,
    title: "Schroef- en klopboormachine",
    description: "Krachtige boormachine voor elke klus",
    imageSrc: "/assets/items/boormachine.png",
    pricePerWeek: 5.0,
    status: "Beschikbaar" as StatusType,
    bg: "bg-indigo-100",
  },
  {
    id: 3,
    title: "Gardena Tuinslang (20m)",
    description: "Flexibele tuinslang van 20 meter",
    imageSrc: "/assets/items/tuinslang.png",
    pricePerWeek: 2.0,
    status: "Beschikbaar" as StatusType,
    bg: "bg-yellow-100",
  },
  {
    id: 4,
    title: "Verlengkabel",
    description: "Stevige verlengkabel voor buitengebruik",
    imageSrc: "/assets/items/verlengkabel.png",
    pricePerWeek: 5.0,
    status: "Beschikbaar" as StatusType,
    bg: "bg-cyan-100",
  },
  {
    id: 5,
    title: "Ijsmachine",
    description: "Maak snel ijsblokjes voor elk feestje",
    imageSrc: "/assets/items/ijsmachine.png",
    pricePerWeek: 5.0,
    status: "Uitgeleend" as StatusType,
    bg: "bg-red-100",
  },
  {
    id: 6,
    title: "Laptop",
    description: "Handige laptop voor werk of studie",
    imageSrc: "/assets/items/laptop.png",
    pricePerWeek: 17.0,
    status: "Gereserveerd" as StatusType,
    bg: "bg-pink-100",
  },
];

const statusColors: Record<StatusType, string> = {
  Beschikbaar: "bg-green-600",
  Uitgeleend: "bg-red-600",
  Gereserveerd: "bg-pink-500",
};

export default function TabletItemsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6f8]">
      {/* Header bar */}

      {/* Title and back arrow */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto mt-10 mb-8 px-8">
        <button className="rounded-lg p-3 bg-white shadow hover:bg-gray-100 transition border border-gray-200" onClick={() => router.back()} aria-label="Terug">
          <ArrowLeft size={32} weight="regular" className="text-[var(--color-primarygreen-1)]" />
        </button>
        <h1 className="text-4xl font-extrabold tracking-wide text-gray-700 mx-auto" style={{ letterSpacing: 1 }}>
          SELECTEER EEN ITEM
        </h1>
        <div className="w-16" /> {/* Spacer for symmetry */}
      </div>

      {/* Product grid */}
      <div className="container mx-auto px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {staticItems.map((item) => (
            <ItemCard key={item.id} id={item.id} title={item.title} pricePerWeek={item.pricePerWeek} imageSrc={item.imageSrc} status={item.status} index={item.id} onClick={() => router.push(`/tablet/reservation-flow/${item.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}
