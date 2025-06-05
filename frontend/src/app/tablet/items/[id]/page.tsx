"use client";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MagnifyingGlass, User, CreditCard } from "phosphor-react";
import Stepper from "@/components/tabletHeader";
import ItemDetailPage from "@/components/common/ItemDetailPage";
import { ReturnButton } from "@/components/common/ReturnButton";

export default function TabletProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6f8]">
      <div className="py-7 px-4">
        <ReturnButton href="/tablet/items" />
      </div>
      <ItemDetailPage />
    </div>
  );
}
