import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowRight,
  BadgeCheck,
  Camera,
  ChevronLeft,
  ChevronRight,
  Droplets,
  ExternalLink,
  Flame,
  Heart,
  Lock,
  Mail,
  Minus,
  Plus,
  RefreshCcw,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { CARE, byId, discountOf, galleryFor, makerFor, money, products, specsFor } from "../data";
import type { Product } from "../data";

const CARE_ICONS = [Droplets, Sparkles, Archive];

const FORGE_EMAIL = "forge.of.ash1@gmail.com";
const FORGE_FACEBOOK = "https://www.facebook.com/share/1CwzZqoVqj/";

const FacebookGlyph = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M13.4 21.5v-7.1h2.4l.4-2.9h-2.8V9.6c0-.85.3-1.5 1.6-1.5h1.3V5.5c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.6H8.5v2.9h2.4v7.1h2.5z" />
  </svg>
);
import { Stars } from "./ui";
import { useShop } from "../shop";
import { IMG } from "../images";

/** Per-product external checkout destinations (only the products listed here leave the store). */
const EXTERNAL_CHECKOUT: Record<string, string> = {
  "knife-heritage": "https://whop.com/checkout/plan_nPTkKXGGDyTdC",
  "knife-pocket": "https://whop.com/checkout/plan_nPTkKXGGDyTdC",
  "chef-set-5": "https://whop.com/checkout/plan_nPTkKXGGDyTdC",
  "viking-seax": "https://whop.com/checkout/plan_5q552bUCMrSkz",
  "skinner-knife": "https://whop.com/checkout/plan_5q552bUCMrSkz",
  "handmade-sword": "https://whop.com/checkout/plan_HgoFfZMVIllo7",
  "viking-axe-set": "https://whop.com/checkout/plan_HgoFfZMVIllo7",
};

type Review = { id: number; name: string; avatar?: string; rating: number; date: string; text: string; photos?: string[] };

const AVATARS = [IMG.avatarEmily, IMG.avatarMarcus, IMG.avatarDaniel];

const seedReviews = (p: Product): Review[] => {
  const extra = galleryFor(p)[1];
  return [
    { id: 1, name: "Emily Johnson", avatar: AVATARS[0], rating: 5, date: "2 days ago", text: `Exactly as pictured — the ${p.name.toLowerCase()} feels seriously well made. You can tell it's finished by hand, not stamped out.`, photos: [p.img] },
    { id: 2, name: "Marcus Reed", avatar: AVATARS[1], rating: 5, date: "1 week ago", text: "Sharp out of the box and the handle fits my palm perfectly. Shipped fast and packed like a gift.", photos: extra && extra !== p.img ? [extra] : undefined },
    { id: 3, name: "Daniel Okafor", avatar: AVATARS[2], rating: 4, date: "2 weeks ago", text: "Great value for a handmade piece. Took a day of use to break in, but now it's my daily carry." },
  ];
};

const RATING_BARS = [
  { star: 5, pct: 78 },
  { star: 4, pct: 15 },
  { star: 3, pct: 5 },
  { star: 2, pct: 1 },
  { star: 1, pct: 1 },
];

/* ------------------------------- zoom lightbox ------------------------------- */
function Lightbox({ imgs, idx, setIdx, onClose }: { imgs: string[]; idx: number; setIdx: (fn: (i: number) => number) => void; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const reset = () => setZoom(1);
  const change = (d: number) => {
    reset();
    setIdx((i) => (i + d + imgs.length) % imgs.length);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[97] bg-black/95" onClick={onClose}>
      {/* header */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold text-white backdrop-blur">
          {idx + 1} / {imgs.length}
        </span>
        <motion.button whileTap={{ scale: 0.85, rotate: 90 }} onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
          <X className="h-5 w-5" />
        </motion.button>
      </div>

      {/* image */}
      <div className="absolute inset-0 grid place-items-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <motion.div
          key={idx}
          drag={zoom > 1}
          dragConstraints={{ left: -160, right: 160, top: -220, bottom: 220 }}
          dragElastic={0.12}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: zoom }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2.2))}
          className={zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}
        >
          <img src={imgs[idx]} alt="" className="max-h-[78vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" draggable={false} />
        </motion.div>
      </div>

      {/* zoom controls */}
      <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setZoom((z) => Math.max(1, +(z - 0.6).toFixed(1)))} aria-label="Zoom out" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
          <ZoomOut className="h-4 w-4" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={reset} aria-label="Reset zoom" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
          <RotateCcw className="h-4 w-4" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setZoom((z) => Math.min(3, +(z + 0.6).toFixed(1)))} aria-label="Zoom in" className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/30">
          <ZoomIn className="h-4 w-4" />
        </motion.button>
      </div>

      {/* thumbnails + arrows */}
      <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => change(-1)} aria-label="Previous photo" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
        <div className="flex gap-2">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => { reset(); setIdx(() => i); }} aria-label={`Photo ${i + 1}`} className={`h-12 w-12 overflow-hidden rounded-lg ring-2 transition-all ${i === idx ? "ring-amber-400" : "ring-transparent opacity-60"}`}>
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => change(1)} aria-label="Next photo" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* --------------------------------- the page --------------------------------- */
export default function ProductPage({ id }: { id: string }) {
  const p = byId(id);
  const { back, navigate, addToCart, isWished, toggleWish, notify } = useShop();
  const [qty, setQtyLocal] = useState(1);
  const [tab, setTab] = useState<"desc" | "reviews">("desc");
  const [reviews, setReviews] = useState<Review[]>(() => (p ? seedReviews(p) : []));
  const [slide, setSlide] = useState(0);
  const [galIdx, setGalIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const [formRating, setFormRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const gallery = useMemo(() => (p ? galleryFor(p) : []), [p]);
  const specs = useMemo(() => (p ? specsFor(p) : []), [p]);
  const maker = useMemo(() => (p ? makerFor(p) : null), [p]);

  if (!p || !maker) return null;
  const wished = isWished(p.id);
  const externalCheckout = EXTERNAL_CHECKOUT[p.id];
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 6);
  const save = p.oldPrice - p.price;
  const activeReview = reviews[slide % reviews.length];

  const onPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - photos.length);
    setPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const submitReview = () => {
    if (!formRating) return notify("Tap a star rating first");
    if (!formText.trim()) return notify("Write a few words about the product");
    setReviews((r) => [
      { id: Date.now(), name: formName.trim() || "Anonymous", rating: formRating, date: "Just now", text: formText.trim(), photos: photos.length ? photos : undefined },
      ...r,
    ]);
    setFormRating(0);
    setFormName("");
    setFormText("");
    setPhotos([]);
    if (fileRef.current) fileRef.current.value = "";
    setTab("reviews");
    notify("Review published — thank you!", "cart");
  };

  return (
    <div className="pb-28 pt-[72px]">
      {/* top bar */}
      <div className="flex items-center justify-between px-3 pb-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={back} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Go back">
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <p className="font-display text-[14px] font-bold text-slate-900">Product Details</p>
        <div className="flex">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => notify("Share link copied!")} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Share">
            <Share2 className="h-4.5 w-4.5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleWish(p.id)} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Toggle wishlist">
            <Heart className={`h-4.5 w-4.5 ${wished ? "fill-red-500 text-red-500" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* gallery */}
      <motion.div initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="px-4">
        <button onClick={() => setLightbox(true)} aria-label="Open photo viewer" className="group relative block h-80 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.img
              key={gallery[galIdx]}
              src={gallery[galIdx]}
              alt={p.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </AnimatePresence>
          <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[11px] font-extrabold text-white shadow">{discountOf(p)}</span>
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-zinc-900 backdrop-blur">{p.category}</span>
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-extrabold text-white backdrop-blur">
            <ZoomIn className="h-3 w-3" /> Tap to zoom
          </span>
        </button>
        {gallery.length > 1 && (
          <div className="mt-2 flex gap-2">
            {gallery.map((g, i) => (
              <motion.button
                key={g}
                whileTap={{ scale: 0.9 }}
                onClick={() => setGalIdx(i)}
                aria-label={`View photo ${i + 1}`}
                className={`h-14 w-14 overflow-hidden rounded-xl ring-2 transition-all ${i === galIdx ? "ring-amber-500" : "ring-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="px-4 pt-4">
        {/* title + rating */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }}>
          <h1 className="font-display text-[19px] font-extrabold leading-snug tracking-tight text-slate-900">{p.name}</h1>
          {p.spec && <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{p.spec}</p>}
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={p.rating} />
            <span className="text-[10px] font-medium text-slate-400">{reviews.length + 144} reviews</span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
              <BadgeCheck className="h-3.5 w-3.5 fill-emerald-500 text-white" /> In stock
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="font-display text-[24px] font-extrabold text-slate-900">{money(p.price)}</span>
            <span className="text-[13px] font-semibold text-slate-400 line-through">{money(p.oldPrice)}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">Save {money(save)}</span>
          </div>

          {/* trust chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              { icon: Flame, t: "Hand-forged" },
              { icon: ShieldCheck, t: "1-yr warranty" },
              { icon: Lock, t: "Secure checkout" },
            ].map((c) => (
              <span key={c.t} className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-extrabold text-amber-700 ring-1 ring-amber-200/70">
                <c.icon className="h-3 w-3" /> {c.t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* qty + buy now */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.45 }} className="mt-4 flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white">
            <button onClick={() => setQtyLocal((q) => Math.max(1, q - 1))} className="grid h-11 w-9 place-items-center text-slate-500 active:bg-slate-100" aria-label="Decrease quantity">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center font-display text-[14px] font-extrabold text-slate-900">{qty}</span>
            <button onClick={() => setQtyLocal((q) => q + 1)} className="grid h-11 w-9 place-items-center text-slate-500 active:bg-slate-100" aria-label="Increase quantity">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              if (externalCheckout) {
                notify("Opening secure checkout…", "cart");
                window.open(externalCheckout, "_blank", "noopener,noreferrer");
                return;
              }
              addToCart(p.id, qty);
              navigate({ name: "cart" });
            }}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-[13px] font-extrabold text-white shadow-lg shadow-zinc-900/30 transition-colors hover:bg-black"
          >
            {externalCheckout ? "Buy Now · Secure Checkout" : "Buy Now"}
            {externalCheckout ? (
              <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </motion.button>
        </motion.div>

        {/* maker story */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="relative mt-5 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg shadow-zinc-900/25"
        >
          <div className="ambient-grid absolute inset-0" />
          <div className="relative flex gap-3 p-4">
            <img src={maker.img} alt={maker.name} loading="lazy" className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-amber-400/40" />
            <div className="min-w-0 flex-1">
              <p className="text-[8.5px] font-extrabold uppercase tracking-widest text-amber-400">Forged by</p>
              <p className="font-display mt-0.5 text-[14px] font-extrabold text-white">{maker.name}</p>
              <p className="text-[9.5px] font-semibold text-zinc-400">
                {maker.years} years at the anvil · {maker.place}
              </p>
              <p className="mt-1.5 text-[10px] font-medium leading-relaxed text-zinc-300">{maker.line}</p>
              <p className="font-serif mt-1.5 text-[13px] font-medium italic text-amber-300/90">— {maker.name.split(" ")[0]}</p>
            </div>
          </div>
        </motion.div>

        {/* materials + specs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
        >
          <p className="font-display text-[13px] font-extrabold text-slate-900">Materials & Measurements</p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {specs.map((s) => (
              <div key={s.label} className="leading-tight">
                <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-slate-400">{s.label}</p>
                <p className="mt-0.5 text-[11px] font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-dashed border-slate-200 pt-3">
            <p className="font-display text-[12px] font-extrabold text-slate-900">Care Guide</p>
            <div className="mt-2 space-y-2">
              {CARE.map((c, i) => {
                const Icon = CARE_ICONS[i];
                return (
                <div key={c.title} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200/70">
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[10.5px] font-extrabold text-slate-800">{c.title}</p>
                    <p className="mt-0.5 text-[9.5px] font-medium leading-relaxed text-slate-500">{c.text}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* seller card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-900 ring-1 ring-white/10">
              <img src="images/logo.png" alt="Forge Of Ash" className="h-10 w-10 object-contain" />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="flex items-center gap-1 text-[12.5px] font-extrabold text-slate-900">
                Forge Of Ash Workshop
                <BadgeCheck className="h-3.5 w-3.5 fill-zinc-900 text-white" />
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9 · 1,240 sales · Verified Forge
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                notify("Opening your email app…");
                window.location.href = `mailto:${FORGE_EMAIL}?subject=${encodeURIComponent(`Question about ${p.name}`)}`;
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-900 py-2.5 text-[11.5px] font-extrabold text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <Mail className="h-4 w-4" /> Message
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(FORGE_FACEBOOK, "_blank", "noopener,noreferrer")}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1877F2] py-2.5 text-[11.5px] font-extrabold text-white shadow-md shadow-[#1877F2]/30 transition-colors hover:bg-[#0e63cf]"
            >
              <FacebookGlyph className="h-4 w-4" /> Facebook
            </motion.button>
          </div>
        </motion.div>

        {/* tabs */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(["desc", "reviews"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`relative rounded-lg py-2.5 text-[12px] font-extrabold transition-colors ${tab === t ? "text-white" : "text-slate-500"}`}>
              {tab === t && <motion.span layoutId="pd-tab" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-lg bg-zinc-900 shadow" />}
              <span className="relative z-10">{t === "desc" ? "Description" : `Reviews (${reviews.length})`}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "desc" ? (
            <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="pt-4">
              <p className="text-[12px] font-medium leading-relaxed text-slate-500">{p.description}</p>
              <ul className="mt-3 space-y-1.5">
                {["Hand-finished and rigorously tested", "1-year warranty included", "Ships within 24 hours"].map((h) => (
                  <li key={h} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-zinc-100 text-zinc-900">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="pt-4">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
                <div className="text-center">
                  <p className="font-display text-[30px] font-extrabold leading-none text-slate-900">4.9</p>
                  <div className="mt-1 flex justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-1 text-[9px] font-semibold text-slate-400">{reviews.length + 144} ratings</p>
                </div>
                <div className="flex-1 space-y-1">
                  {RATING_BARS.map((b) => (
                    <div key={b.star} className="flex items-center gap-2">
                      <span className="w-2 text-[9px] font-bold text-slate-500">{b.star}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${b.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="h-full rounded-full bg-amber-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 space-y-2.5">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} r={r} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* marquee */}
      <div className="relative mt-6 overflow-hidden bg-zinc-900 py-2.5">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex items-center gap-3 pr-3 text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                  Shop Now <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Hand-Forged Blades <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Free Shipping Over $49 <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* reassurance strip */}
      <div className="px-4 pt-5">
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
          {[
            { icon: Truck, t: "Ships in", s: "5–7 days" },
            { icon: RefreshCcw, t: "Returns", s: "30 days" },
            { icon: ShieldCheck, t: "Warranty", s: "1 year" },
            { icon: Lock, t: "Payment", s: "Secured" },
          ].map((d) => (
            <div key={d.t} className="flex flex-col items-center gap-1 text-center">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200/60">
                <d.icon className="h-4 w-4" />
              </span>
              <p className="text-[9.5px] font-extrabold text-slate-700">{d.t}</p>
              <p className="text-[8px] font-bold text-slate-400">{d.s}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[9px] font-bold text-slate-400">
          Handmade to order — every blade is forged, finished and signed before it ships.
        </p>
      </div>

      {/* reviews carousel */}
      <div className="px-4 pt-6">
        <h2 className="font-display text-[15px] font-bold text-slate-900">What buyers are saying</h2>
        <div className="relative mt-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeReview?.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3">
                {activeReview?.avatar ? (
                  <img src={activeReview.avatar} alt={activeReview.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-[13px] font-extrabold text-white">{activeReview?.name.charAt(0)}</span>
                )}
                <div className="leading-tight">
                  <p className="text-[12px] font-extrabold text-slate-900">{activeReview?.name}</p>
                  <p className="text-[9.5px] font-semibold text-slate-400">{activeReview?.date}</p>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < (activeReview?.rating ?? 0) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                  ))}
                </div>
              </div>
              <p className="mt-2.5 text-[11.5px] font-medium leading-relaxed text-slate-500">“{activeReview?.text}”</p>
              {activeReview?.photos && (
                <div className="mt-2.5 flex gap-2">
                  {activeReview.photos.map((ph, i) => (
                    <img key={i} src={ph} alt="Review" className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="mt-3 flex justify-center gap-1.5">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Review ${i + 1}`} className="relative h-1.5 rounded-full" style={{ width: i === slide % reviews.length ? 16 : 5 }}>
                <span className={`absolute inset-0 rounded-full ${i === slide % reviews.length ? "bg-zinc-900" : "bg-slate-300"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* write a review */}
      <div className="px-4 pt-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <h2 className="font-display text-[15px] font-bold text-slate-900">Rate this product</h2>
          <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">Your review helps fellow makers choose well.</p>

          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.button key={i} whileTap={{ scale: 0.8 }} onClick={() => setFormRating(i)} aria-label={`${i} stars`}>
                <motion.span initial={false} animate={{ scale: formRating >= i ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                  <Star className={`h-6 w-6 ${formRating >= i ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                </motion.span>
              </motion.button>
            ))}
            {formRating > 0 && <span className="ml-2 text-[11px] font-extrabold text-amber-600">{["Poor", "Fair", "Good", "Great", "Excellent"][formRating - 1]}</span>}
          </div>

          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Your name (optional)" className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] font-semibold text-slate-700 outline-none transition-all focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5" />
          <textarea value={formText} onChange={(e) => setFormText(e.target.value)} placeholder="How's the blade? The handle? Tell us everything…" rows={3} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-slate-700 outline-none transition-all focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5" />

          <div className="mt-2.5 flex items-center gap-2">
            {photos.map((ph, i) => (
              <span key={i} className="relative">
                <img src={ph} alt="Upload" className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
                <button onClick={() => setPhotos((prev) => prev.filter((_, x) => x !== i))} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-white shadow" aria-label="Remove photo">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {photos.length < 3 && (
              <button onClick={() => fileRef.current?.click()} className="grid h-14 w-14 place-items-center rounded-lg border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-zinc-900 hover:text-zinc-900" aria-label="Add photos">
                <Camera className="h-5 w-5" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPhotos} />
          </div>

          <motion.button whileTap={{ scale: 0.96 }} onClick={submitReview} className="mt-3.5 w-full rounded-xl bg-zinc-900 py-3 text-[12.5px] font-extrabold text-white shadow-lg shadow-zinc-900/25 transition-colors hover:bg-black">
            Submit Review
          </motion.button>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="px-4 pt-6">
          <h2 className="font-display text-[15px] font-bold text-slate-900">{p.category === "Chef Knives" ? "Complete the set" : "You may also like"}</h2>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4">
            {related.map((r, i) => (
              <motion.button key={r.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }} whileTap={{ scale: 0.95 }} onClick={() => navigate({ name: "product", id: r.id })} className="w-[124px] shrink-0 rounded-2xl border border-slate-200/80 bg-white p-2 text-left shadow-sm">
                <div className="h-20 overflow-hidden rounded-xl bg-slate-100">
                  <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <p className="mt-1.5 line-clamp-1 text-[10.5px] font-bold text-slate-800">{r.name}</p>
                <p className="mt-0.5 font-display text-[12px] font-extrabold text-slate-900">{money(r.price)}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>{lightbox && <Lightbox imgs={gallery} idx={galIdx} setIdx={setGalIdx} onClose={() => setLightbox(false)} />}</AnimatePresence>
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200/80 bg-white p-3.5">
      <div className="flex items-center gap-2.5">
        {r.avatar ? (
          <img src={r.avatar} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-[12px] font-extrabold text-white">{r.name.charAt(0)}</span>
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-1 text-[11.5px] font-extrabold text-slate-900">
            {r.name}
            {r.avatar && <BadgeCheck className="h-3 w-3 fill-zinc-900 text-white" />}
          </p>
          <p className="text-[9px] font-semibold text-slate-400">{r.date}</p>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-2.5 w-2.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
          ))}
        </div>
      </div>
      <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-500">{r.text}</p>
      {r.photos && (
        <div className="mt-2 flex gap-2">
          {r.photos.map((ph, i) => (
            <img key={i} src={ph} alt="Review" className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
          ))}
        </div>
      )}
    </motion.div>
  );
}
