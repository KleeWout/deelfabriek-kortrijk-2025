export interface CategoryResponse {
  id: number;
  name: string;
  iconName: string;
}

import { getApiUrl } from "./config";

export async function getCategories(): Promise<CategoryResponse[]> {
  try {
    const response = await fetch(getApiUrl("categories"));

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data: CategoryResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
