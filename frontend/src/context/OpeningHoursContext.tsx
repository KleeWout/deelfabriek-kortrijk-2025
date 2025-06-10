"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { OpeningHoursData, fetchOpeningsHours } from "../app/api/getOpeningshours";

type OpeningHoursContextType = {
  openingHours: OpeningHoursData[] | null;
  loading: boolean;
  error: string | null;
};

const OpeningHoursContext = createContext<OpeningHoursContextType>({
  openingHours: null,
  loading: true,
  error: null,
});

export const useOpeningsHours = () => useContext(OpeningHoursContext);

export const OpeningsHoursProvider = ({ children }: { children: React.ReactNode }) => {
  const [openingHours, setOpeningHours] = useState<OpeningHoursData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  // Session storage key for caching opening hours
  const SESSION_STORAGE_KEY = "deelfabriek_opening_hours";

  useEffect(() => {
    const getOpeningHours = async () => {
      try {
        // First, try to get data from sessionStorage
        const cachedData = sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (cachedData) {
          console.log("Using cached opening hours from session storage");
          setOpeningHours(JSON.parse(cachedData));
          setLoading(false);
          setFetched(true);
          return;
        }

        // If no cached data, make the API call
        console.log("Fetching opening hours from API");
        const data = await fetchOpeningsHours();

        if (data) {
          // Store in session storage for future use
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
          setOpeningHours(data);
        } else {
          throw new Error("No data returned");
        }

        setLoading(false);
        setFetched(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setLoading(false);
      }
    };

    if (!fetched) {
      getOpeningHours();
    }
  }, [fetched]);

  return <OpeningHoursContext.Provider value={{ openingHours, loading, error }}>{children}</OpeningHoursContext.Provider>;
};
