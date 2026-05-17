import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { feeds as initialFeeds } from "@/data/articles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, Plus, Rss, Globe, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useViewMode } from "@/context/ViewModeContext";
import { FeedSearch } from "@/components/FeedSearch";

type SourceType = "rss" | "social";
type SocialPlatform = "twitter" | "instagram" | "linkedinn" | "youtube";

type FeedItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  type: SourceType;
};

const suggestedFeeds: FeedItem[] = [
  { id: "techcrunch", name: "TechCrunch Fintech", category: "Tech · Fintech", color: "bg-primary", type: "rss" },
  { id: "pymnts", name: "PYMNTS", category: "Paiements", color: "bg-primary-deep", type: "rss" },
  { id: "theblock", name: "The Block", category: "Crypto", color: "bg-highlight", type: "rss" },
  { id: "decrypt", name: "Decrypt", category: "Crypto", color: "bg-primary-glow", type: "rss" },
  { id: "bankingdive", name: "Banking Dive", category: "Banking", color: "bg-primary", type: "rss" },
  { id: "finextra", name: "Finextra", category: "Régulation", color: "bg-primary-deep", type: "rss" },
  { id: "sifted", name: "Sifted", category: "Startups", color: "bg-primary-glow", type: "rss" },
  { id: "fintechtimes", name: "The Fintech Times", category: "Fintech", color: "bg-highlight", type: "rss" },
];

const socialPlatforms = [
  { id: "twitter", label: "X / Twitter", color: "bg-slate-900" },
  { id: "instagram", label: "Instagram", color: "bg-pink-500" },
  { id: "linkedin", label: "LinkedIn", color: "bg-blue-600" },
  { id: "youtube", label: "YouTube", color: "bg-red-500" },
] as const;

export default function AddFeed() {
  const { viewMode } = useViewMode();
  const [sourceType, setSourceType] = useState<SourceType>("rss");
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>("twitter");
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const allFeeds = useMemo<FeedItem[]>(() => {
    const existing = initialFeeds.map((f, i) => ({
      id: `existing-${i}`,
      name: f.name,
      category: "Suivi",
      color: f.color,
      type: "rss" as const,
    }));
    return [...suggestedFeeds, ...existing];
  }, []);

  const rssFeeds = useMemo<FeedItem[]>(() => {
    return allFeeds.filter((f) => f.type === "rss");
  }, [allFeeds]);

  const socialFeeds = useMemo<FeedItem[]>(() => {
    return allFeeds.filter((f) => f.type === "social");
  }, [allFeeds]);

  const all = useMemo(() => {
    const existing = initialFeeds.map((f) => ({
      name: f.name,
      category: "Suivi",
      color: f.color,
      type: "rss" as const,
    }));

    const merged = [...suggestedFeeds, ...existing].filter(
      (item) => item.type === sourceType
    );

    if (!query.trim()) return merged;

    const q = query.toLowerCase();
    return merged.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [query, sourceType]);

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

  const handleRssSelect = (item: FeedItem) => {
    setUrl(item.name);
    toggleFollow(item.name);
  };

  const handleSocialSelect = (item: FeedItem) => {
    setSocialUrl(item.name);
    toggleFollow(item.name);
  };

  const handleAddRss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    toast.success(`Flux RSS ajouté : ${url}`);
    setUrl("");
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialUrl.trim()) return;
    const selected = socialPlatforms.find((p) => p.id === platform);
    toast.success(`${selected?.label} ajouté : ${socialUrl}`);
    setSocialUrl("");
  };

  return (
    <PageShell
      eyebrow="Découverte"
      title="Suivre une source"
      meta={<span>Ajoutez un site RSS ou reliez un réseau social.</span>}
    >
      <div className="space-y-8">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={sourceType === "rss" ? "default" : "outline"}
            onClick={() => setSourceType("rss")}
            className="gap-2"
          >
            <Rss className="w-4 h-4" />
            Sites / RSS
          </Button>
          <Button
            type="button"
            variant={sourceType === "social" ? "default" : "outline"}
            onClick={() => setSourceType("social")}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Réseaux sociaux
          </Button>
        </div>

        {sourceType === "rss" ? (
          <form
            onSubmit={handleAddRss}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-lg">
                Suivre un site ou un flux RSS
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Recherchez un site par nom ou collez directement l’URL du flux RSS.
            </p>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <FeedSearch
                query={url}
                setQuery={setUrl}
                items={rssFeeds}
                onSelect={handleRssSelect}
              />
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                Suivre
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleAddSocial}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-lg">
                Suivre un réseau social
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sélectionne une plateforme puis colle le lien du profil ou du compte.
            </p>
            <div className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <Select
                value={platform}
                onValueChange={(value) => setPlatform(value as SocialPlatform)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choisir une plateforme" />
                </SelectTrigger>

                <SelectContent>
                  {socialPlatforms.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FeedSearch
                query={socialUrl}
                setQuery={setSocialUrl}
                items={socialFeeds}
                onSelect={handleSocialSelect}
              />
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                Suivre
              </Button>
            </div>
          </form>
        )}

        <div>
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-display font-bold text-lg whitespace-nowrap">
              {query
                ? "Résultats"
                : sourceType === "rss"
                  ? "Suggestions pour vous"
                  : "Plateformes disponibles"}
            </h2>

            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  sourceType === "rss"
                    ? "Rechercher un site ou une catégorie…"
                    : "Rechercher un réseau social…"
                }
                className="pl-10 h-11"
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {all.length} source(s)
            </span>
          </div>

          {all.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Aucun résultat pour « {query} ».
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
                      {sourceType === "rss" ? (
                        <Rss className="w-4 h-4" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{feed.name}</div>
                      <div className="text-xs text-muted-foreground">{feed.category}</div>
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