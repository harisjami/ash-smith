import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { byId, money } from "../data";
import type { Product } from "../data";
import { SectionHeader } from "./ui";
import { useShop } from "../shop";

const IDS = ["knife-heritage", "chef-single", "knife-pocket", "velvet", "airfryer", "knife-artisan", "sofa"];
const GAP = 12;

export default function PopularRail() {
  const { navigate, addToCart } = useShop();
  const rail = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const settle = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const cards = IDS.map((id) => byId(id)).filter(Boolean) as Product[];

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const step = () => {
    const el = rail.current;
    const card = el?.children[0] as HTMLElement | undefined;
    return card ? card.offsetWidth + GAP : 248;
  };

  // the signature "jerk": a stiff spring with a touch of settle
  const springTo = (i: number) => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.min(max, Math.max(0, i * step()));
    const from = el.scrollLeft;
    animate(from, target, {
      type: "spring",
      stiffness: 640,
      damping: 32,
      mass: 0.9,
      onUpdate: (v) => {
        el.scrollLeft = v;
      },
    });
    setActive(Math.round(target / step()));
  };

  // auto-advance every 3s with the same jerk
  useEffect(() => {
    const id = setInterval(() => {
      if (paused.current) return;
      const atEnd = activeRef.current >= cards.length - 1;
      springTo(atEnd ? 0 : activeRef.current + 1);
    }, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when the user flings it, settle to the nearest card with a jerk
  const onScroll = () => {
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const el = rail.current;
      if (!el) return;
      const nearest = Math.round(el.scrollLeft / step());
      if (nearest !== activeRef.current) springTo(nearest);
    }, 140);
  };

  useEffect(() => () => window.clearTimeout(settle.current), []);

  return (
    <>
      <SectionHeader title="Popular" sub="Mixed bestsellers" onViewAll={() => navigate({ name: "category", cat: "All" })} />
      <div
        className="relative"
        onPointerDown={() => (paused.current = true)}
        onPointerUp={() => (paused.current = false)}
        onPointerLeave={() => (paused.current = false)}
      >
        <div ref={rail} onScroll={onScroll} className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {cards.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate({ name: "product", id: p.id })}
              className="flex w-[236px] shrink-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-lg"
            >
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[12px] font-extrabold text-slate-900">{p.name}</span>
                <span className="block truncate text-[9.5px] font-semibold text-slate-400">{p.spec ?? p.category}</span>
                <span className="font-display mt-1 block text-[13px] font-extrabold text-slate-900">{money(p.price)}</span>
              </span>
              <motion.span
                whileTap={{ scale: 0.75, rotate: 90 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p.id);
                }}
                role="button"
                aria-label={`Add ${p.name} to cart`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-900 text-white shadow-md shadow-zinc-900/30 transition-colors hover:bg-amber-400 hover:text-slate-900"
              >
                <Plus className="h-4 w-4" strokeWidth={2.6} />
              </motion.span>
            </motion.button>
          ))}
        </div>

        {/* progress dashes */}
        <div className="mt-2 flex justify-center gap-1.5 px-4">
          {cards.map((_, i) => (
            <button key={i} onClick={() => springTo(i)} aria-label={`Go to card ${i + 1}`} className="py-1">
              <motion.span
                animate={{ width: i === active ? 18 : 6, backgroundColor: i === active ? "#18181b" : "#d4d4d8" }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="block h-1.5 rounded-full"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
