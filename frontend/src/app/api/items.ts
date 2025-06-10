import CreateItemProps from "@/models/CreateItemProps";
import ItemProps from "./../../models/ItemProps";

export interface ItemResponse {
  id: number;
  title: string;
  description: string | null;
  pricePerWeek: number;
  status: string;
  imageSrc: string | null;
  timesLoaned: number;
  howToUse: string | null;
  accesories: string | null;
  weight: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  } | null;
  tip: string | null;
  createdAt: string;
  lockerId: number;
  category: string;
}

// Local development URL
// const url = "http://localhost:3001";
//public URL
// const url = "https://api-deelfabriek.woutjuuh02.be";
//docker URL
// const url = 'http://backend:3001'

// Using relative URL for client-side requests
// This ensures requests are made to the same origin as the frontend
const url = "http://localhost:3001";

export const getItems = async (): Promise<ItemProps[]> => {
  try {
    const response = await fetch(`${url}/items/lockers`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ItemProps[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
};

export const getItemById = async (id: number): Promise<ItemResponse> => {
  try {
    const response = await fetch(`${url}/items/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ItemResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch item:", error);
    return {
      id: 0,
      title: "",
      description: null,
      pricePerWeek: 0,
      status: "Onbekend",
      imageSrc: null,
      timesLoaned: 0,
      howToUse: null,
      accesories: null,
      weight: 0,
      dimensions: null,
      tip: null,
      createdAt: "",
      lockerId: 0,
      category: "",
    };
  }
};

//dashboard

export const getItemsDashboard = async (): Promise<ItemProps[]> => {
  try {
    const response = await fetch(`${url}/dashboard/items`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ItemProps[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
};

// Create a new item
export async function createItem(item: any): Promise<any> {
  const formData = new FormData();
  // Append all fields
  Object.entries(item).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // For file, append as is
      if (key === "file" && value instanceof File) {
        formData.append("file", value);
      } else {
        formData.append(key, value as string);
      }
    }
  });

  const response = await fetch(`${url}/dashboard/items/with-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to create item: ${response.status}`);
  }

  return await response.json();
}

// Update an existing item
export async function updateItem(id: number, itemData: any) {
  const form = new FormData();
  form.append("title", itemData.title);
  form.append("description", itemData.description);
  form.append("pricePerWeek", itemData.pricePerWeek);
  form.append("howToUse", itemData.howToUse);
  form.append("accesories", itemData.accessories);
  form.append("weight", itemData.weight);
  form.append("dimensions", itemData.dimensions);
  form.append("tip", itemData.tip);
  form.append("status", itemData.status ?? "Beschikbaar");
  if (itemData.lockerId) form.append("lockerId", itemData.lockerId);
  if (itemData.file) form.append("file", itemData.file);

  const res = await fetch(`${url}/dashboard/items/${id}`, {
    method: "PUT",
    body: form,
    // Do NOT set Content-Type header! The browser will set it for FormData.
  });
  if (!res.ok) throw new Error("Failed to update item");
  return await res.json();
}

// Delete an item
export async function deleteItem(id: number): Promise<void> {
  const response = await fetch(`${url}/dashboard/items/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete item: ${response.status}`);
  }
}
