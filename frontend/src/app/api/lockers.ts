import LockerProps from "@/models/LockerProps";

const API_URL = "http://localhost:3001/dashboard/lockers";

// Get all lockers for dashboard
export async function getLockersDashboard(): Promise<LockerProps[]> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch lockers: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching lockers:", error);
    throw error;
  }
}

// Get a single locker by ID
export async function getLockerById(id: number): Promise<LockerProps> {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch locker: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching locker ${id}:`, error);
    throw error;
  }
}

// Create a new locker
export async function createLocker(lockerData: Partial<LockerProps>): Promise<LockerProps> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lockerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create locker: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating locker:", error);
    throw error;
  }
}

// Update an existing locker
export async function updateLocker(id: number, lockerData: Partial<LockerProps>): Promise<LockerProps> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lockerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update locker: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating locker ${id}:`, error);
    throw error;
  }
}

// Delete a locker
export async function deleteLocker(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete locker: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error(`Error deleting locker ${id}:`, error);
    throw error;
  }
}

// This function has been removed as part of the maintenance feature removal
