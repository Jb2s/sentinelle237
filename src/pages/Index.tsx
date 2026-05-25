import { useRef, useCallback } from "react";
import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { useViewMode } from "@/context/ViewModeContext";
import { useArticles } from "@/hooks/useArticles";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { Rss, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Article } from "@/types/article.types";

function formatGroupDate(isoDate: string): string {
  const articleDate = new Date(isoDate);
  const today       = new Date();
  const yesterday   = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (articleDate.toDateString() === today.toDateString())     return "Aujourd'hui";
  if (articleDate.toDateString() === yesterday.toDateString()) return "Hier";

  return articleDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
  });
}

function groupByDate(articles: Article[]): [string, Article[]][] {
  const map = new Map<string, Article[]>();

  for (const article of articles) {
    const label = formatGroupDate(article.date_publication);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(article);
  }

  return Array.from(map.entries());
}

const Index = () => {
  const { viewMode } = useViewMode();
  const { articles, total, isLoading, isLoadingMore, error, hasMore, loadMore } = useArticles();

  // Intersection observer pour le chargement automatique au scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
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

  const today = new Date().toLocaleDateString("fr-FR", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });

  const grouped = groupByDate(articles);

  if (isLoading) {
    return (
      <PageShell
        eyebrow={`Aujourd'hui · ${today}`}
        title="Sentinelle 237"
        meta={<span>Chargement des articles…</span>}
        aside={<SynthesisPanel />}
      >
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell
        eyebrow={`Aujourd'hui · ${today}`}
        title="Sentinelle 237"
        meta={<span className="text-destructive">Erreur de chargement</span>}
        aside={<SynthesisPanel />}
      >
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={`Aujourd'hui · ${today}`}
      title="Sentinelle 237"
      meta={
        <>
          <span>Veille intelligente des flux RSS</span>
          <span>·</span>
          <span className="text-primary font-semibold">{total} articles</span>
        </>
      }
      aside={<SynthesisPanel />}
    >
      {articles.length === 0 ? (
        <EmptyState
          icon={Rss}
          title="Aucun flux ajouté"
          description="Vous n'avez encore ajouté aucun flux RSS. Cliquez sur Ajouter pour suivre les flux que vous aimez."
          action={
            <Button asChild className="gap-2">
              <Link to="/ajouter-flux">
                <Plus className="w-4 h-4" />
                Ajouter un flux
              </Link>
            </Button>
          }
        />
      ) : (
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

              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6"
                    : "space-y-1"
                )}
              >
                {items.map((article) => (
                  <ArticleCard key={article.id_article} article={article} />
                ))}
              </div>
            </section>
          ))}

          {/* Sentinel pour l'infinite scroll */}
          <div ref={sentinelRef} className="h-4" />

          {isLoadingMore && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!hasMore && articles.length > 0 && (
            <p className="text-center text-xs text-muted-foreground py-6">
              Tous les articles sont affichés
            </p>
          )}
        </>
      )}
    </PageShell>
  );
};

export default Index;
