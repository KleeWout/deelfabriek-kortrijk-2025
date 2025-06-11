import { getApiUrl } from "./config";

export interface OpeningHoursResponse {
  idDay: string;
  dayName: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

// Get all opening hours
export async function getOpeningHours(): Promise<OpeningHoursResponse[]> {
  try {
    const response = await fetch(getApiUrl("dashboard/openinghours"));

    if (!response.ok) {
      throw new Error(`Failed to fetch opening hours: ${response.status}`);
    }

    const data: OpeningHoursResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching opening hours:", error);
    throw error;
  }
}

// Get opening hours for a specific day
export async function getOpeningHoursByDay(idDay: string): Promise<OpeningHoursResponse> {
  try {
    const response = await fetch(getApiUrl(`dashboard/openinghours/${idDay}`));

    if (!response.ok) {
      throw new Error(`Failed to fetch opening hours for ${idDay}: ${response.status}`);
    }

    const data: OpeningHoursResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching opening hours for ${idDay}:`, error);
    throw error;
  }
}

// Update opening hours for a day
export async function updateOpeningHours(idDay: string, data: OpeningHoursResponse): Promise<void> {
  try {
    const response = await fetch(getApiUrl(`dashboard/openinghours/${idDay}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || `Failed to update opening hours: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating opening hours:", error);
    throw error;
  }
}
