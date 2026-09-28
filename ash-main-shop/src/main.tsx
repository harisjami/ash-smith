import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { IMG_FALLBACK } from "./images";

// NOTE: SEO runs from a mount effect inside App (not here) so the shop always
// renders first and nothing at import time can ever blank the page.

// Self-healing images: if a local file in public/images/ is missing on the
// host (e.g. not pushed yet), silently swap in the original web copy so the
// shop never shows a broken image.
document.addEventListener(
  "error",
  (e) => {
    const t = e.target as HTMLImageElement | null;
    if (!t || t.tagName !== "IMG" || t.dataset.fb === "1") return;
    const src = t.getAttribute("src") ?? "";
    const fallback = IMG_FALLBACK[src];
    if (fallback) {
      t.dataset.fb = "1";
      t.src = fallback;
    }
  },
  true,
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
