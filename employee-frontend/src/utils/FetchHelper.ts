// src/utils/apiFetch.ts

// Define your API's base URL
const BASE_URL = "https://api.yourdomain.com/v1";

/**
 * Custom error class for API-related errors.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

/**
 * Retrieves the JWT token from localStorage.
 * @returns {string | null} The JWT token or null if not found.
 */
export const getToken = (): string | null => {
  return localStorage.getItem("jwtToken");
};

/**
 * A custom, type-safe fetch utility to handle API requests.
 * @template T The expected type of the JSON response data.
 * @param {string} endpoint - The API endpoint to call (e.g., '/users').
 * @param {ApiFetchOptions} [options={}] - Configuration for the fetch request.
 * @returns {Promise<T>} A promise that resolves with the typed JSON response.
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> => {
  const { auth = false, ...customConfig } = options;

  const headers: Record<string, any> = {
    "Content-Type": "application/json",
    ...customConfig.headers,
  };

  // If auth is true, get the token and add it to the headers.
  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("Authentication token requested but not found.");
    }
  }

  const config: RequestInit = {
    method: options.body ? "POST" : "GET",
    ...customConfig,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If the response is not OK, throw our custom ApiError.
    if (!response.ok) {
      // Try to parse the error body, default to a standard message.
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new ApiError(
        errorData.message || "An API error occurred",
        response.status
      );
    }

    // Handle 204 No Content responses, which have no body.
    if (response.status === 204) {
      return null as T;
    }
    return response.json() as Promise<T>;
  } catch (error) {
    throw error;
  }
};
