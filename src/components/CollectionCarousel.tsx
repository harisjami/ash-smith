import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, ChevronDown, ChevronUp, Heart, ShoppingBag } from "lucide-react";
import { byId, discountOf, money } from "../data";
import { Stars } from "./ui";
import { SectionHeader } from "./ui";
import { useShop } from "../shop";

type Slide = { label: string; productId: string; thumbs: string[] };

const slides: Slide[] = [
  { label: "New Arrivals", productId: "chef-set-5", thumbs: ["chef-set-5", "chef-forge", "chef-single", "chef-duo"] },
  { label: "Featured Products", productId: "knife-heritage", thumbs: ["knife-heritage", "knife-artisan", "knife-craft", "knife-sheath"] },
  { label: "Best Selling Products", productId: "knife-pocket", thumbs: ["knife-pocket", "knife-antler", "knife-rustic", "knife-woodfold"] },
  { label: "Top Rated", productId: "knife-artisan", thumbs: ["knife-artisan", "knife-edc", "knife-sheath", "knife-craft"] },
  { label: "Hot Deal", productId: "chef-single", thumbs: ["chef-single", "chef-duo", "chef-set-5", "chef-forge"] },
];

function CollectionCard({ s, index }: { s: Slide; index: number }) {
  const product = byId(s.productId)!;
  const { navigate, addToCart, isWished, toggleWish, notify } = useShop();
  const [selected, setSelected] = useState(0);
  const [railOpen, setRailOpen] = useState(true);
  const wished = isWished(product.id);
  const mainImg = byId(s.thumbs[selected])?.img ?? product.img;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => navigate({ name: "product", id: product.id })}
      className="relative w-[290px] shrink-0 cursor-pointer snap-start rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200"
    >
      {/* tag + collapse */}
      <div className="flex items-start justify-between">
        <span className="rounded-md bg-amber-400 px-2.5 py-1 text-[10px] font-extrabold text-slate-900 shadow-sm">{s.label}</span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            setRailOpen((v) => !v);
          }}
          aria-label="Toggle thumbnails"
          className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
        >
          <motion.span animate={{ rotate: railOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
            <ChevronUp className="h-3.5 w-3.5" />
          </motion.span>
        </motion.button>
      </div>

      {/* image + thumb rail */}
      <div className="mt-2.5 flex gap-2">
        <div className="relative h-40 min-w-0 flex-1 overflow-hidden rounded-xl bg-slate-100">
          <AnimatePresence mode="wait">
            <motion.img
              key={mainImg}
              src={mainImg}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
          <span className="absolute left-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow">{discountOf(product)}</span>
        </div>
        <AnimatePresence initial={false}>
          {railOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 52, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex shrink-0 flex-col gap-1.5 overflow-hidden"
            >
              {s.thumbs.map((t, i) => (
                <motion.button
                  key={t}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(i);
                  }}
                  aria-label={`View ${byId(t)?.name}`}
                  className={`h-[46px] w-[52px] shrink-0 overflow-hidden rounded-lg border-2 bg-slate-100 transition-colors ${
                    i === selected ? "border-amber-400" : "border-transparent hover:border-slate-200"
                  }`}
                >
                  <img src={byId(t)?.img} alt="" loading="lazy" className="h-full w-full object-cover" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* info */}
      <h3 className="mt-2.5 line-clamp-1 text-[12px] font-bold text-slate-800">{product.name}</h3>
      <div className="mt-1">
        <Stars rating={product.rating} />
      </div>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-[15px] font-extrabold text-red-500">{money(product.price)}</span>
        <span className="text-[10.5px] font-semibold text-slate-400 line-through">{money(product.oldPrice)}</span>
      </p>

      {/* actions */}
      <div className="mt-2.5 flex items-center gap-1.5">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product.id);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2 text-[10px] font-extrabold text-slate-700 transition-colors hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
        >
          <ShoppingBag className="h-3.5 w-3.5" /> Add To Cart
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWish(product.id);
          }}
          aria-label="Toggle wishlist"
          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50"
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? "fill-red-500 text-red-500" : ""}`} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            notify("Added to compare list");
          }}
          aria-label="Compare"
          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-zinc-300 hover:bg-slate-50"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate({ name: "product", id: product.id });
          }}
          aria-label="View details"
          className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-slate-900 shadow-md shadow-amber-400/40 transition-colors hover:bg-amber-300"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.article>
  );
}

export default function CollectionCarousel() {
  const { navigate } = useShop();
  return (
    <>
      <SectionHeader title="Today's Highlights" onViewAll={() => navigate({ name: "category", cat: "All" })} />
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#f6f7fb] to-transparent" />
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2">
          {slides.map((s, i) => (
            <CollectionCard key={s.productId} s={s} index={i} />
          ))}
        </div>
        <p className="mt-1 px-4 text-center text-[9.5px] font-semibold uppercase tracking-widest text-slate-400">Swipe for more</p>
      </div>
    </>
  );
}
