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
const url = process.env.NEXT_PUBLIC_API_URL || "/api";

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
export async function createItem(item: Omit<ItemProps, "id">): Promise<ItemProps> {
  const response = await fetch(`${url}/dashboard/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`Failed to create item: ${response.status}`);
  }

  return await response.json();
}

// Update an existing item
export async function updateItem(id: number, item: Partial<ItemProps>): Promise<ItemProps> {
  const response = await fetch(`${url}/dashboard/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`Failed to update item: ${response.status}`);
  }

  return await response.json();
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
