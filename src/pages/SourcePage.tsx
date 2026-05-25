import { useEffect, useRef, useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { SourceLogo } from "@/components/SourceLogo";
import { EmptyState } from "@/components/EmptyState";
import { useViewMode } from "@/context/ViewModeContext";
import { articlesApi } from "@/api/articles.api";
import { apiFetch } from "@/api/client";
import { cn } from "@/lib/utils";
import { Rss, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types/article.types";

const PAGE_SIZE = 20;

function formatGroupDate(isoDate: string): string {
  const d         = new Date(isoDate);
  const today     = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString())     return "Aujourd'hui";
  if (d.toDateString() === yesterday.toDateString()) return "Hier";

  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function groupByDate(articles: Article[]): [string, Article[]][] {
  const map = new Map<string, Article[]>();
  for (const a of articles) {
    const label = formatGroupDate(a.date_publication);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(a);
  }
  return Array.from(map.entries());
}

export default function SourcePage() {
  const { id } = useParams<{ id: string }>();
  const { viewMode } = useViewMode();

  const [source,        setSource]        = useState<{ nom_source: string; url_source: string } | null>(null);
  const [articles,      setArticles]      = useState<Article[]>([]);
  const [total,         setTotal]         = useState(0);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [hasMore,       setHasMore]       = useState(false);

  const offsetRef   = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const load = async (offset: number, append: boolean) => {
    if (!id) return;

    append ? setIsLoadingMore(true) : setIsLoading(true);
    setError(null);

    try {
      const res  = await articlesApi.getBySource(id, { limit: PAGE_SIZE, offset });
      const data = res?.articles ?? (res as any)?.articles ?? [];
      const tot  = res?.total    ?? (res as any)?.total    ?? 0;

      setArticles((prev) => append ? [...prev, ...data] : data);
      setTotal(tot);
      setHasMore(offset + PAGE_SIZE < tot);
      offsetRef.current = offset + data.length;
    } catch (err: any) {
      setError(err?.message ?? "Erreur de chargement");
    } finally {
      append ? setIsLoadingMore(false) : setIsLoading(false);
    }
  };

  // Charger les infos de la source
  useEffect(() => {
    if (!id) return;
    apiFetch<any>(`/api/sources/${id}`)
      .then((res) => setSource(res?.data ?? res))
      .catch(() => {});
  }, [id]);

  // Charger les articles
  useEffect(() => {
    if (!id) return;
    offsetRef.current = 0;
    setArticles([]);
    load(0, false);
  }, [id]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    load(offsetRef.current, true);
  }, [isLoadingMore, hasMore, id]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasMore) return;
      observerRef.current = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) loadMore(); },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  const sourceName = source?.nom_source ?? "Source";
  const sourceUrl  = source?.url_source ?? "";
  const grouped    = groupByDate(articles);

  return (
    <PageShell
      eyebrow="Flux RSS"
      title={sourceName}
      meta={
        <>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground">
            <Link to="/"><ArrowLeft className="w-3.5 h-3.5" />Retour</Link>
          </Button>
          {!isLoading && (
            <>
              <span>·</span>
              <span className="text-primary font-semibold">{total} articles</span>
            </>
          )}
        </>
      }
    >
      {/* En-tête source */}
      {source && (
        <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl border border-border bg-card">
          <SourceLogo
            url={sourceUrl}
            name={sourceName}
            size={48}
            fallbackIcon="rss"
          />
          <div className="min-w-0">
            <h2 className="font-display font-bold text-lg leading-snug truncate">
              {sourceName}
            </h2>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary truncate block transition-smooth"
            >
              {sourceUrl}
            </a>
          </div>
        </div>
      )}

      {/* États */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <EmptyState
          icon={Rss}
          title="Aucun article"
          description="Ce flux ne contient pas encore d'articles collectés."
          action={
            <Button asChild variant="outline">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          }
        />
      )}

      {/* Articles groupés */}
      {!isLoading && !error && articles.length > 0 && (
        <>
          {grouped.map(([group, items]) => (
            <section key={group} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                  {group}
                </h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {items.length} article{items.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
                  : "space-y-1"
              )}>
                {items.map((article) => (
                  <ArticleCard key={article.id_article} article={article} />
                ))}
              </div>
            </section>
          ))}

          <div ref={sentinelRef} className="h-4" />

          {isLoadingMore && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-xs text-muted-foreground py-6">
              Tous les articles sont affichés
            </p>
          )}
        </>
      )}
    </PageShell>
  );
}
