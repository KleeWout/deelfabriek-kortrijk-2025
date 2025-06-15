'use client';
import HomeIntro from "@/components/common/HomeIntro";
import Footer from "@/components/mobile/footer";
import { useEffect } from "react";

export default function TabletPage() {
  // Clear localStorage when this page loads
  useEffect(() => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage on kiosk page:", error);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", overflow: "hidden" }}>
      <HomeIntro />
      <Footer />
    </div>
  );
}
