import { useState } from "react";
import { ChevronDown, Rss } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useSidebarData } from "@/hooks/useSidebarData";
import { SourceLogo } from "@/components/SourceLogo";

function CategoryBlock({
  nom_cat,
  sources,
}: {
  nom_cat: string;
  sources: { id_source: number; nom_source: string; article_count: number; url_source?: string }[];
}) {
  const [open, setOpen] = useState(true);
  const total = sources.reduce((sum, s) => sum + s.article_count, 0);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-primary-deep bg-secondary mt-1"
      >
        <span className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
          {nom_cat}
        </span>
        <span className="text-xs">{total}</span>
      </button>

      <div
        className={cn(
          "pl-4 mt-1 space-y-0.5 overflow-hidden transition-all duration-300",
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {sources.map((src) => (
          <NavLink
            key={src.id_source}
            to={`/source/${src.id_source}`}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm group transition-smooth",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              )
            }
          >
            <SourceLogo
              url={src.url_source ?? `https://www.${src.nom_source.toLowerCase().replace(/\s+/g, "")}.com`}
              name={src.nom_source}
              size={18}
              className="flex-shrink-0 rounded"
              fallbackIcon="rss"
            />
            <span className="truncate flex-1 text-left text-[13px]">
              {src.nom_source}
            </span>
            <span className="text-[11px] text-muted-foreground group-hover:text-primary">
              {src.article_count}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function SidebarSection() {
  const { categories, isLoading, error } = useSidebarData();

  if (isLoading) {
    return (
      <div className="space-y-2 px-3 py-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 rounded-lg bg-secondary animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="px-3 py-2 text-xs text-destructive">{error}</p>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="px-3 py-4 flex flex-col items-center gap-2 text-center">
        <Rss className="w-6 h-6 text-muted-foreground opacity-40" />
        <p className="text-xs text-muted-foreground">
          Aucune catégorie disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {categories.map((cat) => (
        <CategoryBlock
          key={cat.id_cat}
          nom_cat={cat.nom_cat}
          sources={cat.sources}
        />
      ))}
    </div>
  );
}