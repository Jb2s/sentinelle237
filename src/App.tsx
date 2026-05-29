import { ThemeProvider } from "@/context/theme-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index           from "./pages/Index.tsx";
import ReadLater       from "./pages/ReadLater.tsx";
import Annotated       from "./pages/Annotated.tsx";
import NotFound        from "./pages/NotFound.tsx";
import TrainAlexandre  from "./pages/TrainAlexandre.tsx";
import Feed            from "./pages/Feeds.tsx";
import AddFeeds        from "./pages/AddFeeds.tsx";
import SearchPage      from "./pages/Search.tsx";
import Tools           from "./pages/Tools.tsx";
import Help            from "./pages/Help.tsx";
import SynthesisSettings from "./pages/SynthesisSettings.tsx";
import AuthPage        from "./pages/AuthPage.tsx";
import ProtectedRoute  from "@/routes/ProtectedRoute";
import SourcePage      from "@/pages/SourcePage";

const queryClient = new QueryClient();

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition:    true,
            v7_relativeSplatPath:  true,
          }}
        >
          <Routes>
            {/* Routes publiques */}
            <Route path="/connexion"   element={<AuthPage initialMode="login"  />} />
            <Route path="/inscription" element={<AuthPage initialMode="signup" />} />

            {/* Routes protégées */}
            <Route path="/"                        element={<P><Index /></P>} />
            <Route path="/a-lire-plus-tard"        element={<P><ReadLater /></P>} />
            <Route path="/annotes"                 element={<P><Annotated /></P>} />
            <Route path="/entrainer-alexandre"     element={<P><TrainAlexandre /></P>} />
            <Route path="/flux/:slug"              element={<P><Feed /></P>} />
            <Route path="/ajouter-flux"            element={<P><AddFeeds /></P>} />
            <Route path="/recherche"               element={<P><SearchPage /></P>} />
            <Route path="/outils"                  element={<P><Tools /></P>} />
            <Route path="/help"                    element={<P><Help /></P>} />
            <Route path="/tools/synthetisation-IA" element={<P><SynthesisSettings /></P>} />
            <Route path="/source/:id"              element={<P><SourcePage /></P>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
