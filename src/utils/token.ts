const TOKEN_KEY = "auth-storage";

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.state?.token ?? null; // ✅ lit au bon endroit
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
  },
  remove: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem(TOKEN_KEY);
  },
};