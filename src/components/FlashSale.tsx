import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { discountOf, money, products } from "../data";
import { Stars } from "./ui";
import { useShop } from "../shop";

const DAY = 24 * 60 * 60 * 1000;
const LS_KEY = "foa-flash-sale";

type Saved = { start: number; index: number };

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const s = JSON.parse(raw) as Saved;
      if (typeof s.start === "number" && typeof s.index === "number") return s;
    }
  } catch {
    /* fresh start */
  }
  return { start: Date.now(), index: 0 };
}

function persist(s: Saved) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

const tabs = [
  { id: "all", label: "All Deals" },
  { id: "blades", label: "Blades" },
  { id: "kitchen", label: "Kitchen" },
] as const;
type TabId = (typeof tabs)[number]["id"];

function Tile({ v }: { v: number }) {
  const s = String(v).padStart(2, "0");
  return (
    <span className="relative grid h-7 w-8 place-items-center overflow-hidden rounded-md bg-orange-500 shadow-sm shadow-orange-500/40">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={s}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="font-display text-[12px] font-extrabold leading-none text-white"
        >
          {s}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function FlashSale() {
  const { navigate } = useShop();
  const [tab, setTab] = useState<TabId>("all");
  const [saved, setSaved] = useState<Saved>(loadSaved);
  const [now, setNow] = useState(() => Date.now());

  const pool = useMemo(() => {
    if (tab === "blades") return products.filter((p) => p.category === "Folding Knives" || p.category === "Pocket Knives");
    if (tab === "kitchen") return products.filter((p) => p.category === "Chef Knives");
    return products;
  }, [tab]);

  const product = pool[saved.index % pool.length];

  // tick
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // rollover: when a day passes, advance to the next deal — forever
  useEffect(() => {
    if (now - saved.start >= DAY) {
      const k = Math.floor((now - saved.start) / DAY);
      const next = { start: saved.start + k * DAY, index: saved.index + k };
      setSaved(next);
      persist(next);
    }
  }, [now, saved]);

  const left = Math.max(0, DAY - (now - saved.start));
  const total = Math.floor(left / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const sold = ((product.rating * 13 + product.name.length * 3) % 38) + 6;
  const capacity = 50;
  const pct = Math.min(100, Math.round((sold / capacity) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 pt-7"
    >
      {/* header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display flex items-center gap-1.5 text-[17px] font-extrabold uppercase tracking-tight text-slate-900">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} className="grid h-6 w-6 place-items-center rounded-md bg-orange-500 text-white shadow-md shadow-orange-500/40">
              <Flame className="h-3.5 w-3.5 fill-white" />
            </motion.span>
            Flash Sale
          </h2>
          <span className="mt-1 block h-[3px] w-12 rounded-full bg-orange-500" />
        </div>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-colors ${tab === t.id ? "text-orange-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              {tab === t.id && <motion.span layoutId="fs-tab" className="absolute inset-0 rounded-full bg-orange-50" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* the single evergreen deal card */}
      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={() => navigate({ name: "product", id: product.id })}
        className="relative mt-3 block w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 text-left shadow-sm transition-shadow hover:shadow-lg"
      >
        <div className="animate-shine pointer-events-none absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-orange-400/10 to-transparent" />

        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-3.5"
          >
            {/* image + badge */}
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <img src={product.img} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              <motion.span
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="absolute -right-0 -top-0 grid h-10 w-10 place-items-center rounded-bl-xl bg-orange-500 text-[10px] font-extrabold text-white shadow-md shadow-orange-500/40"
              >
                {discountOf(product)}
              </motion.span>
            </div>

            {/* info */}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-orange-500">
                Deal of the day <span className="text-slate-300">·</span> <span className="text-slate-400">resets daily</span>
              </p>
              <h3 className="mt-1 line-clamp-1 text-[13.5px] font-extrabold text-slate-900">{product.name}</h3>
              <div className="mt-1">
                <Stars rating={product.rating} />
              </div>
              <p className="mt-1.5 flex items-baseline gap-2">
                <span className="font-display text-[18px] font-extrabold text-orange-600">{money(product.price)}</span>
                <span className="text-[11px] font-semibold text-slate-400 line-through">{money(product.oldPrice)}</span>
              </p>

              {/* sold progress */}
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    key={product.id}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                  />
                </div>
                <p className="mt-1 text-[9px] font-bold text-slate-400">
                  Sold: <span className="text-orange-600">{sold}</span> · {capacity - sold} left
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* countdown */}
        <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3">
          <div className="flex items-center gap-1">
            <Tile v={d} />
            <span className="text-[12px] font-extrabold text-orange-500">:</span>
            <Tile v={h} />
            <span className="text-[12px] font-extrabold text-orange-500">:</span>
            <Tile v={m} />
            <span className="text-[12px] font-extrabold text-orange-500">:</span>
            <Tile v={s} />
            <span className="ml-1.5 text-[8.5px] font-bold uppercase tracking-wide text-slate-400">Days · Hrs · Min · Sec</span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-extrabold text-white shadow-md shadow-orange-500/30">
            Grab Deal <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </motion.button>
    </motion.section>
  );
}
