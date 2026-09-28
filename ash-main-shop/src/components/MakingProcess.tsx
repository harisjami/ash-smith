import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame, Hammer, Sparkles, Thermometer, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  n: string;
  title: string;
  icon: LucideIcon;
  tint: string;
  num: string;
  pin: "amber" | "zinc";
  text: string;
};

const steps: Step[] = [
  { n: "01", title: "Forging the Steel", icon: Flame, tint: "bg-orange-50", num: "text-orange-500", pin: "amber", text: "Raw damascus billets are heated to 1,500°F and hammered on the anvil until the layers weld into one living piece of steel." },
  { n: "02", title: "Shaping the Blade", icon: Hammer, tint: "bg-slate-100", num: "text-slate-500", pin: "zinc", text: "The profile is cut, the bevels are ground by hand, and the hidden damascus pattern begins to surface on the blade." },
  { n: "03", title: "Heat Treatment", icon: Thermometer, tint: "bg-amber-50", num: "text-amber-600", pin: "amber", text: "A precise quench and temper cycle locks in hardness — a blade that stays razor-sharp yet never turns brittle." },
  { n: "04", title: "Handle & Guard", icon: Wrench, tint: "bg-orange-50", num: "text-orange-500", pin: "zinc", text: "Antler, horn or walnut is shaped to the palm and fitted with hand-engraved copper bolsters, pinned and sealed." },
  { n: "05", title: "Sharpen & Finish", icon: Sparkles, tint: "bg-slate-100", num: "text-slate-500", pin: "amber", text: "Honed on stones to a shaving edge, oiled, inspected — and signed by the maker before it ever leaves the forge." },
];

const ROTS = [-4, 3, -3, 3.5, -2.5, 0];

const PIN_CLS: Record<Step["pin"], string> = {
  amber: "bg-[radial-gradient(circle_at_35%_30%,#fcd34d,#ea580c)] shadow-[0_4px_10px_rgba(234,88,12,0.45)]",
  zinc: "bg-[radial-gradient(circle_at_35%_30%,#d4d4d8,#3f3f46)] shadow-[0_4px_10px_rgba(63,63,70,0.4)]",
};

// connector curves between alternating cards
const curve = (toRight: boolean) =>
  toRight ? "M 30 3 C 54 20, 48 36, 73 53" : "M 70 3 C 46 20, 52 36, 27 53";

export default function MakingProcess() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".mp-card");
      const draws = gsap.utils.toArray<SVGPathElement>(".mp-path");

      cards.forEach((c, i) => gsap.set(c, { autoAlpha: 0, scale: 0.8, y: 28, rotation: ROTS[i] }));
      draws.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".mp-wrap", start: "top 78%", end: "bottom 62%", scrub: 0.5 },
      });

      cards.forEach((card, i) => {
        tl.to(card, { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.7)" });
        if (i < draws.length) tl.to(draws[i], { strokeDashoffset: 0, duration: 1, ease: "none" }, ">-0.2");
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="ruled-paper mt-8 bg-[#fbfbfc] px-4 pb-14 pt-10">
      {/* header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-[10px] font-extrabold text-amber-400 shadow-md shadow-zinc-900/25">
          <Hammer className="h-3.5 w-3.5" /> Forge Of Ash
        </span>
        <h2 className="font-display mt-3 text-[26px] font-extrabold leading-[1.1] tracking-tight text-slate-800">
          Making Process
          <span className="mt-1 block text-[15px] font-bold text-slate-400">Five steps from billet to blade</span>
        </h2>
      </div>

      {/* timeline */}
      <div className="mp-wrap relative mx-auto mt-8 max-w-[400px]">
        {steps.map((s, i) => (
          <div key={s.n} className={`relative flex ${i % 2 === 0 ? "justify-start" : "justify-end"} ${i > 0 ? "pt-14" : ""}`}>
            {/* connector */}
            {i > 0 && (
              <svg className="pointer-events-none absolute left-0 top-0 h-14 w-full" viewBox="0 0 100 56" preserveAspectRatio="none" fill="none">
                <path d={curve(i % 2 === 1)} stroke="#cbd5e1" strokeWidth="1.4" strokeDasharray="3 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <path className="mp-path" d={curve(i % 2 === 1)} stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            )}

            {/* pinned note */}
            <div className="mp-card relative w-[82%]">
              <span className={`absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full ring-2 ring-white ${PIN_CLS[s.pin]}`} />
              <div className="rounded-2xl bg-white p-2 shadow-[0_14px_30px_-10px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/5">
                <div className={`rounded-xl ${s.tint} p-3.5`}>
                  <p className={`font-display text-[17px] font-extrabold ${s.num}`}>{s.n}</p>
                  <h3 className="font-display mt-1 flex items-center gap-1.5 text-[15px] font-extrabold text-slate-900">
                    <s.icon className="h-4 w-4" /> {s.title}
                  </h3>
                  <p className="mt-1.5 text-[10.5px] font-medium leading-relaxed text-slate-500">{s.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* sign-off */}
        <div className="mp-card mt-10 flex items-center justify-center gap-3">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-zinc-900 ring-2 ring-white">
            <img src="images/logo.png" alt="Forge Of Ash" className="h-9 w-9 object-contain" />
          </span>
          <p className="text-[11px] font-semibold leading-snug text-slate-500">
            Every blade <span className="font-extrabold text-amber-600">signed by its maker</span>,
            <br /> forged to outlive us.
          </p>
        </div>
      </div>
    </section>
  );
}
