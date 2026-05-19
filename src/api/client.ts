const API_URL = import.meta.env.VITE_API_URL;

// Typage léger pour le body et le retour
type ApiOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function apiFetch<T = unknown>(
  endpoint: string,
  options?: ApiOptions
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "GET", // valeur par défaut
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  // 1. Si la requête échoue à arriver (network, CORS, etc.), fetch lève déjà une erreur

  // 2. Si la réponse est 4xx/5xx
  if (!res.ok) {
    let errorBody: any = null;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        errorBody = await res.json();
      } catch (e) {
        // on laisse errorBody = null
      }
    }

    // On construit un Error standard pour le catch
    const message =
      errorBody?.message || errorBody?.error || res.statusText || "Erreur serveur";

    throw new Error(message);
  }

  // 3. Sinon, on parse le JSON
  const data = await res.json();
  return data as T;
}