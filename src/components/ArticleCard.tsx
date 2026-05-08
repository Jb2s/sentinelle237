import { useState, useEffect } from "react";
import { Clock, Bookmark, Eye, PenLine, Plus, ExternalLink } from "lucide-react";
import type { Article } from "@/data/articles";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocation } from "react-router-dom";

export function ArticleCard({ article }: { article: Article }) {
  const [isRead, setIsRead] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(`bookmark-${article.id}`);
    if (saved) setIsBookmarked(true);
  }, [article.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !isBookmarked;
    setIsBookmarked(newValue);
    if (newValue) localStorage.setItem(`bookmark-${article.id}`, "true");
    else localStorage.removeItem(`bookmark-${article.id}`);
  };

  const hasActiveState = isRead || isAnnotating || isBookmarked;
  const articleUrl = article.url ?? "#";

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className={cn(
          "group relative cursor-pointer rounded-2xl border transition-all duration-300",
          "p-4 sm:p-5 overflow-hidden",
          "bg-background/80 hover:bg-card hover:shadow-lg hover:-translate-y-0.5",
          hasActiveState ? "border-border shadow-md" : "border-transparent",
        )}
      >
        <div
          className="absolute top-3 right-3 z-10 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRead((p) => !p);
            }}
            className={cn(
              "p-2 rounded-full backdrop-blur transition shadow-soft",
              isRead
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 hover:bg-primary hover:text-primary-foreground",
            )}
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAnnotating((p) => !p);
            }}
            className={cn(
              "p-2 rounded-full backdrop-blur transition shadow-soft",
              isAnnotating
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 hover:bg-primary hover:text-primary-foreground",
            )}
          >
            <PenLine className="w-4 h-4" />
          </button>

          {location.pathname !== "/a-lire-plus-tard" && (
            <button
              onClick={toggleBookmark}
              className={cn(
                "p-2 rounded-full backdrop-blur transition shadow-soft",
                isBookmarked
                  ? "bg-green-500 text-white hover:bg-green-500"
                  : "bg-background/80 hover:bg-primary hover:text-white",
              )}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-full sm:w-24 md:w-28 h-24 sm:h-24 md:h-28 rounded-xl",
                "bg-gradient-to-br shadow-soft flex items-center justify-center",
                "text-primary-foreground font-display font-bold",
                "text-xl sm:text-2xl",
                article.sourceColor,
              )}
            >
              <span className="opacity-90">
                {article.source.split(" ")[0].slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                {article.category}
              </span>
              <span className="text-muted-foreground hidden sm:inline">·</span>
              <span className="text-muted-foreground font-medium">
                {article.source}
              </span>
            </div>

            <h3 className="mt-2 font-display font-bold text-[16px] sm:text-[17px] leading-snug text-foreground group-hover:text-primary-deep transition-smooth line-clamp-2">
              {article.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
              <span className="hidden sm:inline">·</span>
              <span>{article.publishedAt}</span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            isAnnotating ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <textarea
              placeholder="Ajouter une note..."
              className="w-full min-h-24 p-3 pr-12 text-sm rounded-lg border bg-background resize-none focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-2 bottom-2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-deep transition-smooth"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(92vw,42rem)] max-h-[85vh] overflow-y-auto backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                {article.category}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground font-medium">
                {article.source}
              </span>
            </div>

            <DialogTitle className="font-display font-bold text-2xl leading-tight">
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-foreground hover:text-primary-deep transition-smooth group/link"
              >
                <span className="underline-offset-4 group-hover/link:underline">
                  {article.title}
                </span>
                <ExternalLink className="w-5 h-5 mt-1 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
              </a>
            </DialogTitle>

            <DialogDescription className="flex items-center gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
              <span>·</span>
              <span>{article.publishedAt}</span>
            </DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              "w-full h-32 sm:h-40 rounded-xl bg-gradient-to-br shadow-soft flex items-center justify-center",
              "text-primary-foreground font-display font-bold text-3xl sm:text-4xl",
              article.sourceColor,
            )}
          >
            <span className="opacity-90">
              {article.source.split(" ")[0].slice(0, 3).toUpperCase()}
            </span>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-foreground">
            <p className="text-base text-muted-foreground italic">
              {article.excerpt}
            </p>
            {article.content && (
              <div className="whitespace-pre-line">{article.content}</div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-deep transition-smooth"
            >
              Lire sur {article.source}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}