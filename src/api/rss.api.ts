import { apiFetch } from "./client";

export const rssApi = {

  // Detecter une source
  detectSources: (site_name: string, url_hint: string, token: string) =>
    apiFetch("/api/sources/detect-rss", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        site_name,
        url_hint,
      }),
    }),

  // Ajoutter une source rss
  addRssSource: (nom_source: string, url_source: string, frequence_check: number, token: string ) =>
    apiFetch("/api/sources/rss", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nom_source,
        url_source,
        frequence_check,
      }),
    }),
    
    // Ajoutter une source reseaux sociaux (X / Nitter)
    addSocialSource: (
    nom_source: string,
    handle_social: string,
    token: string
  ) =>
    apiFetch("/api/sources/social", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nom_source,
        handle_social,
      }),
    }),

  // Lister toutes les sources user (cache Redis 5 min)
  getSources: (token: string) =>
    apiFetch("/api/sources", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Détail d'une source
  getSourceById: (source_id: string, token: string) =>
    apiFetch(`/api/sources/${source_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Auteurs suivis (sources sociales)
  getSourceAuthors: (source_id: string, token: string) =>
    apiFetch(`/api/sources/${source_id}/auteurs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Modifier source (ex: fréquence crawl)
  updateSource: (
    source_id: string,
    frequence_check: number,
    token: string
  ) =>
    apiFetch(`/api/sources/${source_id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        frequence_check,
      }),
    }),

  // Supprimer source
  deleteSource: (source_id: string, token: string) =>
    apiFetch(`/api/sources/${source_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};