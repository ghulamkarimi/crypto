import ReactDOM from "react-dom/client";
// Schriften werden vom eigenen Server geliefert (keine Verbindung zu Google)
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/big-shoulders-display/600";
import "@fontsource/big-shoulders-display/700";
import "@fontsource/big-shoulders-display/800";
import "./index.css";
import "./i18n";
import "react-multi-carousel/lib/styles.css";
import ReduxProvider from "./feature/ReduxProvider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReduxProvider>
    <RouterProvider router={router} />
  </ReduxProvider>
);

// Kaputte Bilder (gelöschte Cloudinary-Dateien, fehlende Uploads) durch einen ruhigen Platzhalter ersetzen
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#242220"/><path d="M48 70l22-26 16 18 12-13 14 21z" fill="#34312c"/><circle cx="56" cy="34" r="8" fill="#34312c"/></svg>'
  );
document.addEventListener(
  "error",
  (e) => {
    const el = e.target;
    if (el instanceof HTMLImageElement && !el.dataset.fallback) {
      el.dataset.fallback = "1";
      el.src = PLACEHOLDER;
    }
  },
  true
);
