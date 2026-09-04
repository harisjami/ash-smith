import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { bestSellers, brandBanners, discountOf, money, products } from "../data";
import { SectionHeader, Stars } from "./ui";
import { useShop } from "../shop";

gsap.registerPlugin(ScrollTrigger);

export function BrandBanners() {
  const root = useRef<HTMLDivElement>(null);
  const { navigate } = useShop();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".brand-img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: img.closest(".brand-card"), start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <SectionHeader title="Trusted by Top Brands" />
      <div ref={root} className="grid grid-cols-2 gap-3 px-4">
        {/* summer */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="brand-card relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-300 to-amber-400 shadow-md shadow-amber-400/25"
        >
          <img
            src={brandBanners.summer.img}
            alt="Summer collection"
            loading="lazy"
            className="brand-img absolute bottom-0 right-0 h-full w-[62%] object-cover object-top [mask-image:linear-gradient(to_left,#000_55%,transparent)]"
          />
          <div className="relative z-10 p-3.5">
            <h3 className="font-display text-[15px] font-extrabold leading-tight text-slate-900">{brandBanners.summer.title}</h3>
            <p className="mt-1 text-[10px] font-extrabold text-slate-900">{brandBanners.summer.line1}</p>
            <p className="text-[9px] font-semibold text-slate-800/80">{brandBanners.summer.line2}</p>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate({ name: "category", cat: brandBanners.summer.category })}
              className="group mt-3 flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white"
            >
              Shop Now
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* home */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="brand-card relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-[#dbe4f2] to-[#c8d4ea] shadow-md shadow-blue-300/20"
        >
          <img
            src={brandBanners.home.img}
            alt="Home essentials"
            loading="lazy"
            className="brand-img absolute bottom-0 right-0 h-full w-[68%] object-cover [mask-image:linear-gradient(to_left,#000_50%,transparent)]"
          />
          <div className="relative z-10 p-3.5">
            <h3 className="font-display max-w-[110px] text-[14px] font-extrabold leading-tight text-slate-900">
              {brandBanners.home.title}
            </h3>
            <p className="mt-1 text-[10px] font-extrabold text-slate-800">{brandBanners.home.line1}</p>
            <p className="text-[9px] font-semibold text-slate-600">{brandBanners.home.line2}</p>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate({ name: "category", cat: brandBanners.home.category })}
              className="group mt-3 flex items-center gap-1 rounded-lg bg-blue-700 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm"
            >
              Shop Now
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export function KnifeSpotlight() {
  const { navigate } = useShop();
  return (
    <>
      <SectionHeader title="Folding Knives" onViewAll={() => navigate({ name: "category", cat: "Folding Knives" })} />
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/30">
          {/* copper glow + damascus waves */}
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-amber-500/20 blur-3xl" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 400 200" preserveAspectRatio="none" fill="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M-20 ${30 + i * 28} C 80 ${10 + i * 28}, 160 ${55 + i * 28}, 260 ${30 + i * 28} S 420 ${50 + i * 28}, 440 ${30 + i * 28}`}
                stroke="#f59e0b"
                strokeWidth="1.2"
              />
            ))}
          </svg>

          <div className="relative flex min-h-[190px]">
            <div className="z-10 w-[56%] py-5 pl-5 pr-2">
              <span className="inline-block rounded-full border border-amber-400/50 bg-amber-400/10 px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-widest text-amber-300">
                New · Hand-Forged
              </span>
              <h3 className="font-display mt-2.5 text-[19px] font-extrabold leading-tight text-white">
                Damascus Steel,
                <br />
                <span className="text-amber-400">Copper Soul.</span>
              </h3>
              <p className="mt-2 text-[10.5px] font-medium leading-relaxed text-slate-400">
                67-layer blades, floral-engraved copper bolsters and polished horn handles — forged to be carried for generations.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["67-layer", "Engraved", "Horn handle"].map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-[8.5px] font-bold text-slate-300 ring-1 ring-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => navigate({ name: "category", cat: "Folding Knives" })}
                className="group mt-4 flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-[11px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-300"
              >
                Shop the Collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </div>
            <div className="relative w-[44%]">
              <motion.img
                initial={{ opacity: 0, scale: 0.9, rotate: 8 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                src="images/knife-hero.png"
                alt="Heritage Damascus Folding Knife"
                className="animate-floaty absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_top,#000_70%,transparent)]"
              />
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

export function BestSellers() {
  const { navigate } = useShop();
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const update = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft < max - 8);
  };

  const nudge = (dir: number) => rail.current?.scrollBy({ left: dir * 172, behavior: "smooth" });

  return (
    <>
      <SectionHeader title="Best Sellers" id="deals" />
      <div className="relative">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-[#f6f7fb] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-[#f6f7fb] to-transparent" />

        {/* arrows */}
        <button
          onClick={() => nudge(-1)}
          aria-label="Scroll left"
          className={`absolute left-1.5 top-[72px] z-20 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-700 shadow-lg transition-all ${
            canL ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => nudge(1)}
          aria-label="Scroll right"
          className={`absolute right-1.5 top-[72px] z-20 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-700 shadow-lg transition-all ${
            canR ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div ref={rail} onScroll={update} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {[...bestSellers, ...products.filter((x) => x.featured && !bestSellers.includes(x))].map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate({ name: "product", id: p.id })}
              className="w-[150px] shrink-0 cursor-pointer snap-start rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="group relative h-24 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow">
                  {discountOf(p)}
                </span>
              </div>
              <h3 className="mt-2 truncate text-[11.5px] font-bold text-slate-800">{p.name}</h3>
              {p.spec && <p className="text-[9.5px] font-medium text-slate-400">{p.spec}</p>}
              <div className="mt-1">
                <Stars rating={p.rating} reviews={p.reviews} />
              </div>
              <p className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-display text-[14px] font-extrabold text-slate-900">{money(p.price)}</span>
                <span className="text-[9.5px] font-semibold text-slate-400 line-through">{money(p.oldPrice)}</span>
              </p>
            </motion.article>
          ))}
        </div>

        {/* scroll progress */}
        <div className="mx-auto mt-3 h-1 w-24 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full w-1/3 rounded-full bg-blue-700"
            animate={{ x: `${progress * 200}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    </>
  );
}
