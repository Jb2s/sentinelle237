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
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 min-w-0">
        <div
          className={cn(
            "max-w-[1400px] mx-auto",
            isMobile
              ? "px-4 pt-20 pb-24"
              : "px-8 py-8"
          )}
        >
          {/* ================= HEADER ================= */}
          <header
            className={cn(
              "flex mb-8 gap-6",
              isMobile
                ? "flex-col items-start"
                : "items-start justify-between"
            )}
          >
            {/* LEFT */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-2">
                <svg
                  width="20"
                  height="6"
                  viewBox="0 0 20 6"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-primary/70"
                >
                  <path
                    d="M1 3C4 1.2 6 1.2 9 3C12 4.8 14 4.8 17 3"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
            
                <span className="truncate">
                  {eyebrow}
                </span>
              </div>

              <h1
                className={cn(
                  "font-display font-extrabold text-foreground tracking-tight",
                  isMobile
                    ? "text-3xl"
                    : "text-5xl"
                )}
              >
                {title}
              </h1>

              {meta && (
                <div
                  className={cn(
                    "flex mt-3 text-sm text-muted-foreground",
                    isMobile
                      ? "flex-wrap gap-1"
                      : "items-center gap-2"
                  )}
                >
                  {meta}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div
              className={cn(
                "flex items-center",
                isMobile
                  ? "w-full justify-between"
                  : "gap-1"
              )}
            >
              {/* VIEW TOGGLE */}
              <button
                onClick={() =>
                  setViewMode(
                    viewMode === "list"
                      ? "grid"
                      : "list"
                  )
                }
                className={cn(
                  "rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth",
                  isMobile
                    ? "w-10 h-10 border border-border invisible"
                    : "w-9 h-9"
                )}
              >
                {viewMode === "list" ? (
                  <LayoutGrid className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
              </button>

              {/* DESKTOP ACTIONS */}
              {!isMobile && (
                <>
                  {[Check, RefreshCw, Trash2].map(
                    (Icon, i) => (
                      <button
                        key={i}
                        className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary-deep transition-smooth"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  )}
                </>
              )}

              {/* MOBILE ACTIONS */}
              {isMobile && (
                <div className="flex items-center gap-2">
                  {[Check, RefreshCw, Trash2].map(
                    (Icon, i) => (
                      <button
                        key={i}
                        className="w-10 h-10 rounded-lg border border-border hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary-deep transition-smooth"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </header>

          {/* ================= CONTENT ================= */}
          {aside ? (
            <div
              className={cn(
                isMobile
                  ? "space-y-8"
                  : "grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8"
              )}
            >
              <section className="min-w-0">
                {children}
              </section>

              <aside
                className={cn(
                  "min-w-0",
                  !isMobile &&
                    "xl:sticky xl:top-8 xl:self-start"
                )}
              >
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