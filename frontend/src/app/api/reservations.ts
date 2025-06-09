import { ReservationData } from "../../models/ReservationData";

// Local development URL - matching the pattern used in items.ts
const url = "http://localhost:3001";
//public URL
// const url = "https://api-deelfabriek.woutjuuh02.be";
//docker URL
// const url = 'http://backend:3001'

export async function createReservation(data: ReservationData): Promise<any> {
  try {
    const response = await fetch(`${url}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create reservation: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
}
