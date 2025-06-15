import { getApiUrl } from "@/app/api/config";

export async function saveNotificationRequest(itemId: number, userEmail: string) {
  try {
    console.log("Saving notification request for itemId:", itemId, "and userEmail:", userEmail);
    // Use the correct API endpoint - ensure it's using absolute URL for server actions
    const response = await fetch(getApiUrl("notifications"), {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId,
        userEmail,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to save notification request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving notification request:", error);
    throw error;
  }
}
