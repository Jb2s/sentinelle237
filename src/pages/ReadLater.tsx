import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { Bookmark } from "lucide-react";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";
import { SynthesisPanel } from "@/components/SynthesisPanel";

const saved = articles.slice(0, 3);

const ReadLater = () => {
  const { viewMode } = useViewMode();

  return (
    <PageShell
      eyebrow="Bibliothèque · Hors-ligne"
      title="À lire plus tard"
      meta={<span>{saved.length} articles enregistrés · synchronisés</span>}
      aside={<SynthesisPanel />}
    >
      {saved.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl py-20 text-center text-muted-foreground">
          <Bookmark className="w-8 h-8 mx-auto mb-3 opacity-60" />
          Aucun article enregistré pour le moment
        </div>
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