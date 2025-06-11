/**
 * Central configuration file for API URLs
 *
 * Uncomment the appropriate URL based on your environment:
 * - For local development: http://localhost:3001
 * - For Docker containers: http://backend:3001
 * - For production: https://api-deelfabriek.woutjuuh02.be
 */

// Local development URL (default)
export const API_BASE_URL = "http://localhost:3001";

// Docker URL
// export const API_BASE_URL = "http://backend:3001";

// Public URL
// export const API_BASE_URL = "https://api-deelfabriek.woutjuuh02.be";

// Environment-based URL (if using environment variables)
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";


export function getApiUrl(path: string): string {
  // Ensure path doesn't start with a slash to avoid double slashes
  const formattedPath = path.startsWith("/") ? path.substring(1) : path;
  return `${API_BASE_URL}/${formattedPath}`;
}
