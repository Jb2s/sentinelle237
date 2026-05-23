import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
}

interface AuthState {
  user: User | null;

  setUser: (userData: User) => void;

  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (userData) => set({ user: userData }),

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;