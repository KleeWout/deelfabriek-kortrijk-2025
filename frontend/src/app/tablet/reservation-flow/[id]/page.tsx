"use client";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MagnifyingGlass, User, CreditCard } from "phosphor-react";
import Stepper from "@/components/Stepper";
import ItemDetailPage from "@/app/mobile/items/[id]/page";

type StatusType = "Beschikbaar" | "Uitgeleend" | "Gereserveerd";

const product = {
  title: "Naaimachine",
  imageSrc: "/assets/items/naaimachine.png",
  status: "Beschikbaar" as StatusType,
  pricePerWeek: 15.0,
  tags: ["Huishoud", "Elektrisch"],
  description: "Deze gebruiksvriendelijke naaimachine is ideaal voor al je naai projecten, van kleine kledingreparaties tot creatieve ontwerpen. Geschikt voor zowel beginners als ervaren gebruikers, biedt deze machine meerdere steekpatronen, instelbare steeklengte en -breedte, en een automatische draadinrijger voor extra gemak.",
  details: {
    "Hoe gebruiken?": "Wol niet inbegrepen",
    "Wat zit er bij?": "Wol niet inbegrepen",
    Gewicht: "3 kilogram",
    Afmeting: "180 hoogte || 180 breedte",
    "Tip!": "Wol niet inbegrepen",
  },
  bg: "bg-green-100",
};

const statusColors: Record<StatusType, string> = {
  Beschikbaar: "bg-green-600",
  Uitgeleend: "bg-red-600",
  Gereserveerd: "bg-pink-500",
};

export default function TabletProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6f8]">
      {/* Header bar */}

      {/* Content */}
      <ItemDetailPage />
    </div>
  );
}
