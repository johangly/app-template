import { API_BASE_URL } from "./apiConfig";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const request = async <T>(
  endpoint: string,
  options?: RequestInit,
  responseType: 'json' | 'blob' | 'text' = 'json',
  timeoutMs: number = 30000
): Promise<T> => {
  const headers = new Headers(options?.headers);
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: headers,
  };

  if (finalOptions.body instanceof FormData) {
    headers.delete("Content-Type");
  } else {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...finalOptions,
    signal: controller.signal,
  })
    .catch((err) => {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw err;
    })
    .finally(() => {
      window.clearTimeout(timeoutId);
    });

  if (response.status === 401 || response.status === 403) {
    // Token inválido, expirado o sin permisos
    localStorage.removeItem("token");
    // Redirigir a la página de login
    window.location.href = "/login";
    // Lanzar un error para detener la ejecución del código que llamó a la función
    throw new Error("Session expired or invalid. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  // Si la respuesta no tiene contenido (ej. en un DELETE exitoso), no intentes parsear JSON
  const contentType = response.headers.get("content-type");

  if (response.status === 204) {
    return Promise.resolve({} as T);
  }

  if (responseType === 'blob') {
    return response.blob() as Promise<T>;
  }

  if (responseType === 'text') {
    return response.text() as Promise<T>;
  }

  // Default to json
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Fallback for non-json responses when json is expected
  return response.text().then(text => {
    try {
      return JSON.parse(text) as T;
    } catch { // 'e' is not used, so it can be omitted
      // If text is not valid JSON, return it as is.
      // This might happen for error messages that are not in JSON format.
      return text as unknown as T;
    }
  });
};
