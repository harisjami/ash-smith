import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { discountOf, featuredProducts, money, popularCategories } from "../data";
import type { Product } from "../data";
import { SectionHeader, Stars } from "./ui";
import { useShop } from "../shop";

export function PopularCategories() {
  const { navigate } = useShop();
  return (
    <>
      <SectionHeader title="Popular Categories" id="categories" onViewAll={() => navigate({ name: "category", cat: "All" })} />
      <div className="grid grid-cols-4 gap-2 px-4">
        {popularCategories.map((c, i) => (
          <motion.button
            key={c.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate({ name: "category", cat: c.name })}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white p-1.5 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
              <img src={c.img} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[9px] font-bold text-slate-800">{c.name}</span>
              <span className="block truncate text-[7.5px] font-medium text-slate-400">{c.items}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </>
  );
}

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { addToCart, isWished, toggleWish, navigate } = useShop();
  const wished = isWished(p.id);
  const [added, setAdded] = useState(false);

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index, 5) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => navigate({ name: "product", id: p.id })}
      className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-200"
    >
      <div className="group relative h-28 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow">
          {discountOf(p)}
        </span>
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWish(p.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white shadow"
        >
          <motion.span key={String(wished)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
            <Heart className={`h-3.5 w-3.5 ${wished ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
          </motion.span>
        </motion.button>
      </div>

      <h3 className="mt-2 line-clamp-2 min-h-[30px] text-[11.5px] font-bold leading-snug text-slate-800">{p.name}</h3>
      <div className="mt-1">
        <Stars rating={p.rating} reviews={p.reviews} />
      </div>

      <div className="mt-1.5 flex items-end justify-between">
        <p className="flex items-baseline gap-1.5">
          <span className="font-display text-[15px] font-extrabold text-slate-900">{money(p.price)}</span>
          <span className="text-[10px] font-semibold text-slate-400 line-through">{money(p.oldPrice)}</span>
        </p>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onAdd}
          aria-label={`Add ${p.name} to cart`}
          className={`grid h-8 w-8 place-items-center rounded-lg border transition-all ${
            added ? "border-emerald-500 bg-emerald-500 text-white" : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <ShoppingCart className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}

export function FeaturedProducts() {
  const { navigate } = useShop();
  return (
    <>
      <SectionHeader title="Featured Products" onViewAll={() => navigate({ name: "category", cat: "All" })} />
      <div className="grid grid-cols-2 gap-3 px-4">
        {featuredProducts.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </>
  );
}
