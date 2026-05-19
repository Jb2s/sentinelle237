const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erreur serveur");
  }

  return res.json();
}