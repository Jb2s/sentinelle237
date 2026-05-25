const API_URL = import.meta.env.VITE_API_URL;

type HttpMethod =
  | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";

type ApiOptions = Omit<RequestInit, "headers" | "method"> & {
  method?:  HttpMethod;
  headers?: Record<string, string>;
};

function forceLogout() {
  localStorage.removeItem("token");
  // Redirection disjonctive — pas de boucle si déjà sur /connexion
  if (!window.location.pathname.startsWith("/connexion")) {
    window.location.href = "/connexion";
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options?: ApiOptions
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type":               "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  // Token expiré ou invalide → logout immédiat
  if (res.status === 401) {
    let body: any = null;
    try { body = await res.json(); } catch {}

    const isExpired =
      body?.error?.toLowerCase().includes("expiré") ||
      body?.error?.toLowerCase().includes("expired") ||
      body?.code  === "TOKEN_EXPIRED";

    // Expiration ou token invalide → même traitement : logout
    forceLogout();
    throw new Error(body?.error ?? body?.message ?? "Session expirée");
  }

  if (!res.ok) {
    let errorBody: any = null;
    const ct = res.headers.get("content-type");
    if (ct?.includes("application/json")) {
      try { errorBody = await res.json(); } catch {}
    }
    const message =
      errorBody?.message ||
      errorBody?.error  ||
      res.statusText    ||
      "Erreur serveur";
    throw new Error(message);
  }

  if (res.status === 204) return {} as T;

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  return res.text() as unknown as Promise<T>;
}