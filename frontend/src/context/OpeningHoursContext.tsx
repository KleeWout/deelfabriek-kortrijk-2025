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

  useEffect(() => {
    if (!fetched) {
      const getOpeningHours = async () => {
        try {
          const data = await fetchOpeningsHours();
          if (data) {
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

      getOpeningHours();
    }
  }, [fetched]);

  return <OpeningHoursContext.Provider value={{ openingHours, loading, error }}>{children}</OpeningHoursContext.Provider>;
};