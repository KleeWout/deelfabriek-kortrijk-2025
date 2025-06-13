/**
 * Utility functions for managing local storage in the application
 */

/**
 * Clears all reservation and payment related data from localStorage
 * @param pickupCode Optional pickup code to target specific reservation data
 */
export const clearReservationData = (pickupCode?: string | number) => {
  // Clear generic reservation data
  localStorage.removeItem("reservationDetails");
  localStorage.removeItem("item");
  localStorage.removeItem("cancelled");
  localStorage.removeItem("completed");

  // If pickup code is provided, clear specific items
  if (pickupCode) {
    localStorage.removeItem(`cancelled_${pickupCode}`);
    localStorage.removeItem(`payment_success_${pickupCode}`);
  } else {
    // Try to find and clear any items with these patterns
    // This approach handles cases where we don't know the specific codes
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("cancelled_") || key.startsWith("payment_success_") || key === "cancelled" || key === "completed") {
        localStorage.removeItem(key);
      }
    });
  }
};

/**
 * Clears all payment related data from localStorage
 */
export const clearPaymentData = () => {
  localStorage.removeItem("paymentConfirmation");

  // Try to find and clear any payment_success items
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("payment_success_")) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Clears ALL application data from localStorage
 * Use this when you want a complete reset of the application state
 */
export const clearAllAppData = () => {
  // Known keys we want to clear
  const keysToDelete = ["item", "reservationDetails", "cancelled", "completed", "paymentConfirmation"];

  // Clear all our known keys
  keysToDelete.forEach((key) => localStorage.removeItem(key));

  // Also clear any key with our known prefixes
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("cancelled_") || key.startsWith("payment_success_") || key.startsWith("reservation_") || key.startsWith("payment_")) {
      localStorage.removeItem(key);
    }
  });

  console.log("All application data cleared from localStorage");
};
