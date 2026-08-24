import { motion } from "framer-motion";
import { Axe, Flame, Hammer, Shield, Star, Swords, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Review = {
  name: string;
  role: string;
  rating: number;
  text: string;
  tag: string;
  year: string;
  img: string;
  glyph: LucideIcon;
  glyphCls: string;
};

const av = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200`;

const REVIEWS: Review[] = [
  { name: "Maren Holt", role: "Collector · Oslo", rating: 5, text: "The Heritage folder arrived sharper than my kitchen knives ever were. The damascus pattern photographs badly — it's even better in person.", tag: "Heritage Folder", year: "2026", img: av(36177188), glyph: Swords, glyphCls: "bg-amber-100 text-amber-600" },
  { name: "Devon Marsh", role: "EDC Enthusiast", rating: 5, text: "Three months of daily carry and the edge still shaves. I've stopped babying it — it doesn't need me to.", tag: "Pocket Knife", year: "2026", img: av(804009), glyph: Flame, glyphCls: "bg-orange-100 text-orange-600" },
  { name: "Priya Anand", role: "Custom Build Client", rating: 5, text: "Sent a napkin sketch through the Custom Forge. What came back was a knife I'll hand to my son one day.", tag: "Custom Forge", year: "2026", img: av(38197025), glyph: Hammer, glyphCls: "bg-zinc-200 text-zinc-700" },
  { name: "Tomás Rivera", role: "Home Cook", rating: 4, text: "Shipping took a week longer than quoted — my only complaint. The chef set itself is utterly flawless.", tag: "Chef Set", year: "2026", img: av(9527896), glyph: Axe, glyphCls: "bg-emerald-100 text-emerald-600" },
  { name: "Lena Fischer", role: "Verified Buyer", rating: 5, text: "The antler handle fits my palm like it was measured for it. Because, apparently, it actually was.", tag: "Antler Neck Knife", year: "2025", img: av(7717254), glyph: Shield, glyphCls: "bg-blue-100 text-blue-600" },
  { name: "Aaron Beck", role: "Woodworker", rating: 4, text: "Expected a faster version of a factory knife. Got a completely different object — heavier in all the right ways.", tag: "Fixed Blade", year: "2026", img: av(14950779), glyph: Zap, glyphCls: "bg-yellow-100 text-yellow-600" },
  { name: "Sofia Marino", role: "Gift Buyer", rating: 5, text: "The copper bolster engraving made my husband cry at the dinner table. Ten out of ten, would commission again.", tag: "Engraved Folder", year: "2025", img: av(36593090), glyph: Flame, glyphCls: "bg-rose-100 text-rose-600" },
  { name: "Kwame Osei", role: "Chef · Accra", rating: 5, text: "Balance is the word. The knife disappears in your hand and the work simply happens.", tag: "Chef Knife 8\"", year: "2026", img: av(10812247), glyph: Swords, glyphCls: "bg-indigo-100 text-indigo-600" },
  { name: "June Park", role: "Verified Buyer", rating: 4, text: "Four stars only because I now want six more. This pocket knife quietly started an addiction.", tag: "Pocket Knife", year: "2026", img: av(36177188), glyph: Hammer, glyphCls: "bg-amber-100 text-amber-600" },
  { name: "Marco Bellini", role: "Knifemaker's Son", rating: 5, text: "My father made blades for forty years. Even he ran his thumb along this edge twice and just nodded.", tag: "Damascus Folder", year: "2025", img: av(9527896), glyph: Shield, glyphCls: "bg-slate-200 text-slate-700" },
];

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="group relative w-[238px] shrink-0 overflow-hidden rounded-[16px] bg-white/70 p-3 shadow-[0_8px_24px_-14px_rgba(15,23,42,0.25)] ring-1 ring-white/90 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 hover:shadow-[0_14px_34px_-16px_rgba(15,23,42,0.35)]">
      {/* glass sheen */}
      <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <span className="animate-water-a pointer-events-none absolute -right-8 -top-10 h-20 w-28 rounded-full bg-white/60 blur-xl" />

      {/* header */}
      <div className="relative flex items-center gap-2">
        <img src={r.img} alt={r.name} loading="lazy" decoding="async" className="h-7 w-7 rounded-full object-cover ring-2 ring-white shadow-sm" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[10.5px] font-extrabold text-slate-900">{r.name}</p>
          <p className="truncate text-[8px] font-semibold text-slate-400">{r.role}</p>
        </div>
        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${r.glyphCls}`}>
          <r.glyph className="h-3 w-3" />
        </span>
      </div>

      <div className="relative mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`h-2.5 w-2.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
        ))}
        <span className="ml-1 text-[8px] font-extrabold text-slate-500">{r.rating}.0</span>
      </div>

      <p className="relative mt-2 line-clamp-3 text-[10px] font-medium leading-relaxed text-slate-600">“{r.text}”</p>

      <p className="relative mt-2 text-[7.5px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
        {r.tag} <span className="text-slate-300">/</span> {r.year}
      </p>
    </article>
  );
}

function Row({ items, reverse, duration }: { items: Review[]; reverse?: boolean; duration: number }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f6f7fb] via-[#f6f7fb]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f6f7fb] via-[#f6f7fb]/70 to-transparent" />
      <div
        className={`flex w-max gap-3 px-3 hover:[animation-play-state:paused] ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...items, ...items].map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} r={r} />
        ))}
      </div>
    </div>
  );
}

export default function ReviewWall() {
  const top = REVIEWS.slice(0, 5);
  const bottom = REVIEWS.slice(5);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pt-6"
    >
      {/* header */}
      <div className="mb-3 flex items-end justify-between px-4">
        <div>
          <p className="text-[8px] font-extrabold uppercase tracking-[0.28em] text-amber-600">Words From The Bench</p>
          <h2 className="font-display mt-0.5 text-[16px] font-extrabold tracking-tight text-slate-900">
            Carried. Used. <span className="text-slate-400">Reviewed.</span>
          </h2>
        </div>
        <div className="text-right leading-tight">
          <p className="flex items-center justify-end gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-display text-[14px] font-extrabold text-slate-900">4.9</span>
          </p>
          <p className="text-[8px] font-bold text-slate-400">2,300+ verified reviews</p>
        </div>
      </div>

      {/* opposing marquee rows */}
      <div className="flex flex-col gap-3">
        <Row items={top} duration={42} />
        <Row items={bottom} reverse duration={48} />
      </div>
    </motion.section>
  );
}
