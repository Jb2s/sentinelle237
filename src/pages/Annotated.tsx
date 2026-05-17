import { PageShell } from "@/components/PageShell";
import { articles } from "@/data/articles";
import { PenLine, Quote } from "lucide-react";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const notes = articles.slice(0, 4).map((a, i) => ({
  ...a,
  highlight: [
    "Marché en consolidation rapide, opportunité B2B.",
    "Nouvelle réglementation à anticiper sur Q3.",
    "Acquisition stratégique : signal fort du secteur.",
    "API ouverte = nouvel avantage compétitif.",
  ][i],
}));

const Annotated = () => {
  const { viewMode } = useViewMode();

  const hasNoNotes = notes.length === 0;

  return (
    <PageShell
      eyebrow="Notes & surlignages"
      title="Annotés"
      meta={
        <span>
          {notes.length} annotations · classées par date
        </span>
      }
    >
      {hasNoNotes ? (
        <EmptyState
          icon={PenLine}
          title="Aucune annotation"
          description="Surlignez des passages dans vos articles pour retrouver ici vos notes et insights."
          action={
            <Button asChild>
              <Link to="/">
                Retour aux articles
              </Link>
            </Button>
          }
        />
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
              : "space-y-3"
          )}
        >
          {notes.map((n) => (
            <div
              key={n.id}
              className="bg-card border border-border rounded-xl p-5 shadow-soft hover:shadow-elegant transition-smooth"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <PenLine className="w-3.5 h-3.5 text-primary" />

                <span className="font-semibold text-primary-deep">
                  {n.source}
                </span>

                <span>·</span>

                <span>{n.publishedAt}</span>
              </div>

              <h3 className="font-display font-bold text-lg text-foreground mb-3">
                {n.title}
              </h3>

              <div className="flex gap-3 bg-secondary/60 border-l-4 border-primary rounded-r-lg p-3">
                <Quote className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />

                <p className="text-sm text-primary-deep italic">
                  {n.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default Annotated;