import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { categoryMeta, products } from "../data";
import { ProductCard } from "./Catalog";
import { useShop } from "../shop";

type SortKey = "popular" | "rated" | "asc" | "desc";

const sorts: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "rated", label: "Top Rated" },
  { key: "asc", label: "Price: Low to High" },
  { key: "desc", label: "Price: High to Low" },
];

export default function CategoryPage({ cat }: { cat: string }) {
  const { back } = useShop();
  const [sort, setSort] = useState<SortKey>("popular");

  const meta = categoryMeta.find((c) => c.name === cat);
  const title = cat === "All" ? "All Products" : cat;

  const list = useMemo(() => {
    const base = cat === "All" ? [...products] : products.filter((p) => p.category === cat);
    switch (sort) {
      case "rated":
        return base.sort((a, b) => b.rating - a.rating);
      case "asc":
        return base.sort((a, b) => a.price - b.price);
      case "desc":
        return base.sort((a, b) => b.price - a.price);
      default:
        return base.sort((a, b) => parseFloat(b.reviews.replace(/,/g, "")) - parseFloat(a.reviews.replace(/,/g, "")));
    }
  }, [cat, sort]);

  return (
    <div className="pb-28 pt-[72px]">
      {/* top bar */}
      <div className="flex items-center gap-3 px-3 pb-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={back} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Go back">
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <p className="font-display flex-1 truncate text-[15px] font-bold text-slate-900">{title}</p>
        <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700">
          <SlidersHorizontal className="h-3 w-3" /> {list.length} items
        </span>
      </div>

      {/* hero strip */}
      {meta && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-4 mt-3 flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 p-3.5 shadow-md shadow-blue-700/20"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-amber-300">Forge Of Ash · {meta.items}</p>
            <h2 className="font-display mt-1 text-[17px] font-extrabold text-white">{meta.name}</h2>
            <p className="text-[10.5px] font-medium text-blue-100">{meta.blurb}</p>
          </div>
          <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-white/30">
            <img src={meta.img} alt={meta.name} className="h-full w-full object-cover" />
          </span>
        </motion.div>
      )}

      {/* sort chips */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4">
        {sorts.map((s) => (
          <motion.button
            key={s.key}
            whileTap={{ scale: 0.94 }}
            onClick={() => setSort(s.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
              sort === s.key ? "bg-blue-700 text-white shadow-md shadow-blue-700/25" : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            {s.label}
          </motion.button>
        ))}
      </div>

      {/* grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        {list.map((p, i) => (
          <ProductCard key={`${sort}-${p.id}`} p={p} index={i} />
        ))}
      </div>
    </div>
  );
}
