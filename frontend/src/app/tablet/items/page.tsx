"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ReturnButton } from "@/components/common/ReturnButton";
import { ItemPage } from "@/components/common/ItemsPage";

export default function TabletItemsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const baseRoute = "/tablet/items";

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6f8]">
      {/* Header bar */}

      {/* Title and back arrow */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto mt-10 mb-8 px-8">
        <ReturnButton href="/tablet" />
        <h1 className="text-4xl font-extrabold tracking-wide text-gray-700 mx-auto" style={{ letterSpacing: 1 }}>
          SELECTEER EEN ITEM
        </h1>
        <div className="w-16" /> {/* Spacer for symmetry */}
      </div>

      <ItemPage baseRoute={baseRoute} />
    </div>
  );
}
