import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import {
  LogOut,
  Mail,
  KeyRound,
  X,
} from "lucide-react";

import useAuthStore from "@/store/useAuthStore";
import useLogoutSidebarStore from "@/store/useLogoutSidebarStore";

import { tokenStorage } from "@/utils/token";

export function LogoutSidebar() {
  const navigate = useNavigate();

  // AUTH STORE
  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  // SIDEBAR STORE
  const logoutBarStatus =
    useLogoutSidebarStore(
      (state) => state.logoutBarStatus
    );

  const closeLogoutBar =
    useLogoutSidebarStore(
      (state) => state.closeLogoutBar
    );

  // STATE
  const [signingOut, setSigningOut] =
    useState(false);

  const email = user?.email ?? null;

  // LOGOUT
  const handleSignOut = async () => {
    setSigningOut(true);

    // REMOVE TOKEN
    tokenStorage.remove();

    // CLEAR USER
    logout();

    toast.success(
      "Déconnexion réussie"
    );

    closeLogoutBar();

    navigate("/connexion", {
      replace: true,
    });

    setSigningOut(false);
  };

  return (
    <>
      {/* OVERLAY */}
      {logoutBarStatus && (
        <div
          className="
            fixed inset-0
            bg-black/40
            backdrop-blur-sm
            z-40
          "
          onClick={closeLogoutBar}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 right-0
          h-screen w-[460px]
          bg-background
          border-l border-border
          shadow-2xl
          z-50
          transition-transform duration-300
          p-6
          flex flex-col
          ${
            logoutBarStatus
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-semibold text-lg">
              Mon compte
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              Gérez votre session
            </p>
          </div>

          {/* CLOSE */}
          <button
            onClick={closeLogoutBar}
            className="
              w-9 h-9 rounded-lg
              hover:bg-muted
              flex items-center justify-center
              transition
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
          
          {/* TOP */}
          <div className="bg-gradient-primary px-6 py-8">
            <div className="flex items-center gap-4">

              {/* AVATAR */}
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center text-primary-foreground font-bold text-2xl">
                {email?.[0]?.toUpperCase() ??
                  "U"}
              </div>

              <div>
                <h2 className="font-display font-bold text-xl text-primary-foreground">
                  {email
                    ? email.split("@")[0]
                    : "Utilisateur"}
                </h2>

                <p className="text-sm text-primary-foreground/80 mt-0.5">
                  {email ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-6">

            {/* EMAIL */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                <Mail className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </p>

                <p className="text-sm font-medium text-foreground truncate">
                  {email ?? "—"}
                </p>
              </div>
            </div>

            {/* LOGIN METHOD */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                <KeyRound className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Méthode de connexion
                </p>

                <p className="text-sm font-medium text-foreground">
                  Email & Mot de passe
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* LOGOUT */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-destructive">
                Zone de danger
              </h3>

              <p className="text-sm text-muted-foreground">
                Déconnectez-vous de votre
                compte sur cet appareil.
              </p>

              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? (
                  <>
                    <LogOut className="w-4 h-4 animate-spin" />
                    Déconnexion…
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}