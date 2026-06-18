import { useEffect, useRef, useState, useCallback } from "react";
import { articlesApi } from "@/api/articles.api";
import type { Article } from "@/types/article.types";
import { friendlyError } from "@/api/client";

const PAGE_SIZE = 20;

function extractArticles(data: any): { articles: Article[]; total: number } {
  if (Array.isArray(data?.articles)) {
    return { articles: data.articles, total: data.total ?? data.articles.length };
  }
  if (Array.isArray(data?.articles?.articles)) {
    return {
      articles: data.articles.articles,
      total:    data.articles.total ?? data.articles.articles.length,
    };
  }
  return { articles: [], total: 0 };
}

type State = {
  articles:      Article[];
  total:         number;
  isLoading:     boolean;
  isLoadingMore: boolean;
  error:         string | null;
  hasMore:       boolean;
};

const INITIAL_STATE: State = {
  articles:      [],
  total:         0,
  isLoading:     true,
  isLoadingMore: false,
  error:         null,
  hasMore:       false,
};

export function useArticles() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const offsetRef  = useRef(0);
  const articleIds = useRef<Set<string>>(new Set());

  // Chargement initial ou "load more" — affiche le spinner
  const load = useCallback(async (offset: number, append: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setState((prev) => ({
      ...prev,
      isLoading:     !append,
      isLoadingMore: append,
      error:         null,
    }));

    try {
      const data                = await articlesApi.getAll({ limit: PAGE_SIZE, offset });
      const { articles, total } = extractArticles(data);

      if (!append) {
        articleIds.current = new Set(articles.map((a) => String(a.id_article)));
      } else {
        articles.forEach((a) => articleIds.current.add(String(a.id_article)));
      }

      setState((prev) => ({
        articles: append ? [...prev.articles, ...articles] : articles,
        total,
        isLoading:     false,
        isLoadingMore: false,
        error:         null,
        hasMore:       offset + PAGE_SIZE < total,
      }));

      offsetRef.current = offset + articles.length;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading:     false,
        isLoadingMore: false,
        error:         friendlyError(err),
      }));
    }
  }, []);

  // Refresh silencieux — ne touche pas aux articles affichés pendant le fetch
  // Insère seulement les nouveaux articles en tête de liste
  const silentRefresh = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const data                = await articlesApi.getAll({ limit: PAGE_SIZE, offset: 0 });
      const { articles, total } = extractArticles(data);

      setState((prev) => {
        // Filtrer uniquement les articles vraiment nouveaux
        const newOnes = articles.filter(
          (a) => !articleIds.current.has(String(a.id_article))
        );

        if (newOnes.length === 0) {
          // Mettre à jour le total uniquement
          return { ...prev, total };
        }

        newOnes.forEach((a) => articleIds.current.add(String(a.id_article)));

        return {
          ...prev,
          // Nouveaux articles en tête, articles existants conservés
          articles: [...newOnes, ...prev.articles],
          total,
        };
      });
    } catch {
      // Échec silencieux — ne pas effacer les articles affichés
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    offsetRef.current = 0;
    articleIds.current = new Set();
    setState(INITIAL_STATE);
    load(0, false);
  }, [load]);

  // Polling toutes les 30s — silencieux pour ne pas perturber l'affichage
  useEffect(() => {
    const interval = setInterval(silentRefresh, 30_000);
    return () => clearInterval(interval);
  }, [silentRefresh]);

  const loadMore = useCallback(() => {
    if (state.isLoadingMore || !state.hasMore) return;
    load(offsetRef.current, true);
  }, [state.isLoadingMore, state.hasMore, load]);

  // Refresh manuel explicite (ex: après ajout d'un flux) — recharge tout
  const refresh = useCallback(() => {
    offsetRef.current = 0;
    articleIds.current = new Set();
    load(0, false);
  }, [load]);

  return { ...state, loadMore, refresh };
}
