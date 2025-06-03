"use client";

import { ReactNode } from "react";
import Navigation from "@/components/mobile/nav";
import Footer from "@/components/mobile/footer";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-primarybackground">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
