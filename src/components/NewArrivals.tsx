import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ShoppingBag } from "lucide-react";
import { byId, money } from "../data";
import type { Product } from "../data";
import { SectionHeader } from "./ui";
import { useShop } from "../shop";

const POOL = ["chef-balance", "knife-artisan", "knife-edc", "chef-cleaver", "knife-fieldset", "knife-craft", "knife-sheath", "velvet"];
const RADIUS = 132;
const DURATION = "36s";

export default function NewArrivals() {
  const { navigate, addToCart } = useShop();
  const [centerId, setCenterId] = useState(POOL[0]);
  const [paused, setPaused] = useState(false);

  const center = byId(centerId)!;
  const sats = POOL.filter((id) => id !== centerId).map((id) => byId(id)!).filter(Boolean) as Product[];
  const play = paused ? "paused" : "running";

  return (
    <>
      <SectionHeader title="New Arrivals" sub="Fresh from the forge" onViewAll={() => navigate({ name: "category", cat: "All" })} />

      <div
        className="relative mx-auto h-[356px] w-full max-w-[380px]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        {/* orbit tracks */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[272px] w-[272px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-300/70" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[196px] w-[196px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-2xl" />

        {/* rotating system */}
        <div className="absolute inset-0" style={{ animation: `orbit-spin ${DURATION} linear infinite`, animationPlayState: play }}>
          {sats.map((p, i) => {
            const angle = (i / sats.length) * 360;
            return (
              <div
                key={p.id}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `rotate(${angle}deg) translate(${RADIUS}px) rotate(${-angle}deg)` }}
              >
                {/* counter-rotate so moons stay upright */}
                <div className="relative -ml-[31px] -mt-[31px] h-[62px] w-[62px]" style={{ animation: `orbit-spin-rev ${DURATION} linear infinite`, animationPlayState: play }}>
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 320, damping: 18 }}
                    whileHover={{ scale: 1.14 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCenterId(p.id)}
                    aria-label={`Feature ${p.name}`}
                    className="block h-full w-full overflow-hidden rounded-full bg-white shadow-lg shadow-slate-300/50 ring-2 ring-white"
                  >
                    <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.7 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p.id);
                    }}
                    aria-label={`Add ${p.name} to cart`}
                    className="absolute -bottom-1 -right-1 z-10 grid h-[22px] w-[22px] place-items-center rounded-full bg-amber-400 text-slate-900 shadow-md shadow-amber-500/40 ring-2 ring-white"
                  >
                    <Plus className="h-3 w-3" strokeWidth={3} />
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        {/* the sun — center product */}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <span className="animate-spin-slow pointer-events-none absolute -inset-2 rounded-full border border-dashed border-amber-400/50" />
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate({ name: "product", id: center.id })}
            aria-label={`View ${center.name}`}
            className="relative block h-[164px] w-[164px] overflow-hidden rounded-full bg-zinc-900 shadow-2xl shadow-amber-900/30 ring-4 ring-amber-400"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={center.id}
                src={center.img}
                alt={center.name}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-inset ring-white/25"
            />
          </motion.button>

          {/* BUY bar */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => addToCart(center.id)}
            className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-zinc-900 px-5 py-2.5 text-[11px] font-extrabold text-white shadow-xl shadow-zinc-900/40 ring-1 ring-amber-400/40 transition-colors hover:bg-black"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
            Buy · {money(center.price)}
          </motion.button>
        </div>

        {/* caption */}
        <AnimatePresence mode="wait">
          <motion.p
            key={center.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center text-[10.5px] font-bold text-slate-500"
          >
            {center.name} <span className="text-slate-300">·</span>{" "}
            <span className="text-amber-600">tap a moon to feature it</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </>
  );
}
