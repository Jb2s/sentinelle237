import {
  Sun,
  Bookmark,
  PenLine,
  Brain,
  Users,
  Plus,
  Search,
  UserPlus,
  Moon,
  Wrench,
  Package,
  Gift,
  HelpCircle,
  Settings,
  ChevronDown,
  Rss,
  Link,
} from "lucide-react";
import { feeds } from "@/data/articles";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import SidebarSection from "./SidebarSection";


const mainItems = [
  { icon: Sun, label: "Aujourd'hui", to: "/" },
  { icon: Bookmark, label: "À lire plus tard", to: "/a-lire-plus-tard" },
  { icon: PenLine, label: "Annotés", to: "/annotes" },
  { icon: Brain, label: "Entraîner Alexandre", to: "/entrainer-alexandre" },
  // { icon: Users, label: "Admin équipe" },
];

export function AppSidebar() {
  return (
    <div className="flex h-screen sticky top-0">
      {/* Rail */}
      <aside className="w-14 bg-gradient-primary flex flex-col items-center py-4 gap-5 text-primary-foreground">
        <div className="w-9 h-9 rounded-xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center font-display font-bold">
          R
        </div>
        <div className="flex flex-col gap-4 mt-4 opacity-90">
          {[Plus, Search, Moon, Wrench, Package, Gift, HelpCircle].map(
            (Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-lg hover:bg-primary-foreground/15 flex items-center justify-center transition-smooth"
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          )}
        </div>
        <div className="mt-auto flex flex-col gap-3">
          <div className="w-9 h-9 rounded-full bg-highlight border-2 border-primary-foreground/40" />
          <div className="w-9 h-9 rounded-full bg-primary-glow border-2 border-primary-foreground/40" />
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
            Fintech Radar
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
            <span className="text-xs text-muted-foreground">1K+</span>
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
  );
}
