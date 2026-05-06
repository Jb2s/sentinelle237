import { useParams, Navigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { feeds, articles, Article } from "@/data/articles";
import { Rss, ExternalLink, BellRing, Share2 } from "lucide-react";
import { SynthesisPanel } from "@/components/SynthesisPanel";

// Slug helper - keep in sync with sidebar
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Mock articles per feed (deterministic seed from name)
function buildFeedArticles(name: string, color: string): Article[] {
  const base = articles.slice(0, 4);
  return base.map((a, i) => ({
    ...a,
    id: `${slugify(name)}-${i}`,
    source: name,
    sourceColor: `from-primary-deep to-primary`,
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
  const feed = feeds.find((f) => slugify(f.name) === slug);

  if (!feed) return <Navigate to="/" replace />;

  const feedArticles = buildFeedArticles(feed.name, feed.color);

  return (
    <PageShell
      eyebrow={`Flux · Finance & Banking`}
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
      {/* Feed header card */}
      <div className="rounded-2xl border border-border bg-card shadow-soft p-6 mb-6 flex items-start gap-5">
        <div
          className={`w-16 h-16 rounded-2xl ${feed.color} flex items-center justify-center text-primary-foreground shadow-soft`}
        >
          <Rss className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
              Source RSS
            </span>
            <span>·</span>
            <span>~{Math.max(1, Math.round(feed.count / 30))} articles / jour</span>
          </div>
          <h2 className="font-display font-bold text-2xl mt-2 text-foreground">
            {feed.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
            Suivi automatisé du flux <strong className="text-foreground">{feed.name}</strong>.
            Tous les nouveaux articles publiés apparaissent ici en temps réel et
            sont indexés par Leo pour la synthèse quotidienne.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-deep transition-smooth">
            <BellRing className="w-3.5 h-3.5" /> Suivi(e)
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-smooth">
            <Share2 className="w-3.5 h-3.5" /> Partager
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-smooth">
            <ExternalLink className="w-3.5 h-3.5" /> Site
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
          Derniers articles
        </h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">
          {feedArticles.length} articles
        </span>
      </div>

      <div className="space-y-1">
        {feedArticles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </PageShell>
  );
};

export default Feed;