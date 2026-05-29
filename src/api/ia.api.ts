import { apiFetch, API_URL, getToken } from "@/api/client";

export type PreviewReport = {
  nb_articles: number;
  date_debut:  string;
  date_fin:    string;
  articles:    any[];
};

export type RapportListItem = {
  id_note:         string;
  titre_note:      string;
  type_periode:    string;
  statut:          string;
  nb_informations: number;
  created_at:      string;
};

export type RapportDetail = RapportListItem & {
  articles: any[];
};

export const reportsApi = {
  previewReport(
    periode: string,
    id_cat:  number,
    zone:    string,
    limit:   number = 50,
  ): Promise<PreviewReport> {
    const qs = new URLSearchParams({
      periode,
      id_cat: String(id_cat),
      zone,
      limit:  String(limit),
    });
    return apiFetch<any>(`/api/rapports/preview?${qs}`).then(
      (res: any) => res?.data ?? res
    );
  },

  // PDF binaire — fetch natif requis (apiFetch parse en JSON)
  async genererRapportPdf(
    periode: string,
    id_cat:  number,
    zone:    string,
    limit:   number = 50,
  ): Promise<{ blob: Blob; rapportId: string; nbArticles: number }> {
    const token = getToken(); // lit depuis auth-storage

    const res = await fetch(`${API_URL}/api/rapports/generer`, {
      method:  "POST",
      headers: {
        "Content-Type":               "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ periode, id_cat, zone, limit }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error ?? err?.message ?? "Erreur génération PDF");
    }

    const blob       = await res.blob();
    const rapportId  = res.headers.get("X-Rapport-Id")  ?? "";
    const nbArticles = Number(res.headers.get("X-Nb-Articles") ?? 0);

    return { blob, rapportId, nbArticles };
  },

  list(params: { limit?: number; offset?: number } = {}): Promise<RapportListItem[]> {
    const qs = new URLSearchParams({
      limit:  String(params.limit  ?? 20),
      offset: String(params.offset ?? 0),
    });
    return apiFetch<any>(`/api/rapports?${qs}`).then(
      (res: any) => res?.data ?? res ?? []
    );
  },

  detail(id: string): Promise<RapportDetail> {
    return apiFetch<any>(`/api/rapports/${id}`).then(
      (res: any) => res?.data ?? res
    );
  },
};