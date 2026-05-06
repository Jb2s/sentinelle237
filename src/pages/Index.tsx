import { PageShell } from "@/components/PageShell";
import { ArticleCard } from "@/components/ArticleCard";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { articles } from "@/data/articles";

const Index = () => {
  return (
    <PageShell
      eyebrow="Aujourd'hui · 30 avril 2026"
      title="Fintech Radar"
      meta={
        <>
          <span>1 abonné</span>
          <span>·</span>
          <span>~1 article par semaine</span>
          <span>·</span>
          <span className="text-primary font-semibold">
            {articles.length} nouveautés
          </span>
        </>
      }
      aside={<SynthesisPanel />}
    >
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
          Aujourd'hui
        </h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">
          {articles.length} articles
        </span>
      </div>

      <div className="space-y-1">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </PageShell>
  );
};

export default Index;
