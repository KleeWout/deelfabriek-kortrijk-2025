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
  categoryNames: string[];
}

// const url = "http://localhost:3001";
const url = "https://api-deelfabriek.woutjuuh02.be/";

export const getItems = async (): Promise<ItemProps[]> => {
  try {
    const response = await fetch(`${url}/items`);

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
      categoryNames: [],
    };
  }
};
