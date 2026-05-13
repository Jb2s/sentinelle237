import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

import {
  Wrench,
  Download,
  Upload,
  Trash2,
  RefreshCcw,
  FileJson,
  Sparkles,
  Filter,
  KeyRound,
  Bell,
} from "lucide-react";

import { toast } from "sonner";

import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";

const tools = [
  {
    icon: Download,
    title: "Exporter OPML",
    description:
      "Téléchargez tous vos flux au format OPML pour les sauvegarder.",
    color: "bg-primary",
    action: "Exporter",
    route: "/tools/export-opml",
  },

  {
    icon: Upload,
    title: "Importer OPML",
    description:
      "Importez une liste de flux depuis un autre lecteur RSS.",
    color: "bg-primary-deep",
    action: "Importer",
    route: "/tools/import-opml",
  },

  {
    icon: RefreshCcw,
    title: "Rafraîchir tous les flux",
    description:
      "Forcer la récupération des derniers articles de chaque source.",
    color: "bg-primary-glow",
    action: "Rafraîchir",
    route: "/tools/refresh",
  },

  {
    icon: Sparkles,
    title: "Gérer les synthèses IA",
    description:
      "Recalculer la synthèse quotidienne pour les flux suivis.",
    color: "bg-highlight",
    action: "Gérer",
    route: "/tools/synthetisation-IA",
  },

  {
    icon: Filter,
    title: "Règles de filtrage",
    description:
      "Définissez des mots-clés à ignorer ou à mettre en avant.",
    color: "bg-primary",
    action: "Configurer",
    route: "/tools/filters",
  },

  {
    icon: Bell,
    title: "Notifications",
    description:
      "Choisissez les flux qui déclenchent une alerte en temps réel.",
    color: "bg-primary-deep",
    action: "Configurer",
    route: "/tools/notifications",
  },

  {
    icon: FileJson,
    title: "Exporter les annotations",
    description:
      "Téléchargez vos notes et surlignages au format JSON.",
    color: "bg-primary-glow",
    action: "Exporter",
    route: "/tools/export-json",
  },

  {
    icon: KeyRound,
    title: "Clés API",
    description:
      "Gérez vos jetons d'accès pour les intégrations externes.",
    color: "bg-highlight",
    action: "Gérer",
    route: "/tools/api-keys",
  },

  {
    icon: Trash2,
    title: "Vider le cache",
    description:
      "Effacer les articles mis en cache pour libérer de l'espace.",
    color: "bg-primary",
    action: "Vider",
    route: "/tools/cache",
  },
];

export default function Tools() {
  const { viewMode } = useViewMode();

  const navigate = useNavigate();

  const handleAction = (tool: (typeof tools)[0]) => {
    toast.success(`${tool.title}`);

    navigate(tool.route);
  };

  return (
    <PageShell
      eyebrow="Boîte à outils"
      title="Outils"
      meta={
        <span className="inline-flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5" />
          {tools.length} utilitaires disponibles
        </span>
      }
    >
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            : "space-y-3",
        )}
      >
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <div
              key={tool.title}
              className={cn(
                "group flex items-start gap-4 rounded-2xl border border-border",
                "bg-card p-5 transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                viewMode === "grid" ? "min-h-[160px]" : "",
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-11 h-11 shrink-0 rounded-xl",
                  "flex items-center justify-center",
                  "text-primary-foreground shadow-soft",
                  tool.color,
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base leading-tight">
                  {tool.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Action */}
              <Button
                size="sm"
                variant="secondary"
                className="shrink-0"
                onClick={() => handleAction(tool)}
              >
                {tool.action}
              </Button>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}