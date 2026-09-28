import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Eye,
  EyeOff,
  FileCode2,
  Globe,
  ImagePlus,
  KeyRound,
  LayoutGrid,
  Lock,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { categoryMeta, money, products } from "../data";
import type { Product } from "../data";
import {
  ADMIN_PASS,
  ADMIN_USER,
  PLACEHOLDER_IMG,
  addProduct,
  deleteProduct,
  fileToDataUrl,
  getSeo,
  grantAdmin,
  isAdmin,
  isHidden,
  revokeAdmin,
  saveSeo,
  toggleHidden,
  updateProduct,
} from "../store";
import { applySeoSettings, buildSitemapXml, seoAudit } from "../seo";
import { useShop } from "../shop";

const CATS = categoryMeta.map((c) => c.name);

/* ------------------------------- login gate ------------------------------- */
function Login() {
  const { notify } = useShop();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      grantAdmin();
      notify("Welcome back, owner", "cart");
    } else {
      setError(true);
      setShake((s) => s + 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 pt-10">
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -10, 10, -7, 7, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[26px] bg-[#0c0c0e] p-7 shadow-2xl shadow-zinc-900/40 ring-1 ring-white/[0.07]"
      >
        <div className="ambient-grid absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[70px]" />

        <div className="relative text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-zinc-900 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
            <Lock className="h-7 w-7 text-amber-400" />
          </span>
          <h1 className="font-display mt-4 text-[22px] font-extrabold tracking-tight text-white">Forge Portal</h1>
          <p className="mt-1 text-[10.5px] font-semibold text-zinc-500">Owner access only — no sign-ups, no password resets.</p>
        </div>

        <div className="relative mt-6 space-y-3">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={user}
              onChange={(e) => { setUser(e.target.value); setError(false); }}
              placeholder="Username"
              autoComplete="username"
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3 pl-10 pr-3 text-[12.5px] font-semibold text-white outline-none transition-all placeholder:text-zinc-500 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3 pl-10 pr-3 text-[12.5px] font-semibold text-white outline-none transition-all placeholder:text-zinc-500 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-lg bg-red-500/15 px-3 py-2 text-[10.5px] font-bold text-red-300 ring-1 ring-red-500/30">
                Wrong username or password. Access denied.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button whileTap={{ scale: 0.96 }} onClick={submit} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-[13px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-300">
            <ShieldCheck className="h-4 w-4" /> Unlock Portal
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ product form ------------------------------ */
type Mat = { label: string; value: string };

function ProductForm({ onDone, initial }: { onDone: () => void; initial?: Product }) {
  const { notify } = useShop();
  const [name, setName] = useState(initial?.name ?? "");
  const [spec, setSpec] = useState(initial?.spec ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? CATS[0]);
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [oldPrice, setOldPrice] = useState(initial ? String(initial.oldPrice) : "");
  const [discountPct, setDiscountPct] = useState("");
  const [buyLink, setBuyLink] = useState(initial?.buyLink ?? "");
  const [images, setImages] = useState<string[]>(initial ? (initial.gallery?.length ? initial.gallery : [initial.img]) : []);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [details, setDetails] = useState(initial?.details ?? "");
  const [mats, setMats] = useState<Mat[]>(initial?.materials ?? []);
  const [care, setCare] = useState(initial?.care?.join("\n") ?? "");
  const [storyOn, setStoryOn] = useState(Boolean(initial?.story));
  const [storyLabel, setStoryLabel] = useState(initial?.story?.label ?? "");
  const [storyCaption, setStoryCaption] = useState(initial?.story?.caption ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [seoTitle, setSeoTitle] = useState(initial?.seo?.title ?? "");
  const [seoDesc, setSeoDesc] = useState(initial?.seo?.description ?? "");

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - images.length);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => fileToDataUrl(f)));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      notify("Could not read that image");
    }
    setUploading(false);
    e.target.value = "";
  };

  const applyDiscount = () => {
    const p = parseFloat(price);
    const d = parseFloat(discountPct);
    if (p > 0 && d > 0 && d < 100) setOldPrice((p / (1 - d / 100)).toFixed(2));
  };

  const save = () => {
    const priceN = parseFloat(price);
    if (name.trim().length < 2) return notify("Add a product name");
    if (!priceN || priceN <= 0) return notify("Add a valid sale price");
    const oldN = parseFloat(oldPrice);
    const payload = {
      name: name.trim(),
      spec: spec.trim() || undefined,
      category: category as Product["category"],
      price: priceN,
      oldPrice: oldN > priceN ? oldN : Math.round(priceN * 1.3 * 100) / 100,
      img: images[0] ?? PLACEHOLDER_IMG,
      gallery: images.length ? images : undefined,
      description: description.trim() || "Hand-forged at Forge Of Ash — finished, signed and shipped from the anvil.",
      details: details.trim() || undefined,
      materials: mats.filter((m) => m.label.trim() && m.value.trim()),
      care: care.split("\n").map((l) => l.trim()).filter(Boolean),
      buyLink: buyLink.trim() || undefined,
      featured,
      seo: seoTitle.trim() || seoDesc.trim() ? { title: seoTitle.trim() || undefined, description: seoDesc.trim() || undefined } : undefined,
      story: storyOn ? { label: storyLabel.trim() || name.trim().split(" ")[0], caption: storyCaption.trim() || `Fresh from the forge — ${name.trim()}.` } : undefined,
    };
    if (initial) {
      const ok = updateProduct(initial.id, payload);
      notify(ok ? "Changes saved — live on the shop" : "Saved, but storage is full", ok ? "cart" : "info");
      onDone();
      return;
    }
    const product: Product = {
      id: `custom-${Date.now()}`,
      rating: 5,
      reviews: "0",
      ...payload,
    };
    const ok = addProduct(product);
    notify(ok ? "Listing published to the shop" : "Saved, but storage is full — image too large", ok ? "cart" : "info");
    onDone();
  };

  const field = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] font-semibold text-slate-700 outline-none transition-all focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5";
  const label = "text-[9px] font-extrabold uppercase tracking-widest text-slate-400";

  return (
    <div className="space-y-5 px-4 pt-4">
      {/* photos */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Photos</p>
        <p className="mt-0.5 text-[9.5px] font-semibold text-slate-400">First photo is the cover · up to 5 · auto-resized</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <span key={i} className="relative">
              <img src={img} alt="" className={`h-16 w-16 rounded-xl object-cover ring-2 ${i === 0 ? "ring-amber-500" : "ring-slate-200"}`} />
              {i === 0 && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-1.5 text-[7px] font-extrabold text-slate-900">COVER</span>}
              <button onClick={() => setImages((a) => a.filter((_, x) => x !== i))} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-white" aria-label="Remove photo">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {images.length < 5 && (
            <label className={`grid h-16 w-16 cursor-pointer place-items-center rounded-xl border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-amber-500 hover:text-amber-600 ${uploading ? "opacity-50" : ""}`}>
              {uploading ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-amber-500 border-t-transparent" /> : <ImagePlus className="h-5 w-5" />}
              <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
            </label>
          )}
        </div>
      </section>

      {/* identity */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Listing</p>
        <div className="mt-3 space-y-3">
          <div>
            <p className={label}>Product name *</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Handmade Bearded Axe" className={`mt-1 ${field}`} />
          </div>
          <div>
            <p className={label}>Short line (subtitle)</p>
            <input value={spec} onChange={(e) => setSpec(e.target.value)} placeholder="Forged steel · Ash haft" className={`mt-1 ${field}`} />
          </div>
          <div>
            <p className={label}>Category</p>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`mt-1 ${field}`}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Pricing & Discount</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className={label}>Sale price ($) *</p>
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="480" className={`mt-1 ${field}`} />
          </div>
          <div>
            <p className={label}>Original price ($)</p>
            <input value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} type="number" min="0" placeholder="640" className={`mt-1 ${field}`} />
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <input value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} type="number" min="1" max="90" placeholder="% off" className={`w-24 ${field}`} />
          <motion.button whileTap={{ scale: 0.94 }} onClick={applyDiscount} className="rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[10px] font-extrabold text-amber-400">
            Apply %
          </motion.button>
          {parseFloat(price) > 0 && parseFloat(oldPrice) > parseFloat(price) && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-extrabold text-emerald-700">
              -{Math.round((1 - parseFloat(price) / parseFloat(oldPrice)) * 100)}%
            </span>
          )}
        </div>
      </section>

      {/* buy now link */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Buy Now Link</p>
        <p className="mt-0.5 text-[9.5px] font-semibold text-slate-400">Where the shop's Buy Now button sends buyers. Leave empty for the in-store cart.</p>
        <input value={buyLink} onChange={(e) => setBuyLink(e.target.value)} placeholder="https://whop.com/checkout/…" className={`mt-2 ${field}`} />
      </section>

      {/* copy */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Description & Details</p>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Tell the story of this piece…" className={`mt-2 w-full resize-none ${field}`} />
        <p className={`${label} mt-3`}>Dimensions / extra details</p>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={2} placeholder="Blade 7 in · Overall 24 in · 1.2 kg" className={`mt-1 w-full resize-none ${field}`} />
      </section>

      {/* materials */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Materials & Measurements</p>
        <div className="mt-2 space-y-2">
          {mats.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input value={m.label} onChange={(e) => setMats((a) => a.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} placeholder="Steel" className={field} />
              <input value={m.value} onChange={(e) => setMats((a) => a.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} placeholder="1095, 58 HRC" className={field} />
              <button onClick={() => setMats((a) => a.filter((_, j) => j !== i))} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label="Remove row">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setMats((a) => [...a, { label: "", value: "" }])} className="mt-2 flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-[10px] font-extrabold text-slate-500 hover:border-zinc-900 hover:text-zinc-900">
          <Plus className="h-3.5 w-3.5" /> Add row
        </motion.button>
      </section>

      {/* care */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Care Guide</p>
        <p className="mt-0.5 text-[9.5px] font-semibold text-slate-400">One tip per line</p>
        <textarea value={care} onChange={(e) => setCare(e.target.value)} rows={3} placeholder={"Oil the blade after use\nHone on a 1000-grit stone\nStore dry in its sheath"} className={`mt-2 w-full resize-none ${field}`} />
      </section>

      {/* placement */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display text-[13px] font-extrabold text-slate-900">Placement</p>
        <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
          <span className="flex items-center gap-2 text-[11.5px] font-extrabold text-slate-700"><Sparkles className="h-4 w-4 text-amber-500" /> Add a story bubble</span>
          <button onClick={() => setStoryOn((v) => !v)} className={`relative h-6 w-11 rounded-full transition-colors ${storyOn ? "bg-amber-400" : "bg-slate-300"}`} aria-label="Toggle story">
            <motion.span animate={{ x: storyOn ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </label>
        <AnimatePresence>
          {storyOn && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <input value={storyLabel} onChange={(e) => setStoryLabel(e.target.value)} placeholder="Story label (e.g. New Drop)" className={`mt-2 ${field}`} />
              <input value={storyCaption} onChange={(e) => setStoryCaption(e.target.value)} placeholder="Story caption" className={`mt-2 ${field}`} />
            </motion.div>
          )}
        </AnimatePresence>
        <label className="mt-2.5 flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
          <span className="flex items-center gap-2 text-[11.5px] font-extrabold text-slate-700"><Package className="h-4 w-4 text-amber-500" /> Feature in Best Sellers rail</span>
          <button onClick={() => setFeatured((v) => !v)} className={`relative h-6 w-11 rounded-full transition-colors ${featured ? "bg-amber-400" : "bg-slate-300"}`} aria-label="Toggle featured">
            <motion.span animate={{ x: featured ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </label>
      </section>

      {/* SEO */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display flex items-center gap-1.5 text-[13px] font-extrabold text-slate-900">
          <SearchCheck className="h-4 w-4 text-amber-500" /> Search SEO
        </p>
        <p className="mt-0.5 text-[9.5px] font-semibold text-slate-400">How this listing appears on Google. Leave empty for auto-generated tags.</p>
        <div className="mt-3 space-y-3">
          <div>
            <p className={label}>SEO title · {seoTitle.length}/60</p>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value.slice(0, 60))} placeholder="Handmade Bearded Axe — $480 | Forge Of Ash" className={`mt-1 ${field}`} />
          </div>
          <div>
            <p className={label}>SEO description · {seoDesc.length}/160</p>
            <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value.slice(0, 160))} rows={2} placeholder="Hand-forged bearded axe with ash haft…" className={`mt-1 w-full resize-none ${field}`} />
          </div>
        </div>
        {/* live SERP preview */}
        <div className="mt-3 rounded-xl border border-slate-200 bg-[#f8f9fa] p-3.5">
          <p className="text-[10px] text-[#4d5156]">forgeofash.com › shop › {category.toLowerCase().replace(/\s/g, "-")}</p>
          <p className="mt-0.5 truncate text-[15px] leading-snug text-[#1a0dab]">{seoTitle || `${name || "Product name"} — Forge Of Ash`}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#4d5156]">{seoDesc || description || "Your SEO description will show here — write one to win the click."}</p>
        </div>
      </section>

      <motion.button whileTap={{ scale: 0.96 }} onClick={save} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-[13px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-300">
        <Upload className="h-4 w-4" /> Publish to Shop
      </motion.button>
    </div>
  );
}

/* ------------------------------- listings tab ------------------------------ */
function Listings({ onEdit }: { onEdit: (p: Product) => void }) {
  const { notify } = useShop();
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...products].sort((a, b) => Number(b.custom ?? false) - Number(a.custom ?? false)).filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="px-4 pt-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search listings…" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-[12px] font-semibold text-slate-700 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5" />
      </div>

      <div className="mt-3 space-y-2.5">
        {list.map((p) => (
          <motion.div key={p.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
            <img src={p.img} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-black/5" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[11.5px] font-extrabold text-slate-900">{p.name}</p>
              <p className="mt-0.5 text-[9px] font-semibold text-slate-400">{p.category} · {money(p.price)}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {p.custom && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[7.5px] font-extrabold text-amber-700">PORTAL</span>}
                {p.story && <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[7.5px] font-extrabold text-blue-700">STORY</span>}
                {p.featured && <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[7.5px] font-extrabold text-emerald-700">FEATURED</span>}
                {isHidden(p.id) && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[7.5px] font-extrabold text-red-600">HIDDEN</span>}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-1.5">
              <button onClick={() => onEdit(p)} className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700" aria-label="Edit listing">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {p.custom ? (
                confirmId === p.id ? (
                  <motion.button initial={{ scale: 0.8 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }} onClick={() => { deleteProduct(p.id); setConfirmId(null); notify("Listing removed from the shop"); }} className="rounded-lg bg-red-500 px-2.5 py-1.5 text-[9px] font-extrabold text-white">
                    Confirm
                  </motion.button>
                ) : (
                  <button onClick={() => setConfirmId(p.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500" aria-label="Delete listing">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )
              ) : (
                <button onClick={() => { toggleHidden(p.id); notify(isHidden(p.id) ? "Listing restored" : "Listing hidden from the shop"); }} className={`grid h-8 w-8 place-items-center rounded-lg ${isHidden(p.id) ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500 hover:bg-zinc-900 hover:text-white"}`} aria-label="Toggle visibility">
                  {isHidden(p.id) ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-[11px] font-bold text-slate-400">No listings match "{query}".</p>}
      </div>
    </div>
  );
}

/* ---------------------------------- SEO tab --------------------------------- */
function SeoTab() {
  const { notify } = useShop();
  const seo = getSeo();
  const [desc, setDesc] = useState(seo.siteDescription ?? "");
  const [gsc, setGsc] = useState(seo.gsc ?? "");
  const [ga, setGa] = useState(seo.ga ?? "");
  const [sitemap, setSitemap] = useState("");
  const audit = seoAudit();
  const passed = audit.filter((a) => a.ok).length;

  const save = () => {
    const ok = saveSeo({ siteDescription: desc.trim(), gsc: gsc.trim(), ga: ga.trim() });
    applySeoSettings();
    notify(ok ? "SEO settings applied to the live shop" : "Saved, but storage blocked", ok ? "cart" : "info");
  };

  const copySitemap = async () => {
    try {
      await navigator.clipboard.writeText(sitemap);
      notify("Sitemap copied — paste it into sitemap.xml", "cart");
    } catch {
      notify("Copy blocked — select the text manually");
    }
  };

  const field = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] font-semibold text-slate-700 outline-none transition-all focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5";
  const label = "text-[9px] font-extrabold uppercase tracking-widest text-slate-400";

  return (
    <div className="space-y-4 px-4 pt-4">
      {/* audit */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-display flex items-center gap-1.5 text-[13px] font-extrabold text-slate-900">
            <SearchCheck className="h-4 w-4 text-amber-500" /> SEO Health
          </p>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-700">{passed}/{audit.length}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(passed / audit.length) * 100}%` }} transition={{ duration: 0.7, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
        </div>
        <div className="mt-3 space-y-1.5">
          {audit.map((a) => (
            <p key={a.label} className="flex items-center gap-2 text-[10.5px] font-bold text-slate-600">
              {a.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-slate-300" />}
              {a.label}
            </p>
          ))}
        </div>
      </section>

      {/* site settings */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display flex items-center gap-1.5 text-[13px] font-extrabold text-slate-900">
          <Globe className="h-4 w-4 text-amber-500" /> Google Integration
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <p className={label}>Site meta description · {desc.length}/160</p>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 160))} rows={2} placeholder="What Google shows under your title in search results…" className={`mt-1 w-full resize-none ${field}`} />
          </div>
          <div>
            <p className={label}>Search Console verification code</p>
            <input value={gsc} onChange={(e) => setGsc(e.target.value)} placeholder="Paste the code from GSC → HTML tag" className={`mt-1 ${field}`} />
          </div>
          <div>
            <p className={label}>GA4 Measurement ID</p>
            <input value={ga} onChange={(e) => setGa(e.target.value)} placeholder="G-XXXXXXXXXX" className={`mt-1 ${field}`} />
          </div>
          <motion.button whileTap={{ scale: 0.96 }} onClick={save} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-[12px] font-extrabold text-slate-900 shadow-md shadow-amber-500/25 hover:bg-amber-300">
            <ShieldCheck className="h-4 w-4" /> Apply to Live Shop
          </motion.button>
        </div>
      </section>

      {/* sitemap */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="font-display flex items-center gap-1.5 text-[13px] font-extrabold text-slate-900">
          <FileCode2 className="h-4 w-4 text-amber-500" /> Sitemap
        </p>
        <p className="mt-1 text-[9.5px] font-semibold leading-relaxed text-slate-400">
          A static sitemap.xml ships with the site. Regenerate it here after adding listings, then replace public/sitemap.xml or submit the XML in Search Console.
        </p>
        <div className="mt-2.5 flex gap-2">
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => setSitemap(buildSitemapXml())} className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-[10.5px] font-extrabold text-amber-400">
            Generate from {products.length} listings
          </motion.button>
          {sitemap && (
            <motion.button whileTap={{ scale: 0.94 }} onClick={copySitemap} className="flex items-center gap-1.5 rounded-xl border border-zinc-900 px-3.5 py-2.5 text-[10.5px] font-extrabold text-zinc-900">
              <Copy className="h-3.5 w-3.5" /> Copy
            </motion.button>
          )}
        </div>
        {sitemap && <textarea readOnly value={sitemap} rows={6} className={`mt-2 w-full resize-none font-mono text-[8.5px] leading-relaxed text-slate-500 ${field}`} />}
      </section>
    </div>
  );
}

/* --------------------------------- the page -------------------------------- */
export default function AdminPage() {
  const { back, notify } = useShop();
  const [tab, setTab] = useState<"list" | "add" | "seo">("list");
  const [editing, setEditing] = useState<Product | null>(null);
  const authed = isAdmin();

  const startEdit = (p: Product) => {
    setEditing(p);
    setTab("add");
  };

  const customs = products.filter((p) => p.custom);
  const stories = products.filter((p) => p.story).length;

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-28 pt-[72px]">
      {/* top bar */}
      <div className="flex items-center gap-3 px-3 pb-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={back} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Go back">
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <p className="font-display flex-1 text-[15px] font-extrabold text-slate-900">{authed ? "Forge Portal" : "Owner Login"}</p>
        {authed && (
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { revokeAdmin(); notify("Signed out of the portal"); }} className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-[9.5px] font-extrabold text-white">
            <LogOut className="h-3 w-3" /> Sign out
          </motion.button>
        )}
      </div>

      {!authed ? (
        <Login />
      ) : (
        <>
          {/* stats */}
          <div className="grid grid-cols-3 gap-2.5 px-4">
            {[
              { icon: Package, v: products.length, l: "Live listings" },
              { icon: Upload, v: customs.length, l: "Portal uploads" },
              { icon: Sparkles, v: stories, l: "Active stories" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-slate-200/80 bg-white p-3 text-center shadow-sm">
                <s.icon className="mx-auto h-4 w-4 text-amber-500" />
                <p className="font-display mt-1 text-[18px] font-extrabold text-slate-900">{s.v}</p>
                <p className="text-[8px] font-extrabold uppercase tracking-wide text-slate-400">{s.l}</p>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div className="mx-4 mt-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1">
            {([["list", "Listings", LayoutGrid], ["add", "Add", Plus], ["seo", "SEO", Globe]] as const).map(([id, l, Icon]) => (
              <button key={id} onClick={() => setTab(id)} className={`relative rounded-lg py-2.5 text-[11.5px] font-extrabold transition-colors ${tab === id ? "text-white" : "text-slate-500"}`}>
                {tab === id && <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-lg bg-zinc-900 shadow" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                <span className="relative z-10 flex items-center justify-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {l}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "list" ? (
              <motion.div key="list" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.22 }}>
                <Listings onEdit={startEdit} />
              </motion.div>
            ) : tab === "add" ? (
              <motion.div key={editing?.id ?? "new"} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.22 }}>
                {editing && (
                  <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-amber-100 px-3.5 py-2.5 text-[10.5px] font-extrabold text-amber-800 ring-1 ring-amber-300">
                    <Pencil className="h-3.5 w-3.5" /> Editing “{editing.name}” — save to push changes live
                    <button onClick={() => setEditing(null)} className="ml-auto text-amber-700 underline">cancel</button>
                  </div>
                )}
                <ProductForm key={editing?.id ?? "new"} initial={editing ?? undefined} onDone={() => { setEditing(null); setTab("list"); }} />
              </motion.div>
            ) : (
              <motion.div key="seo" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.22 }}>
                <SeoTab />
              </motion.div>
            )}
          </AnimatePresence>

          {/* floating camera shortcut */}
          {tab === "list" && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => { setEditing(null); setTab("add"); }}
              aria-label="Add product"
              className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-amber-400 text-slate-900 shadow-xl shadow-amber-500/40"
            >
              <Camera className="h-6 w-6" />
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}
