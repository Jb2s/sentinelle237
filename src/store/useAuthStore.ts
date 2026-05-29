import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenStorage } from "@/utils/token";

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;

  setUser: (userData: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (userData, token) => {
        // ✅ zustand persist sauvegarde dans auth-storage automatiquement
        set({ user: userData, token });
      },

      logout: () => {
        tokenStorage.remove(); // ✅ supprime auth-storage
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;