import { useParams, Navigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { feeds, articles, Article } from "@/data/articles";
import { Rss, ExternalLink, BellMinus } from "lucide-react";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const formatGroupDate = (dateString: string) => {
  const articleDate = new Date(dateString);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (articleDate.toDateString() === today.toDateString()) {
    return "Aujourd’hui";
  }

  if (articleDate.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }

  return articleDate.toLocaleDateString("fr-FR");
};

const groupArticlesByDate = (articles: Article[]) => {
  return articles.reduce((groups, article) => {
    const label = formatGroupDate(article.date);

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(article);

    return groups;
  }, {} as Record<string, Article[]>);
};

function buildFeedArticles(name: string): Article[] {
  const base = articles.slice(0, 4);

  return base.map((a, i) => ({
    ...a,

    id: `${slugify(name)}-${i}`,

    source: name,

    sourceColor: "from-primary-deep to-primary",

    date:
      i === 0
        ? "2026-05-17T10:00:00"
        : i === 1
        ? "2026-05-17T08:00:00"
        : i === 2
        ? "2026-05-16T15:00:00"
        : "2026-05-15T11:00:00",

    publishedAt:
      i === 0
        ? "Il y a 1h"
        : i === 1
        ? "Il y a 3h"
        : i === 2
        ? "Hier"
        : "15/05/2026",

    title:
      i === 0
        ? `${name} : analyse hebdo des tendances clés du marché`
        : i === 1
        ? `Décryptage — ce qu'il faut retenir cette semaine selon ${name}`
        : i === 2
        ? `${name} publie son rapport mensuel : chiffres et perspectives`
        : `Édito ${name} — vers une nouvelle phase de consolidation`,
  }));
}

const Feed = () => {
  const { slug } = useParams();

  const { viewMode } = useViewMode();

  const isMobile = useIsMobile();

  const feed = feeds.find((f) => slugify(f.name) === slug);

  if (!feed) {
    return <Navigate to="/" replace />;
  }

  const feedArticles = buildFeedArticles(feed.name);

  const groupedArticles = groupArticlesByDate(feedArticles);

  return (
    <PageShell
      eyebrow="Flux · Finance & Banking"
      title={feed.name}
      meta={
        <>
          <span>{feed.count} articles</span>

          <span>·</span>

          <span>Mis à jour il y a 12 min</span>

          <span>·</span>

          <span className="text-primary font-semibold">
            {feedArticles.length} nouveautés
          </span>
        </>
      }
      aside={<SynthesisPanel />}
    >
<div
  className={cn(
    "rounded-2xl border border-border bg-card shadow-soft mb-6",
    "flex gap-5",
    isMobile
      ? "flex-col p-4"
      : "items-start p-6"
  )}
>
  {/* ICON */}
  <div
    className={cn(
      "rounded-2xl flex items-center justify-center text-primary-foreground shadow-soft flex-shrink-0",
      feed.color,
      isMobile
        ? "w-14 h-14"
        : "w-16 h-16"
    )}
  >
    <Rss
      className={cn(
        isMobile
          ? "w-6 h-6"
          : "w-7 h-7"
      )}
    />
  </div>

  {/* CONTENT */}
  <div className="flex-1 min-w-0">
    <div
      className={cn(
        "flex text-xs text-muted-foreground",
        isMobile
          ? "flex-wrap gap-1"
          : "items-center gap-2"
      )}
    >
      <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
        Source RSS
      </span>

      <span>·</span>

      <span>
        ~{Math.max(1, Math.round(feed.count / 30))} articles / jour
      </span>
    </div>

    <h2
      className={cn(
        "font-display font-bold text-foreground mt-2 break-words",
        isMobile
          ? "text-xl"
          : "text-2xl"
      )}
    >
      {feed.name}
    </h2>

    <p
      className={cn(
        "text-sm text-muted-foreground mt-2 leading-relaxed",
        !isMobile && "max-w-2xl"
      )}
    >
      Suivi automatisé du flux{" "}
      <strong className="text-foreground">
        {feed.name}
      </strong>
      . Tous les nouveaux articles publiés apparaissent ici en temps réel et
      sont indexés pour la synthèse quotidienne.
    </p>
  </div>

  {/* ACTIONS */}
  <div
    className={cn(
      "flex gap-2",
      isMobile
        ? "flex-row w-full"
        : "flex-col"
    )}
  >
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-deep transition-smooth",
        isMobile
          ? "flex-1 px-3 py-2"
          : "px-3 py-1.5"
      )}
    >
      <BellMinus className="w-3.5 h-3.5" />
      Ne plus suivre
    </button>

    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-smooth",
        isMobile
          ? "flex-1 px-3 py-2"
          : "px-3 py-1.5"
      )}
    >
      <ExternalLink className="w-3.5 h-3.5" />
      Site
    </button>
  </div>
</div>

      {Object.entries(groupedArticles).map(([group, items]) => (
        <section key={group} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
              {group}
            </h2>

            <div className="flex-1 h-px bg-border" />

            <span className="text-xs text-muted-foreground">
              {items.length} articles
            </span>
          </div>

          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6"
                : "space-y-1"
            )}
          >
            {items.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
};

export default Feed;