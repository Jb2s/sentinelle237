import { useState } from "react";
import { Sparkles, RefreshCw, TrendingUp, Eye, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { articles } from "@/data/articles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Synthesis = {
  headline: string;
  overview: string;
  key_points: string[];
  trends: { label: string; intensity: "faible" | "modérée" | "forte" }[];
  watchlist: string[];
};

const intensityStyle: Record<string, string> = {
  faible: "bg-muted text-muted-foreground",
  modérée: "bg-primary-glow/40 text-primary-deep",
  forte: "bg-primary text-primary-foreground",
};

export function SynthesisPanel() {
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "synthesize",
        { body: { articles } }
      );
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      if (!data?.synthesis) throw new Error("Réponse IA invalide");
      setSynthesis(data.synthesis);
      toast.success("Synthèse générée");
    } catch (e: any) {
      const msg = e?.message ?? "Erreur lors de la génération";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-synthesis text-primary-foreground shadow-elegant">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-highlight/10 blur-3xl" />

      <div className="relative p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-80">
              Cauris · IA
              </p>
              <p className="font-display font-bold text-lg">Note de synthèse</p>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary-foreground/15 hover:bg-primary-foreground/25 backdrop-blur-sm text-sm font-semibold transition-smooth disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {synthesis ? "Régénérer" : "Générer"}
          </button>
        </div>

        {!synthesis && !loading && !error && (
          <div className="mt-6 p-5 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15">
            <p className="text-sm leading-relaxed opacity-95">
              Obtenez une synthèse instantanée de tous les articles du
              jour, de la semaine ou du mois: tendances, points clés et sujets à surveiller.
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-6 space-y-3 animate-pulse">
            <div className="h-4 bg-primary-foreground/15 rounded w-3/4" />
            <div className="h-4 bg-primary-foreground/15 rounded w-full" />
            <div className="h-4 bg-primary-foreground/15 rounded w-5/6" />
            <div className="h-4 bg-primary-foreground/15 rounded w-2/3" />
          </div>
        )}

        {error && !loading && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/20 border border-destructive/30 flex gap-3 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {synthesis && !loading && (
          <div className="mt-6 space-y-5">
            <div>
              <h3 className="font-display font-bold text-2xl leading-tight">
                {synthesis.headline}
              </h3>
              <p className="text-sm leading-relaxed opacity-90 mt-3">
                {synthesis.overview}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-70 mb-2.5">
                Points clés
              </p>
              <ul className="space-y-2">
                {synthesis.key_points.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-primary-foreground/15 flex items-center justify-center text-[11px] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="opacity-95">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-70 mb-2.5 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Tendances
              </p>
              <div className="flex flex-wrap gap-2">
                {synthesis.trends.map((t, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold",
                      intensityStyle[t.intensity]
                    )}
                  >
                    {t.label}
                    <span className="ml-2 opacity-70 font-normal">
                      · {t.intensity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-70 mb-2.5 flex items-center gap-1.5">
                <Eye className="w-3 h-3" /> À surveiller
              </p>
              <div className="space-y-1.5">
                {synthesis.watchlist.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-highlight" />
                    <span className="opacity-95">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
