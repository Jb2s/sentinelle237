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