# 🖼️ Changing Images — Quick Guide

Every picture on the site is listed in **one file**: `src/images.ts`.

## Swap a product / category / story photo

1. Open `src/images.ts`.
2. Find the line with the name you want (each one has a comment, e.g. `// Heritage folding knife, open`).
3. Replace the value:
   - **Your own photo:** put the file in `public/images/` and write `"images/your-file.jpg"`
   - **A web photo:** paste any image URL (right-click image → *Copy image address*)
4. Save. Done — no other file needs editing.

## Change the logo

Replace the file `public/images/logo.png` with your own (keep the same name).
The header, menus, stories, sellers and footer all update automatically.

## Add a brand-new product photo

Same as swapping: add a line to `src/images.ts`, then use that name in `src/data.ts`
when you create the product (see the existing products as examples).

## Removing an image

You never delete from `images.ts` — just stop using it. Unused lines are harmless.

---

Deploying after an image change: push to GitHub (Vercel / GitHub Pages / Netlify
rebuild automatically) — see `README.md` for the one-time host setup.
