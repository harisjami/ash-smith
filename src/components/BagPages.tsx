import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Heart, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { byId, money } from "../data";
import { ProductCard } from "./Catalog";
import { useShop } from "../shop";

function PageBar({ title, sub }: { title: string; sub?: string }) {
  const { back } = useShop();
  return (
    <div className="flex items-center gap-3 px-3 pb-2">
      <motion.button whileTap={{ scale: 0.85 }} onClick={back} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Go back">
        <ChevronLeft className="h-5 w-5" />
      </motion.button>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-bold text-slate-900">{title}</p>
        {sub && <p className="text-[10px] font-medium text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

export function CartPage() {
  const { cartLines, setQty, removeLine, navigate, notify } = useShop();
  const [placed, setPlaced] = useState(false);

  const rows = cartLines.map((l) => ({ ...l, p: byId(l.id)! })).filter((r) => r.p);
  const subtotal = rows.reduce((s, r) => s + r.p.price * r.qty, 0);
  const freeShip = subtotal >= 49;
  const shipping = rows.length === 0 || freeShip ? 0 : 4.99;
  const total = subtotal + shipping;

  if (placed) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100"
        >
          <ShoppingBag className="h-9 w-9 text-emerald-600" />
        </motion.span>
        <h2 className="font-display mt-5 text-xl font-extrabold text-slate-900">Order placed!</h2>
        <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-500">
          Thanks for shopping with Forge Of Ash. Your order <span className="font-bold text-slate-700">#MK-28417</span> is being packed and will ship within 24 hours.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setPlaced(false);
            navigate({ name: "home" });
          }}
          className="mt-6 flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-[13px] font-extrabold text-white shadow-lg shadow-blue-700/25"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-[72px]">
      <PageBar title="My Cart" sub={`${rows.reduce((s, r) => s + r.qty, 0)} items`} />

      {rows.length === 0 ? (
        <div className="flex flex-col items-center px-8 pt-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-slate-100">
            <ShoppingBag className="h-9 w-9 text-slate-300" />
          </span>
          <h2 className="font-display mt-5 text-lg font-extrabold text-slate-900">Your cart is empty</h2>
          <p className="mt-1.5 text-[12px] font-medium text-slate-500">Looks like you haven't added anything yet. Let's fix that.</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate({ name: "home" })} className="mt-5 rounded-xl bg-blue-700 px-6 py-3 text-[13px] font-extrabold text-white shadow-lg shadow-blue-700/25">
            Browse Deals
          </motion.button>
        </div>
      ) : (
        <div className="px-4 pt-3">
          {/* free shipping meter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 rounded-2xl border border-slate-200/80 bg-white p-3">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-700">
              <Truck className="h-3.5 w-3.5 text-amber-500" />
              {freeShip ? "You unlocked FREE shipping!" : `Add ${money(49 - subtotal)} more for free shipping`}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (subtotal / 49) * 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${freeShip ? "bg-emerald-500" : "bg-amber-400"}`}
              />
            </div>
          </motion.div>

          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2.5 flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-2.5"
              >
                <button onClick={() => navigate({ name: "product", id: r.id })} className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <img src={r.p.img} alt={r.p.name} className="h-full w-full object-cover" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-[11.5px] font-bold leading-snug text-slate-800">{r.p.name}</p>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeLine(r.id)} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label="Remove">
                      <Trash2 className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                  <p className="text-[9.5px] font-medium text-slate-400">{r.p.spec ?? r.p.category}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-display text-[14px] font-extrabold text-slate-900">{money(r.p.price * r.qty)}</span>
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button onClick={() => setQty(r.id, -1)} className="grid h-7 w-7 place-items-center text-slate-500 active:bg-slate-100" aria-label="Decrease">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-[11px] font-extrabold text-slate-800">{r.qty}</span>
                      <button onClick={() => setQty(r.id, 1)} className="grid h-7 w-7 place-items-center text-slate-500 active:bg-slate-100" aria-label="Increase">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* summary */}
          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4">
            {[
              ["Subtotal", money(subtotal)],
              ["Shipping", freeShip ? "FREE" : money(shipping)],
            ].map(([k, v]) => (
              <p key={k} className="flex justify-between text-[11.5px] font-semibold text-slate-500">
                <span>{k}</span>
                <span className={v === "FREE" ? "font-extrabold text-emerald-600" : "text-slate-700"}>{v}</span>
              </p>
            ))}
            <div className="my-2.5 border-t border-dashed border-slate-200" />
            <p className="flex justify-between">
              <span className="text-[13px] font-extrabold text-slate-900">Total</span>
              <span className="font-display text-[17px] font-extrabold text-slate-900">{money(total)}</span>
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                rows.forEach((r) => removeLine(r.id));
                setPlaced(true);
                notify("Order placed successfully!", "cart");
              }}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-[13px] font-extrabold text-white shadow-lg shadow-blue-700/25 transition-colors hover:bg-blue-800"
            >
              Checkout · {money(total)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

export function WishlistPage() {
  const { wishIds, navigate } = useShop();
  const items = wishIds.map(byId).filter(Boolean);

  return (
    <div className="pb-28 pt-[72px]">
      <PageBar title="My Wishlist" sub={`${items.length} saved items`} />
      {items.length === 0 ? (
        <div className="flex flex-col items-center px-8 pt-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-red-50">
            <Heart className="h-9 w-9 text-red-300" />
          </span>
          <h2 className="font-display mt-5 text-lg font-extrabold text-slate-900">No favorites yet</h2>
          <p className="mt-1.5 text-[12px] font-medium text-slate-500">Tap the heart on any product to save it here for later.</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate({ name: "home" })} className="mt-5 rounded-xl bg-blue-700 px-6 py-3 text-[13px] font-extrabold text-white shadow-lg shadow-blue-700/25">
            Discover Products
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pt-4">
          {items.map(
            (p, i) =>
              p && <ProductCard key={p.id} p={p} index={i} />,
          )}
        </div>
      )}
    </div>
  );
}
