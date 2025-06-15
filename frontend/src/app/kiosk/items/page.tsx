"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ReturnButton } from "@/components/common/ReturnButton";
import { ItemPage } from "@/components/common/ItemsPage";

export default function TabletItemsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const baseRoute = "/kiosk/items";

  return (
    <div className="flex flex-col bg-[#f3f6f8] overflow-x-hidden">
      {/* Header bar */}
      <div className="relative flex items-center w-full max-w-7xl px-6 h-[64px] pt-4">
        <div className="flex-shrink-0 absolute z-10">
          <ReturnButton href="/kiosk" />
        </div>
        <h1
          className="text-4xl font-extrabold tracking-wide text-gray-700 absolute w-screen text-center
            "
          style={{ letterSpacing: 1 }}
        >
          SELECTEER EEN ITEM
        </h1>
        <div className="flex-shrink-0 w-[44px]" />
      </div>
      <div className="flex-1 flex flex-col">
        <ItemPage baseRoute={baseRoute} />
      </div>
    </div>
  );
}
