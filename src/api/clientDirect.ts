import { apiFetch } from "./clientDirect";

export const authApi = {
  login: (email: string, mot_de_passe: string) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, mot_de_passe }),
    }),

  signup: (email: string, mot_de_passe: string, role: string) =>
    apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, mot_de_passe, role }),
    }),

  me: () => apiFetch("/api/auth/me"),
};

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
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    
    // Support hybride : s'adapte si le token est stocké via Zustand (.state.token) ou brut (.token)
    return parsed?.state?.token ?? parsed?.token ?? parsed ?? null;
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
      "Accept": "application/json",
      "Content-Type":     "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  // Gestion spécifique de la 401 (Non autorisé / Session expirée)
  if (res.status === 401) {
    let body: any = null;
    try { body = await res.json(); } catch {}
    
    // On ne déconnecte que si la route demandée n'était pas la route de login elle-même
    if (token && !endpoint.includes("/auth/login")) {
      forceLogout();
    }

    throw new Error(body?.error || body?.message || "Session expirée ou identifiants invalides");
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

export { API_URL, getToken };
