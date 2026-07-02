const API_URL = import.meta.env.VITE_API_URL ?? "";

type HttpMethod =
  | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";

type ApiOptions = Omit<RequestInit, "headers" | "method"> & {
  method?:  HttpMethod;
  headers?: Record<string, string>;
};

function forceLogout() {
  localStorage.removeItem("auth-storage");
  if (!window.location.pathname.startsWith("/connexion")) {
    window.location.href = "/connexion";
  }
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("auth-storage");
    return raw ? JSON.parse(raw)?.state?.token ?? null : null;
  } catch {
    return null;
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options?: ApiOptions
): Promise<T> {
  const token = getToken();
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

  if (res.status === 401) {
    let body: any = null;
    try { body = await res.json(); } catch {}
    if (token) {
      forceLogout();
    }
    throw new Error(body?.error ?? body?.message ?? "Session expirée");
  }

  if (!res.ok) {
    let errorBody: any = null;
    const ct = res.headers.get("content-type");
    if (ct?.includes("application/json")) {
      try { errorBody = await res.json(); } catch {}
    }
    throw new Error(
      errorBody?.message || errorBody?.error || res.statusText || "Erreur serveur"
    );
  }

  if (res.status === 204) return {} as T;

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as Promise<T>;
}

export function friendlyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message || "Une erreur inattendue est survenue.";
  }
  if (typeof error === "string") {
    return error;
  }
  return "Une erreur inattendue est survenue.";
}

export { API_URL, getToken };
