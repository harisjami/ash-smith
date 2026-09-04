import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const FAQS = [
  {
    q: "Is Every Blade Really Hand-Forged?",
    a: "Yes — every billet is heated, hammered and ground on our own anvil. No drop-forging, no overseas blanks. Each knife carries the maker's stamp before it ships.",
  },
  {
    q: "How Long Does A Custom Knife Take?",
    a: "Around three weeks from design approval to delivery. Damascus layering and hand engraving can add a few days — we'd rather ship it right than ship it fast.",
  },
  {
    q: "What Steel Do You Work With?",
    a: "1095 high-carbon for toughness, 67+ layer damascus for the pattern, D2 for edge retention, and VG-10 for kitchen work. We'll recommend the right one for your build.",
  },
  {
    q: "Can I Send My Own Design Or Photo?",
    a: "Absolutely. Open the Custom Forge, attach a sketch or reference photo, pick your steel, handle and guard, and we quote it within 24 hours.",
  },
  {
    q: "Do You Ship Internationally?",
    a: "Yes — tracked shipping to most countries, free over $49. Knives travel in locked, foam-lined cases and every parcel is declared and insured.",
  },
  {
    q: "What If My Blade Arrives Damaged?",
    a: "A 30-day no-questions return or reforge. If the edge chips under normal use in the first year, we re-hone or replace it free — a forge stands behind its steel.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="px-4 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-white/80 via-white/60 to-white/75 px-5 py-9 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.3)] ring-1 ring-white/80 backdrop-blur-2xl backdrop-saturate-150"
      >
        {/* living glass light */}
        <span className="animate-water-a pointer-events-none absolute -left-12 -top-16 h-44 w-56 rounded-full bg-white/70 blur-2xl" />
        <span className="animate-water-b pointer-events-none absolute -bottom-20 -right-10 h-44 w-52 rounded-full bg-amber-100/70 blur-2xl" />
        <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <span className="animate-floaty pointer-events-none absolute right-12 top-12 h-1.5 w-1.5 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        <span className="animate-floaty pointer-events-none absolute left-10 bottom-16 h-1 w-1 rounded-full bg-amber-300/70" style={{ animationDelay: "1.2s" }} />

        {/* heading */}
        <div className="relative text-center">
          <span className="inline-block rounded-full bg-zinc-900 px-3 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.25em] text-amber-400 shadow-md shadow-zinc-900/25">
            FAQs
          </span>
          <h2 className="font-display mx-auto mt-3 max-w-[300px] text-[21px] font-extrabold leading-snug tracking-tight text-slate-900">
            Questions From The Forge?
            <span className="block text-slate-500">Quick Answers Before You Order</span>
          </h2>
        </div>

        {/* accordion */}
        <div className="relative mx-auto mt-7 flex max-w-[340px] flex-col gap-2.5">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center gap-3 rounded-full py-2 pl-2 pr-4 text-left ring-1 transition-all duration-300 ${
                    isOpen
                      ? "bg-zinc-900 shadow-lg shadow-zinc-900/25 ring-zinc-900"
                      : "bg-white/75 shadow-sm ring-white/90 backdrop-blur-xl hover:bg-white hover:shadow-md"
                  }`}
                >
                  <span
                    className={`font-display grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-extrabold transition-colors ${
                      isOpen ? "bg-amber-400 text-slate-900" : "bg-zinc-900 text-amber-400"
                    }`}
                  >
                    ?
                  </span>
                  <span className={`flex-1 text-[11.5px] font-extrabold tracking-tight ${isOpen ? "text-white" : "text-slate-800"}`}>
                    {f.q}
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} className={`text-[15px] font-bold leading-none ${isOpen ? "text-amber-400" : "text-slate-400"}`}>
                    +
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 flex items-start gap-2.5 rounded-2xl rounded-tl-md bg-white/80 p-3.5 pr-3 shadow-sm ring-1 ring-white/90 backdrop-blur-xl">
                        <p className="flex-1 text-[10.5px] font-semibold leading-relaxed text-slate-600">{f.a}</p>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-600 ring-1 ring-amber-200/70">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="relative mt-6 text-center text-[9.5px] font-bold text-slate-400">
          Still curious? Message the forge from your account — we answer within the hour.
        </p>
      </motion.div>
    </section>
  );
}
