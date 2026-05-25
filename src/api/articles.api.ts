import { apiFetch } from "./client";

export const articlesApi = {
  async getAll(params: { limit?: number; offset?: number } = {}): Promise<any> {
    const limit    = params.limit  ?? 200;
    const offset   = params.offset ?? 0;
    const response = await apiFetch<any>(`/api/articles?limit=${limit}&offset=${offset}`);
    // L'API enveloppe la réponse dans { success, data: ... } — on unwrap ici
    return response?.data ?? response;
  },

  async getBySource(sourceId: string, params: { limit?: number; offset?: number } = {}): Promise<any> {
    const limit    = params.limit  ?? 20;
    const offset   = params.offset ?? 0;
    const response = await apiFetch<any>(`/api/articles/source/${sourceId}?limit=${limit}&offset=${offset}`);
    return response?.data ?? response;
  },

  async getOne(articleId: string): Promise<any> {
    const response = await apiFetch<any>(`/api/articles/${articleId}`);
    return response?.data ?? response;
  },

  updateDescription(articleId: string, description: string): Promise<any> {
    return apiFetch(`/api/articles/${articleId}/description`, {
      method: "PATCH",
      body:   JSON.stringify({ description }),
    });
  },

  save(articleId: string): Promise<any> {
    return apiFetch(`/api/articles/${articleId}/sauvegarder`, { method: "POST" });
  },

  unsave(articleId: string): Promise<any> {
    return apiFetch(`/api/articles/${articleId}/sauvegarder`, { method: "DELETE" });
  },

  async isSaved(articleId: string): Promise<{ saved: boolean }> {
    const response = await apiFetch<any>(`/api/articles/${articleId}/sauvegarde`);
    return response?.data ?? response;
  },

  async getSaved(): Promise<any> {
    const response = await apiFetch<any>("/api/articles/sauvegardes");
    return response?.data ?? response;
  },

  upsertNote(articleId: string, contenu: string): Promise<any> {
    return apiFetch(`/api/articles/${articleId}/note`, {
      method: "PUT",
      body:   JSON.stringify({ contenu }),
    });
  },

  async getNote(articleId: string): Promise<{ contenu: string }> {
    const response = await apiFetch<any>(`/api/articles/${articleId}/note`);
    return response?.data ?? response;
  },

  async getAllNotes(): Promise<any[]> {
    const response = await apiFetch<any>("/api/articles/notes");
    return response?.data ?? response;
  },

  deleteNote(articleId: string): Promise<any> {
    return apiFetch(`/api/articles/${articleId}/note`, { method: "DELETE" });
  },
};