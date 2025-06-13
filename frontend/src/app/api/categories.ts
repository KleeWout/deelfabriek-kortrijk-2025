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

// Create a new category
export async function createCategory(category: { name: string; iconName: string }): Promise<CategoryResponse> {
  try {
    const response = await fetch(getApiUrl("dashboard/categories"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || `Failed to create category: ${response.status}`);
    }

    const data: CategoryResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// Delete a category
export async function deleteCategory(categoryName: string): Promise<void> {
  try {
    const response = await fetch(getApiUrl(`dashboard/categories/${categoryName}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || `Failed to delete category: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
