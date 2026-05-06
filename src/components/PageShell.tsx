import { AppSidebar } from "@/components/AppSidebar";
import { Check, List, RefreshCw, MoreHorizontal, Users } from "lucide-react";
import { ReactNode } from "react";

interface PageShellProps {
  eyebrow: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}

export function PageShell({ eyebrow, title, meta, children, aside }: PageShellProps) {

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
                  <Users className="w-3.5 h-3.5" />
                  {meta}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[Check, List, RefreshCw, MoreHorizontal].map((Icon, i) => (
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
              <aside className="xl:sticky xl:top-8 xl:self-start">{aside}</aside>
            </div>
          ) : (
            <section>{children}</section>
          )}
        </div>
      </main>
    </div>
  );
}