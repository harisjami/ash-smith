import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useShop } from "../shop";

export function SectionHeader({ title, id, onViewAll, sub }: { title: string; id?: string; onViewAll?: () => void; sub?: string }) {
  const { notify } = useShop();
  return (
    <div id={id} className="flex items-center justify-between px-4 pt-6 pb-3 scroll-mt-32">
      <motion.h2
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="font-display leading-tight"
      >
        <span className="block text-[17px] font-bold tracking-tight text-slate-900">{title}</span>
        {sub && <span className="mt-0.5 block text-[9.5px] font-extrabold uppercase tracking-widest text-amber-600">{sub}</span>}
      </motion.h2>
      <motion.button
        initial={{ opacity: 0, x: 14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => (onViewAll ? onViewAll() : notify(`Viewing all ${title.toLowerCase()}`))}
        className="group flex items-center gap-1 text-[12px] font-bold text-blue-700"
      >
        View All
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </motion.button>
    </div>
  );
}

export function Stars({ rating, reviews }: { rating: number; reviews?: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 500, damping: 20 }}
          >
            <Star className={`h-3 w-3 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
          </motion.span>
        ))}
      </span>
      {reviews && <span className="text-[10px] font-medium text-slate-400">({reviews})</span>}
    </span>
  );
}
