import { apiFetch } from "./client";

const jsonHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const rssApi = {
  detectSources: (site_name: string, token: string) =>
    apiFetch("/api/sources/detect-rss", {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify({
        site_name,
      }),
    }),

  addRssSource: (
    nom_source: string,
    url_source: string,
    frequence_check: number,
    token: string
  ) =>
    apiFetch("/api/sources/rss", {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify({
        nom_source,
        url_source,
        frequence_check,
      }),
    }),

  addSocialSource: (
    nom_source: string,
    handle_social: string,
    token: string
  ) =>
    apiFetch("/api/sources/social", {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify({
        nom_source,
        handle_social,
      }),
    }),
};