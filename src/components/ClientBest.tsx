import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flame, Heart, Star } from "lucide-react";
import { byId, discountOf, money } from "../data";
import type { Product } from "../data";
import { SectionHeader } from "./ui";
import { useShop } from "../shop";

gsap.registerPlugin(ScrollTrigger);

const center = byId("knife-heritage")!;
const corners: (Product & { pos: string; rot: string })[] = [
  { ...byId("knife-pocket")!, pos: "left-0 top-0", rot: "-rotate-2" },
  { ...byId("chef-single")!, pos: "right-0 top-0", rot: "rotate-2" },
  { ...byId("knife-artisan")!, pos: "left-0 bottom-0", rot: "rotate-1" },
  { ...byId("chef-duo")!, pos: "right-0 bottom-0", rot: "-rotate-1" },
];

function CornerCard({ p, index }: { p: (typeof corners)[number]; index: number }) {
  const { navigate } = useShop();
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: 0.15 + index * 0.12, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ y: -5, rotate: 0 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate({ name: "product", id: p.id })}
      className={`group absolute ${p.pos} z-10 w-[29%] ${p.rot} overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 text-left shadow-md transition-shadow hover:shadow-xl`}
    >
      <div className="relative h-[72px] overflow-hidden rounded-xl bg-slate-100">
        <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute left-1 top-1 rounded bg-red-500 px-1 py-0.5 text-[7.5px] font-extrabold text-white shadow">{discountOf(p)}</span>
      </div>
      <p className="mt-1.5 line-clamp-1 text-[9px] font-extrabold text-slate-900">{p.name}</p>
      <p className="font-display text-[10px] font-extrabold text-amber-600">{money(p.price)}</p>
    </motion.button>
  );
}

export default function ClientBest() {
  const { navigate } = useShop();
  const root = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGPathElement>(null);

  // the dashed ring draws itself card-to-card as the section scrolls into view
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (maskRef.current) {
        gsap.set(maskRef.current, { strokeDashoffset: 1 });
        gsap.to(maskRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 82%", end: "center 55%", scrub: 0.6 },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const ring = "M 15 20 Q 15 14 21 14 H 79 Q 85 14 85 20 V 80 Q 85 86 79 86 H 21 Q 15 86 15 80 Z";

  return (
    <>
      <SectionHeader title="Client Best" sub="The forge circle" onViewAll={() => navigate({ name: "category", cat: "All" })} />
      <div ref={root} className="relative mx-auto h-[352px] max-w-[400px] px-4">
        {/* animated dashed connector ring */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
          <defs>
            <mask id="cb-mask" maskUnits="userSpaceOnUse">
              <path ref={maskRef} d={ring} stroke="white" strokeWidth="8" fill="none" pathLength={1} strokeDasharray="1" vectorEffect="non-scaling-stroke" />
            </mask>
          </defs>
          <path d={ring} stroke="#e4e4e7" strokeWidth="1.4" strokeDasharray="3 6" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
          <path d={ring} stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" className="light-line" mask="url(#cb-mask)" />
        </svg>

        {/* corner satellites */}
        {corners.map((p, i) => (
          <CornerCard key={p.id} p={p} index={i} />
        ))}

        {/* center flagship */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 18 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate({ name: "product", id: center.id })}
          className="group absolute left-1/2 top-1/2 z-20 w-[40%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-zinc-900 p-2.5 text-left shadow-2xl shadow-zinc-900/40 ring-1 ring-amber-400/30"
        >
          <span className="animate-shine pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" />
          <div className="relative h-[104px] overflow-hidden rounded-xl">
            <img src={center.img} alt={center.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute left-1.5 top-1.5 rounded-md bg-amber-400 px-1.5 py-0.5 text-[8px] font-extrabold text-slate-900 shadow">{discountOf(center)}</span>
          </div>
          <div className="relative mt-2">
            <span className="inline-block rounded-full bg-amber-400/15 px-2 py-0.5 text-[7.5px] font-extrabold uppercase tracking-wide text-amber-300 ring-1 ring-amber-400/30">
              Client Best Pick
            </span>
            <h3 className="font-display mt-1 line-clamp-1 text-[11.5px] font-extrabold text-white">{center.name}</h3>
            <div className="mt-1 flex items-center justify-between">
              <p className="flex items-baseline gap-1">
                <span className="font-display text-[13px] font-extrabold text-amber-400">{money(center.price)}</span>
                <span className="text-[8.5px] font-semibold text-zinc-500 line-through">{money(center.oldPrice)}</span>
              </p>
              <span className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[9px] font-extrabold text-zinc-300">{center.rating}.0</span>
              </span>
            </div>
            <span className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-amber-400 py-1.5 text-[9.5px] font-extrabold text-slate-900 shadow-md shadow-amber-500/30 transition-colors group-hover:bg-amber-300">
              View the pick <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.button>
      </div>
    </>
  );
}

/* ------------------------- bento showcase: wide + halves ------------------------- */
const bentoWide = byId("chef-set-5")!;
const bentoHalves = [byId("knife-rustic")!, byId("chef-cleaver")!];

function BentoHalf({ p, index }: { p: Product; index: number }) {
  const { navigate, isWished, toggleWish } = useShop();
  const wished = isWished(p.id);
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: 0.12 + index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate({ name: "product", id: p.id })}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2.5 text-left shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-36 overflow-hidden rounded-xl bg-slate-100">
        <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute left-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow">{discountOf(p)}</span>
        <motion.span
          whileTap={{ scale: 0.7 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWish(p.id);
          }}
          role="button"
          aria-label="Toggle wishlist"
          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/95 shadow-md"
        >
          <motion.span key={String(wished)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
            <Heart className={`h-3.5 w-3.5 ${wished ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
          </motion.span>
        </motion.span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0 leading-tight">
          <p className="line-clamp-1 text-[11px] font-extrabold text-slate-900">{p.name}</p>
          <p className="mt-0.5 flex items-center gap-1">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[9px] font-bold text-slate-400">{p.reviews} sold</span>
          </p>
          <p className="font-display mt-0.5 text-[12px] font-extrabold text-amber-600">{money(p.price)}</p>
        </div>
        <span className="shrink-0 rounded-full border border-zinc-900 px-2.5 py-1.5 text-[9px] font-extrabold text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
          View
        </span>
      </div>
    </motion.button>
  );
}

export function ClientBestBento() {
  const { navigate } = useShop();
  return (
    <>
      <SectionHeader title="Client Best" sub="Most-loved this month" onViewAll={() => navigate({ name: "category", cat: "All" })} />
      <div className="grid grid-cols-2 gap-3 px-4">
        {/* wide feature card */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate({ name: "product", id: bentoWide.id })}
          className="group col-span-2 flex items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-lg"
        >
          <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img src={bentoWide.img} alt={bentoWide.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute left-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow">{discountOf(bentoWide)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wide text-amber-700">
              <Flame className="h-2.5 w-2.5" /> Client Favorite
            </span>
            <h3 className="font-display mt-1.5 line-clamp-1 text-[14px] font-extrabold text-slate-900">{bentoWide.name}</h3>
            <p className="mt-0.5 line-clamp-1 text-[10px] font-semibold text-slate-400">{bentoWide.spec}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-[15px] font-extrabold text-slate-900">{money(bentoWide.price)}</span>
                <span className="text-[10px] font-semibold text-slate-400 line-through">{money(bentoWide.oldPrice)}</span>
              </p>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-extrabold text-slate-600">{bentoWide.rating}.0</span>
                <span className="ml-1 grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-white shadow-md transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </div>
          </div>
        </motion.button>

        {/* two half cards */}
        {bentoHalves.map((p, i) => (
          <BentoHalf key={p.id} p={p} index={i} />
        ))}
      </div>
    </>
  );
}
