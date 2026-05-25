import { useState, useEffect, useRef } from "react";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SourceLogo } from "@/components/SourceLogo";
import { apiFetch } from "@/api/client";
import {
  Search as SearchIcon,
  Rss,
  FileText,
  Sparkles,
  Globe,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const filters = ["Tout", "Interne", "Web"] as const;
type Filter = (typeof filters)[number];

const trending = ["Cameroun", "Economie", "Sécurité", "Politique", "Santé", "Technologie"];

type InternalArticle = {
  id_article:      string;
  titre:           string;
  nom_source:      string;
  url_origine:     string;
  url_source?:     string;
  date_publication: string;
  score:           number;
  extrait:         string;
  categories?:     string[];
};

type WebArticle = {
  titre:           string;
  url:             string;
  source:          string;
  date_publication?: string;
  description?:    string;
};

type SearchResult = {
  interne?: { articles: InternalArticle[]; total: number };
  externe?: {
    google_news:  WebArticle[];
    bing_news:    WebArticle[];
    duckduckgo:   WebArticle[];
    base_locale:  WebArticle[];
  };
};

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const diffH = Math.floor((Date.now() - d.getTime()) / 3_600_000);
    if (diffH < 1)  return "Il y a moins d'1h";
    if (diffH < 24) return `Il y a ${diffH}h`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch { return iso; }
}

function highlightQuery(text: string, q: string): string {
  // Le backend envoie déjà du HTML surligné via ts_headline
  return text;
}

function InternalCard({ article, q }: { article: InternalArticle; q: string }) {
  const category = article.categories?.[0] ?? null;
  return (
    <li className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-smooth">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
        <SourceLogo
          url={article.url_source ?? article.url_origine}
          name={article.nom_source}
          size={16}
          fallbackIcon="rss"
        />
        <span className="font-semibold text-primary-deep truncate">{article.nom_source}</span>
        {category && <><span>·</span><span>{category}</span></>}
        <span>·</span>
        <span>{formatDate(article.date_publication)}</span>
      </div>
      <h3 className="font-display font-bold text-base leading-snug mb-1.5">
        <a
          href={article.url_origine}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-smooth"
        >
          {article.titre}
        </a>
      </h3>
      {article.extrait && (
        <p
          className="text-sm text-muted-foreground line-clamp-2 [&_mark]:bg-primary/20 [&_mark]:text-foreground [&_mark]:rounded"
          dangerouslySetInnerHTML={{ __html: article.extrait }}
        />
      )}
    </li>
  );
}

function WebCard({ article }: { article: WebArticle }) {
  return (
    <li className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-smooth">
      <div className="flex items-start gap-3">
        <SourceLogo
          url={article.url}
          name={article.source}
          size={32}
          fallbackIcon="rss"
          className="mt-0.5 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span className="font-semibold text-primary-deep truncate">{article.source}</span>
            {article.date_publication && (
              <><span>·</span><span>{formatDate(article.date_publication)}</span></>
            )}
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm leading-snug hover:text-primary transition-smooth flex items-start gap-1.5 group"
          >
            <span className="line-clamp-2">{article.titre}</span>
            <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-60" />
          </a>
          {article.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{article.description}</p>
          )}
        </div>
      </div>
    </li>
  );
}

function WebSection({ label, icon, items }: { label: string; icon: React.ReactNode; items: WebArticle[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">
        {icon}{label}
      </h3>
      <ul className="space-y-2">
        {items.map((a, i) => <WebCard key={i} article={a} />)}
      </ul>
    </div>
  );
}

export default function SearchPage() {
  const [query,     setQuery]     = useState("");
  const [filter,    setFilter]    = useState<Filter>("Tout");
  const [result,    setResult]    = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const q = query.trim();

  useEffect(() => {
    if (!q || q.length < 2) {
      setResult(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint =
          filter === "Interne" ? `/api/search/interne?q=${encodeURIComponent(q)}&limit=20` :
          filter === "Web"     ? `/api/search/web?q=${encodeURIComponent(q)}&lang=fr` :
                                 `/api/search?q=${encodeURIComponent(q)}&lang=fr`;

        const res  = await apiFetch<any>(endpoint);
        const data = res?.data ?? res;
        setResult(data);
      } catch (err: any) {
        setError(err?.message ?? "Erreur de recherche");
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q, filter]);

  const internalArticles = result?.interne?.articles ?? (result as any)?.articles ?? [];
  const internalTotal    = result?.interne?.total    ?? (result as any)?.total    ?? 0;
  const externe          = result?.externe;

  const webItems = externe
    ? [
        ...(externe.google_news  ?? []),
        ...(externe.bing_news    ?? []),
        ...(externe.duckduckgo   ?? []),
        ...(externe.base_locale  ?? []),
      ]
    : [];

  const totalResults =
    (filter !== "Web"     ? internalArticles.length : 0) +
    (filter !== "Interne" ? webItems.length          : 0);

  return (
    <PageShell
      eyebrow="Recherche"
      title="Rechercher"
      meta={<span>Explorez articles, flux et synthèses dans toute votre veille.</span>}
    >
      <div className="space-y-8">
        {/* Barre de recherche */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="relative">
            <SearchIcon className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            {isLoading && (
              <Loader2 className="w-4 h-4 text-primary animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
            )}
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tapez un mot-clé, un sujet, une source…"
              className="pl-12 pr-12 h-14 text-base"
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

        {/* État vide — suggestions */}
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
                Aucune recherche récente.
              </p>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Résultats */}
        {q && !isLoading && result && (
          <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
              {totalResults} résultat{totalResults > 1 ? "s" : ""} pour «{" "}
              <span className="font-semibold text-foreground">{query}</span> »
            </p>

            {/* Résultats internes */}
            {filter !== "Web" && internalArticles.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Articles internes
                  <span className="text-xs text-muted-foreground font-normal">
                    ({internalTotal})
                  </span>
                </h2>
                <ul className="space-y-3">
                  {internalArticles.map((a) => (
                    <InternalCard key={a.id_article} article={a} q={q} />
                  ))}
                </ul>
              </section>
            )}

            {/* Résultats web */}
            {filter !== "Interne" && externe && (
              <section className="space-y-6">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Actualités web
                </h2>
                <WebSection
                  label="Google News"
                  icon={<Globe className="w-3 h-3" />}
                  items={externe.google_news}
                />
                <WebSection
                  label="Bing News"
                  icon={<Globe className="w-3 h-3" />}
                  items={externe.bing_news}
                />
                <WebSection
                  label="DuckDuckGo"
                  icon={<Globe className="w-3 h-3" />}
                  items={externe.duckduckgo}
                />
                <WebSection
                  label="Sources locales"
                  icon={<Rss className="w-3 h-3" />}
                  items={externe.base_locale}
                />
              </section>
            )}

            {totalResults === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Aucun résultat pour « {query} ».
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
