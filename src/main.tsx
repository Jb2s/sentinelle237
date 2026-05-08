import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ViewModeProvider } from "@/context/ViewModeContext";

createRoot(document.getElementById("root")!).render(
  <ViewModeProvider>
    <App />
  </ViewModeProvider>
);
