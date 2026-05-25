import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, Plus, Rss, Globe, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useViewMode } from "@/context/ViewModeContext";
import { FeedSearch } from "@/components/FeedSearch";
import { rssApi } from "@/api/rss.api";
import { tokenStorage } from "@/utils/token";
import { SourceLogo } from "@/components/SourceLogo";

type SourceType = "rss" | "social";
type SocialPlatform = "twitter" | "instagram" | "linkedin" | "youtube";

type FeedItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  type: SourceType;
  url?: string;
};

const socialPlatforms = [
  { id: "twitter",   label: "X / Twitter", color: "bg-slate-900" },
  { id: "instagram", label: "Instagram",   color: "bg-pink-500"  },
  { id: "linkedin",  label: "LinkedIn",    color: "bg-blue-600"  },
  { id: "youtube",   label: "YouTube",     color: "bg-red-500"   },
] as const;

export default function AddFeed() {
  const { viewMode } = useViewMode();
  const token = tokenStorage.get();

  const [sourceType, setSourceType] = useState<SourceType>("rss");
  const [query, setQuery] = useState("");
  const [rssInput, setRssInput] = useState("");
  const [socialInput, setSocialInput] = useState("");

  const [selectedRss, setSelectedRss] = useState<FeedItem | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<FeedItem | null>(null);

  const [platform, setPlatform] = useState<SocialPlatform>("twitter");
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const [isSubmittingRss, setIsSubmittingRss] = useState(false);
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);

  const [isDetectingRss, setIsDetectingRss] = useState(false);
  const [isDetectingSocial, setIsDetectingSocial] = useState(false);

  const [rssDetectResult, setRssDetectResult] = useState<any>(null);

  // Uniquement les flux détectés — aucune suggestion statique
  const detectedFeeds = useMemo<FeedItem[]>(() => {
    const candidates = rssDetectResult?.data?.candidates ?? [];
    return candidates.map((c: { url: string; titre: string }, i: number) => ({
      id:       `detected-${i}`,
      name:     c.titre ?? c.url,
      category: "Détecté",
      color:    "bg-primary",
      type:     "rss" as const,
      url:      c.url,
    }));
  }, [rssDetectResult]);

  const all = useMemo(() => {
    const source = sourceType === "rss" ? detectedFeeds : [];

    if (!query.trim()) return source;

    const q = query.toLowerCase();
    return source.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [detectedFeeds, query, sourceType]);

  const toggleFollow = (name: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleRssSelect = (item: FeedItem) => {
    setRssInput(item.url ?? item.name);
    setSelectedRss(item);
  };

  const handleSocialSelect = (item: FeedItem) => {
    setSocialInput(item.url ?? item.name);
    setSelectedSocial(item);
  };

  useEffect(() => {
    if (sourceType !== "rss") return;

    const site_name = rssInput.trim();
    if (!site_name || site_name.length < 3) {
      setSelectedRss(null);
      setRssDetectResult(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsDetectingRss(true);
        const result: any = await rssApi.detectSources(site_name, token);
        setRssDetectResult(result);

        const detected = result?.data?.candidates?.[0] ?? null;
        if (detected) {
          setSelectedRss({
            id:       detected.url ?? site_name,
            name:     detected.titre ?? site_name,
            category: "Détecté",
            color:    "bg-primary",
            type:     "rss",
            url:      detected.url ?? site_name,
          });
        } else {
          setSelectedRss(null);
        }
      } catch {
        setRssDetectResult(null);
        setSelectedRss(null);
      } finally {
        setIsDetectingRss(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [rssInput, sourceType, token]);

  useEffect(() => {
    if (sourceType !== "social") return;

    const site_name = socialInput.trim();
    if (!site_name || site_name.length < 3) {
      setSelectedSocial(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsDetectingSocial(true);
        const selected = socialPlatforms.find((p) => p.id === platform);
        const result: any = await rssApi.detectSources(
          selected?.label ?? platform,
          site_name,
          token
        );

        const detected = result?.data?.source ?? result?.source ?? null;
        if (detected) {
          setSelectedSocial({
            id:       detected.id ?? site_name,
            name:     detected.name ?? selected?.label ?? platform,
            category: detected.category ?? "Détecté",
            color:    "bg-primary",
            type:     "social",
            url:      detected.url ?? site_name,
          });
        } else {
          setSelectedSocial(null);
        }
      } catch {
        setSelectedSocial(null);
      } finally {
        setIsDetectingSocial(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [socialInput, sourceType, platform, token]);

  const handleAddRss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rssInput.trim()) return;

    try {
      setIsSubmittingRss(true);

      const sourceName = selectedRss?.name ?? rssInput.trim();
      const sourceUrl  = selectedRss?.url  ?? rssInput.trim();

      await rssApi.addRssSource(sourceName, sourceUrl, 60, token);

      toast.success(`Flux RSS ajouté : ${sourceName}`);
      setRssInput("");
      setSelectedRss(null);
      setRssDetectResult(null);
      setQuery("");
    } catch {
      toast.error("Impossible d'ajouter la source RSS");
    } finally {
      setIsSubmittingRss(false);
    }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialInput.trim()) return;

    try {
      setIsSubmittingSocial(true);

      const selected   = socialPlatforms.find((p) => p.id === platform);
      const sourceName = selectedSocial?.name ?? selected?.label ?? platform;

      await rssApi.addSocialSource(sourceName, socialInput.trim(), token);

      toast.success(`${selected?.label ?? platform} ajouté : ${socialInput}`);
      setSocialInput("");
      setSelectedSocial(null);
      setQuery("");
    } catch {
      toast.error("Impossible d'ajouter le réseau social");
    } finally {
      setIsSubmittingSocial(false);
    }
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
              Recherchez un site par nom ou collez directement l'URL du flux RSS.
            </p>

            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <FeedSearch
                query={rssInput}
                setQuery={setRssInput}
                items={detectedFeeds}
                onSelect={handleRssSelect}
                onFollow={async (item) => {
                  try {
                    await rssApi.addRssSource(item.name, item.url, 10, token);
                    toast.success(`${item.name} ajouté`);
                  } catch (error) {
                    console.error("Erreur ajout RSS :", error);
                    toast.error("Erreur ajout RSS");
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center leading-tight">
                <span className="text-xs opacity-70">
                  {isSubmittingRss ? "En cours" : isDetectingRss ? "Analyse" : "Statut"}
                </span>
                <span className="text-sm font-medium">
                  {isSubmittingRss ? "Ajout..." : isDetectingRss ? "Détection..." : "Prêt à suivre"}
                </span>
              </div>
            </div>

            {selectedRss && (
              <div className="mt-3 text-sm text-muted-foreground">
                Source détectée :{" "}
                <span className="text-foreground font-medium">{selectedRss.name}</span>
              </div>
            )}
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
                query={socialInput}
                setQuery={setSocialInput}
                items={[]}
                onSelect={handleSocialSelect}
                onFollow={async (item) => {
                  try {
                    await rssApi.addSocialSource(item.name, item.url, token);
                    toast.success(`${item.name} ajouté`);
                  } catch {
                    toast.error("Erreur ajout réseau social");
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center leading-tight">
                <span className="text-xs opacity-70">
                  {isSubmittingSocial ? "En cours" : isDetectingSocial ? "Analyse" : "Statut"}
                </span>
                <span className="text-sm font-medium">
                  {isSubmittingSocial ? "Ajout..." : isDetectingSocial ? "Détection..." : "Prêt à suivre"}
                </span>
              </div>
            </div>

            {selectedSocial && (
              <div className="mt-3 text-sm text-muted-foreground">
                Source détectée :{" "}
                <span className="text-foreground font-medium">{selectedSocial.name}</span>
              </div>
            )}
          </form>
        )}

        <div>
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-display font-bold text-lg whitespace-nowrap">
              {isDetectingRss
                ? "Recherche en cours…"
                : all.length > 0
                ? "Flux trouvés"
                : rssInput.length >= 3
                ? "Aucun flux trouvé"
                : "Tapez un nom de site pour commencer"}
            </h2>

            {all.length > 0 && (
              <div className="relative flex-1 max-w-xl">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filtrer les résultats…"
                  className="pl-10 h-11"
                />
              </div>
            )}

            {all.length > 0 && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {all.length} flux
              </span>
            )}
          </div>

          {all.length === 0 && !isDetectingRss ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {rssInput.length >= 3
                ? `Aucun flux RSS détecté pour « ${rssInput} ». Essayez avec l'URL directe.`
                : "Entrez le nom d'un site ou média pour détecter ses flux RSS."}
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
                    key={feed.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-smooth",
                      viewMode === "grid" ? "min-h-[84px]" : "min-h-[72px]"
                    )}
                  >
                    <SourceLogo
                      url={feed.url!}
                      name={feed.name}
                      size={40}
                      className="shrink-0"
                      fallbackIcon="rss"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{feed.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{feed.url}</div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant={isFollowed ? "secondary" : "default"}
                      disabled={isFollowed}
                      onClick={async () => {
                        if (isFollowed) return;
                        try {
                          await rssApi.addRssSource(feed.name, feed.url!, 0, token);
                          toggleFollow(feed.name);
                          toast.success(`${feed.name} ajouté`);
                        } catch {
                          toast.error("Erreur lors de l'ajout");
                        }
                      }}
                      className="gap-1.5 shrink-0"
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