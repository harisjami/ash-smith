# 🔥 Forge Of Ash

A mobile-first shop for hand-forged knives — product pages, cart & wishlist, custom-knife
builder, flash sales, live animations, accounts (email + Google) via Supabase.

Built with **React + Vite + Tailwind CSS + Framer Motion + GSAP + Supabase**.

---

## 🚀 Deploy in 60 seconds

The project is pre-configured for all three popular hosts. **Pick one.**

### Option A — Vercel (recommended)

1. Push this folder to a GitHub repository.
2. Go to **[vercel.com](https://vercel.com)** → sign in with GitHub.
3. **Add New… → Project** → import your repository → press **Deploy**.
4. Done. `vercel.json` already tells Vercel how to build. Every future push redeploys automatically.

### Option B — GitHub Pages

1. Push this folder to GitHub.
2. In the repo: **Settings → Pages → Source → GitHub Actions**
   *(this step is required — the included workflow builds and publishes for you).*
3. Open the **Actions** tab, wait ~1 minute for the green ✔.
4. Live at `https://<your-username>.github.io/<repo-name>/`.

### Option C — Netlify

1. **[app.netlify.com](https://app.netlify.com)** → **Add new site → Import an existing project** → pick your repo → **Deploy**.
   `netlify.toml` handles the rest.
2. *No GitHub?* Run the two commands below and drag the **`dist`** folder onto
   **[app.netlify.com/drop](https://app.netlify.com/drop)**.

### Manual upload (any host / cPanel)

```bash
npm install
npm run build
```

Upload the **contents of `dist/`** (`index.html` + the `images/` folder) to your host's root.
Never upload `src/` or the root `index.html` — browsers can't run those.

---

## 🔐 Accounts (Supabase) — optional

The shop works immediately with **no setup**: accounts run in demo mode (stored on the
visitor's device). To enable real email + Google sign-in:

1. Create a free project at [supabase.com](https://supabase.com).
2. **Project Settings → API** → copy the **Project URL** and **anon public** key.
3. Set them as environment variables (Vercel/Netlify: *Site → Environment variables*;
   locally: copy `.env.example` to `.env`):

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Google sign-in:** Supabase → *Authentication → Providers → Google* → enable it and
   add your site URL to the authorized redirect URIs.
5. Redeploy. No database tables needed — names & emblems live in auth metadata.

---

## 🧪 Run locally

```bash
npm install
npm run dev      # local preview at http://localhost:5173
npm run build    # production build → dist/
```

---

## 🩺 Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Blank white page | Raw source uploaded instead of `dist/` | Deploy the build (Options A–C) |
| Splash screen never disappears | Same as above | Run `npm run build`, upload `dist/` |
| GitHub Pages shows source code | Pages source set to a branch | Settings → Pages → **GitHub Actions** |
| "404 on /src/main.tsx" in console | Source files on the host | Replace them with `dist/` contents |
| Google login loops | Redirect URI not whitelisted | Add your site URL in Supabase providers |

## 📁 Structure

```
src/
├── App.tsx            # shell, routing, page transitions
├── shop.tsx           # cart/wishlist/toasts + hash history (native back/swipe)
├── auth.tsx           # Supabase auth (demo-mode fallback)
├── data.ts            # products & categories
└── components/        # every screen & section
public/images/         # logo + product renders
.github/workflows/     # auto-deploy to GitHub Pages
```
