import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Anvil,
  Axe,
  Bone,
  Camera,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronLeft,
  CircleDollarSign,
  Clock,
  Coins,
  Droplets,
  Flame,
  Gem,
  Hammer,
  Layers,
  Mail,
  Minus,
  Phone,
  Ruler,
  Send,
  Shell,
  Shield,
  Sparkles,
  StickyNote,
  Swords,
  TreePine,
  Upload,
  User,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { money } from "../data";
import { useShop } from "../shop";

type Opt = { id: string; name: string; price: number; desc: string; icon: LucideIcon };

const projects: Opt[] = [
  { id: "folding", name: "Folding Knife", price: 60, desc: "Lock-back or slipjoint pocket carry", icon: Swords },
  { id: "fixed", name: "Fixed Blade", price: 50, desc: "Full-tang hunter or camp blade", icon: Hammer },
  { id: "chef", name: "Chef Knife", price: 70, desc: "Kitchen-ready forged edge", icon: ChefHat },
  { id: "axe", name: "Axe / Hatchet", price: 80, desc: "Splitting or carving head", icon: Axe },
  { id: "metal", name: "Custom Metalwork", price: 90, desc: "Any forged idea you dream up", icon: Anvil },
];

const blades: Opt[] = [
  { id: "1095", name: "1095 High Carbon", price: 45, desc: "Tough, easy to sharpen, classic", icon: Flame },
  { id: "damascus", name: "Damascus Steel", price: 120, desc: "67+ folded layers, signature waves", icon: Layers },
  { id: "d2", name: "D2 Tool Steel", price: 65, desc: "Wear-resistant, holds an edge", icon: Shield },
  { id: "440c", name: "Stainless 440C", price: 55, desc: "Rust-proof, low maintenance", icon: Droplets },
  { id: "vg10", name: "VG-10 Japanese", price: 85, desc: "Razor core, surgical sharpness", icon: Gem },
];

const handles: Opt[] = [
  { id: "antler", name: "Deer Antler", price: 40, desc: "Natural curve, one-of-a-kind", icon: Bone },
  { id: "horn", name: "Buffalo Horn", price: 35, desc: "Glossy black, polished smooth", icon: Shell },
  { id: "walnut", name: "Walnut Wood", price: 25, desc: "Oiled grain, warm in hand", icon: TreePine },
  { id: "micarta", name: "Micarta", price: 30, desc: "Grip-tight, weatherproof", icon: Layers },
  { id: "brass", name: "Brass Scales", price: 50, desc: "Heavy shine, ages to patina", icon: Coins },
];

const guards: Opt[] = [
  { id: "none", name: "No Guard", price: 0, desc: "Clean seamless transition", icon: Minus },
  { id: "brass", name: "Brass Bolster", price: 30, desc: "Bright fitted collar", icon: Coins },
  { id: "copper", name: "Engraved Copper", price: 55, desc: "Hand-cut floral scrollwork", icon: Sparkles },
  { id: "steel", name: "Stainless Guard", price: 25, desc: "Tough, rust-free protection", icon: Shield },
];

const FORGE_EMAIL = "forge.of.ash1@gmail.com";

/* ---------------------------------- teaser ---------------------------------- */
const orbit = [
  { icon: Layers, label: "Blade steel", x: 30, y: 11, delay: 0 },
  { icon: Shield, label: "Guard", x: 70, y: 11, delay: 0.25 },
  { icon: Bone, label: "Handle", x: 91, y: 44, delay: 0.5 },
  { icon: Sparkles, label: "Engraving", x: 81, y: 78, delay: 0.75 },
  { icon: Ruler, label: "Blade length", x: 62, y: 91, delay: 1 },
  { icon: Camera, label: "Your photo", x: 38, y: 91, delay: 1.25 },
  { icon: Flame, label: "Heat treat", x: 19, y: 78, delay: 1.5 },
  { icon: Hammer, label: "Hand forge", x: 9, y: 44, delay: 1.75 },
];

export function CustomKnifeTeaser() {
  const { navigate } = useShop();
  const [burst, setBurst] = useState(false);

  const ignite = () => {
    if (burst) return;
    setBurst(true);
    setTimeout(() => navigate({ name: "custom" }), 950);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 pt-6"
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#0b0b0e] px-4 pb-6 pt-3.5 shadow-xl shadow-zinc-900/40 ring-1 ring-white/5">
        {/* grid + core glow */}
        <div className="ambient-grid absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-[44%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 blur-3xl" />

        {/* top row */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-white">
            <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-md bg-zinc-800 ring-1 ring-white/10">
              <img src="images/logo.png" alt="" className="h-5 w-5 object-contain" />
            </span>
            Forge Of Ash
          </span>
          <span className="text-[9.5px] font-semibold text-zinc-500">..forge your own</span>
        </div>

        {/* orbit stage */}
        <div className="relative mx-auto mt-1 h-[236px] w-full max-w-[330px]">
          {/* concentric rings */}
          <div className="pointer-events-none absolute left-1/2 top-[47%] h-[224px] w-[224px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
          <div className="pointer-events-none absolute left-1/2 top-[47%] h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]" />

          {/* light connectors */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
            {orbit.map((o, i) => (
              <path
                key={i}
                d={`M ${o.x} ${o.y} C ${(o.x + 50) / 2} ${(o.y + 47) / 2 - 5}, ${(o.x + 50) / 2} ${(o.y + 47) / 2 + 5}, 50 47`}
                pathLength={100}
                className="light-line"
                stroke="#f59e0b"
                strokeOpacity={0.6}
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${o.delay}s` }}
              />
            ))}
          </svg>

          {/* material tiles */}
          {orbit.map((o, i) => (
            <motion.span
              key={o.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={burst ? { scale: 0, opacity: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 320, damping: 18 }}
              whileHover={{ scale: 1.14 }}
              className="absolute z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-zinc-800/80 text-amber-400 ring-1 ring-white/10"
              style={{ left: `${o.x}%`, top: `${o.y}%` }}
              title={o.label}
            >
              <o.icon className="h-4 w-4" />
            </motion.span>
          ))}

          {/* ember core */}
          <button onClick={ignite} aria-label="Start your custom build" className="absolute left-1/2 top-[47%] z-20 h-20 w-20 -translate-x-1/2 -translate-y-1/2">
            {!burst && <span className="animate-ping-soft absolute inset-0 rounded-full bg-amber-500/40" />}
            <motion.span
              animate={burst ? { scale: [1, 0.7, 1.45], opacity: [1, 1, 0] } : { scale: [1, 1.08, 1] }}
              transition={
                burst
                  ? { duration: 0.55, times: [0, 0.32, 1], ease: [0.16, 1, 0.3, 1] }
                  : { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
              }
              className="relative grid h-20 w-20 place-items-center rounded-full"
              style={{
                background: "radial-gradient(circle at 32% 28%, #fde68a, #f59e0b 42%, #92400e 72%, #1c0a00 100%)",
                boxShadow: "0 0 44px rgba(245,158,11,0.6), inset 0 -9px 20px rgba(0,0,0,0.55), inset 0 5px 12px rgba(255,255,255,0.35)",
              }}
            >
              <span
                className="animate-spin-slow absolute inset-1 rounded-full"
                style={{ background: "conic-gradient(from 0deg, transparent 0 38%, rgba(255,255,255,0.28) 50%, transparent 62% 100%)" }}
              />
              <Hammer className="relative h-6 w-6 text-zinc-900/70" />
            </motion.span>

            {/* energy ignition */}
            <AnimatePresence>
              {burst && (
                <>
                  {/* implosion — energy sucked into the core before detonation */}
                  <motion.span
                    key="imp"
                    initial={{ scale: 2.6, opacity: 0.9 }}
                    animate={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeIn" }}
                    className="absolute inset-0 rounded-full border-2 border-amber-300/70"
                  />
                  {/* rotating light rays */}
                  <motion.span
                    key="rays"
                    initial={{ opacity: 0.95, scale: 0.4, rotate: -30 }}
                    animate={{ opacity: 0, scale: 3.4, rotate: 110 }}
                    transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
                    className="absolute -inset-8 rounded-full"
                    style={{
                      background: "repeating-conic-gradient(rgba(253,230,138,0.55) 0deg 5deg, transparent 5deg 30deg)",
                      maskImage: "radial-gradient(circle, #000 15%, transparent 68%)",
                      WebkitMaskImage: "radial-gradient(circle, #000 15%, transparent 68%)",
                    }}
                  />
                  {/* white-hot flash */}
                  <motion.span
                    key="flash"
                    initial={{ opacity: 0.95, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 2.8 }}
                    transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(251,191,36,0.55)_45%,transparent_72%)]"
                  />
                  {/* triple shockwaves */}
                  {[0, 0.09, 0.18].map((d, i) => (
                    <motion.span
                      key={`w${i}`}
                      initial={{ scale: 0.5, opacity: 0.9 }}
                      animate={{ scale: 4.4, opacity: 0 }}
                      transition={{ duration: 0.75, delay: 0.14 + d, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute inset-0 rounded-full border-2 ${i === 1 ? "border-white/80" : "border-amber-400"}`}
                    />
                  ))}
                  {/* streaking sparks */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const a = (i / 20) * Math.PI * 2 + (i % 2 ? 0.14 : 0);
                    const dist = 80 + (i % 5) * 18;
                    const deg = (a * 180) / Math.PI;
                    return (
                      <motion.span
                        key={`s${i}`}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: Math.cos(a) * dist, y: Math.sin(a) * dist, opacity: [1, 1, 0], scale: [1, 1.4, 0.2] }}
                        transition={{ duration: 0.74, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-1/2 h-4 w-[3px] rounded-full bg-gradient-to-t from-transparent via-amber-300 to-white"
                        style={{ rotate: `${deg + 90}deg`, boxShadow: "0 0 10px rgba(251,191,36,0.95)" }}
                      />
                    );
                  })}
                  {/* ember dots */}
                  {Array.from({ length: 10 }).map((_, i) => {
                    const a = (i / 10) * Math.PI * 2 + 0.35;
                    const dist = 108 + (i % 3) * 18;
                    return (
                      <motion.span
                        key={`d${i}`}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: Math.cos(a) * dist, y: Math.sin(a) * dist, opacity: [1, 0.9, 0], scale: [1, 1.6, 0] }}
                        transition={{ duration: 0.82, delay: 0.12, ease: "easeOut" }}
                        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.95)]"
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>
          </button>
          <motion.p
            animate={{ opacity: burst ? 0 : 1 }}
            className="absolute left-1/2 top-[calc(47%+50px)] -translate-x-1/2 text-center text-[8px] font-extrabold uppercase tracking-[0.3em] text-amber-400/80"
          >
            Tap the core
          </motion.p>
        </div>

        {/* heading */}
        <div className="relative z-10 mt-1 text-center">
          <h2 className="font-display text-[19px] font-extrabold leading-tight tracking-tight text-white">
            Customize Your Idea
            <br />
            Into a Real Knife
          </h2>
          <p className="mx-auto mt-1.5 max-w-[270px] text-[10px] font-medium leading-relaxed text-zinc-400">
            Steel, handle, guard, engraving — pick every piece and we forge the rest by hand.
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[9px] font-bold text-zinc-400 ring-1 ring-white/10">
            <Clock className="h-3 w-3 text-amber-400" /> From $95 · Forged in ~3 weeks
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------------------- builder page ------------------------------- */
function Step({ num, icon: Icon, title, sub }: { num: number; icon: LucideIcon; title: string; sub: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-[13px] font-extrabold text-amber-400 shadow-md shadow-zinc-900/25">{num}</span>
      <div className="leading-tight">
        <p className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-slate-900">
          <Icon className="h-4 w-4 text-amber-600" /> {title}
        </p>
        <p className="text-[10px] font-medium text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

function OptionCard({ o, selected, onTap }: { o: Opt; selected: boolean; onTap: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onTap}
      className={`relative rounded-xl border p-2.5 text-left transition-all ${
        selected ? "border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900/10" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {selected && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-white">
          <Check className="h-3 w-3" />
        </motion.span>
      )}
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${selected ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-500"}`}>
        <o.icon className="h-4 w-4" />
      </span>
      <p className="mt-1.5 text-[11px] font-extrabold leading-tight text-slate-800">{o.name}</p>
      <p className="mt-0.5 line-clamp-1 text-[8.5px] font-medium text-slate-400">{o.desc}</p>
      <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[8.5px] font-extrabold ${o.price ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
        {o.price ? `+${money(o.price)}` : "Included"}
      </span>
    </motion.button>
  );
}

export default function CustomKnifePage() {
  const { back, notify } = useShop();
  const [project, setProject] = useState<Opt | null>(null);
  const [blade, setBlade] = useState<Opt | null>(null);
  const [handle, setHandle] = useState<Opt | null>(null);
  const [guard, setGuard] = useState<Opt>(guards[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const total = useMemo(() => (project?.price ?? 0) + (blade?.price ?? 0) + (handle?.price ?? 0) + guard.price, [project, blade, handle, guard]);

  const onPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - photos.length);
    setPhotos((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const submit = () => {
    if (!project) return notify("Choose a project type first");
    if (!blade) return notify("Select your blade steel");
    if (!handle) return notify("Select a handle material");
    if (!name.trim()) return notify("Your name is required");
    if (!phone.trim()) return notify("Your phone number is required");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return notify("Enter a valid email address");

    setSending(true);
    const body = [
      "NEW CUSTOM FORGE REQUEST",
      "--------------------------------",
      `Project type : ${project.name} (base ${money(project.price)})`,
      `Blade steel  : ${blade.name} (+${money(blade.price)})`,
      `Handle       : ${handle.name} (+${money(handle.price)})`,
      `Guard/Bolster: ${guard.name} (${guard.price ? "+" + money(guard.price) : "included"})`,
      `Estimated total: ${money(total)}`,
      `Reference photos: ${photos.length} (will be attached in a follow-up email)`,
      "",
      "Buyer details",
      `Name : ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Email: ${email.trim()}`,
      "",
      "Instructions / notes:",
      notes.trim() || "(none)",
    ].join("\n");

    const href = `mailto:${FORGE_EMAIL}?subject=${encodeURIComponent(`Custom Knife Quote — ${name.trim()}`)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      const a = document.createElement("a");
      a.href = href;
      a.rel = "noopener";
      a.click();
      setSending(false);
      setSent(true);
      notify("Quote request sent to the forge!", "cart");
    }, 1100);
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-[12px] font-semibold text-slate-700 outline-none transition-all focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5";

  return (
    <div className="pb-28 pt-[72px]">
      {/* header */}
      <div className="flex items-center gap-3 px-3 pb-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={back} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Go back">
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <p className="font-display flex-1 text-[15px] font-extrabold text-slate-900">Custom Forge</p>
        <motion.span key={total} initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-extrabold text-slate-900 shadow">
          <CircleDollarSign className="h-3.5 w-3.5" /> {money(total)}
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[75vh] flex-col items-center justify-center px-8 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 15 }} className="grid h-20 w-20 place-items-center rounded-full bg-amber-100">
              <CheckCircle2 className="h-10 w-10 text-amber-600" />
            </motion.span>
            <h2 className="font-display mt-5 text-xl font-extrabold text-slate-900">Request on its way!</h2>
            <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-500">
              Your build — <span className="font-bold text-slate-700">{project?.name}</span> in {blade?.name} with a {handle?.name} handle — was sent to <span className="font-bold text-slate-700">{FORGE_EMAIL}</span>. We'll reply with a final quote within 24 hours.
            </p>
            <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-4 text-left">
              {[
                ["Project", project?.name ?? ""],
                ["Blade", blade?.name ?? ""],
                ["Handle", handle?.name ?? ""],
                ["Guard", guard.name],
              ].map(([k, v]) => (
                <p key={k} className="flex justify-between py-1 text-[11px] font-semibold text-slate-500">
                  <span>{k}</span>
                  <span className="font-extrabold text-slate-800">{v}</span>
                </p>
              ))}
              <div className="my-1.5 border-t border-dashed border-slate-200" />
              <p className="flex justify-between text-[13px] font-extrabold text-slate-900">
                <span>Estimated total</span>
                <span className="text-amber-600">{money(total)}</span>
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSent(false);
                setProject(null);
                setBlade(null);
                setHandle(null);
                setGuard(guards[0]);
                setPhotos([]);
                setNotes("");
              }}
              className="mt-5 rounded-xl bg-zinc-900 px-6 py-3 text-[13px] font-extrabold text-white shadow-lg shadow-zinc-900/25"
            >
              Start Another Build
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -16 }} className="px-4 pt-4">
            {/* intro */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-zinc-900 p-4">
              <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-amber-500/20 blur-2xl" />
              <p className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-400">
                <Sparkles className="h-3 w-3" /> Dream it · We forge it
              </p>
              <h1 className="font-display mt-1 text-[17px] font-extrabold leading-tight text-white">Build your dream knife, step by step</h1>
              <p className="mt-1 text-[10px] font-medium text-slate-400">Every choice is priced live — your quote updates as you build.</p>
            </motion.div>

            {/* 1 project */}
            <div className="mt-5">
              <Step num={1} icon={Ruler} title="Project Type" sub="What are we forging today?" />
              <div className="grid grid-cols-2 gap-2">
                {projects.map((o) => (
                  <OptionCard key={o.id} o={o} selected={project?.id === o.id} onTap={() => setProject(o)} />
                ))}
              </div>
            </div>

            {/* 2 blade */}
            <div className="mt-6">
              <Step num={2} icon={Flame} title="Blade Steel" sub="The heart of your edge" />
              <div className="grid grid-cols-2 gap-2">
                {blades.map((o) => (
                  <OptionCard key={o.id} o={o} selected={blade?.id === o.id} onTap={() => setBlade(o)} />
                ))}
              </div>
            </div>

            {/* 3 handle */}
            <div className="mt-6">
              <Step num={3} icon={Bone} title="Handle Material" sub="What your hand will hold" />
              <div className="grid grid-cols-2 gap-2">
                {handles.map((o) => (
                  <OptionCard key={o.id} o={o} selected={handle?.id === o.id} onTap={() => setHandle(o)} />
                ))}
              </div>
            </div>

            {/* 4 guard */}
            <div className="mt-6">
              <Step num={4} icon={Shield} title="Guard / Bolster" sub="The finishing collar" />
              <div className="grid grid-cols-2 gap-2">
                {guards.map((o) => (
                  <OptionCard key={o.id} o={o} selected={guard.id === o.id} onTap={() => setGuard(o)} />
                ))}
              </div>
            </div>

            {/* 5 reference */}
            <div className="mt-6">
              <Step num={5} icon={Upload} title="Reference Images" sub="Optional — up to 3 photos or sketches" />
              <div className="flex items-center gap-2">
                {photos.map((ph, i) => (
                  <span key={i} className="relative">
                    <img src={ph} alt="Reference" className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200" />
                    <button onClick={() => setPhotos((p) => p.filter((_, x) => x !== i))} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-white shadow" aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {photos.length < 3 && (
                  <button onClick={() => fileRef.current?.click()} className="grid h-16 w-16 flex-col place-items-center gap-1 rounded-xl border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-amber-500 hover:text-amber-600" aria-label="Upload reference">
                    <Camera className="h-5 w-5" />
                    <span className="text-[7.5px] font-bold">Upload</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPhotos} />
              </div>
            </div>

            {/* 6 notes */}
            <div className="mt-6">
              <Step num={6} icon={StickyNote} title="Instructions & Notes" sub="Blade length, engraving, anything at all" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder='e.g. "9-inch blade, floral engraving on the copper bolster, jute wrap under the guard…"' className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-slate-700 outline-none transition-all focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5" />
            </div>

            {/* 7 buyer */}
            <div className="mt-6">
              <Step num={7} icon={User} title="Your Details" sub="Required so we can send your quote" />
              <div className="space-y-2.5">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name *" className={inputCls} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number *" type="tel" className={inputCls} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address *" type="email" className={inputCls} />
                </div>
              </div>
            </div>

            {/* summary */}
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-display text-[13px] font-extrabold text-slate-900">Your build summary</p>
              <div className="mt-2 space-y-1">
                {[
                  ["Project", project?.name, project?.price],
                  ["Blade steel", blade?.name, blade?.price],
                  ["Handle", handle?.name, handle?.price],
                  ["Guard", guard.name, guard.price],
                ].map(([k, v, pr]) => (
                  <p key={k as string} className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>{k}</span>
                    <span className="text-slate-700">
                      {v ? `${v} · ${money(pr as number)}` : <span className="italic text-slate-300">not selected</span>}
                    </span>
                  </p>
                ))}
              </div>
              <div className="my-2.5 border-t border-dashed border-slate-200" />
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[13px] font-extrabold text-slate-900">Estimated total</p>
                  <p className="flex items-center gap-1 text-[9.5px] font-semibold text-slate-400">
                    <Clock className="h-3 w-3" /> Forged & shipped in ≈ 3 weeks
                  </p>
                </div>
                <motion.p key={total} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="font-display text-[22px] font-extrabold text-amber-600">
                  {money(total)}
                </motion.p>
              </div>
            </motion.div>

            {/* submit */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={submit}
              disabled={sending}
              className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-900 py-3.5 text-[13.5px] font-extrabold text-white shadow-lg shadow-zinc-900/30 transition-colors hover:bg-black disabled:opacity-80"
            >
              <span className="animate-shine pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
              {sending ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-amber-400 border-t-transparent" />
                  Sending to the forge…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  Send My Quote Request
                </>
              )}
            </motion.button>
            <p className="mt-2 pb-2 text-center text-[9px] font-semibold text-slate-400">
              Sent directly to <span className="font-extrabold text-slate-600">{FORGE_EMAIL}</span> · No payment now
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
