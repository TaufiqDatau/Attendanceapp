// src/utils/apiFetch.ts

import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  auth?: boolean;
  payload?: any;
}

/**
 * Retrieves the JWT token from localStorage.
 * @returns {string | null} The JWT token or null if not found.
 */
export const getToken = (): string | null => {
  const token = Cookies.get("access_token");
  if (!token) {
    return null;
  }
  return token;
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
  const { auth = true, payload, ...customConfig } = options;

  const headers: Record<string, string> = {
    ...(customConfig.headers as Record<string, string>),
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
    method: options.method,
    ...customConfig,
    headers,
  };

  if (payload) {
    if (payload instanceof FormData) {
      // If the payload is FormData, let the browser set the Content-Type.
      // Do NOT manually set 'Content-Type': 'multipart/form-data'.
      config.body = payload;
    } else {
      // Otherwise, assume it's JSON.
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(payload);
    }
  }

  config.headers = headers;

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
