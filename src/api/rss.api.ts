import { apiFetch } from "./clientDirect"; // ✅ ngrok direct (pas de preflight CORS sur ces endpoints)

export const rssApi = {
  detectSources: (site_name: string) =>
    apiFetch("/api/sources/detect-rss", {
      method: "POST",
      body: JSON.stringify({ site_name }),
    }),

  addRssSource: (
    nom_source: string,
    url_source: string,
    frequence_check: number,
  ) =>
    apiFetch("/api/sources/rss", {
      method: "POST",
      body: JSON.stringify({ nom_source, url_source, frequence_check }),
    }),

  addSocialSource: (
    nom_source: string,
    handle_social: string,
  ) =>
    apiFetch("/api/sources/social", {
      method: "POST",
      body: JSON.stringify({ nom_source, handle_social }),
    }),
};