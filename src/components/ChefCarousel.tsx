import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { products } from "../data";
import { useShop } from "../shop";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ChefCarousel() {
  const cards = products.filter((p) => p.category === "Folding Knives").slice(0, 7);
  const n = cards.length;
  const { navigate, addToCart } = useShop();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (d: number) => setIndex((i) => Math.min(n - 1, Math.max(0, i + d)));

  useEffect(() => {
    if (paused || n < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), 4600);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pt-7"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* header row */}
      <div className="flex items-end justify-between px-5">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-amber-600">Handmade in the forge</p>
          <h2 className="font-display mt-0.5 text-[19px] font-extrabold tracking-tight text-slate-900">Folding Knives</h2>
        </div>
        <p className="font-display text-[15px] font-extrabold text-slate-900">
          {pad(index + 1)}
          <span className="text-slate-300">/{pad(n)}</span>
        </p>
      </div>

      {/* stage */}
      <motion.div
        className="relative mt-4 h-[300px] touch-pan-y overflow-x-clip px-2"
        style={{ perspective: 1000 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -48) go(1);
          else if (info.offset.x > 48) go(-1);
        }}
      >
        {cards.map((p, i) => {
          const o = i - index;
          const abs = Math.abs(o);
          // only mount the visible trio — off-screen cards cost GPU for nothing
          if (abs > 1) return null;
          const isCenter = o === 0;
          return (
            <motion.button
              key={p.id}
              onClick={() => (isCenter ? navigate({ name: "product", id: p.id }) : setIndex(i))}
              animate={{
                x: `calc(-50% + ${o * 126}px)`,
                scale: isCenter ? 1 : 0.82,
                opacity: abs === 1 ? 0.7 : 1,
                rotateY: o === 0 ? 0 : o > 0 ? -10 : 10,
                zIndex: 30 - abs,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={`absolute left-1/2 top-1/2 h-[248px] w-[178px] -translate-y-1/2 overflow-hidden rounded-[20px] bg-slate-200 text-left shadow-xl ${
                isCenter ? "shadow-zinc-900/25 ring-1 ring-black/5" : "shadow-zinc-900/10"
              } ${abs > 1 ? "pointer-events-none" : "cursor-pointer"}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                draggable={false}
              />

              {/* corner arrow ring */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ name: "product", id: p.id });
                }}
                role="button"
                aria-label={`View ${p.name}`}
                className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full border-2 border-white/90 bg-black/15 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900"
              >
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>

              {/* bottom gradient plate */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10">
                <p className="font-display text-[12px] font-extrabold leading-tight text-white">{p.name}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-2.5 w-2.5 ${s <= p.rating ? "fill-amber-400 text-amber-400" : "fill-white/25 text-white/25"}`} />
                    ))}
                  </span>
                  <span className="text-[8px] font-bold text-white/70">({p.reviews})</span>
                </div>
                <motion.span
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p.id);
                  }}
                  role="button"
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-[9px] font-extrabold text-slate-900 shadow-md shadow-amber-500/30"
                >
                  <ShoppingBag className="h-2.5 w-2.5" /> Buy Now
                </motion.span>
              </div>
            </motion.button>
          );
        })}

        {/* arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className={`absolute left-2 top-1/2 z-40 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur transition-all hover:bg-white ${
            index === 0 ? "pointer-events-none opacity-30" : ""
          }`}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className={`absolute right-2 top-1/2 z-40 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur transition-all hover:bg-white ${
            index === n - 1 ? "pointer-events-none opacity-30" : ""
          }`}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      {/* dashes */}
      <div className="mt-1 flex justify-center gap-1.5">
        {cards.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Go to card ${i + 1}`} className="py-1">
            <motion.span
              animate={{ width: i === index ? 22 : 8, backgroundColor: i === index ? "#18181b" : "#d4d4d8" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="block h-1.5 rounded-full"
            />
          </button>
        ))}
      </div>
    </motion.section>
  );
}
