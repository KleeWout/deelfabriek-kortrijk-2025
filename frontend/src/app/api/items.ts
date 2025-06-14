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

import { getApiUrl } from "./config";

export const getItems = async (): Promise<ItemProps[]> => {
  try {
    const response = await fetch(getApiUrl("items/available"));

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
    const response = await fetch(getApiUrl(`items/${id}`));
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
    const response = await fetch(getApiUrl("dashboard/items"));

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
  const response = await fetch(getApiUrl("dashboard/items"), {
  // const response = await fetch(getApiUrl("dashboard/items/with-image"), {
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
  form.append("accesories", itemData.accesories);
  form.append("weight", itemData.weight);
  form.append("dimensions", itemData.dimensions);
  form.append("tip", itemData.tip);
  form.append("status", itemData.status ?? "Beschikbaar");
  form.append("timesLoaned", itemData.timesLoaned);
  if (itemData.lockerId) form.append("lockerId", itemData.lockerId);
  if (itemData.file) form.append("file", itemData.file);
  if (itemData.category) form.append("category", itemData.category);
  const res = await fetch(getApiUrl(`dashboard/items/${id}`), {
    method: "PUT",
    body: form,
    // Do NOT set Content-Type header! The browser will set it for FormData.
  });
  if (!res.ok) throw new Error("Failed to update item");
  return await res.json();
}

// Delete an item
export async function deleteItem(id: number): Promise<void> {
  const response = await fetch(getApiUrl(`dashboard/items/${id}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete item: ${response.status}`);
  }
}

// Fetch an item image and return it as a blob URL
export const getItemImage = async (imageSrc: string): Promise<string | null> => {
  try {
    const response = await fetch(getApiUrl(`photo/${encodeURIComponent(imageSrc)}`));
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Failed to fetch item image:", error);
    return null;
  }
};
