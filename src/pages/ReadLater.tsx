import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { Bookmark } from "lucide-react";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const saved = articles.slice(0, 3);

const ReadLater = () => {
  const { viewMode } = useViewMode();

  const hasNoSavedArticles = saved.length === 0;

  return (
    <PageShell
      eyebrow="Bibliothèque · Hors-ligne"
      title="À lire plus tard"
      meta={
        <span>
          {saved.length} articles enregistrés · synchronisés
        </span>
      }
      aside={<SynthesisPanel />}
    >
      {hasNoSavedArticles ? (
        <EmptyState
          icon={Bookmark}
          title="Aucun article enregistré"
          description="Ajoutez des articles à votre bibliothèque pour les retrouver ici, même hors connexion."
          action={
            <Button asChild className="gap-2">
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
              ? "grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6"
              : "space-y-1"
          )}
        >
          {saved.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default ReadLater;