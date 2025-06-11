export type OpeningHoursData = {
  idDay: string;
  openTimeMorning: string | null;
  closeTimeMorning: string | null;
  openTimeAfternoon: string | null;
  closeTimeAfternoon: string | null;
  open: boolean;
};
import { getApiUrl } from "./config";

export const fetchOpeningsHours = async () => {
  try {
    const response = await fetch(getApiUrl("openingshours"));
    if (!response.ok) {
      throw new Error(`Failed to fetch openingshours: ${response.status}`);
    }
    const data: OpeningHoursData[] = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch opening hours:", err);
  }
};
