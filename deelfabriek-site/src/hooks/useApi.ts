"use client";
import { useAuth } from "@/contexts/AuthContext";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export function useApi() {
  const { user } = useAuth();

  const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
    const { requiresAuth = true, ...fetchOptions } = options; // Default headers
    let headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authorization header if user is logged in
    if (requiresAuth && user?.token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${user.token}`,
      };
    }

    // Prepare the request options
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers,
    };

    // Make the actual request
    const response = await fetch(url, requestOptions);

    // Handle unauthorized responses (expired token, etc.)
    if (response.status === 401) {
      // You could trigger a logout or token refresh here
      // auth.logout();
      throw new Error("Unauthorized");
    }

    return response;
  };

  return { fetchWithAuth };
}
