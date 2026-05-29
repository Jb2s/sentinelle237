import { useState, useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles, Loader2, Filter, Clock,
  FileText, Download, Eye, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { reportsApi, type RapportListItem, type PreviewReport } from "@/api/ia.api";
import { apiFetch } from "@/api/client";

const PERIODS = [
  { value: "quotidienne", label: "Quotidien"     },
  { value: "hebdo",       label: "Hebdomadaire"  },
  { value: "mensuelle",   label: "Mensuel"       },
];

const ZONES = [
  { value: "all",      label: "Toutes les zones"      },
  { value: "nationale",      label: "Nationale"      },
  { value: "internationale", label: "Internationale" },
];

type Category = { id_cat: number; nom_cat: string };

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return iso; }
}

export default function SynthesisSettings() {
  const [zone,     setZone]     = useState("all");
  const [period,   setPeriod]   = useState("quotidienne");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const [preview,       setPreview]       = useState<PreviewReport | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingGen,    setLoadingGen]    = useState(false);
  const [showPreview,   setShowPreview]   = useState(false);

  const [rapports,     setRapports]     = useState<RapportListItem[]>([]);
  const [loadingList,  setLoadingList]  = useState(false);

  // Charger les catégories depuis l'API
  useEffect(() => {
    apiFetch<any>("/api/categories")
      .then((res: any) => {
        const data: Category[] = res?.data ?? res ?? [];
        setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Charger l'historique des rapports
  useEffect(() => {
    setLoadingList(true);
    reportsApi.list({ limit: 10 })
      .then(setRapports)
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  const handlePreview = async () => {
    if (!selectedCat) { toast.error("Sélectionnez une catégorie"); return; }
    setLoadingPreview(true);
    setShowPreview(false);
    try {
      const data = await reportsApi.previewReport(period, selectedCat.id_cat, zone, 50);
      setPreview(data);
      setShowPreview(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur aperçu");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCat) { toast.error("Sélectionnez une catégorie"); return; }
    setLoadingGen(true);
    try {
      const { blob, rapportId, nbArticles } = await reportsApi.genererRapportPdf(
        period, selectedCat.id_cat, zone, 50
      );

      // Téléchargement automatique
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `synthese_${period}_${selectedCat.nom_cat}_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Rapport généré — ${nbArticles} articles inclus`);

      // Rafraîchir l'historique
      reportsApi.list({ limit: 10 }).then(setRapports).catch(() => {});
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur génération PDF");
    } finally {
      setLoadingGen(false);
    }
  };

  const handleReset = () => {
    setPeriod("quotidienne");
    setZone("nationale");
    setSelectedCat(null);
    setPreview(null);
    setShowPreview(false);
    toast.info("Configuration réinitialisée");
  };

  return (
    <PageShell
      eyebrow="Configuration"
      title="Gérer les synthèses IA"
      meta={
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Période, catégorie et zone géographique
        </span>
      }
    >
      <div className="space-y-6">

        {/* Période + Zone */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">Période de synthèse</h2>
              <p className="text-xs text-muted-foreground">Plage de temps couverte par le rapport.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fréquence</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PERIODS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Zone</label>
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Catégorie */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">Catégorie</h2>
              <p className="text-xs text-muted-foreground">Sujet principal de la synthèse.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id_cat}
                onClick={() => setSelectedCat((prev) => prev?.id_cat === cat.id_cat ? null : cat)}
                className={cn(
                  "px-3.5 py-2 rounded-full text-sm font-semibold border transition-smooth",
                  selectedCat?.id_cat === cat.id_cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40"
                )}
              >
                {cat.nom_cat}
              </button>
            ))}
          </div>
        </section>

        {/* Aperçu */}
        {showPreview && preview && (
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                Aperçu
              </h2>
              <button onClick={() => setShowPreview(false)}>
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
              <span><strong className="text-foreground">{preview.nb_articles}</strong> articles</span>
              <span>Du <strong className="text-foreground">{formatDate(preview.date_debut)}</strong> au <strong className="text-foreground">{formatDate(preview.date_fin)}</strong></span>
            </div>

            {preview.articles?.length > 0 && (
              <ul className="space-y-1 max-h-48 overflow-y-auto">
                {preview.articles.slice(0, 10).map((a: any, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground truncate flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {a.titre ?? a.title}
                  </li>
                ))}
                {preview.nb_articles > 10 && (
                  <li className="text-xs text-muted-foreground pl-3.5">
                    +{preview.nb_articles - 10} autres articles…
                  </li>
                )}
              </ul>
            )}
          </section>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset} disabled={loadingPreview || loadingGen}>
            Réinitialiser
          </Button>

          <Button variant="secondary" onClick={handlePreview} disabled={loadingPreview || loadingGen || !selectedCat}>
            {loadingPreview ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Aperçu…</>
            ) : (
              <><Eye className="w-4 h-4 mr-2" />Aperçu</>
            )}
          </Button>

          <Button onClick={handleGenerate} disabled={loadingGen || loadingPreview || !selectedCat}>
            {loadingGen ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Génération…</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Générer le PDF</>
            )}
          </Button>
        </div>

        {/* Historique */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Historique des rapports
          </h2>

          {loadingList ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : rapports.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun rapport généré.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rapports.map((r) => (
                <li key={r.id_note} className="flex items-center gap-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{r.titre_note}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.type_periode} · {r.nb_informations} articles · {formatDate(r.created_at)}
                    </p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    r.statut === "envoye"       ? "bg-emerald-100 text-emerald-700" :
                    r.statut === "genere"        ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {r.statut}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
