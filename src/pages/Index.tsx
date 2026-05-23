import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { articles } from "@/data/articles";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { Rss, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const formatGroupDate = (dateString: string) => {
  const articleDate = new Date(dateString);

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isToday = articleDate.toDateString() === today.toDateString();
  const isYesterday = articleDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Aujourd’hui";
  if (isYesterday) return "Hier";

  return articleDate.toLocaleDateString("fr-FR");
};

const groupArticlesByDate = () => {
  return articles.reduce((groups, article) => {
    const label = formatGroupDate(article.date);

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(article);

    return groups;
  }, {} as Record<string, typeof articles>);
};

const Index = () => {
  const { viewMode } = useViewMode();

  const groupedArticles = groupArticlesByDate();

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasNoArticles = Object.keys(groupedArticles).length === 0;

  return (
    <PageShell
      eyebrow={`Aujourd'hui · ${today}`}
      title="Sentinelle 237"
      meta={
        <>
          <span>Veille intelligente des flux RSS</span>
          <span>·</span>
          <span className="text-primary font-semibold">
            {articles.length} nouveautés
          </span>
        </>
      }
      aside={<SynthesisPanel />}
      
    >
      {hasNoArticles ? (
        <EmptyState
          icon={Rss}
          title="Aucun flux ajouté"
          description="Vous n’avez encore ajouté aucun flux RSS. Cliquez sur Ajouter pour suivre les flux que vous aimez."
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
        Object.entries(groupedArticles).map(([group, items]) => (
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
              {items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ))
      )}
    </PageShell>
  );
};

export default Index;