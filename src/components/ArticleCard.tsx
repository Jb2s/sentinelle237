import { useState, useEffect } from "react";
import {
  Clock,
  Bookmark,
  Eye,
  PenLine,
  Plus,
  ExternalLink,
} from "lucide-react";

import type { Article } from "@/types/article.types";
import { articlesApi } from "@/api/articles.api";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useLocation } from "react-router-dom";
import { useViewMode } from "@/context/ViewModeContext";

const SOURCE_COLORS = [
  "from-primary to-primary-deep",
  "from-highlight to-primary",
  "from-primary-glow to-highlight",
  "from-slate-600 to-slate-800",
  "from-emerald-500 to-teal-700",
  "from-violet-500 to-purple-700",
  "from-rose-500 to-pink-700",
  "from-amber-500 to-orange-600",
];

function sourceColor(name: string | null | undefined): string {
  if (!name) return SOURCE_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return SOURCE_COLORS[hash % SOURCE_COLORS.length];
}

function estimateReadTime(text: string | null | undefined): string {
  if (!text) return "1 min";
  const minutes = Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  return `${minutes} min`;
}

function formatPublishedAt(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const date  = new Date(iso);
    const now   = new Date();
    const diffH = Math.floor((now.getTime() - date.getTime()) / 3_600_000);
    const diffD = Math.floor(diffH / 24);

    if (diffH < 1)   return "Il y a moins d'1h";
    if (diffH < 24)  return `Il y a ${diffH}h`;
    if (diffD === 1) return "Hier";
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function ArticleCard({ article }: { article: Article }) {
  const [isRead,       setIsRead]       = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [note,         setNote]         = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [open,         setOpen]         = useState(false);

  const location     = useLocation();
  const { viewMode } = useViewMode();

  const source       = article.nom_source ?? "Source inconnue";
  const color        = sourceColor(source);
  const readTime     = estimateReadTime(article.contenu_brut);
  const publishedAt  = formatPublishedAt(article.date_publication);
  const category     = article.categories?.[0] ?? "Général";
  const excerpt      = article.description ?? article.resume_auto ?? "";
  const articleUrl   = article.url_origine ?? "#";
  const initials     = source.split(" ")[0].slice(0, 2).toUpperCase();

  useEffect(() => {
    const saved = localStorage.getItem(`bookmark-${article.id_article}`);
    if (saved) setIsBookmarked(true);
  }, [article.id_article]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next);
    if (next) {
      articlesApi.save(article.id_article).catch(() => {});
      localStorage.setItem(`bookmark-${article.id_article}`, "true");
    } else {
      articlesApi.unsave(article.id_article).catch(() => {});
      localStorage.removeItem(`bookmark-${article.id_article}`);
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    setIsSavingNote(true);
    try {
      await articlesApi.upsertNote(article.id_article, note.trim());
      setIsAnnotating(false);
    } catch {
      // silencieux — note non critique
    } finally {
      setIsSavingNote(false);
    }
  };

  const hasActiveState = isRead || isAnnotating || isBookmarked;

  const actionButtonClass = (active: boolean) =>
    cn(
      "p-2 rounded-full backdrop-blur transition-all duration-200 shadow-soft",
      "focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95",
      active
        ? "bg-primary text-primary-foreground ring-2 ring-primary/30 scale-105"
        : "bg-background/80 hover:bg-primary hover:text-primary-foreground"
    );

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className={cn(
          "group relative cursor-pointer rounded-2xl border transition-all duration-300",
          "p-4 sm:p-5 overflow-hidden bg-background/80",
          "hover:bg-card hover:shadow-xl hover:border-primary/20",
          hasActiveState ? "border-border shadow-md" : "border-transparent",
          isRead && "opacity-75"
        )}
      >
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); setIsRead((p) => !p); }} className={actionButtonClass(isRead)} title="Marquer comme lu">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsAnnotating((p) => !p); }} className={actionButtonClass(isAnnotating)} title="Annoter">
            <PenLine className="w-4 h-4" />
          </button>
          {location.pathname !== "/a-lire-plus-tard" && (
            <button onClick={toggleBookmark} className={actionButtonClass(isBookmarked)} title={isBookmarked ? "Retirer" : "Sauvegarder"}>
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className={cn("flex gap-4 sm:gap-5", viewMode === "grid" ? "flex-col" : "flex-row")}>
          <div className="flex-shrink-0">
            {article.vignette ? (
              <img
                src={article.vignette}
                alt={article.titre}
                className={cn(viewMode === "grid" ? "w-full h-28" : "w-24 sm:w-28 h-24 sm:h-28", "rounded-xl object-cover shadow-soft")}
              />
            ) : (
              <div className={cn(
                viewMode === "grid" ? "w-full h-28 text-2xl" : "w-24 sm:w-28 h-24 sm:h-28 text-xl sm:text-2xl",
                "bg-gradient-to-br shadow-soft flex items-center justify-center",
                "text-primary-foreground font-display font-bold rounded-xl", color
              )}>
                <span className="opacity-90">{initials}</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{category}</span>
              <span className="text-muted-foreground hidden sm:inline">·</span>
              <span className="text-muted-foreground font-medium">{source}</span>
              {!isRead && <div className="w-2 h-2 rounded-full bg-primary ml-1" />}
            </div>

            <h3 className="mt-2 font-display font-bold text-[16px] sm:text-[17px] leading-snug text-foreground group-hover:text-primary-deep transition-smooth line-clamp-2">
              {article.titre}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime}</span>
              <span className="hidden sm:inline">·</span>
              <span>{publishedAt}</span>
              {article.zone && <><span className="hidden sm:inline">·</span><span className="capitalize">{article.zone}</span></>}
            </div>

            {excerpt && <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{excerpt}</p>}
          </div>
        </div>

        <div
          className={cn("transition-all duration-300 overflow-hidden", isAnnotating ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={5000} placeholder="Ajouter une note..."
              className="w-full min-h-24 p-3 pr-12 text-sm rounded-lg border bg-background resize-none focus:outline-none" />
            <button type="button" disabled={isSavingNote || !note.trim()} onClick={saveNote}
              className="absolute right-2 bottom-2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-deep transition-smooth active:scale-95 disabled:opacity-40">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(92vw,42rem)] max-h-[85vh] overflow-y-auto backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{category}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground font-medium">{source}</span>
            </div>
            <DialogTitle className="font-display font-bold text-2xl leading-tight">
              <a href={articleUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-foreground hover:text-primary-deep transition-smooth group/link">
                <span className="underline-offset-4 group-hover/link:underline">{article.titre}</span>
                <ExternalLink className="w-5 h-5 mt-1 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
              </a>
            </DialogTitle>
            <DialogDescription className="flex items-center gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime}</span>
              <span>·</span>
              <span>{publishedAt}</span>
            </DialogDescription>
          </DialogHeader>

          {article.vignette ? (
            <img src={article.vignette} alt={article.titre} className="w-full h-32 sm:h-40 rounded-xl object-cover shadow-soft" />
          ) : (
            <div className={cn("w-full h-32 sm:h-40 rounded-xl bg-gradient-to-br shadow-soft flex items-center justify-center text-primary-foreground font-display font-bold text-3xl sm:text-4xl", color)}>
              <span className="opacity-90">{source.split(" ")[0].slice(0, 3).toUpperCase()}</span>
            </div>
          )}

          <div className="space-y-4 text-sm leading-relaxed text-foreground">
            {excerpt && <p className="text-base text-muted-foreground italic">{excerpt}</p>}
            {article.contenu_brut && <div className="whitespace-pre-line">{article.contenu_brut}</div>}
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <a href={articleUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-deep transition-smooth">
              Lire sur {source}<ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
