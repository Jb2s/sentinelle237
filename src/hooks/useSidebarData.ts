import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/api/client";

export type SidebarSource = {
  id_source:     number;
  nom_source:    string;
  article_count: number;
  url_source?:   string;
  color?:        string;
};

export type SidebarCategory = {
  id_cat:  number;
  nom_cat: string;
  sources: SidebarSource[];
};

const SOURCE_COLORS = [
  "bg-primary", "bg-primary-deep", "bg-primary-glow", "bg-highlight",
  "bg-emerald-500", "bg-violet-500", "bg-rose-500", "bg-amber-500",
];

function deriveColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return SOURCE_COLORS[hash % SOURCE_COLORS.length];
}

export function useSidebarData() {
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const load = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    apiFetch<any>("/api/categories/with-sources")
      .then((res) => {
        const raw  = res?.data ?? res;
        const data = Array.isArray(raw) ? raw : [];
        setCategories(data);
      })
      .catch((err) => setError(err?.message ?? "Erreur"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categoriesWithColor = categories.map((cat) => ({
    ...cat,
    sources: cat.sources.map((src) => ({
      ...src,
      color: deriveColor(src.nom_source),
    })),
  }));

  return { categories: categoriesWithColor, isLoading, error, refresh: load };
}