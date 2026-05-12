import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  MessageCircle,
  Mail,
  Rss,
  Sparkles,
  Bookmark,
  PenLine,
  Shield,
  Bug,
} from "lucide-react";
import { toast } from "sonner";
import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";

const topics = [
  {
    icon: Rss,
    title: "Ajouter et organiser vos flux",
    description:
      "Apprenez à importer un OPML, suivre un nouveau flux et le ranger dans une catégorie.",
    color: "bg-primary",
    action: "Lire",
  },
  {
    icon: Sparkles,
    title: "Comprendre les synthèses IA",
    description:
      "Comment Alexandre résume vos lectures et adapte ses recommandations à vos centres d'intérêt.",
    color: "bg-primary-deep",
    action: "Découvrir",
  },
  {
    icon: Bookmark,
    title: "À lire plus tard",
    description:
      "Mettez de côté des articles et retrouvez-les facilement, même hors-ligne.",
    color: "bg-primary-glow",
    action: "Voir",
  },
  {
    icon: PenLine,
    title: "Annoter un article",
    description:
      "Surlignez, ajoutez des notes et exportez vos annotations en JSON.",
    color: "bg-highlight",
    action: "Tutoriel",
  },
  {
    icon: Keyboard,
    title: "Raccourcis clavier",
    description:
      "Naviguez plus vite : j/k pour parcourir, m pour marquer comme lu, ? pour la liste complète.",
    color: "bg-primary",
    action: "Afficher",
  },
  {
    icon: Shield,
    title: "Confidentialité & données",
    description:
      "Ce que nous stockons, ce que nous ne stockons pas, et comment exporter vos données.",
    color: "bg-primary-deep",
    action: "En savoir +",
  },
  {
    icon: BookOpen,
    title: "Documentation complète",
    description:
      "Le guide pas-à-pas avec captures d'écran et bonnes pratiques.",
    color: "bg-primary-glow",
    action: "Ouvrir",
  },
  {
    icon: MessageCircle,
    title: "Contacter le support",
    description:
      "Une question ? Notre équipe répond en moyenne sous 4 heures les jours ouvrés.",
    color: "bg-highlight",
    action: "Discuter",
  },
  {
    icon: Bug,
    title: "Signaler un bug",
    description:
      "Aidez-nous à améliorer Fintech Radar en décrivant ce qui ne fonctionne pas.",
    color: "bg-primary",
    action: "Signaler",
  },
  {
    icon: Mail,
    title: "Nous écrire",
    description: "support@fintechradar.app — pour tout le reste.",
    color: "bg-primary-deep",
    action: "Envoyer",
  },
];

export default function Help() {
  const { viewMode } = useViewMode();

  const handleAction = (title: string) => {
    toast.success(`${title} : ouverture`);
  };

  return (
    <PageShell
      eyebrow="Centre d'aide"
      title="Aide & support"
      meta={
        <span className="inline-flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5" />
          {topics.length} ressources disponibles
        </span>
      }
    >
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4"
            : "space-y-2"
        )}
      >
        {topics.map((topic) => {
          const Icon = topic.icon;

          return (
            <div
              key={topic.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-smooth"
            >
              <div
                className={cn(
                  "w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-primary-foreground",
                  topic.color
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base leading-tight">
                  {topic.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {topic.description}
                </p>
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAction(topic.title)}
              >
                {topic.action}
              </Button>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}