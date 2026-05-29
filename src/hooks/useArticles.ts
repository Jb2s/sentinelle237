import { useEffect, useRef, useState, useCallback } from "react";
import { articlesApi } from "@/api/articles.api";
import type { Article } from "@/types/article.types";

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
  const offsetRef = useRef(0);

  const load = useCallback(async (offset: number, append: boolean) => {
    // Vérification synchrone du token au moment de l'appel
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

      setState((prev) => ({
        articles:      append ? [...prev.articles, ...articles] : articles,
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
        error:         err?.message ?? "Erreur de chargement",
      }));
    }
  }, []);

  useEffect(() => {
    offsetRef.current = 0;
    setState(INITIAL_STATE);
    load(0, false);
  }, [load]);

  // Polling toutes les 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
      offsetRef.current = 0;
      load(0, false);
    }, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const loadMore = useCallback(() => {
    if (state.isLoadingMore || !state.hasMore) return;
    load(offsetRef.current, true);
  }, [state.isLoadingMore, state.hasMore, load]);

  const refresh = useCallback(() => {
    offsetRef.current = 0;
    load(0, false);
  }, [load]);

  return { ...state, loadMore, refresh };
}