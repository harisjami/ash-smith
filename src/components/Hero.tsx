import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Hammer, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { useShop } from "../shop";

const SMITH_IMG = "https://images.pexels.com/photos/37226044/pexels-photo-37226044.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800";

const trust = [
  { icon: Truck, title: "Free Shipping", sub: "Orders over $49" },
  { icon: RefreshCcw, title: "Easy Returns", sub: "30-day policy" },
  { icon: ShieldCheck, title: "Secure Pay", sub: "100% protected" },
];

function PipelineLink() {
  return (
    <svg className="mx-1 mt-3.5 h-2 w-5 shrink-0 text-amber-300/70" viewBox="0 0 40 8" fill="none">
      <line x1="0" y1="4" x2="40" y2="4" stroke="currentColor" strokeWidth="2" className="animate-dashflow" />
    </svg>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { navigate } = useShop();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-top", { y: -14, opacity: 0, duration: 0.5 }, 0.1)
        .from(".hero-line", { y: 30, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.2)
        .from(".hero-sub", { y: 14, opacity: 0, duration: 0.45 }, 0.5)
        .from(".hero-cta", { y: 12, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.62)
        .from(".hero-chip", { x: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.5)
        .from(".hero-badge", { scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2.2)" }, 0.75);
      // slow forge breathing on the photo
      gsap.to(".hero-photo", { scale: 1.07, duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="px-4 pt-4">
      <div className="relative h-[364px] overflow-hidden rounded-[26px] shadow-2xl shadow-zinc-900/50">
        {/* blacksmith photo */}
        <img src={SMITH_IMG} alt="Blacksmith forging steel at the anvil" className="hero-photo absolute inset-0 h-full w-full object-cover" />

        {/* scrims for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        {/* drifting embers */}
        <span className="animate-floaty absolute right-16 top-24 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
        <span className="animate-floaty absolute right-28 top-40 h-1 w-1 rounded-full bg-orange-300" style={{ animationDelay: "0.8s" }} />
        <span className="animate-floaty absolute left-1/2 top-16 h-1 w-1 rounded-full bg-amber-300" style={{ animationDelay: "1.6s" }} />

        {/* top row: brand chip + discount */}
        <div className="hero-top absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 text-[8.5px] font-extrabold uppercase tracking-[0.18em] text-amber-300 ring-1 ring-white/15 backdrop-blur-md">
            <span className="grid h-4 w-4 place-items-center overflow-hidden rounded-full bg-zinc-900 ring-1 ring-amber-400/40">
              <img src="images/logo.png" alt="" className="h-3.5 w-3.5 object-contain" />
            </span>
            Forge Of Ash
          </span>
          <div className="hero-badge relative">
            <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping-soft" />
            <div className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-center shadow-lg shadow-orange-600/50 ring-2 ring-amber-200/40">
              <div className="leading-none text-white">
                <p className="text-[6px] font-extrabold uppercase">Up to</p>
                <p className="font-display text-base font-extrabold">60%</p>
                <p className="text-[6.5px] font-extrabold uppercase">Off</p>
              </div>
            </div>
          </div>
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4 pb-6">
          <p className="hero-line flex items-center gap-1.5 text-[8.5px] font-extrabold uppercase tracking-[0.22em] text-amber-400">
            <Flame className="h-3 w-3 fill-amber-400" /> Hand-forged · small batches
          </p>
          <h1 className="mt-1.5 leading-[1.04] tracking-tight text-white">
            <span className="hero-line font-display block text-[27px] font-extrabold">Steel With a Story,</span>
            <span className="hero-line block font-serif text-[21px] font-medium italic text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>
              forged for your hand.
            </span>
          </h1>
          <p className="hero-sub mt-2 max-w-[240px] text-[10px] font-medium leading-relaxed text-zinc-300">
            Damascus blades, bone & horn handles — hammered, ground and signed at one anvil.
          </p>
          <div className="hero-cta mt-3.5 flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate({ name: "category", cat: "All" })}
              className="group flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-[11px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/40 transition-colors hover:bg-amber-300"
            >
              Shop the Forge
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.06 }}
              onClick={() => navigate({ name: "custom" })}
              aria-label="Start a custom build"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/25 bg-white/[0.06] text-amber-400 backdrop-blur-md transition-colors hover:bg-white/15"
            >
              <Hammer className="h-4 w-4" />
            </motion.button>
          </div>
          <p className="mt-2.5 flex items-center gap-1.5 text-[8.5px] font-bold text-zinc-400">
            <span className="font-display text-[11px] font-extrabold text-white">23 yrs</span> at the anvil
            <span className="h-2.5 w-px bg-white/20" />
            <span className="font-display text-[11px] font-extrabold text-white">1.2k+</span> blades shipped
            <span className="h-2.5 w-px bg-white/20" />
            <Flame className="h-3 w-3 text-amber-400" />
            <span className="font-display text-[11px] font-extrabold text-white">4.9</span> maker rating
          </p>
        </div>
      </div>

      {/* trust strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-2 -mt-4 flex items-start justify-between rounded-2xl bg-white px-3.5 py-3 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/70"
      >
        {trust.map((t, i) => (
          <div key={t.title} className="flex flex-1 items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + i * 0.12 }}
              className="flex items-start gap-1.5"
            >
              <span className="mt-0.5 grid h-6.5 w-6.5 shrink-0 place-items-center rounded-lg bg-amber-100 p-1.5 text-amber-600">
                <t.icon className="h-3.5 w-3.5" />
              </span>
              <span className="leading-tight">
                <p className="text-[10px] font-extrabold text-slate-800">{t.title}</p>
                <p className="text-[8.5px] font-semibold text-slate-400">{t.sub}</p>
              </span>
            </motion.div>
            {i < trust.length - 1 && <PipelineLink />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
