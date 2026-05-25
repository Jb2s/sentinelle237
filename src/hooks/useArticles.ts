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

export function useArticles() {
  const [state, setState] = useState<State>({
    articles:      [],
    total:         0,
    isLoading:     true,
    isLoadingMore: false,
    error:         null,
    hasMore:       false,
  });

  const offsetRef = useRef(0);

  const load = async (offset: number, append: boolean) => {
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
  };

  useEffect(() => {
    offsetRef.current = 0;
    load(0, false);
  }, []);

  const loadMore = useCallback(() => {
    if (state.isLoadingMore || !state.hasMore) return;
    load(offsetRef.current, true);
  }, [state.isLoadingMore, state.hasMore]);

  return { ...state, loadMore };
}
