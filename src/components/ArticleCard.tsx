import { Article } from "@/data/articles";
import { cn } from "@/lib/utils";
import { Clock, Bookmark, Eye, PenLine, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export function ArticleCard({ article }: { article: Article }) {
  const [isRead, setIsRead] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`bookmark-${article.id}`);
    if (saved) setIsBookmarked(true);
  }, [article.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !isBookmarked;
    setIsBookmarked(newValue);
    if (newValue) {
      localStorage.setItem(`bookmark-${article.id}`, "true");
    } else {
      localStorage.removeItem(`bookmark-${article.id}`);
    }
  };

  const hasActiveState = isRead || isAnnotating || isBookmarked;

  return (
<article
  className={cn(
    "group relative flex flex-col gap-4 p-5 rounded-2xl transition-smooth border cursor-pointer",
    hasActiveState
      ? "bg-card shadow-soft border-border"
      : "border-transparent hover:bg-card hover:shadow-soft hover:border-border"
  )}
>
      {/* ACTION BUTTONS */}
      <div
        className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition"
        style={{ opacity: hasActiveState ? 1 : undefined }}
      >

        {/* 👁️ VU */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRead((prev) => !prev);
          }}
          className={cn(
            "p-2 rounded-full backdrop-blur transition shadow-soft",
            isRead
              ? "bg-primary text-white"
              : "bg-background/80 hover:bg-primary hover:text-white"
          )}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* ✏️ ANNOTER */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAnnotating((prev) => !prev);
          }}
          className={cn(
            "p-2 rounded-full backdrop-blur transition shadow-soft",
            isAnnotating
              ? "bg-primary text-white"
              : "bg-background/80 hover:bg-primary hover:text-white"
          )}
        >
          <PenLine className="w-4 h-4" />
        </button>

        {/* 🔖 BOOKMARK */}
        <button
          onClick={toggleBookmark}
          className={cn(
            "p-2 rounded-full backdrop-blur transition shadow-soft",
            isBookmarked
              ? "bg-green-500 text-white hover:bg-green-500"
              : "bg-background/80 hover:bg-primary hover:text-white"
          )}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* CONTENU */}
      <div className="flex gap-5">
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-32 h-32 rounded-xl bg-gradient-to-br shadow-soft flex items-center justify-center text-primary-foreground font-display font-bold text-2xl",
              article.sourceColor
            )}
          >
            <span className="opacity-90">
              {article.source.split(" ")[0].slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
              {article.category}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground font-medium">{article.source}</span>
          </div>

          <h3 className="font-display font-bold text-[17px] leading-snug mt-2 text-foreground group-hover:text-primary-deep transition-smooth">
            {article.title}
          </h3>

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
            <span>·</span>
            <span>{article.publishedAt}</span>
          </div>

          <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* ✏️ ZONE ANNOTATION */}
      {/* ✏️ ZONE ANNOTATION */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isAnnotating ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="relative mt-2">
          <textarea
            placeholder="Ajouter une note..."
            className="w-full p-3 pr-12 text-sm rounded-lg border bg-background resize-none focus:outline-none"
          />

          {/* ➕ BOUTON */}
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white shadow-soft hover:scale-105 transition"
            onClick={(e) => {
              e.stopPropagation();
              // 👉 logique ici (save note, etc.)
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}