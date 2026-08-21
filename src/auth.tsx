import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { Axe, Flame, Hammer, Shield, Swords, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { hasSupabase, supabase } from "./lib/supabase";

export const AVATAR_ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  swords: Swords,
  shield: Shield,
  zap: Zap,
  axe: Axe,
  hammer: Hammer,
};

export type AuthUser = { id: string; email: string; name: string; avatar: string };

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  mode: "supabase" | "demo";
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signInGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (patch: { name?: string; avatar?: string }) => Promise<string | null>;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}

const AVATARS = ["flame", "swords", "shield", "zap", "axe", "hammer"];

/* ---------- tiny local demo store (used only when Supabase isn't configured) ---------- */
type DemoAccount = { email: string; password: string; name: string; avatar: string };
const readAccounts = (): DemoAccount[] => {
  try {
    return JSON.parse(localStorage.getItem("foa_accounts") ?? "[]") as DemoAccount[];
  } catch {
    return [];
  }
};
const writeAccounts = (a: DemoAccount[]) => localStorage.setItem("foa_accounts", JSON.stringify(a));
const readSession = (): string | null => localStorage.getItem("foa_session");

const mapUser = (su: User): AuthUser => ({
  id: su.id,
  email: su.email ?? "",
  name: (su.user_metadata?.full_name as string) || (su.email?.split("@")[0] ?? "Bladesmith"),
  avatar: (su.user_metadata?.avatar as string) || "flame",
});

const demoUser = (a: DemoAccount): AuthUser => ({ id: `demo-${a.email}`, email: a.email, name: a.name, avatar: a.avatar });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      const email = readSession();
      const acc = email ? readAccounts().find((a) => a.email === email) : undefined;
      setUser(acc ? demoUser(acc) : null);
      setLoading(false);
      return;
    }
    let active = true;
    // Google OAuth returns tokens in the hash — strip them so the
    // app's own hash router never mistakes them for a route
    if (window.location.hash.includes("access_token") || window.location.hash.includes("error=")) {
      try {
        window.history.replaceState(window.history.state, "", "#/");
      } catch {
        /* non-fatal */
      }
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ? mapUser(data.session.user) : null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, avatar: "flame" } },
      });
      return error?.message ?? null;
    }
    const accounts = readAccounts();
    if (accounts.some((a) => a.email === email)) return "An account with this email already exists.";
    accounts.push({ email, password, name, avatar: "flame" });
    writeAccounts(accounts);
    localStorage.setItem("foa_session", email);
    setUser(demoUser(accounts[accounts.length - 1]));
    return null;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    }
    const acc = readAccounts().find((a) => a.email === email && a.password === password);
    if (!acc) return "Wrong email or password.";
    localStorage.setItem("foa_session", email);
    setUser(demoUser(acc));
    return null;
  }, []);

  const signInGoogle = useCallback(async () => {
    if (!supabase) return "Google sign-in needs Supabase configured — see README.";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    return error?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("foa_session");
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: { name?: string; avatar?: string }) => {
      if (supabase && user) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: patch.name, avatar: patch.avatar },
        });
        if (error) return error.message;
        setUser((u) => (u ? { ...u, name: patch.name ?? u.name, avatar: patch.avatar ?? u.avatar } : u));
        return null;
      }
      const accounts = readAccounts();
      const acc = accounts.find((a) => a.email === user?.email);
      if (acc) {
        acc.name = patch.name ?? acc.name;
        acc.avatar = patch.avatar ?? acc.avatar;
        writeAccounts(accounts);
        setUser(demoUser(acc));
      }
      return null;
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, mode: hasSupabase ? "supabase" : "demo", signUp, signIn, signInGoogle, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const AVATAR_KEYS = AVATARS;
