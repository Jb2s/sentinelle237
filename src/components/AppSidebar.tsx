import {
  Sun,
  Clock3,
  Bookmark,
  PenLine,
  Brain,
  Plus,
  Search,
  Moon,
  Wrench,
  HelpCircle,
  Settings,
  Rss,
  Menu,
  X,
  Home,
  User,
} from "lucide-react";

import { feeds } from "@/data/articles";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SidebarSection from "./SidebarSection";
import { useTheme } from "@/context/theme-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

import useAuthStore from "@/store/useAuthStore";
import useLogoutSidebarStore from "@/store/useLogoutSidebarStore";

const mainItems = [
  { icon: Clock3, label: "Aujourd'hui", to: "/" },
  { icon: Bookmark, label: "À lire plus tard", to: "/a-lire-plus-tard" },
  { icon: PenLine, label: "Annotés", to: "/annotes" },
  { icon: Brain, label: "Entraîner Alexandre", to: "/entrainer-alexandre" },
];



export function AppSidebar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const openLogoutBar = useLogoutSidebarStore((state) => state.openLogoutBar);

  const isMobile = useIsMobile();

  const [mobileOpen, setMobileOpen] = useState(false);

  const railActions = [
    {
      Icon: Plus,
      label: "Ajouter un flux",
      path: "/ajouter-flux",
      onClick: () => navigate("/ajouter-flux"),
    },

    {
      Icon: Search,
      label: "Rechercher un flux",
      path: "/recherche",
      onClick: () => navigate("/recherche"),
    },

    {
      Icon: theme === "dark" ? Sun : Moon,
      label: "Thème",
      path: null,
      onClick: toggleTheme,
    },

    {
      Icon: Wrench,
      label: "Outils",
      path: "/outils",
      onClick: () => navigate("/outils"),
    },

    {
      Icon: HelpCircle,
      label: "Aide",
      path: "/help",
      onClick: () => navigate("/help"),
    },
  ];

  return (
    <>
      {/* ================= MOBILE TOPBAR ================= */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

            <span className="font-display font-bold text-lg">
              Sentinelle 237
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-smooth"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>
      )}

      {/* ================= MOBILE DRAWER ================= */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Rassemblement
                </div>
                <div className="flex w-32">
  <div className="h-1 flex-1 bg-[#CE1126]" />
  <div className="h-1 flex-1 bg-[#FCD116]" />
</div>

                <h1 className="font-display font-bold text-xl mt-1">
                  Sentinelle 237
                </h1>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {mainItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-sidebar-border mt-2">
              <div className="space-y-1">
                {railActions.map(({ Icon, label, onClick, path }) => {
                  const isActive = path && location.pathname === path;

                  return (
                    <button
                      key={label}
                      onClick={() => {
                        onClick();
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-smooth",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-5 pt-3 pb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Flux
              </span>

              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="px-3 flex-1 overflow-y-auto">
              <SidebarSection
                title="Finance & Banking"
                count="1K+"
                feeds={feeds}
              />

              <SidebarSection
                title="Economic"
                count="1K+"
                feeds={feeds}
              />
            </div>
          </aside>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      {!isMobile && (
        <div className="flex h-screen sticky top-0">
          {/* Rail */}
          <aside className="w-14 bg-gradient-primary flex flex-col items-center py-4 gap-5 text-primary-foreground">
            <button
              onClick={() => navigate("/")}
              className="w-9 h-9 rounded-lg hover:bg-primary-foreground/15 flex items-center justify-center transition-smooth"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
            </button>
            <div className="flex flex-col gap-4 mt-4 opacity-90">
              {railActions.map(({ Icon, label, onClick, path }) => {
                const isActive = path && location.pathname === path;

                return (
                  <button
                    key={label}
                    onClick={onClick}
                    title={label}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-smooth",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "hover:bg-primary-foreground/15"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <button onClick={openLogoutBar}
                className="
                  w-9 h-9 rounded-full
                  bg-primary-glow
                  border-2 border-primary-foreground/40
                  flex items-center justify-center
                  font-bold text-white
                  cursor-pointer
                "
              >
                {user?.email?.[0]?.toUpperCase()}
              </button>
            </div>
          </aside>

          {/* Main sidebar */}
          <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
            <div className="p-5 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

                <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Rassemblement
                </span>
              </div>

              <h1 className="font-display font-bold text-xl mt-1 text-sidebar-foreground">
                Sentinelle 237
              </h1>
            </div>

            <nav className="px-3 py-4 space-y-0.5">
              {mainItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="w-4 h-4" />

                      {item.label}

                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="px-5 pt-3 pb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Flux
              </span>

              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="px-3 flex-1 overflow-y-auto">
              <NavLink
                to="/"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent/60"
              >
                <span className="flex items-center gap-2">
                  <Rss className="w-4 h-4" />
                  Tous
                </span>

                <span className="text-xs text-muted-foreground">
                  1K+
                </span>
              </NavLink>

              <SidebarSection
                title="Finance & Banking"
                count="1K+"
                feeds={feeds}
              />

              <SidebarSection
                title="Economic"
                count="1K+"
                feeds={feeds}
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}