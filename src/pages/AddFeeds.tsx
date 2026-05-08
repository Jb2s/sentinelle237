import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { feeds as initialFeeds } from "@/data/articles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Check, Rss, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useViewMode } from "@/context/ViewModeContext";

const suggested = [
  { name: "TechCrunch Fintech", category: "Tech · Fintech", color: "bg-primary" },
  { name: "PYMNTS", category: "Paiements", color: "bg-primary-deep" },
  { name: "The Block", category: "Crypto", color: "bg-highlight" },
  { name: "Decrypt", category: "Crypto", color: "bg-primary-glow" },
  { name: "Banking Dive", category: "Banking", color: "bg-primary" },
  { name: "Finextra", category: "Régulation", color: "bg-primary-deep" },
  { name: "Sifted", category: "Startups", color: "bg-primary-glow" },
  { name: "The Fintech Times", category: "Fintech", color: "bg-highlight" },
];

export default function AddFeed() {
  const { viewMode } = useViewMode();
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const all = useMemo(() => {
    const existing = initialFeeds.map((f) => ({
      name: f.name,
      category: "Suivi",
      color: f.color,
    }));
    const merged = [...suggested, ...existing];
    if (!query.trim()) return merged;
    const q = query.toLowerCase();
    return merged.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [query]);

  const toggleFollow = (name: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        toast.success(`${name} retiré de vos flux`);
      } else {
        next.add(name);
        toast.success(`${name} ajouté à vos flux`);
      }
      return next;
    });
  };

  const handleAddByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    toast.success(`Flux ajouté : ${url}`);
    setUrl("");
  };

  return (
    <PageShell
      eyebrow="Découverte"
      title="Ajouter un flux"
      meta={<span>Recherchez, explorez et abonnez-vous à de nouvelles sources.</span>}
    >
      <div className="space-y-8">
        <form
          onSubmit={handleAddByUrl}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-lg">Ajouter par URL</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Collez une URL de site web ou un flux RSS pour vous abonner directement.
          </p>
          <div className="flex gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple.com/rss.xml"
              className="flex-1"
            />
            <Button type="submit" className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </form>

        <div>
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un flux par nom ou catégorie…"
              className="pl-10 h-11"
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">
              {query ? "Résultats" : "Suggestions pour vous"}
            </h2>
            <span className="text-xs text-muted-foreground">{all.length} flux</span>
          </div>

          {all.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Aucun flux ne correspond à « {query} ».
            </div>
          ) : (
            <ul
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 gap-3"
                  : "space-y-2"
              )}
            >
              {all.map((feed) => {
                const isFollowed = followed.has(feed.name);

                return (
                  <li
                    key={feed.name}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-smooth",
                      viewMode === "grid" ? "min-h-[84px]" : "min-h-[72px]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground",
                        feed.color
                      )}
                    >
                      <Rss className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {feed.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {feed.category}
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant={isFollowed ? "secondary" : "default"}
                      onClick={() => toggleFollow(feed.name)}
                      className="gap-1.5"
                    >
                      {isFollowed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Suivi
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Suivre
                        </>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}