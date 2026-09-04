/* ============================================================================
   🛠️  SHOP PORTAL STORE
   ----------------------------------------------------------------------------
   Holds products the owner creates in the Admin Portal, plus which built-in
   listings are hidden. Everything persists in the visitor's browser storage,
   merges into the live shop at boot, and any change re-renders the app.
   ========================================================================== */
import { products } from "./data";
import type { Product } from "./data";

const PRODUCTS_KEY = "foa_portal_products";
const HIDDEN_KEY = "foa_portal_hidden";
export const CHANGE_EVENT = "foa-store-change";

/* ---------- safe storage ---------- */
const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/* ---------- state ---------- */
const customs = read<Product[]>(PRODUCTS_KEY, []);
const hiddenIds = read<string[]>(HIDDEN_KEY, []);

// merge at boot: owner listings join the catalog, hidden built-ins leave it
customs.forEach((p) => {
  p.custom = true;
  if (!products.some((x) => x.id === p.id)) products.push(p);
});
hiddenIds.forEach((id) => {
  const i = products.findIndex((p) => p.id === id && !p.custom);
  if (i >= 0) products.splice(i, 1);
});

const emit = () => window.dispatchEvent(new Event(CHANGE_EVENT));

/* ---------- admin session ---------- */
const ADMIN_KEY = "foa_admin_session";
export const ADMIN_USER = "ForgeOfAsh";
export const ADMIN_PASS = "Ash1022#";

export const isAdmin = () => read<string>(ADMIN_KEY, "") === "granted";
export const grantAdmin = () => {
  write(ADMIN_KEY, "granted");
  emit();
};
export const revokeAdmin = () => {
  try {
    localStorage.removeItem(ADMIN_KEY);
  } catch {
    /* ignore */
  }
  emit();
};

/* ---------- listing actions ---------- */
export const customProducts = () => products.filter((p) => p.custom);

export const addProduct = (p: Product): boolean => {
  p.custom = true;
  products.unshift(p);
  const ok = write(PRODUCTS_KEY, customProducts());
  emit();
  return ok;
};

export const deleteProduct = (id: string) => {
  const i = products.findIndex((p) => p.id === id && p.custom);
  if (i >= 0) products.splice(i, 1);
  write(PRODUCTS_KEY, customProducts());
  emit();
};

export const isHidden = (id: string) => hiddenIds.includes(id);

export const toggleHidden = (id: string) => {
  const idx = products.findIndex((p) => p.id === id);
  const currentlyHidden = hiddenIds.includes(id);
  if (currentlyHidden) {
    // restore: we don't keep a copy, so built-ins reappear from a fresh reload
    hiddenIds.splice(hiddenIds.indexOf(id), 1);
    write(HIDDEN_KEY, hiddenIds);
    emit();
    return;
  }
  if (idx >= 0 && !products[idx].custom) {
    products.splice(idx, 1);
    hiddenIds.push(id);
    write(HIDDEN_KEY, hiddenIds);
    emit();
  }
};

/* ---------- image helper: shrink uploads so storage never overflows ---------- */
export const fileToDataUrl = (file: File, max = 900): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(reader.result as string);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

export const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='#18181b'/><text x='200' y='208' font-family='sans-serif' font-size='20' fill='#f59e0b' text-anchor='middle'>Forge Of Ash</text></svg>`,
  );
