import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ReadLater from "./pages/ReadLater.tsx";
import Annotated from "./pages/Annotated.tsx";
import NotFound from "./pages/NotFound.tsx";
import TrainAlexandre from "./pages/TrainAlexandre.tsx";
import Feed from "./pages/Feeds.tsx";
import AddFeeds from "./pages/AddFeeds.tsx";
import SearchPage from "./pages/Search.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/a-lire-plus-tard" element={<ReadLater />} />
          <Route path="/annotes" element={<Annotated />} />
          <Route path="/entrainer-alexandre" element={<TrainAlexandre />} />
          <Route path="/flux/:slug" element={<Feed />} />
          <Route path="/ajouter-flux" element={<AddFeeds />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;