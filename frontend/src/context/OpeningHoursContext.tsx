"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type OpeningHoursData = {
  idDay: string;
  openTimeMorning: string | null;
  closeTimeMorning: string | null;
  openTimeAfternoon: string | null;
  closeTimeAfternoon: string | null;
  open: boolean;
};

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

export const useOpeningHours = () => useContext(OpeningHoursContext);

export const OpeningHoursProvider = ({ children }: { children: React.ReactNode }) => {
  const [openingHours, setOpeningHours] = useState<OpeningHoursData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      const fetchOpeningHours = async () => {
        try {
          const response = await fetch("https://api-deelfabriek.woutjuuh02.be/openingshours");
          if (!response.ok) {
            throw new Error("Failed to fetch opening hours");
          }
          const data: OpeningHoursData[] = await response.json();
          setOpeningHours(data);
          setLoading(false);
          setFetched(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error occurred");
          setLoading(false);
        }
      };

      fetchOpeningHours();
    }
  }, [fetched]);

  return <OpeningHoursContext.Provider value={{ openingHours, loading, error }}>{children}</OpeningHoursContext.Provider>;
};
