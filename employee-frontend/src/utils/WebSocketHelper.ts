import { getToken } from "@/utils/FetchHelper";

const WSS_BASE_URL = "wss://api.yourdomain.com/ws";

/**
 * Options for establishing a WebSocket connection.
 */
interface WebSocketConnectOptions {
  isAdmin?: boolean;
}

/**
 * Creates and returns a WebSocket connection with authentication.
 * @param {string} endpoint - The WebSocket endpoint to connect to (e.g., '/notifications').
 * @param {WebSocketConnectOptions} [options={}] - Configuration options for the connection.
 * @returns {WebSocket} A WebSocket instance.
 * @throws {Error} If the authentication token is missing.
 */
export const connectWebSocket = (
  endpoint: string,
  options: WebSocketConnectOptions = {}
): WebSocket => {
  const token = getToken();

  // A token is required for all authenticated WebSocket connections.
  if (!token) {
    throw new Error(
      "Authentication token not found. Cannot connect WebSocket."
    );
  }

  // Use URLSearchParams to safely build the query string.
  const params = new URLSearchParams();
  params.append("token", token);

  // If the isAdmin flag is passed, add it as a query parameter.
  // The backend middleware will use this to route or validate.
  if (options.isAdmin) {
    params.append("role", "admin");
  }

  const fullUrl = `${WSS_BASE_URL}${endpoint}?${params.toString()}`;
  console.log(`Connecting to WebSocket: ${fullUrl}`);

  const socket = new WebSocket(fullUrl);

  return socket;
};
