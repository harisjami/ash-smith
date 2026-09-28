import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { categoryTiles, tileCount } from "../data";
import { useShop } from "../shop";
import { IMG } from "../images";

type Card = { id: string; name: string; sub: string; img: string; likes: number; tile?: string; custom?: boolean };

const count = (tile: string) => {
  const t = categoryTiles.find((c) => c.name === tile);
  return t ? tileCount(t) : 0;
};

const CARDS: Card[] = [
  { id: "heritage", name: "Heritage Folders", sub: `${count("Folding Knives")} pieces`, img: "images/knife-hero.png", likes: 482, tile: "Folding Knives" },
  { id: "damascus", name: "Damascus Steel", sub: `${count("Damascus Steel")} blades`, img: IMG.damascusClose, likes: 617, tile: "Damascus Steel" },
  { id: "chef", name: "Chef Knives", sub: `${count("Chef Knives")} forged`, img: "images/chef-set.png", likes: 359, tile: "Chef Knives" },
  { id: "pocket", name: "Pocket Knives", sub: `${count("Pocket Knives")} antler`, img: "images/pocket-knife.png", likes: 274, tile: "Pocket Knives" },
  { id: "custom", name: "Custom Forge", sub: "Your sketch", img: "images/knife-folded.png", likes: 893, custom: true },
];

const LOOP = 46; // seconds per full ambient lap
const REACH = 400; // how far a hand can pull the strip either way

function CollectionCard({ c }: { c: Card }) {
  const { navigate } = useShop();
  const [liked, setLiked] = useState(false);

  const open = () => {
    if (c.custom) navigate({ name: "custom" });
    else if (c.tile) navigate({ name: "category", cat: c.tile });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={open}
      className="group w-[150px] shrink-0 cursor-pointer rounded-[14px] bg-[#17171a] p-1.5 ring-1 ring-white/[0.06] transition-shadow duration-300 hover:shadow-[0_12px_30px_-14px_rgba(245,158,11,0.35)] hover:ring-amber-400/30"
    >
      <div className="relative h-[148px] overflow-hidden rounded-b-md rounded-t-[999px] bg-zinc-800">
        <img src={c.img} alt={c.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      </div>

      <div className="flex items-center gap-1.5 pt-1.5">
        <span className="grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-900 ring-[1.5px] ring-amber-400/50">
          <img src="images/logo.png" alt="" className="h-4 w-4 object-contain" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[9px] font-extrabold text-white">{c.name}</p>
          <p className="truncate text-[6.5px] font-semibold text-zinc-500">{c.sub}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.7 }}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          aria-label="Save collection"
          className={`flex shrink-0 items-center text-[7.5px] font-bold transition-colors ${liked ? "text-red-400" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <motion.span key={String(liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
            <Heart className={`h-2.5 w-2.5 ${liked ? "fill-red-400" : ""}`} />
          </motion.span>
        </motion.button>
      </div>

      <motion.span
        whileTap={{ scale: 0.94 }}
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
        role="button"
        className="mt-1.5 block rounded-full bg-amber-400 py-1 text-center text-[8.5px] font-extrabold text-slate-900 shadow-md shadow-amber-500/25 transition-colors hover:bg-amber-300"
      >
        {c.custom ? "Start a build" : "Explore"}
      </motion.span>
    </motion.div>
  );
}

export default function PopularCollections() {
  const zone = useRef<HTMLDivElement>(null);
  const scrub = useRef<HTMLDivElement>(null);
  const shift = useRef(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [dot, setDot] = useState(0);
  pausedRef.current = paused;

  const apply = (v: number) => {
    shift.current = Math.max(-REACH, Math.min(REACH, v));
    if (scrub.current) scrub.current.style.transform = `translate3d(${shift.current}px,0,0)`;
  };

  // decorative dashes cycle with the ambient lap
  useEffect(() => {
    const id = setInterval(() => setDot((d) => (d + 1) % CARDS.length), (LOOP * 1000) / CARDS.length);
    return () => clearInterval(id);
  }, []);

  // grab-and-browse: pause the loop, pull the strip as slow or fast as you like,
  // keep your spot on release and let the loop carry on from there
  useEffect(() => {
    const el = zone.current;
    if (!el) return;

    const hold = () => {
      if (!pausedRef.current) setPaused(true);
    };
    let timer: number | undefined;
    const resume = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setPaused(false), 500);
    };

    let active = false;
    let startX = 0;
    let startY = 0;
    let startShift = 0;
    let horizontal: boolean | null = null;

    const onTouchStart = (e: TouchEvent) => {
      active = true;
      horizontal = null;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startShift = shift.current;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!active) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (horizontal === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) horizontal = Math.abs(dx) > Math.abs(dy);
      if (horizontal) {
        e.preventDefault();
        hold();
        apply(startShift + dx);
      }
    };
    const onTouchEnd = () => {
      if (active && horizontal) resume();
      active = false;
    };

    let dragging = false;
    let lastX = 0;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      dragging = true;
      lastX = e.clientX;
      hold();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      apply(shift.current + (e.clientX - lastX));
      lastX = e.clientX;
    };
    const onPointerUp = () => {
      if (dragging) {
        dragging = false;
        resume();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!d) return;
      e.preventDefault();
      hold();
      apply(shift.current - d);
      resume();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="px-4 pt-5">
      <div className="relative overflow-hidden rounded-[20px] bg-[#0c0c0e] px-2.5 pb-3.5 pt-4 shadow-xl shadow-zinc-900/40 ring-1 ring-white/[0.06]">
        {/* ambient forge depth */}
        <div className="ambient-grid absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-52 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[60px]" />
        <span className="animate-floaty pointer-events-none absolute left-6 top-9 h-1 w-1 rounded-full bg-amber-400/70 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        <span className="animate-floaty pointer-events-none absolute right-8 top-14 h-1 w-1 rounded-full bg-amber-300/60" style={{ animationDelay: "1.1s" }} />

        {/* heading */}
        <div className="relative text-center">
          <h2 className="font-display text-[14.5px] font-extrabold uppercase tracking-[0.06em] text-white">
            Popular <span className="text-amber-400">Collections</span>
          </h2>
          <p className="mx-auto mt-0.5 max-w-[220px] text-[8px] font-medium leading-relaxed text-zinc-500">
            Drift through, or grab the strip and browse at your own pace.
          </p>
        </div>

        {/* carousel */}
        <div ref={zone} className="relative mt-3 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-[#0c0c0e] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-[#0c0c0e] to-transparent" />
          <div ref={scrub} className="will-change-transform">
            <div
              className="animate-marquee flex w-max gap-2.5 px-1 py-1"
              style={{ animationDuration: `${LOOP}s`, animationPlayState: paused ? "paused" : "running" }}
            >
              {[...CARDS, ...CARDS].map((c, i) => (
                <CollectionCard key={`${c.id}-${i}`} c={c} />
              ))}
            </div>
          </div>
        </div>

        {/* dashes */}
        <div className="relative mt-2.5 flex justify-center gap-1">
          {CARDS.map((_, i) => (
            <motion.span
              key={i}
              animate={{ width: i === dot ? 14 : 4, backgroundColor: i === dot ? "#f59e0b" : "#3f3f46" }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="block h-1 rounded-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
