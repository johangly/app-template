const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl || String(rawApiBaseUrl).trim() === "") {
  const message = "Missing required env var: VITE_API_BASE_URL. Configure .env and restart the server.";
  console.error(message);
  throw new Error(message);
}

export const API_BASE_URL = rawApiBaseUrl;
