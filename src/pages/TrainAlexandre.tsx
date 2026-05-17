import { PageShell } from "@/components/PageShell";
import { Brain, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { articles } from "@/data/articles";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TrainAlexandre = () => {
  const { viewMode } = useViewMode();

  const trainingArticles = articles.slice(0, 5);

  const hasNoArticles = trainingArticles.length === 0;

  return (
    <PageShell
      eyebrow="IA personnalisée"
      title="Entraîner Alexandre"
      meta={
        <span>
          Affinez les recommandations en notant les articles ci-dessous
        </span>
      }
    >
      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Articles notés", value: "128", icon: Brain },
          { label: "Précision actuelle", value: "82%", icon: Sparkles },
          { label: "Sujets prioritaires", value: "6", icon: ThumbsUp },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-5 shadow-soft"
          >
            <s.icon className="w-5 h-5 text-primary mb-3" />

            <div className="text-3xl font-display font-extrabold text-foreground">
              {s.value}
            </div>

            <div className="text-xs text-muted-foreground mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {hasNoArticles ? (
        <EmptyState
          icon={Brain}
          title="Aucun article disponible"
          description="Ajoutez des articles pour commencer à entraîner Alexandre et améliorer les recommandations."
          action={
            <Button asChild>
              <Link to="/">
                Retour à la veille
              </Link>
            </Button>
          }
        />
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4"
              : "space-y-2"
          )}
        >
          {trainingArticles.map((a) => (
            <div
              key={a.id}
              className={cn(
                "bg-card border border-border rounded-xl p-4 hover:shadow-soft transition-smooth",
                viewMode === "grid"
                  ? "flex flex-col gap-4"
                  : "flex items-center gap-4"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {a.source}
                </div>

                <div className="font-semibold text-foreground truncate">
                  {a.title}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary flex items-center justify-center transition-smooth active:scale-95">
                  <ThumbsUp className="w-4 h-4" />
                </button>

                <button className="w-9 h-9 rounded-lg bg-muted hover:bg-destructive hover:text-destructive-foreground text-muted-foreground flex items-center justify-center transition-smooth active:scale-95">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default TrainAlexandre;