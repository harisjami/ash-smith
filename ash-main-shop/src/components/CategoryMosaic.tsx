import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { categoryTiles, tileCount } from "../data";
import { SectionHeader } from "./ui";
import { useShop } from "../shop";

const SPEED = 0.5; // px per frame drift

/* mixed widths per row, mirroring the sketch: wide · square · wide / medium · wide · square */
/* bento rhythm: dramatic wide/narrow alternation so the grid reads as composed blocks */
const ROW1_W = [218, 150, 202, 166, 226, 154, 198, 162];
const ROW2_W = [158, 222, 150, 210, 158, 218, 146];

export default function CategoryMosaic() {
  const { navigate } = useShop();
  const scroller = useRef<HTMLDivElement>(null);
  const dir = useRef(1);
  const paused = useRef(false);
  const idle = useRef<number | undefined>(undefined);
  const drag = useRef<{ x: number; left: number } | null>(null);

  // continuous right-to-left drift, reversing gently at each end
  useEffect(() => {
    let raf = 0;
    const step = () => {
      const el = scroller.current;
      if (el && !paused.current && !drag.current) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 4) {
          let next = el.scrollLeft + SPEED * dir.current;
          if (next <= 0) {
            next = 0;
            dir.current = 1;
          } else if (next >= max) {
            next = max;
            dir.current = -1;
          }
          el.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // resume drifting shortly after the user lifts their finger
  const scheduleResume = () => {
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => (paused.current = false), 1400);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // touch uses native scroll
    const el = scroller.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    paused.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el || !drag.current) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    drag.current = null;
    scheduleResume();
  };

  const row1 = categoryTiles.slice(0, 8);
  const row2 = categoryTiles.slice(8);

  const Tile = ({ t, w, i, row }: { t: (typeof categoryTiles)[number]; w: number; i: number; row: number }) => (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: (row * 4 + i) * 0.04, duration: 0.45 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate({ name: "category", cat: t.name })}
      style={{ width: w }}
      className="group flex h-[58px] shrink-0 items-center gap-2 rounded-xl border border-slate-200/70 bg-white p-1.5 text-left shadow-[0_6px_18px_-12px_rgba(15,23,42,0.28)] transition-shadow hover:shadow-[0_12px_26px_-12px_rgba(15,23,42,0.32)]"
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/5">
        <img
          src={t.img}
          alt={t.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="font-display block truncate text-[10.5px] font-extrabold tracking-tight text-slate-900">{t.name}</span>
        <span className="mt-[1px] block text-[8px] font-bold text-slate-400">{tileCount(t)} units</span>
      </span>
      <motion.span
        whileTap={{ scale: 0.7, rotate: 90 }}
        onClick={(e) => {
          e.stopPropagation();
          navigate({ name: "category", cat: t.name });
        }}
        role="button"
        aria-label={`Browse ${t.name}`}
        className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-zinc-900 text-amber-400 shadow-md shadow-zinc-900/25 transition-colors group-hover:bg-amber-400 group-hover:text-slate-900"
      >
        <Plus className="h-3 w-3" strokeWidth={3} />
      </motion.span>
    </motion.button>
  );

  return (
    <>
      <SectionHeader title="Popular Categories" sub="Fifteen ways to browse" onViewAll={() => navigate({ name: "categories" })} />
      <div
        ref={scroller}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerEnter={() => (paused.current = true)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={scheduleResume}
        className="no-scrollbar cursor-grab touch-[pan-x_pan-y] overflow-x-auto px-4 active:cursor-grabbing"
      >
        <div className="flex w-max flex-col gap-2.5 pb-1">
          <div className="flex gap-3">
            {row1.map((t, i) => (
              <Tile key={t.name} t={t} w={ROW1_W[i % ROW1_W.length]} i={i} row={0} />
            ))}
          </div>
          <div className="flex gap-3">
            {row2.map((t, i) => (
              <Tile key={t.name} t={t} w={ROW2_W[i % ROW2_W.length]} i={i} row={1} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
