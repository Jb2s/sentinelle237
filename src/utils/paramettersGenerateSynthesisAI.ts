const KEY = "paramettersGenerateSynthesisAI";

export type SynthesisParams = {
  period: string;
  category: { id: number; name: string } | undefined; // ✅ name pas nom
  zone: string;
};

export const synthesisParamsStorage = {
  get: (): SynthesisParams | null => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  set: (params: SynthesisParams) => {
    localStorage.setItem(KEY, JSON.stringify(params));
  },
  clear: () => localStorage.removeItem(KEY),
};