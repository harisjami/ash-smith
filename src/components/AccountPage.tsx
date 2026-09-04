import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, LogOut, Mail, Pencil, Shield, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AVATAR_ICONS, AVATAR_KEYS, useAuth } from "../auth";
import { useShop } from "../shop";

const AVATAR_CLS: Record<string, string> = {
  flame: "bg-orange-500/15 text-orange-500",
  swords: "bg-zinc-500/15 text-zinc-600",
  shield: "bg-blue-500/15 text-blue-600",
  zap: "bg-amber-500/15 text-amber-500",
  axe: "bg-emerald-500/15 text-emerald-600",
  hammer: "bg-red-500/15 text-red-500",
};

const AVATAR_UI: Record<string, { icon: LucideIcon; cls: string }> = Object.fromEntries(
  Object.entries(AVATAR_ICONS).map(([k, icon]) => [k, { icon, cls: AVATAR_CLS[k] ?? AVATAR_CLS.flame }]),
);

function AvatarBadge({ avatar, size = "h-16 w-16" }: { avatar: string; size?: string }) {
  const ui = AVATAR_UI[avatar] ?? AVATAR_UI.flame;
  return (
    <span className={`grid ${size} place-items-center rounded-full ${ui.cls} ring-2 ring-white shadow-lg`}>
      <ui.icon className="h-1/2 w-1/2" />
    </span>
  );
}

const GoogleG = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.3v3.1C3.3 21.4 7.3 24 12 24z" />
    <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.2-1.7.4-2.4V6.5H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.5l4.1-3.1z" />
    <path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.6 1.3 6.5l4.1 3.1C6.3 6.8 8.9 4.7 12 4.7z" />
  </svg>
);

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-[12.5px] font-semibold text-slate-700 outline-none transition-all focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5";

export default function AccountPage() {
  const { back, notify } = useShop();
  const { user, loading, mode, signUp, signIn, signInGoogle, signOut, updateProfile } = useAuth();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError(null);
    if (tab === "up" && name.trim().length < 2) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password needs at least 6 characters.");
    setBusy(true);
    const err = tab === "up" ? await signUp(email.trim(), password, name.trim()) : await signIn(email.trim(), password);
    setBusy(false);
    if (err) setError(err);
    else notify(tab === "up" ? "Welcome to the forge!" : "Welcome back!", "cart");
  };

  const google = async () => {
    setError(null);
    setBusy(true);
    const err = await signInGoogle();
    setBusy(false);
    if (err) setError(err);
  };

  const saveProfile = async () => {
    if (editName.trim().length < 2) return notify("Name is too short");
    setSaving(true);
    await updateProfile({ name: editName.trim() });
    setSaving(false);
    setEditing(false);
    notify("Profile updated", "cart");
  };

  return (
    <div className="pb-28 pt-[72px]">
      {/* top bar */}
      <div className="flex items-center gap-3 px-3 pb-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={back} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Go back">
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <p className="font-display text-[15px] font-extrabold text-slate-900">My Account</p>
      </div>

      {loading ? (
        <div className="grid place-items-center pt-24">
          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="h-8 w-8 rounded-full border-[3px] border-amber-400 border-t-transparent" />
        </div>
      ) : user ? (
        /* ------------------------------ logged in ------------------------------ */
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-2">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-5 shadow-xl shadow-zinc-900/30">
            <div className="ambient-grid absolute inset-0" />
            <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <AvatarBadge avatar={user.avatar} />
              <div className="min-w-0 flex-1">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-[13px] font-bold text-white outline-none focus:border-amber-400"
                    />
                    <motion.button whileTap={{ scale: 0.85 }} onClick={saveProfile} disabled={saving} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-400 text-slate-900" aria-label="Save name">
                      {saving ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }} className="h-3.5 w-3.5 rounded-full border-2 border-slate-900 border-t-transparent" /> : <Check className="h-4 w-4" />}
                    </motion.button>
                  </div>
                ) : (
                  <p className="flex items-center gap-1.5 text-[17px] font-extrabold text-white">
                    {user.name}
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => { setEditName(user.name); setEditing(true); }} className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-zinc-300 ring-1 ring-white/15" aria-label="Edit name">
                      <Pencil className="h-3 w-3" />
                    </motion.button>
                  </p>
                )}
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[10.5px] font-semibold text-zinc-400">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
            </div>

            {/* avatar picker */}
            <p className="relative mt-4 text-[9px] font-extrabold uppercase tracking-widest text-zinc-500">Forge emblem</p>
            <div className="relative mt-2 flex gap-2">
              {AVATAR_KEYS.map((k) => {
                const ui = AVATAR_UI[k];
                const active = user.avatar === k;
                return (
                  <motion.button
                    key={k}
                    whileTap={{ scale: 0.85 }}
                    onClick={async () => {
                      await updateProfile({ avatar: k });
                      notify("Emblem updated", "cart");
                    }}
                    aria-label={`Choose ${k} emblem`}
                    className={`grid h-10 w-10 place-items-center rounded-full ring-2 transition-all ${active ? "ring-amber-400" : "ring-transparent"} ${ui.cls}`}
                  >
                    <ui.icon className="h-5 w-5" />
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-[11px] font-extrabold text-slate-800">Member profile</p>
                <p className="text-[9.5px] font-semibold text-slate-400">Saved to your Forge Of Ash account</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">Active</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              await signOut();
              notify("Signed out — see you soon");
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-[12.5px] font-extrabold text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </motion.button>
        </motion.div>
      ) : (
        /* ------------------------------ logged out ------------------------------ */
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-2">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-6 shadow-xl shadow-zinc-900/30">
            <div className="ambient-grid absolute inset-0" />
            <div className="pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="relative text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-amber-400/30">
                <img src="images/logo.png" alt="" className="h-12 w-12 object-contain" />
              </span>
              <h2 className="font-display mt-3 text-[20px] font-extrabold text-white">
                {tab === "up" ? "Join the Forge" : "Welcome Back"}
              </h2>
              <p className="mt-1 text-[10.5px] font-medium text-zinc-400">
                {tab === "up" ? "Create your account and track every blade." : "Sign in to your bladesmith account."}
              </p>
            </div>

            {/* tabs */}
            <div className="relative mt-5 grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
              {(["in", "up"] as const).map((t) => (
                <button key={t} onClick={() => { setTab(t); setError(null); }} className={`relative rounded-lg py-2 text-[11px] font-extrabold transition-colors ${tab === t ? "text-slate-900" : "text-zinc-400"}`}>
                  {tab === t && <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-lg bg-amber-400" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                  <span className="relative">{t === "in" ? "Sign In" : "Create Account"}</span>
                </button>
              ))}
            </div>

            <div className="relative mt-4 space-y-2.5">
              {tab === "up" && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={`${inputCls} !bg-white/10 !text-white placeholder:!text-zinc-500 !border-white/15 focus:!border-amber-400 focus:!bg-white/10 focus:!ring-amber-400/10`} />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" className={`${inputCls} !bg-white/10 !text-white placeholder:!text-zinc-500 !border-white/15 focus:!border-amber-400 focus:!bg-white/10 focus:!ring-amber-400/10`} />
              </div>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password (6+ characters)" className={`${inputCls} !bg-white/10 !text-white placeholder:!text-zinc-500 !border-white/15 focus:!border-amber-400 focus:!bg-white/10 focus:!ring-amber-400/10`} />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="relative mt-2.5 rounded-lg bg-red-500/15 px-3 py-2 text-[10.5px] font-bold text-red-300 ring-1 ring-red-500/30">
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={submit}
              disabled={busy}
              className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-[12.5px] font-extrabold text-slate-900 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-300 disabled:opacity-70"
            >
              {busy ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent" /> : null}
              {tab === "up" ? "Create My Account" : "Sign In"}
            </motion.button>

            <div className="relative my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={google}
              disabled={busy}
              className="relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-white py-3 text-[12px] font-extrabold text-slate-800 shadow-md transition-colors hover:bg-zinc-100 disabled:opacity-70"
            >
              <GoogleG /> Continue with Google
            </motion.button>

            {mode === "demo" && (
              <p className="relative mt-4 rounded-lg bg-amber-400/10 px-3 py-2 text-center text-[9.5px] font-bold leading-relaxed text-amber-300/90 ring-1 ring-amber-400/25">
                Demo mode — accounts are stored on this device. Add your Supabase keys (see README) to enable real email & Google sign-in.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
