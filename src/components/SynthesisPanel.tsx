import { Sparkles } from "lucide-react";


export function SynthesisPanel() {
  const handleGenerate = () => {
    // Redirection vers tools/synthetisation-IA
    window.location.href = "/tools/synthetisation-IA";
  };


  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-synthesis text-primary-foreground shadow-elegant">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-highlight/10 blur-3xl" />


      <div className="relative p-7">
        {/* Header */}
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
              <p className="text-[10px] opacity-60 mt-0.5">tools/synthetisation-IA</p>
            </div>
          </div>


          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary-foreground/15 hover:bg-primary-foreground/25 backdrop-blur-sm text-sm font-semibold transition-smooth"
          >
            Générer
          </button>
        </div>


        {/* Message */}
        <div className="mt-6 p-5 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15">
          <p className="text-sm leading-relaxed opacity-95">
            Cliquez sur Générer pour accéder à l'outil de synthèse IA.
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}