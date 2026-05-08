import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";
import { feeds } from "@/data/articles";
import { Search as SearchIcon, Rss, FileText, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const filters = ["Tout", "Articles", "Flux"] as const;
type Filter = (typeof filters)[number];

const trending = ["Stripe", "Revolut", "Bitcoin", "Bâle", "Mastercard", "Open banking"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Tout");

  const q = query.trim().toLowerCase();

  const matchedArticles = useMemo(() => {
    if (!q) return [];
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [q]);

  const matchedFeeds = useMemo(() => {
    if (!q) return [];
    return feeds.filter((f) => f.name.toLowerCase().includes(q));
  }, [q]);

  const showArticles = filter === "Tout" || filter === "Articles";
  const showFeeds = filter === "Tout" || filter === "Flux";
  const totalResults =
    (showArticles ? matchedArticles.length : 0) +
    (showFeeds ? matchedFeeds.length : 0);

  return (
    <PageShell
      eyebrow="Recherche"
      title="Rechercher"
      meta={
        <span>
          Explorez articles, flux et synthèses dans toute votre veille.
        </span>
      }
    >
      <div className="space-y-8">
        {/* Search input */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="relative">
            <SearchIcon className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tapez un mot-clé, un sujet, une source…"
              className="pl-12 h-14 text-base"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-primary-deep"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* No query: trending */}
        {!q && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Tendances
              </div>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="px-3 py-1.5 rounded-full text-sm bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Recherches récentes
              </div>
              <p className="text-sm text-muted-foreground">
                Aucune recherche récente. Lancez votre première recherche ci-dessus.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {q && (
          <div className="space-y-8">
            <div className="text-sm text-muted-foreground">
              {totalResults} résultat{totalResults > 1 ? "s" : ""} pour «{" "}
              <span className="font-semibold text-foreground">{query}</span> »
            </div>

            {showFeeds && matchedFeeds.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                  <Rss className="w-4 h-4 text-primary" /> Flux
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchedFeeds.map((feed) => (
                    <li key={feed.name}>
                      <Link
                        to={`/flux/${slugify(feed.name)}`}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-smooth"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground",
                            feed.color
                          )}
                        >
                          <Rss className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {feed.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {feed.count} articles
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {showArticles && matchedArticles.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Articles
                </h2>
                <ul className="space-y-3">
                  {matchedArticles.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-smooth"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                        <span className="font-semibold text-primary-deep">
                          {a.source}
                        </span>
                        <span>·</span>
                        <span>{a.category}</span>
                        <span>·</span>
                        <span>{a.publishedAt}</span>
                      </div>
                      <h3 className="font-display font-bold text-base leading-snug mb-1.5">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {a.excerpt}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {totalResults === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Aucun résultat ne correspond à votre recherche.
                </p>
                <Button variant="secondary" onClick={() => setQuery("")}>
                  Effacer
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}