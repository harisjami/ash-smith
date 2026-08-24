import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, GripVertical, Heart, Home, LayoutGrid, Percent, User } from "lucide-react";
import { PopBadge, useShop } from "../shop";
import { AVATAR_ICONS, useAuth } from "../auth";

const routeToTab: Partial<Record<string, string>> = {
  home: "home",
  product: "home",
  custom: "home",
  category: "categories",
  categories: "categories",
  wishlist: "wishlist",
  account: "account",
};

const OUT = 320; // px off-screen when docked

export default function BottomNav() {
  const { route, navigate, wishIds, wishPulse } = useShop();
  const { user } = useAuth();
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const [docked, setDocked] = useState<null | "left" | "right">(null);
  const x = useMotionValue(0);
  const idle = useRef<number | undefined>(undefined);

  // keep the glass blob in sync whenever the route changes underneath
  useEffect(() => {
    const mapped = routeToTab[route.name];
    if (mapped) setActive(mapped);
  }, [route.name]);

  // dive below the screen while scrolling, rise again once scrolling stops
  useEffect(() => {
    const onScroll = () => {
      setHidden(true);
      window.clearTimeout(idle.current);
      idle.current = window.setTimeout(() => setHidden(false), 240);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle.current);
    };
  }, []);

  const onDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -90) {
      setDocked("left");
      animate(x, -OUT, { type: "spring", stiffness: 300, damping: 30 });
    } else if (info.offset.x > 90) {
      setDocked("right");
      animate(x, OUT, { type: "spring", stiffness: 300, damping: 30 });
    } else {
      animate(x, 0, { type: "spring", stiffness: 340, damping: 26 });
    }
  };

  const undock = () => {
    setDocked(null);
    animate(x, 0, { type: "spring", stiffness: 300, damping: 26 });
  };

  const scrollTo = (id: string) => {
    if (route.name !== "home") {
      navigate({ name: "home" });
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 380);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tabs = [
    { id: "home", label: "Home", icon: Home, onTap: () => navigate({ name: "home" }) },
    { id: "categories", label: "Categories", icon: LayoutGrid, onTap: () => scrollTo("categories") },
    { id: "deals", label: "Deals", icon: Percent, onTap: () => scrollTo("deals") },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: true, onTap: () => navigate({ name: "wishlist" }) },
    { id: "account", label: "Account", icon: User, onTap: () => navigate({ name: "account" }) },
  ];
  const AccountGlyph = user ? (AVATAR_ICONS[user.avatar] ?? User) : User;

  return (
    <>
      <div className="pointer-events-none fixed bottom-[max(env(safe-area-inset-bottom),16px)] left-1/2 z-50 -translate-x-1/2">
        <motion.div
          animate={{ y: hidden && !docked ? 150 : 0, opacity: hidden && !docked ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="pointer-events-auto"
        >
          <motion.div
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -OUT, right: OUT }}
            dragElastic={0.14}
            onDragEnd={onDragEnd}
            whileDrag={{ scale: 1.04, cursor: "grabbing" }}
            className="relative flex cursor-grab items-center gap-1 rounded-full bg-zinc-950 px-2 py-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
          >
            {/* drag grip hint */}
            <span className="pointer-events-none absolute -top-2 left-1/2 grid h-3.5 w-9 -translate-x-1/2 place-items-center rounded-full bg-zinc-800 text-zinc-500 ring-1 ring-white/10">
              <GripVertical className="h-3 w-3" />
            </span>
            <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {tabs.map((t) => {
              const isActive = active === t.id;
              return (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.86 }}
                  onClick={() => {
                    setActive(t.id);
                    t.onTap();
                  }}
                  aria-label={t.label}
                  className="relative grid h-11 w-12 place-items-center"
                >
                  {/* liquid glass blob */}
                  {isActive && (
                    <motion.span
                      layoutId="liquid-glass"
                      transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.8 }}
                      className="absolute inset-0.5 rounded-full bg-gradient-to-b from-white/25 to-white/[0.06] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.3),0_4px_14px_rgba(0,0,0,0.4)] ring-1 ring-white/25 backdrop-blur-md"
                    />
                  )}
                  <span className="relative">
                    {t.id === "account" ? (
                      <AccountGlyph
                        className={`relative z-10 h-[19px] w-[19px] transition-colors duration-300 ${isActive ? "text-amber-400" : user ? "text-zinc-200" : "text-zinc-400"}`}
                        strokeWidth={isActive ? 2.4 : 2}
                      />
                    ) : (
                      <t.icon
                        className={`relative z-10 h-[19px] w-[19px] transition-colors duration-300 ${isActive ? "text-amber-400" : "text-zinc-400"}`}
                        strokeWidth={isActive ? 2.4 : 2}
                      />
                    )}
                    {t.id === "account" && user && (
                      <span className="absolute -right-1 -top-1 z-10 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
                    )}
                    {t.badge && (
                      <span className="absolute -right-2 -top-1.5 grid place-items-center rounded-full bg-amber-400 text-slate-900 shadow-md shadow-amber-400/40">
                        <PopBadge count={wishIds.length} pulse={wishPulse} />
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* dock recall arrows — the outline arrow where the nav was flung */}
      <AnimatePresence>
        {docked === "left" && (
          <motion.button
            key="dock-left"
            initial={{ x: -48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            whileTap={{ scale: 0.85 }}
            onClick={undock}
            aria-label="Bring navigation back"
            className="fixed bottom-28 left-2 z-50 grid h-11 w-11 place-items-center rounded-full border-2 border-amber-400/80 bg-white/85 text-amber-600 shadow-lg shadow-amber-500/20 backdrop-blur"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.6} />
          </motion.button>
        )}
        {docked === "right" && (
          <motion.button
            key="dock-right"
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            whileTap={{ scale: 0.85 }}
            onClick={undock}
            aria-label="Bring navigation back"
            className="fixed bottom-28 right-2 z-50 grid h-11 w-11 place-items-center rounded-full border-2 border-amber-400/80 bg-white/85 text-amber-600 shadow-lg shadow-amber-500/20 backdrop-blur"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.6} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
