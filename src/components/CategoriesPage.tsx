import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { categoryTiles, products, tileCount } from "../data";
import { useShop } from "../shop";

export default function CategoriesPage() {
  const { back, navigate } = useShop();

  return (
    <div className="pb-28 pt-[72px]">
      {/* top bar */}
      <div className="flex items-center gap-3 px-3 pb-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={back} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Go back">
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <p className="font-display flex-1 text-[15px] font-extrabold text-slate-900">All Categories</p>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-200/70">
          {categoryTiles.length} collections
        </span>
      </div>

      <p className="px-4 text-[11px] font-medium leading-relaxed text-slate-500">
        Every corner of the forge — tap a collection to see exactly what lives inside it.
      </p>

      {/* all products feature card */}
      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate({ name: "category", cat: "All" })}
        className="group relative mx-4 mt-4 flex w-[calc(100%-32px)] items-center gap-3 overflow-hidden rounded-2xl bg-zinc-900 p-3.5 text-left shadow-lg shadow-zinc-900/30 ring-1 ring-amber-400/25"
      >
        <span className="animate-shine pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" />
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-400 text-slate-900 shadow-md shadow-amber-500/30">
          <LayoutGrid className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <span className="relative min-w-0 flex-1 leading-tight">
          <span className="block text-[13px] font-extrabold text-white">All Products</span>
          <span className="block text-[9.5px] font-semibold text-zinc-400">{products.length} items across the whole shop</span>
        </span>
        <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-amber-400 ring-1 ring-white/15 transition-transform group-hover:translate-x-0.5">
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </motion.button>

      {/* category grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {categoryTiles.map((t, i) => (
          <motion.button
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate({ name: "category", cat: t.name })}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-2.5 text-left shadow-sm backdrop-blur-xl transition-shadow hover:shadow-xl hover:shadow-slate-300/50"
          >
            <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="relative h-24 overflow-hidden rounded-xl bg-slate-100">
              <img src={t.img} alt={t.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-amber-300 backdrop-blur-sm">
                {tileCount(t)} items
              </span>
            </div>
            <div className="relative mt-2 flex items-center justify-between gap-1.5">
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[11.5px] font-extrabold text-slate-900">{t.name}</p>
                <p className="truncate text-[8.5px] font-semibold text-slate-400">{t.blurb}</p>
              </div>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:bg-zinc-900 group-hover:text-amber-400">
                <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
