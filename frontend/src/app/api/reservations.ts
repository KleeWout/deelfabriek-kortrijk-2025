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

export async function getReservationByCode(code: string): Promise<any> {
  try {
    const response = await fetch(`${url}/reservations/code/${code}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Reservation not found");
      }
      throw new Error(`Failed to get reservation: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reservation data:", error);
    throw error;
  }
}

export interface ReservationResponse {
  pickupCode: string;
  itemTitle: string;
  totalPrice: number;
  userName: string;
  lockerNumber: string;
  loanStart: string;
  loanEnd: string;
  reservationDate: string;
  actualReturnDate: string | null;
  pickupDeadline: string;
  status: string;
  weeks: number;
  item?: {
    title: string;
  };
}

export async function markReservationAsPaid(code: string): Promise<ReservationResponse> {
  try {
    const response = await fetch(`${url}/reservations/code/${code}/ispayed`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Reservation not found");
      }
      throw new Error(`Failed to mark reservation as paid: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking reservation as paid:", error);
    throw error;
  }
}

export async function markReservationAsReturned(code: string): Promise<ReservationResponse> {
  try {
    const response = await fetch(`${url}/reservations/code/${code}/returned`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Reservation not found");
      }
      throw new Error(`Failed to mark reservation as returned: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking reservation as returned:", error);
    throw error;
  }
}

export async function cancelReservation(reservationId: string): Promise<any> {
  try {
     console.log(`Attempting to cancel reservation with ID: ${reservationId}`);
    // Check if the reservation was already cancelled to prevent duplicate requests
    const key = `cancelled_${reservationId}`;
    const alreadyCancelled = localStorage.getItem(key);

    if (alreadyCancelled === "completed") {
      console.log(`Reservation ${reservationId} was already cancelled, skipping`);
      return { success: true, status: "already_cancelled" };
    }

    localStorage.setItem(key, "in_progress");

    const response = await fetch(`${url}/reservations/code/${reservationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle the response based on status and content
    if (response.ok) {
      localStorage.setItem(key, "completed");

      // Check if there's actually JSON content to parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          // Try to parse JSON, but handle empty response
          const text = await response.text();
          return text ? JSON.parse(text) : { success: true };
        } catch (parseError) {
          // If parsing fails, return a success object
          console.log("Response wasn't valid JSON, but cancellation was successful");
          return { success: true };
        }
      } else {
        // For non-JSON responses that were successful
        return { success: true };
      }
    } else {
      // For error responses
      if (response.status === 404) {
        // Reservation not found is not an error - it's already gone
        localStorage.setItem(key, "completed");
        return { success: true, status: "not_found" };
      }
      throw new Error(`Failed to cancel reservation: ${response.status}`);
    }
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    // Don't throw the error, just return a standardized error object
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
