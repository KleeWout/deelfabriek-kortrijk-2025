export type OpeningHoursData = {
  idDay: string;
  openTimeMorning: string | null;
  closeTimeMorning: string | null;
  openTimeAfternoon: string | null;
  closeTimeAfternoon: string | null;
  open: boolean;
};
const url = "https://api-deelfabriek.woutjuuh02.be";
// const url = process.env.NEXT_PUBLIC_API_URL || "/api";

export const fetchOpeningsHours = async () => {
  try {
    const response = await fetch(`${url}/openingshours`);
    if (!response.ok) {
      throw new Error(`Failed to fetch openingshours: ${response.status}`);
    }
    const data: OpeningHoursData[] = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch opening hours:", err);
  }
};
