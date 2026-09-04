import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { useShop } from "../shop";

const trust = [
  { icon: Truck, title: "Free Shipping", sub: "On orders over $49" },
  { icon: RefreshCcw, title: "Easy Returns", sub: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", sub: "100% protected" },
];

function PipelineLink() {
  return (
    <svg className="mx-1 mt-4 h-2 w-6 shrink-0 text-blue-300 sm:w-10" viewBox="0 0 40 8" fill="none">
      <line x1="0" y1="4" x2="40" y2="4" stroke="currentColor" strokeWidth="2" className="animate-dashflow" />
    </svg>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const { notify } = useShop();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.5 }, 0.1)
        .from(".hero-line", { y: 34, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.2)
        .from(".hero-copy", { y: 18, opacity: 0, duration: 0.5 }, 0.55)
        .from(".hero-btn", { y: 16, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.7)
        .from(".hero-podium", { x: 60, opacity: 0, scale: 0.92, duration: 0.9, ease: "power4.out" }, 0.35)
        .from(".hero-badge", { scale: 0, rotation: -40, duration: 0.6, ease: "back.out(2.2)" }, 0.9);

      // gentle perpetual float on the podium
      gsap.to(".hero-podium", { y: -12, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.2 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-3xl bg-[#e9eef8]">
        {/* soft glow orbs */}
        <div className="hero-orb pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-6 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative flex min-h-[240px]">
          {/* copy */}
          <div className="z-10 w-[56%] py-6 pl-5 pr-2">
            <p className="hero-eyebrow text-[10px] font-extrabold uppercase tracking-wide text-amber-500">
              Premium Quality, Premium You.
            </p>
            <h1 className="font-display mt-2 text-[26px] font-extrabold leading-[1.12] tracking-tight text-slate-900">
              <span className="hero-line block overflow-hidden">Everything You Need,</span>
              <span className="hero-line block overflow-hidden">
                All in <span className="text-amber-600">One Place</span>
              </span>
            </h1>
            <p className="hero-copy mt-3 text-[11px] font-medium leading-relaxed text-slate-500">
              Discover millions of products from top brands and trusted sellers. Best prices, premium quality &
              unbeatable service.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => notify("Let's shop!")}
                className="hero-btn group flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-700/30 transition-colors hover:bg-blue-800"
              >
                Shop Now
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => notify("Exploring today's deals")}
                className="hero-btn rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-white"
              >
                Explore Deals
              </motion.button>
            </div>
          </div>

          {/* podium image */}
          <div className="relative w-[44%]">
            <img
              src="images/hero-podium.png"
              alt="Curated products on a display podium"
              fetchPriority="high"
              decoding="async"
              className="hero-podium absolute bottom-0 right-0 h-full w-full object-cover object-bottom"
            />
            {/* discount badge */}
            <div className="hero-badge absolute right-3 top-3">
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping-soft" />
              <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-center shadow-lg shadow-orange-500/40">
                <div className="leading-none text-white">
                  <p className="text-[7px] font-bold uppercase tracking-wide">Up to</p>
                  <p className="font-display text-lg font-extrabold">60%</p>
                  <p className="text-[8px] font-bold uppercase tracking-wide">Off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* trust pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="mt-3 flex items-start justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm"
      >
        {trust.map((t, i) => (
          <div key={t.title} className="flex flex-1 items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.15 }}
              className="flex items-start gap-2"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-600">
                <t.icon className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <p className="text-[11px] font-bold text-slate-800">{t.title}</p>
                <p className="text-[9.5px] font-medium text-slate-400">{t.sub}</p>
              </span>
            </motion.div>
            {i < trust.length - 1 && <PipelineLink />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
