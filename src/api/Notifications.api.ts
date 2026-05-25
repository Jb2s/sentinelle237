import { apiFetch } from "@/api/client";

export type Alerte = {
  id_alerte:    string;
  type_alerte:  string;
  statut_envoi: string;
  article_titre?: string;
  article_url?:   string;
  created_at:   string;
};

export const notificationsApi = {
  async list(params: { limit?: number; non_lues?: boolean } = {}): Promise<{ alertes: Alerte[]; non_lues: number }> {
    const qs = new URLSearchParams();
    if (params.limit)     qs.set("limit",    String(params.limit));
    if (params.non_lues)  qs.set("non_lues", "true");
    const res = await apiFetch<any>(`/api/notifications?${qs}`);
    return res?.data ?? res;
  },

  async markAllRead(): Promise<void> {
    await apiFetch("/api/notifications/lues", { method: "PATCH" });
  },

  async markOneRead(id: string): Promise<void> {
    await apiFetch(`/api/notifications/${id}/lue`, { method: "PATCH" });
  },
};
