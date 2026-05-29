import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useAuthStore from "@/store/useAuthStore";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";

import { authApi } from "@/api/auth.api";
import { tokenStorage } from "@/utils/token";

type Mode = "login" | "signup";

interface AuthPageProps {
  initialMode?: Mode;
}


export default function AuthPage({
  initialMode = "login",
}: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getModeFromPath = (): Mode => {
    if (location.pathname.includes("inscription")) {
      return "signup";
    }

    return initialMode;
  };

  const [mode, setMode] = useState<Mode>(
    getModeFromPath()
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Message erreur affiché sous le titre
  const [errorMessage, setErrorMessage] =
    useState("");

  const showError = (
    message: string
  ) => {
    setErrorMessage(message);
  };

  const setUser = useAuthStore((state) => state.setUser);

  // Validation mot de passe
  const validatePassword = (
    password: string
  ) => {
    // Minimum 8 caractères
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Au moins une majuscule
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }

    // Au moins une minuscule
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une minuscule";
    }

    // Au moins un chiffre
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }

    // Au moins un caractère spécial
    if (
      !/[!@#$%^&*(),.?":{}|<>]/.test(
        password
      )
    ) {
      return "Le mot de passe doit contenir au moins un caractère spécial";
    }

    return null;
  };

  useEffect(() => {
    const token = tokenStorage.get();

    if (token) {
      navigate("/", {
        replace: true,
      });
    }
  }, [navigate]);

  useEffect(() => {
    setMode(getModeFromPath());
    setErrorMessage("");
  }, [location.pathname]);

  const handleModeChange = (
    value: string
  ) => {
    const nextMode = value as Mode;

    setMode(nextMode);

    // reset erreurs
    setErrorMessage("");

    navigate(
      nextMode === "login"
        ? "/connexion"
        : "/inscription",
      { replace: true }
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // reset erreurs
    setErrorMessage("");

    if (!email || !password) {
      showError(
        "Email et mot de passe requis"
      );
      return;
    }

    // Validation signup
    if (mode === "signup") {
      const passwordError =
        validatePassword(password);

      if (passwordError) {
        showError(passwordError);
        return;
      }
    }

    setLoading(true);

    try {
      const response =
        mode === "signup"
          ? await authApi.signup(
              email,
              password,
              "Veilleur"
            )
          : await authApi.login(
              email,
              password
            );

      const { data } = response as any;

      const { accessToken } = data;

      if (mode === "signup") {
        toast.success(
          "Compte créé avec succès 🎉"
        );

        navigate("/connexion", {
          replace: true,
        });

        setMode("login");
      } else {
        toast.success(
          "Connexion réussie"
        );

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        setUser({ email: data.user.email }, accessToken);
        navigate("/", { replace: true });
      }

      }
    } catch (err: any) {
      console.error(
        "Auth error:",
        err
      );

      const status =
        err?.response?.status;

      const serverMessage =
        err?.response?.data
          ?.message ||
        err?.response?.data?.error ||
        err?.message;

      const friendly =
        status === 401 ||
        (serverMessage &&
          serverMessage.includes(
            "Unauthorized"
          ))
          ? "Email ou mot de passe incorrect"
          : serverMessage?.includes(
              "exists"
            )
          ? "Cet email est déjà utilisé"
          : serverMessage ||
            "Erreur serveur";

      showError(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft p-4 sm:p-6">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-l flex items-center justify-center shadow-glow">
            <img
              src="/logo fl.png"
              alt="Sentinelle 237"
              className="w-5 h-5"
            />
          </div>

          <span className="font-display font-bold text-2xl tracking-tight text-foreground">
            Sentinelle 237
          </span>
        </Link>

        <div className="rounded-3xl border border-border bg-card shadow-elegant p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              {mode === "login"
                ? "Bon retour"
                : "Créer un compte"}
            </h1>

            <p className="text-sm text-muted-foreground mt-2">
              {mode === "login"
                ? "Connectez-vous pour accéder à votre veille"
                : "Quelques secondes pour rejoindre Sentinelle 237"}
            </p>

            {/* MESSAGE ERREUR */}
            {errorMessage && (
              <p className="mt-3 text-sm text-red-500 font-medium">
                {errorMessage}
              </p>
            )}
          </div>

          <Tabs
            value={mode}
            onValueChange={
              handleModeChange
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">
                Connexion
              </TabsTrigger>

              <TabsTrigger value="signup">
                Inscription
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent
              value="login"
              className="mt-0"
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="pl-9"
                      
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mot de passe
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}

                  Se connecter
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent
              value="signup"
              className="mt-0"
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-email">
                    Email
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    Mot de passe
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      className="pl-9"
                      
                      minLength={8}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 8 caractères avec
                    majuscule, minuscule,
                    chiffre et caractère
                    spécial.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}

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