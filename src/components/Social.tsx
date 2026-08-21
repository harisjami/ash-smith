import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Mail, Send } from "lucide-react";
import { testimonials } from "../data";
import { useShop } from "../shop";

const variants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0, scale: 0.97 }),
};

export function Testimonials() {
  const [[index, dir], setIndex] = useState([0, 1]);

  const go = (next: number, d: number) => setIndex([(next + testimonials.length) % testimonials.length, d]);

  useEffect(() => {
    const id = setInterval(() => setIndex(([i]) => [(i + 1) % testimonials.length, 1]), 4600);
    return () => clearInterval(id);
  }, [index]);

  const t = testimonials[index];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55 }}
      className="px-4 pt-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3"
          >
            <img src={t.avatar} alt={t.name} loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover shadow-md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-extrabold text-slate-900">{t.name}</p>
                <BadgeCheck className="h-3.5 w-3.5 fill-blue-600 text-white" />
              </div>
              <p className="text-[10px] font-bold text-blue-700">{t.role}</p>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-500">“{t.text}”</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Show review ${i + 1}`}
              className="relative h-1.5 rounded-full transition-all"
              style={{ width: i === index ? 18 : 6 }}
            >
              {i === index ? (
                <motion.span layoutId="dot" className="absolute inset-0 rounded-full bg-blue-700" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              ) : (
                <span className="absolute inset-0 rounded-full bg-slate-300" />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const { notify } = useShop();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      notify("Please enter your email first");
      return;
    }
    setDone(true);
    notify("Subscribed — welcome aboard!");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55 }}
      className="px-4 pb-6 pt-5"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-700 text-white shadow-md shadow-blue-700/30"
        >
          <Mail className="h-4.5 w-4.5" />
        </motion.span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[12px] font-extrabold text-slate-900">Get Exclusive Offers & Updates</p>
          <p className="truncate text-[9.5px] font-medium text-slate-500">Join our newsletter and save more on your favorite products.</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.p
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="shrink-0 text-[11px] font-extrabold text-emerald-600"
            >
              Subscribed ✓
            </motion.p>
          ) : (
            <motion.form key="form" exit={{ opacity: 0, scale: 0.9 }} onSubmit={submit} className="flex shrink-0 items-center gap-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-[124px] rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:w-[140px] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="flex items-center gap-1 rounded-full bg-blue-700 px-3.5 py-2 text-[10px] font-extrabold text-white shadow-md shadow-blue-700/25 transition-colors hover:bg-blue-800"
              >
                Subscribe
                <Send className="h-3 w-3" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
