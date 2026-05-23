import { create } from "zustand";

interface LogoutSidebarState {
  logoutBarStatus: boolean;

  openLogoutBar: () => void;

  closeLogoutBar: () => void;
}

const useLogoutSidebarStore =
  create<LogoutSidebarState>((set) => ({
    logoutBarStatus: false,

    openLogoutBar: () =>
      set({
        logoutBarStatus: true,
      }),

    closeLogoutBar: () =>
      set({
        logoutBarStatus: false,
      }),
  }));

export default useLogoutSidebarStore;