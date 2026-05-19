import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { authApi } from "@/api/auth.api";
import { tokenStorage } from "@/utils/token";

type Mode = "login" | "signup";

interface AuthPageProps {
  initialMode?: Mode;
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getModeFromPath = (): Mode => {
    if (location.pathname.includes("inscription")) return "signup";
    return initialMode;
  };

  const [mode, setMode] = useState<Mode>(getModeFromPath());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    setMode(getModeFromPath());
  }, [location.pathname]);

  const handleModeChange = (value: string) => {
    const nextMode = value as Mode;
    setMode(nextMode);
    navigate(nextMode === "login" ? "/connexion" : "/inscription", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email et mot de passe requis");
      return;
    }

    if (mode === "signup" && password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

try {
  let data;

  if (mode === "signup") {
    data = await authApi.signup(email, password);
        console.log("data reçu :", data);

  } else {
    data = await authApi.login(email, password);
  }

  const { user, accessToken } = data;

  if (accessToken) {
    console.log("Token reçu :", accessToken);
    tokenStorage.set(accessToken);
  }

  if (mode === "signup") {
    toast.success("Compte créé avec succès 🎉");
    navigate("/connexion", { replace: true });
    setMode("login");
  } else {
    toast.success("Connexion réussie");
    navigate("/", { replace: true });
  }
} catch (err: any) {
  const message = err?.message || "Erreur serveur";
  const friendly =
    message.includes("Invalid")
      ? "Email ou mot de passe incorrect"
      : message.includes("exists")
      ? "Cet email est déjà utilisé"
      : message;

  toast.error(friendly);
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft p-4 sm:p-6">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-l flex items-center justify-center shadow-glow">
            <img src="/disvi.ico" alt="Disvi" className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">
            DisVi
          </span>
        </Link>

        <div className="rounded-3xl border border-border bg-card shadow-elegant p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              {mode === "login" ? "Bon retour" : "Créer un compte"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "login"
                ? "Connectez-vous pour accéder à votre veille"
                : "Quelques secondes pour rejoindre Disvi"}
            </p>
          </div>

          <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Se connecter
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Au moins 6 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Créer mon compte
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}