import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";


export default function SidebarSection({ title, count, feeds }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {/* Bouton principal */}
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
          {title}
        </span>
        <span className="text-xs">{count}</span>
      </button>

      {/* Sous-éléments */}
      <div
        className={cn(
          "pl-4 mt-1 space-y-0.5 overflow-hidden transition-all duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
       {feeds.map((feed) => {
              const slug = feed.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              return (
                <NavLink
                  key={feed.name}
                  to={`/flux/${slug}`}
                  className={({ isActive }) =>
                    cn(
                      "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm group transition-smooth",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                    )
                  }
                >
                  <span
                    className={cn("w-2 h-2 rounded-sm flex-shrink-0", feed.color)}
                  />
                  <span className="truncate flex-1 text-left text-[13px]">
                    {feed.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground group-hover:text-primary">
                    {feed.count}
                  </span>
                </NavLink>
              );
            })}
      </div>
    </div>
  );
}