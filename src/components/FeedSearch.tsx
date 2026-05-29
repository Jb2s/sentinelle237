import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Rss, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedItem = {
  id:       string;
  name:     string;
  category: string;
  type:     "rss" | "social";
  color:    string;
  url?:     string;
};

type Props = {
  query:    string;
  setQuery: (q: string) => void;
  items:    FeedItem[];
  onSelect: (item: FeedItem) => void;
  onFollow: (item: FeedItem) => void | Promise<void>;
};

export function FeedSearch({ query, setQuery, items, onSelect, onFollow }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? items.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showDropdown = Boolean(query.trim()) && results.length > 0;

  const handleSelect = (item: FeedItem) => {
    onSelect(item);
    setQuery(item.name);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un site ou un compte…"
          className="pl-10 h-11"
        />
      </div>

      {showDropdown && (
        <ul className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden max-h-72 overflow-auto divide-y divide-border">
          {results.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className={cn(
                "cursor-pointer px-4 py-3 hover:bg-sidebar-accent transition-colors",
                "flex items-center gap-3"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center text-primary-foreground shrink-0",
                item.color
              )}>
                {item.type === "rss"
                  ? <Rss    className="w-3.5 h-3.5 text-primary-foreground" />
                  : <Share2 className="w-3.5 h-3.5 text-primary-foreground" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.category}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
