"use client";

import { useEffect } from "react";
import { clearReservationData } from "@/utils/storage";

/**
 * This component cleans up any stale localStorage data on application startup
 * It should be included in the main layout component
 */
export default function LocalStorageCleanup() {
  useEffect(() => {
    // Clean up on initial load to prevent stale data
    try {
      // Get all keys in localStorage
      const keys = Object.keys(localStorage);
      console.log("Cleaning up localStorage on app startup. Found keys:", keys);

      // Clear all localStorage data completely
      localStorage.clear();

      console.log("LocalStorage completely cleared");
    } catch (error) {
      console.error("Error cleaning up localStorage:", error);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
