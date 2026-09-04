import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useShop } from "../shop";
import { IMG } from "../images";
import { products } from "../data";

type Story = {
  id: string;
  label: string;
  img: string;
  time: string;
  caption: string;
  cta: string;
  go: "product" | "category" | "custom";
  target?: string;
};

const BASE_STORIES: Story[] = [
  { id: "viking-axe", label: "Viking Axe", img: IMG.axeSet1, time: "10m", caption: "Bearded axe and round shield, forged as a matched set — ash haft, rawhide-bound linden. $480 this batch only.", cta: "Order the Set", go: "product", target: "viking-axe-set" },
  { id: "sword", label: "Sword", img: IMG.swordFull, time: "15m", caption: "Thirty-eight inches of hand-forged steel — fullered blade, stacked-leather grip, peened pommel. $380 for this batch only.", cta: "Order the Sword", go: "product", target: "handmade-sword" },
  { id: "skinner", label: "Skinner", img: "images/skinner-1.png", time: "30m", caption: "Fresh off the anvil — a forge-textured skinner with a pinned bone grip and a twisted lanyard loop. $190 while the batch lasts.", cta: "Order the Skinner", go: "product", target: "skinner-knife" },
  { id: "viking", label: "Viking", img: IMG.vikingSeax, time: "1h", caption: "New from the forge — a rune-carved damascus seax with a bone grip inscribed in elder futhark. One piece, $190.", cta: "Order the Seax", go: "product", target: "viking-seax" },
  { id: "s1", label: "Heritage", img: IMG.knifeHero, time: "2h", caption: "The Heritage folder is back — 67 damascus layers, copper soul, horn handle.", cta: "Order the Heritage", go: "product", target: "knife-heritage" },
  { id: "s2", label: "Pocket", img: IMG.pocketKnife, time: "4h", caption: "Handmade small pocket knife. One antler tine, one jute wrap, one honest edge.", cta: "Order the pocket knife", go: "product", target: "knife-pocket" },
  { id: "s3", label: "Chef Set", img: IMG.chefSet, time: "6h", caption: "Five-piece damascus chef set — hammered faces, twisted steel handles. Forged to order.", cta: "Order the chef set", go: "product", target: "chef-set-5" },
  { id: "s4", label: "Custom", img: IMG.knifeFolded, time: "9h", caption: "The Custom Forge is open. Pick steel, handle and guard — we hammer the rest.", cta: "Start your build", go: "custom" },
  { id: "s5", label: "48h Deal", img: IMG.chefHandles, time: "12h", caption: "Flash window: chef knives marked down for 48 hours only. Then the fire dies.", cta: "See the deal", go: "category", target: "Chef Knives" },
  { id: "s6", label: "Workshop", img: IMG.engravingBench, time: "1d", caption: "Inside the workshop — engraving day. Floral scroll No. 9 on a copper bolster.", cta: "Browse folders", go: "category", target: "Folding Knives" },
];

const DURATION = 5200;
const RING = "bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500";

export default function Stories() {
  const { navigate, notify } = useShop();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const prog = useRef(0);
  const hold = useRef<{ x: number; t: number; moved: boolean } | null>(null);
  const justSwiped = useRef(false);

  // portal-created stories join the rail live
  const STORIES: Story[] = [
    ...products
      .filter((p) => p.story)
      .map((p) => ({
        id: `portal-${p.id}`,
        label: p.story!.label,
        img: p.img,
        time: "now",
        caption: p.story!.caption,
        cta: "Order now",
        go: "product" as const,
        target: p.id,
      })),
    ...BASE_STORIES,
  ];

  const story = STORIES[active];

  // mark stories as watched while the viewer is open
  useEffect(() => {
    if (open) setSeen((s) => new Set(s).add(STORIES[active].id));
  }, [open, active]);

  // lock scroll + keyboard controls while watching
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  // the timed progress bar — pauses on hold, advances on completion
  useEffect(() => {
    if (!open || paused) return;
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const dt = t - last;
      last = t;
      prog.current += dt / DURATION;
      if (prog.current >= 1) {
        prog.current = 0;
        if (active < STORIES.length - 1) setActive(active + 1);
        else setOpen(false);
        return;
      }
      setProgress(prog.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paused, active]);

  const reset = () => {
    prog.current = 0;
    setProgress(0);
  };
  const go = (d: number) => {
    const next = active + d;
    if (next < 0) return reset();
    if (next >= STORIES.length) return setOpen(false);
    setActive(next);
    reset();
  };

  const openAt = (i: number) => {
    setActive(i);
    reset();
    setOpen(true);
  };

  // hold-to-pause + swipe-to-skip, shared by touch and mouse
  const onDown = (e: React.PointerEvent) => {
    hold.current = { x: e.clientX, t: Date.now(), moved: false };
    setPaused(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (hold.current && Math.abs(e.clientX - hold.current.x) > 12) hold.current.moved = true;
  };
  const onUp = (e: React.PointerEvent) => {
    const h = hold.current;
    hold.current = null;
    setPaused(false);
    if (!h) return;
    const dx = e.clientX - h.x;
    if (h.moved && Math.abs(dx) > 55) {
      justSwiped.current = true;
      setTimeout(() => (justSwiped.current = false), 80);
      go(dx < 0 ? 1 : -1);
    }
  };

  const act = () => {
    setOpen(false);
    if (story.go === "product" && story.target) navigate({ name: "product", id: story.target });
    else if (story.go === "category" && story.target) navigate({ name: "category", cat: story.target });
    else if (story.go === "custom") navigate({ name: "custom" });
  };

  return (
    <>
      {/* story rail */}
      <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-4 pb-1 pt-1">
        {STORIES.map((s, i) => {
          const viewed = seen.has(s.id);
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openAt(i)}
              className="flex w-[66px] shrink-0 flex-col items-center gap-1.5"
              aria-label={`Watch story: ${s.label}`}
            >
              <span className="relative grid h-[66px] w-[66px] place-items-center">
                <img
                  src={s.img}
                  alt={s.label}
                  loading="lazy"
                  decoding="async"
                  className="h-[52px] w-[52px] rounded-full object-cover shadow-md ring-2 ring-white"
                />
                {/* rotating dashed ember ring */}
                <svg
                  viewBox="0 0 66 66"
                  className="absolute inset-0 h-full w-full"
                  style={{ animation: `orbit-spin ${viewed ? 18 : 7}s linear infinite` }}
                  aria-hidden
                >
                  <defs>
                    {/* ember gradient with a travelling hot glint */}
                    <linearGradient id={`sg-${s.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="38%" stopColor="#f97316" />
                      <stop offset="66%" stopColor="#f43f5e" />
                      <stop offset="84%" stopColor="#fde68a" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                  {/* pathLength=100 + a dash that divides it evenly = a seamless closed ring */}
                  <circle
                    cx="33"
                    cy="33"
                    r="30"
                    pathLength={100}
                    fill="none"
                    stroke={viewed ? "#cbd5e1" : `url(#sg-${s.id})`}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />
                </svg>
              </span>
              <span className={`max-w-full truncate text-[10px] font-bold ${viewed ? "text-slate-400" : "text-slate-700"}`}>{s.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* viewer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[96] flex items-center justify-center bg-black/95"
          >
            <div
              className="relative h-full max-h-[100dvh] w-full max-w-[430px] select-none overflow-hidden bg-zinc-950"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              style={{ touchAction: "none" }}
            >
              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28 }}
                  className="absolute inset-0"
                >
                  <img src={story.img} alt={story.caption} className="h-full w-full object-cover" draggable={false} />
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* progress bars */}
              <div className="absolute inset-x-3 top-3 z-20 flex gap-1.5">
                {STORIES.map((s, i) => (
                  <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                    <span
                      className="block h-full rounded-full bg-white"
                      style={{ width: i < active ? "100%" : i === active ? `${progress * 100}%` : "0%" }}
                    />
                  </span>
                ))}
              </div>

              {/* header */}
              <div className="absolute inset-x-3 top-6 z-20 flex items-center gap-2.5">
                <span className={`rounded-full p-[2px] ${RING}`}>
                  <img src={story.img} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-black/40" />
                </span>
                <div className="flex-1 leading-tight">
                  <p className="flex items-center gap-1 text-[12px] font-extrabold text-white">
                    forge.of.ash <BadgeCheck className="h-3 w-3 fill-white text-zinc-900" />
                  </p>
                  <p className="text-[9.5px] font-semibold text-white/60">{story.time} ago</p>
                </div>
                {paused && <span className="rounded-full bg-black/50 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest text-white/80">Paused</span>}
                <motion.button whileTap={{ scale: 0.85, rotate: 90 }} onClick={() => setOpen(false)} aria-label="Close stories" className="grid h-8 w-8 place-items-center rounded-full text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* tap zones */}
              <button aria-label="Previous story" onClick={() => !justSwiped.current && go(-1)} className="absolute inset-y-0 left-0 z-10 w-1/3" />
              <button aria-label="Next story" onClick={() => !justSwiped.current && go(1)} className="absolute inset-y-0 right-0 z-10 w-1/3" />

              {/* caption + actions */}
              <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-6">
                <p className="text-[13px] font-semibold leading-relaxed text-white drop-shadow">{story.caption}</p>
                <div className="mt-3.5 flex gap-2.5">
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={act}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-400 py-3 text-[12px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/30 transition-colors hover:bg-amber-300"
                  >
                    <ShoppingBag className="h-4 w-4" /> {story.cta}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => notify("Chat opened — we reply in minutes")}
                    aria-label="Message the forge"
                    className="grid h-11 w-11 place-items-center rounded-full text-white ring-2 ring-white/50 transition-colors hover:bg-white/10"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
