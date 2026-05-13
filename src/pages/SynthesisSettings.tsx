import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sparkles,
  CalendarIcon,
  Mail,
  Plus,
  X,
  Filter,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { articles } from "@/data/articles";

const PERIODS = [
  { value: "day", label: "Quotidien" },
  { value: "week", label: "Hebdomadaire" },
  { value: "month", label: "Mensuel" },
  { value: "custom", label: "Plage personnalisée" },
];

// const SUGGESTED_CONTACTS = [
//   { name: "Alexandre Dupont", email: "alexandre@disvi.app" },
//   { name: "Marie Laurent", email: "marie.laurent@disvi.app" },
//   { name: "Comité Veille", email: "veille@disvi.app" },
// ];

export default function SynthesisSettings() {
  // const [showSuggestions, setShowSuggestions] = useState(false);
  const allCategories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))).sort(),
    [],
  );

  const [period, setPeriod] = useState("day");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [categories, setCategories] = useState<string[]>(allCategories);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const addRecipient = (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Adresse email invalide");
      return;
    }
    if (recipients.includes(trimmed)) {
      toast.info("Destinataire déjà ajouté");
      return;
    }
    setRecipients([...recipients, trimmed]);
    setNewRecipient("");
  };

  const removeRecipient = (email: string) =>
    setRecipients(recipients.filter((r) => r !== email));

  const handleSave = () => {
    if (recipients.length === 0) {
      toast.error("Ajoutez au moins un destinataire");
      return;
    }
    if (categories.length === 0) {
      toast.error("Sélectionnez au moins une catégorie");
      return;
    }
    toast.success(
      `Synthèse ${PERIODS.find((p) => p.value === period)?.label.toLowerCase()} programmée pour ${recipients.length} destinataire(s)`,
    );
  };

  const handleCancel = () => {
  setPeriod("day");

  setDate(new Date());

  setEndDate(new Date());

  setCategories(allCategories);

  setRecipients([]);

  setNewRecipient("");

  toast.info("Configuration réinitialisée");
};

  return (
    <PageShell
      eyebrow="Configuration"
      title="Gérer les synthèses IA"
      meta={
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Réglez la période, les catégories et les destinataires email
        </span>
      }
      // aside={<SynthesisPanel />}
    >
      <div className="space-y-6">
        {/* Période */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">
                Période de synthèse
              </h2>
              <p className="text-xs text-muted-foreground">
                Sur quelle plage de temps les articles sont-ils synthétisés ?
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fréquence</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIODS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                {period === "custom" ? "Date de début" : "Date de référence"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {period === "custom" && (
              <div className="space-y-2 sm:col-span-2">
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate
                        ? format(endDate, "PPP", { locale: fr })
                        : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={fr}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </section>

        {/* Catégories */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">
                Catégories incluses
              </h2>
              <p className="text-xs text-muted-foreground">
                Choisissez les sujets pris en compte dans la synthèse.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const active = categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-sm font-semibold border transition-smooth",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Destinataires */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">
                Destinataires email
              </h2>
              <p className="text-xs text-muted-foreground">
                Qui reçoit la synthèse générée par e-mail ?
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* <div className="space-y-2">
              <Label>Contacts suggérés</Label>
              <div className="space-y-2">
                {SUGGESTED_CONTACTS.map((c) => {
                  const checked = recipients.includes(c.email);
                  return (
                    <label
                      key={c.email}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-smooth",
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          checked ? removeRecipient(c.email) : addRecipient(c.email)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.email}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="new-recipient">Ajouter un destinataire</Label>
              <div className="flex gap-2">
                <Input
                  id="new-recipient"
                  type="email"
                  placeholder="nom@entreprise.com"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRecipient(newRecipient);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addRecipient(newRecipient)}
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </div>

            {recipients.length > 0 && (
              <div className="space-y-2">
                <Label>Liste d'envoi ({recipients.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {recipients.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-3 py-1.5 text-sm"
                    >
                      <Mail className="w-3 h-3" />
                      {email}
                      <button
                        onClick={() => removeRecipient(email)}
                        className="hover:text-destructive"
                        aria-label={`Retirer ${email}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>Annuler</Button>
          <Button onClick={handleSave}>
            <Sparkles className="w-4 h-4" />
            Programmer la synthèse
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
