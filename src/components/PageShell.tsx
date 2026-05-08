import { AppSidebar } from "@/components/AppSidebar";
import {
  Check,
  LayoutGrid,
  List,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { ReactNode } from "react";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";

interface PageShellProps {
  eyebrow: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}

export function PageShell({
  eyebrow,
  title,
  meta,
  children,
  aside,
}: PageShellProps) {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <header className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-2">
                <span className="w-6 h-px bg-primary" />
                {eyebrow}
              </div>

              <h1 className="font-display font-extrabold text-5xl text-foreground tracking-tight">
                {title}
              </h1>

              {meta && (
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  {meta}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* TOGGLE VIEW : un seul bouton qui bascule */}
              <button
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth"
              >
                {viewMode === "list" ? (
                  <LayoutGrid className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
              </button>

              {/* OTHER ACTIONS */}
              {[Check, RefreshCw, Trash2].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary-deep transition-smooth"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </header>

          {aside ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
              <section>{children}</section>
              <aside className="xl:sticky xl:top-8 xl:self-start">
                {aside}
              </aside>
            </div>
          ) : (
            <section>{children}</section>
          )}
        </div>
      </main>
    </div>
  );
}