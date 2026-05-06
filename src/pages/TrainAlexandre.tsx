import { PageShell } from "@/components/PageShell";
import { Brain, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { articles } from "@/data/articles";

const TrainAlexandre = () => (
  <PageShell
    eyebrow="IA personnalisée"
    title="Entraîner Alexandre"
    meta={<span>Affinez les recommandations en notant les articles ci-dessous</span>}
  >
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
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="space-y-2">
      {articles.slice(0, 5).map((a) => (
        <div
          key={a.id}
          className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-soft transition-smooth"
        >
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">{a.source}</div>
            <div className="font-semibold text-foreground truncate">{a.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary flex items-center justify-center transition-smooth">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-muted hover:bg-destructive hover:text-destructive-foreground text-muted-foreground flex items-center justify-center transition-smooth">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </PageShell>
);

export default TrainAlexandre;