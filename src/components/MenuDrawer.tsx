import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  Home,
  LayoutGrid,
  LogOut,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { categoryMeta } from "../data";
import { useShop } from "../shop";

export default function MenuDrawer() {
  const { menuOpen, setMenuOpen, navigate, route, cartCount, wishIds, notify } = useShop();

  const goHomeThen = (id: string) => {
    setMenuOpen(false);
    if (route.name !== "home") {
      navigate({ name: "home" });
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 380);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const main = [
    { icon: Home, label: "Home", onTap: () => navigate({ name: "home" }) },
    { icon: User, label: "My Account", onTap: () => navigate({ name: "account" }) },
    { icon: LayoutGrid, label: "Shop by Category", onTap: () => goHomeThen("categories") },
    { icon: Percent, label: "Today's Deals", onTap: () => goHomeThen("deals") },
    { icon: Heart, label: "My Wishlist", badge: wishIds.length, onTap: () => navigate({ name: "wishlist" }) },
    { icon: ShoppingBag, label: "My Cart", badge: cartCount, onTap: () => navigate({ name: "cart" }) },
  ];
  const secondary = [
    { icon: Package, label: "My Orders", onTap: () => notify("3 orders on the way") },
    { icon: CreditCard, label: "Payment Methods", onTap: () => notify("Payment methods — coming soon") },
    { icon: HelpCircle, label: "Help Center", onTap: () => notify("We reply within 2 hours") },
    { icon: Settings, label: "Settings", onTap: () => notify("Settings — coming soon") },
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <div className="fixed inset-y-0 left-1/2 z-[60] w-full max-w-[430px] -translate-x-1/2">
          {/* overlay */}
          <motion.button
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-900/55 backdrop-blur-[2px]"
          />
          {/* panel */}
          <motion.aside
            initial={{ x: "-104%" }}
            animate={{ x: 0 }}
            exit={{ x: "-104%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="absolute inset-y-0 left-0 flex w-[84%] max-w-[330px] flex-col bg-white shadow-2xl"
          >
            {/* profile header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 to-blue-600 px-5 pb-5 pt-6">
              <div className="animate-shine pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <button onClick={() => setMenuOpen(false)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
              <img src="images/logo.png" alt="" className="pointer-events-none absolute -bottom-2 right-3 h-16 w-16 object-contain opacity-30" />
              <div className="flex items-center gap-3">
                <span className="relative">
                  <img
                    src="https://images.pexels.com/photos/7717254/pexels-photo-7717254.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Profile"
                    className="h-14 w-14 rounded-full border-2 border-white/70 object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                </span>
                <div>
                  <p className="font-display text-[16px] font-extrabold text-white">Hi, Emily!</p>
                  <span className="mt-0.5 inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-slate-900">
                    Gold Member
                  </span>
                </div>
              </div>
            </div>

            {/* nav list */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {main.map((m, i) => (
                <motion.button
                  key={m.label}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={m.onTap}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-blue-50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
                    <m.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-[13px] font-bold text-slate-800">{m.label}</span>
                  {"badge" in m && m.badge ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue-700 px-1.5 text-[10px] font-extrabold text-white">{m.badge}</span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  )}
                </motion.button>
              ))}

              <p className="mt-3 px-3 pb-1 text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400">Browse Categories</p>
              <div className="flex flex-wrap gap-1.5 px-3">
                {categoryMeta.map((c, i) => (
                  <motion.button
                    key={c.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.28 + i * 0.04 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigate({ name: "category", cat: c.name })}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10.5px] font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {c.name}
                  </motion.button>
                ))}
              </div>

              <div className="my-3 border-t border-dashed border-slate-200" />

              {secondary.map((m, i) => (
                <motion.button
                  key={m.label}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.32 + i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={m.onTap}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <m.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-[13px] font-bold text-slate-700">{m.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </motion.button>
              ))}
            </div>

            {/* promo + logout */}
            <div className="border-t border-slate-100 p-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate({ name: "category", cat: "All" })}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-3 text-left shadow-md shadow-amber-400/25"
              >
                <div className="animate-shine pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-900/70">Limited time</p>
                <p className="font-display text-[14px] font-extrabold text-slate-900">Mega Summer Sale — up to 60% off</p>
              </motion.button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  notify("Signed out. See you soon!");
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-bold text-red-500 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
