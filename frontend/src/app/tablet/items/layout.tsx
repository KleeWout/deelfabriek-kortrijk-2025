"use client";

import Image from "next/image";
import { ReactNode } from "react";
import Stepper, { TabletHeader } from "@/components/tabletHeader";
import { usePathname } from "next/navigation";
import MobileItemPage from "@/app/mobile/items/page";
import ItemDetailPage from "@/app/mobile/items/[id]/page";

interface LayoutProps {
  children: ReactNode;
}

export default function ReservationFlowLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  // Determine active step based on the current path
  const getActiveStep = () => {
    if (pathname === "/tablet/reservation-flow") return 1;
    if (pathname.includes("/tablet/reservation-flow/") && !pathname.includes("/confirmation")) return 2;
    if (pathname.includes("/confirmation")) return 3;
    return 1;
  };

  return (
    <div className="min-h-screen flex flex-col bg-primarybackground">
      {/* Main content */}
      <TabletHeader />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
