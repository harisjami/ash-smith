import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800`;

const team = [
  { name: "Ash Rourke", role: "Founder & Master Bladesmith", img: px(14391923), bio: "Third-generation smith who lit the first Forge Of Ash coal in 2016. Every damascus billet starts under his hammer." },
  { name: "Mira Solis", role: "Forge Lead", img: px(38197025), bio: "Runs the daily heat — from billet to blank. Mira keeps the forge at temperature and the queue of commissions moving." },
  { name: "Dario Venn", role: "Heat-Treat Specialist", img: px(9527896), bio: "Owns the quench and the temper. Dario's charts are why our edges hold at 60 HRC without ever turning brittle." },
  { name: "Elena Marsh", role: "Handle & Guard Artisan", img: px(36177188), bio: "Shapes antler, horn and walnut to the palm, then engraves the copper bolsters — one floral scroll at a time." },
  { name: "Kael Brandt", role: "Edge & Finish", img: px(10812247), bio: "The last hands a blade meets. Kael hones every edge to shaving sharp and signs off before it ships to you." },
];

const SPEED = 0.55; // px per frame

export default function TeamCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const dir = useRef(1);
  const hold = useRef<number | null>(null);
  const [flipped, setFlipped] = useState<number | null>(null);
  const flippedRef = useRef<number | null>(null);

  useEffect(() => {
    flippedRef.current = flipped;
  }, [flipped]);

  // continuous ping-pong drift: right-to-left, then left-to-right, forever
  useEffect(() => {
    let raf = 0;
    const step = () => {
      const el = track.current;
      if (el && flippedRef.current === null) {
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
          if (bar.current) bar.current.style.transform = `translateX(${(next / max) * 200}%)`;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => () => window.clearTimeout(hold.current ?? undefined), []);

  const onCard = (i: number) => {
    if (flipped !== null) return;
    const el = track.current;
    if (el) {
      const card = el.children[i] as HTMLElement | undefined;
      if (card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
    }
    setFlipped(i);
    hold.current = window.setTimeout(() => setFlipped(null), 3000);
  };

  const nudge = (d: number) => {
    dir.current = d;
    track.current?.scrollBy({ left: d * 200, behavior: "smooth" });
  };

  return (
    <section className="relative mt-8 overflow-hidden bg-gradient-to-b from-[#0a0a0c] via-[#181310] to-[#0a0a0c] px-0 pb-10 pt-12">
      {/* ambient forge stage */}
      <div className="ambient-grid absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/10" />
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
      <span className="animate-floaty pointer-events-none absolute left-8 top-20 h-1.5 w-1.5 rounded-full bg-amber-400/70 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
      <span className="animate-floaty pointer-events-none absolute right-10 top-40 h-1 w-1 rounded-full bg-amber-300/60" style={{ animationDelay: "1.1s" }} />
      <span className="animate-floaty pointer-events-none absolute bottom-24 left-16 h-1 w-1 rounded-full bg-orange-400/60" style={{ animationDelay: "2s" }} />

      {/* heading */}
      <div className="relative px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.3em] text-amber-400/90"
        >
          <Flame className="h-3 w-3 fill-amber-400 text-amber-400" /> Forge Of Ash
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-display mt-2 text-[26px] font-bold leading-tight tracking-tight text-white"
        >
          Our Team
          <span className="font-serif mt-0.5 block text-[22px] font-medium italic text-amber-400">
            the hands behind every blade
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="mx-auto mt-2 max-w-[260px] text-[10.5px] font-medium leading-relaxed text-zinc-500"
        >
          Tap any card to meet the maker — the forge pauses while you read.
        </motion.p>
      </div>

      {/* carousel */}
      <div className="relative mt-7">
        <button
          onClick={() => nudge(-1)}
          aria-label="Previous"
          className="absolute left-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => nudge(1)}
          aria-label="Next"
          className="absolute right-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div ref={track} className="no-scrollbar flex gap-4 overflow-x-auto px-12 py-2">
          {team.map((m, i) => (
            <motion.button
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onCard(i)}
              className="relative h-[320px] w-[228px] shrink-0"
              style={{ perspective: "1100px" }}
            >
              <div
                className={`preserve-3d relative h-full w-full transition-transform duration-700 ${
                  flipped === i ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* front */}
                <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-xl shadow-black/60 ring-1 ring-white/10">
                  <img src={m.img} alt={m.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent px-4 pb-4 pt-12 text-left">
                    <p className="font-display text-[15px] font-bold text-white">{m.name}</p>
                    <p className="mt-0.5 text-[9.5px] font-semibold text-amber-300/80">{m.role}</p>
                  </div>
                </div>
                {/* back — copper plate */}
                <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-orange-600 p-4 text-left shadow-xl shadow-amber-900/40 [transform:rotateY(180deg)]">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.35) 1px, transparent 1px)",
                      backgroundSize: "26px 26px",
                    }}
                  />
                  <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                  <div className="relative flex h-full flex-col">
                    <p className="font-display text-[16px] font-extrabold text-slate-900">{m.name}</p>
                    <p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-800/80">{m.role}</p>
                    <div className="mt-3 h-px w-10 bg-slate-900/50" />
                    <p className="mt-auto text-[10px] font-semibold leading-relaxed text-slate-900/85">{m.bio}</p>
                    <p className="mt-3 flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-widest text-slate-800/70">
                      <Flame className="h-2.5 w-2.5" /> Flips back in a moment…
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* progress line */}
        <div className="mx-auto mt-4 h-[3px] w-24 overflow-hidden rounded-full bg-white/10">
          <div ref={bar} className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
        </div>
      </div>
    </section>
  );
}
