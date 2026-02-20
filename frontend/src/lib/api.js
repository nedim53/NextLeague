/**
 * Centralized API configuration
 * Uses NEXT_PUBLIC_API_URL environment variable for production
 * Falls back to http://localhost:8000 for local development
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Helper function to get full API URL for an endpoint
 * @param {string} endpoint - API endpoint (e.g., '/login', '/register')
 * @returns {string} Full URL
 */
export function getApiUrl(endpoint) {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
}
