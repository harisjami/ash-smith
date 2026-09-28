import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Star } from "lucide-react";
import { categoryMeta, discountOf, products } from "../data";
import type { Product } from "../data";
import { useShop } from "../shop";

type Arc = { key: string; name: string; img: string };

const ARCS: Arc[] = [
  { key: "All", name: "All", img: "images/logo.png" },
  ...categoryMeta.map((c) => ({ key: c.name, name: c.name, img: c.img })),
];

/* ---- one big liquid-glass circle: bubbles ride its crest exactly ---- */
const STEP = 96; // even horizontal spacing between bubbles
const RC = 300; // radius of the glass dome
const DOME_TOP = 66; // where the dome's crest sits inside the stage

// droop taken straight from the dome circle, so bubbles and glass always agree
const droop = (d: number) => {
  const dx = Math.min(Math.abs(d) * STEP, RC - 26);
  return RC - Math.sqrt(RC * RC - dx * dx);
};

/* ------------------------------ product card ------------------------------ */
function ArcCard({ p }: { p: Product }) {
  const { navigate, addToCart, notify } = useShop();
  const [qty, setQty] = useState(0);

  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate({ name: "product", id: p.id })}
      className="group relative flex flex-col overflow-hidden rounded-[20px] bg-white p-3 text-left shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/60 transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.4)]"
    >
      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100">
        <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <span className="mx-auto -mt-3 rounded-full bg-zinc-900 px-2.5 py-1 text-[9px] font-extrabold text-white shadow-md">{discountOf(p)}</span>
      <p className="mt-2 line-clamp-1 text-center text-[12px] font-extrabold text-slate-900">{p.name}</p>
      <p className="mt-0.5 line-clamp-1 text-center text-[9px] font-semibold text-slate-400">{p.spec ?? p.category}</p>
      <div className="mt-2.5 flex items-center justify-between">
        <p className="flex items-baseline gap-0.5">
          <span className="text-[11px] font-extrabold text-amber-500">$</span>
          <span className="font-display text-[17px] font-extrabold text-slate-900">{p.price.toFixed(2)}</span>
        </p>
        <motion.span
          whileTap={{ scale: 0.75, rotate: 90 }}
          onClick={(e) => {
            e.stopPropagation();
            if (qty === 0) {
              addToCart(p.id);
              setQty(1);
            } else {
              notify("Added another to your cart", "cart");
              setQty((q) => q + 1);
            }
          }}
          role="button"
          aria-label={`Add ${p.name} to cart`}
          className={`grid h-8 w-8 place-items-center rounded-full shadow-md transition-colors ${qty ? "bg-zinc-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-zinc-900 hover:text-white"}`}
        >
          {qty ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-4 w-4" />}
        </motion.span>
      </div>
    </motion.button>
  );
}

/* -------------------------------- the arc -------------------------------- */
export default function ArcCategories() {
  const stage = useRef<HTMLDivElement>(null);
  const bubbles = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [gridKey, setGridKey] = useState("All");

  // float controller — one value drives everything; pure transforms, no layout reads
  const ctrl = useRef({ current: 0, target: 0, vel: 0, dragging: false, lastX: 0, lastT: 0 });
  const emit = useRef({ idx: 0, t: 0 });

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const c = ctrl.current;
      if (!c.dragging) {
        // smooth critically-damped glide: always comes to rest exactly on the lens
        c.current += (c.target - c.current) * 0.16;
        c.target = Math.max(0, Math.min(ARCS.length - 1, c.target));
      } else {
        c.current += (c.target - c.current) * 0.4; // tight follow while held
      }

      for (let i = 0; i < ARCS.length; i++) {
        const node = bubbles.current[i];
        if (!node) continue;
        const d = i - c.current;
        const ad = Math.abs(d);
        const x = d * STEP; // even pitch, like the reference
        const y = droop(d); // rides the glass dome circle
        const t = Math.min(ad / 2.5, 1);
        const s = 1 - t * 0.18;
        // fade to zero just past the dome's shoulder so nothing bleeds below
        const op = ad > 2.4 ? 0 : Math.max(0, 1 - Math.max(0, ad - 0.8) * 0.75);
        node.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), ${y.toFixed(2)}px, 0) scale(${s.toFixed(3)})`;
        node.style.opacity = op.toFixed(3);
        node.style.zIndex = String(50 - Math.round(ad * 10));
        node.style.pointerEvents = ad > 2.3 ? "none" : "auto";
        const lbl = labels.current[i];
        if (lbl) lbl.style.opacity = Math.max(0, 1 - Math.max(0, ad - 0.5) * 0.75).toFixed(3);
      }

      // emit the active index only once it settles — no mid-fling re-renders
      const nearest = Math.round(c.current);
      const now = performance.now();
      if (nearest !== emit.current.idx) {
        if (!emit.current.t) emit.current.t = now;
        else if (now - emit.current.t > 110) {
          emit.current = { idx: nearest, t: 0 };
          setActive(nearest);
          setGridKey(ARCS[nearest].key);
        }
      } else {
        emit.current.t = 0;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // pointer drag + fling inertia
  const onDown = (e: React.PointerEvent) => {
    const c = ctrl.current;
    c.dragging = true;
    c.vel = 0;
    c.lastX = e.clientX;
    c.lastT = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const c = ctrl.current;
    if (!c.dragging) return;
    const dx = e.clientX - c.lastX;
    const dt = Math.max(8, performance.now() - c.lastT);
    c.target = Math.max(0, Math.min(ARCS.length - 1, c.target - dx / STEP));
    c.vel = (-dx / STEP) * (16 / dt) * 0.5;
    c.lastX = e.clientX;
    c.lastT = performance.now();
  };
  // after any gesture, snap the target to the nearest bubble so it always
  // parks centered over the glass lens
  const snap = useRef<number | undefined>(undefined);
  const scheduleSnap = () => {
    window.clearTimeout(snap.current);
    snap.current = window.setTimeout(() => {
      const c = ctrl.current;
      c.target = Math.max(0, Math.min(ARCS.length - 1, Math.round(c.target)));
      c.vel = 0;
    }, 140);
  };

  const onUp = () => {
    const c = ctrl.current;
    c.dragging = false;
    // carry the fling as projected distance, then snap to the nearest bubble
    c.target = Math.max(0, Math.min(ARCS.length - 1, c.target + c.vel * 6));
    c.vel = 0;
    scheduleSnap();
  };
  const centerOn = (i: number) => {
    window.clearTimeout(snap.current);
    ctrl.current.target = i;
    ctrl.current.vel = 0;
  };

  // wheel steers the arc without scrolling the page
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = ctrl.current;
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      c.target = Math.max(0, Math.min(ARCS.length - 1, c.target + d / STEP / 2.2));
      window.clearTimeout(snap.current);
      snap.current = window.setTimeout(() => {
        c.target = Math.max(0, Math.min(ARCS.length - 1, Math.round(c.target)));
      }, 140);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const activeArc = ARCS[active];
  const grid = useMemo<Product[]>(() => {
    if (gridKey === "All") return products.slice(0, 8);
    return products.filter((p) => p.category === gridKey).slice(0, 8);
  }, [gridKey]);

  return (
    <section className="pt-8">
      {/* arc stage */}
      <div
        ref={stage}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative mx-auto h-[188px] max-w-[430px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        {/* dome + crest live in their own clipped layer so the glass never escapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/30 ring-1 ring-white/50 backdrop-blur-[10px]"
            style={{
              width: RC * 2,
              height: RC * 2,
              top: DOME_TOP,
              boxShadow: "inset 0 2px 12px rgba(255,255,255,0.9), inset 0 -30px 60px rgba(148,163,184,0.12), 0 24px 60px -28px rgba(15,23,42,0.3)",
            }}
          />
          <div
            className="absolute left-1/2 h-[2px] w-[82%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ top: DOME_TOP }}
          />
        </div>

        {/* fixed glass halo — sits BEHIND the bubbles; the centered bubble rests
            on it, so it always shows which category is selected */}
        <motion.div
          key={active}
          initial={{ scale: 1.16 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="pointer-events-none absolute left-1/2 z-[5] h-[96px] w-[96px] -translate-x-1/2"
          style={{ top: -14 }}
        >
          <span
            className="absolute inset-0 rounded-full bg-white/15 ring-2 ring-white/70"
            style={{
              boxShadow:
                "inset 0 2px 12px rgba(255,255,255,0.85), inset 0 -5px 14px rgba(148,163,184,0.2), 0 12px 30px -8px rgba(245,158,11,0.45)",
            }}
          />
          <span className="absolute inset-[6px] rounded-full ring-1 ring-amber-400/60" />
          <motion.span
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="absolute -inset-1.5 rounded-full ring-1 ring-amber-300/35"
          />
        </motion.div>

        {ARCS.map((a, i) => {
          const isActive = i === active;
          return (
            <button
              key={a.key}
              ref={(n) => {
                bubbles.current[i] = n;
              }}
              onClick={() => centerOn(i)}
              aria-label={`Show ${a.name}`}
              className="absolute left-1/2 top-1 flex w-[72px] flex-col items-center will-change-transform"
              style={{ transform: "translate(-50%, 0)" }}
            >
              <span
                className={`grid h-[62px] w-[62px] place-items-center overflow-hidden rounded-full bg-white shadow-[0_10px_22px_-10px_rgba(15,23,42,0.4)] transition-[box-shadow] duration-300 ${
                  isActive ? "ring-[3px] ring-amber-400" : "ring-1 ring-slate-200"
                }`}
              >
                <img src={a.img} alt={a.name} loading="lazy" decoding="async" className={`h-full w-full object-cover ${a.key === "All" ? "bg-zinc-900 p-3" : ""}`} />
              </span>
              <span
                ref={(n) => {
                  labels.current[i] = n;
                }}
                className={`mt-1.5 max-w-full truncate text-[10px] transition-colors duration-300 ${isActive ? "font-extrabold text-slate-900" : "font-semibold text-slate-400"}`}
              >
                {a.name}
              </span>
              <motion.span
                animate={{ width: isActive ? 24 : 0, opacity: isActive ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="mt-1 h-[3px] rounded-full bg-zinc-900"
              />
            </button>
          );
        })}
      </div>

      {/* active label + count */}
      <div className="mt-1 flex items-end justify-between px-5">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-amber-600">Browse the forge</p>
          <motion.h2 key={gridKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="font-display text-[19px] font-extrabold tracking-tight text-slate-900">
            {gridKey === "All" ? "Everything, mixed" : activeArc.name}
          </motion.h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">{grid.length} pieces</span>
      </div>

      {/* filtered grid — springy punch-in / punch-out that matches the arc's snap */}
      <div className="relative mt-3 grid grid-cols-2 gap-3 px-4 pb-2">
        <AnimatePresence mode="popLayout">
          {grid.map((p, i) => (
            <motion.div
              key={`${gridKey}-${p.id}`}
              layout
              initial={{ opacity: 0, y: 28, scale: 0.88 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 520, damping: 19, mass: 0.85, delay: i * 0.035 },
              }}
              exit={{ opacity: 0, scale: 0.82, y: 16, transition: { duration: 0.16, ease: "easeIn" } }}
            >
              <ArcCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="flex items-center justify-center gap-1.5 pb-2 pt-3 text-[9px] font-bold text-slate-400">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        Every piece hand-forged, rated 4.9 across {products.length} listings
      </p>
    </section>
  );
}
