import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, Search, X } from "lucide-react";
import { categoryMeta } from "../data";
import { useShop } from "../shop";

// white liquid glass: milky frosted body, drifting caustic light, a travelling
// surface sheen and bright meniscus edges — and it never leaves the screen
const GLASS =
  "bg-gradient-to-b from-white/80 via-white/62 to-white/75 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/85 shadow-[0_10px_34px_-10px_rgba(15,23,42,0.22),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(255,255,255,0.6)]";

const GLASS_BTN =
  "bg-white/75 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(15,23,42,0.08)]";

export default function TopChrome() {
  const { navigate, setMenuOpen, route } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const isHome = route.name === "home";

  // leaving home collapses the floating extras so they never linger over sub-pages
  useEffect(() => {
    if (!isHome) {
      setCatOpen(false);
      setSearchOpen(false);
    }
  }, [isHome]);

  return (
    <>
      {/* floating liquid-glass nav */}
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className={`fixed left-1/2 top-3 z-50 w-[calc(100%-24px)] max-w-[406px] -translate-x-1/2 overflow-hidden rounded-full ${GLASS}`}
      >
        {/* drifting caustic light — the liquid feel */}
        <span className="animate-water-a pointer-events-none absolute -left-10 -top-12 h-24 w-36 rounded-full bg-white/70 blur-xl" />
        <span className="animate-water-b pointer-events-none absolute -bottom-14 -right-8 h-24 w-32 rounded-full bg-amber-100/60 blur-xl" />
        {/* travelling surface sheen */}
        <span className="animate-water-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        {/* meniscus highlights — the curved-water gleam */}
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent" />
        <span className="pointer-events-none absolute -left-6 top-0 h-16 w-24 rotate-12 bg-gradient-to-br from-white/50 to-transparent blur-md" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="relative flex h-14 items-center gap-1.5 py-1.5 pl-2 pr-1.5">
          {/* logo + name */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate({ name: "home" })}
              className="flex items-center gap-2.5"
            >
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-zinc-900/90 shadow-[0_2px_10px_rgba(15,23,42,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] ring-1 ring-white/30">
                <img src="images/logo.png" alt="Forge Of Ash" className="h-10 w-10 object-contain" />
              </span>
              <span className="font-display text-[15px] font-extrabold tracking-tight text-zinc-900 [text-shadow:0_1px_0_rgba(255,255,255,0.6)]">
                Forge Of Ash
              </span>
            </motion.button>

          <span className="flex-1" />

          {/* search toggle */}
          <motion.button
            whileTap={{ scale: 0.86 }}
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            className={`relative grid h-11 w-11 place-items-center rounded-full transition-all ${
              searchOpen ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/30" : `${GLASS_BTN} text-zinc-700 hover:bg-white/40`
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {searchOpen ? (
                <motion.span key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.16 }}>
                  <X className="h-[18px] w-[18px]" />
                </motion.span>
              ) : (
                <motion.span key="s" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.16 }}>
                  <Search className="h-[18px] w-[18px]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* hamburger */}
          <motion.button
            whileTap={{ scale: 0.86 }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className={`grid h-11 w-11 place-items-center rounded-full text-zinc-700 transition-all hover:bg-white/40 ${GLASS_BTN}`}
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* floating search pill */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            initial={{ y: -24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -24, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSearchOpen(false);
              navigate({ name: "category", cat: "All" });
            }}
            className={`fixed left-1/2 top-[74px] z-40 flex w-[calc(100%-24px)] max-w-[406px] -translate-x-1/2 items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 ${GLASS}`}
          >
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search blades, steels, categories…"
              className="w-full bg-transparent text-[13px] font-medium text-zinc-800 outline-none placeholder:text-zinc-400"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="grid h-9 w-10 shrink-0 place-items-center rounded-full bg-zinc-900 text-white shadow-md shadow-zinc-900/30"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* category drawer toggle — floats top-right under the nav (home only) */}
      {isHome && (
        <motion.button
          initial={{ x: 80, opacity: 0 }}
          animate={{ y: 0, x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          whileTap={{ scale: 0.86 }}
          onClick={() => setCatOpen((v) => !v)}
          aria-label="Browse categories"
          className={`fixed right-4 top-[74px] z-40 grid h-11 w-11 place-items-center rounded-full text-zinc-700 ${GLASS}`}
        >
          <motion.span animate={{ rotate: catOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft className="h-5 w-5" />
          </motion.span>
        </motion.button>
      )}

      {/* category drawer — floats in from the right */}
      <AnimatePresence>
        {catOpen && isHome && (
          <>
            <motion.button
              aria-label="Close categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCatOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/15"
            />
            <motion.aside
              initial={{ x: "120%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "120%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className={`fixed right-3 top-[124px] z-50 max-h-[66vh] w-[76%] max-w-[290px] overflow-y-auto rounded-3xl p-2 ${GLASS}`}
            >
              <p className="px-3 pb-1 pt-2 text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">Browse the forge</p>
              <button
                onClick={() => {
                  setCatOpen(false);
                  navigate({ name: "category", cat: "All" });
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-white/70"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-amber-400">
                  <ChevronRight className="h-4 w-4" />
                </span>
                <span className="flex-1 leading-tight">
                  <span className="block text-[12px] font-extrabold text-zinc-900">All Products</span>
                  <span className="block text-[9px] font-semibold text-zinc-400">Everything in the shop</span>
                </span>
              </button>
              {categoryMeta.map((c, i) => (
                <motion.button
                  key={c.name}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  onClick={() => {
                    setCatOpen(false);
                    navigate({ name: "category", cat: c.name });
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-white/70"
                >
                  <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
                    <img src={c.img} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[12px] font-extrabold text-zinc-900">{c.name}</span>
                    <span className="block text-[9px] font-semibold text-zinc-400">{c.items}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300" />
                </motion.button>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
