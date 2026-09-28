# 🔍 Growing Forge Of Ash on Google — the playbook

The technical half is already built into the shop. This file is the human half.

## Already working in the code (on-page + technical)

- **Meta tags** — title, description, robots, Open Graph + Twitter cards, canonical URL, theme color (set at boot in `src/seo.ts`).
- **Structured data (JSON-LD)** — `Organization`, `WebSite`, an `ItemList` of every product with `Product` + `Offer` (price, availability, buy link) + `AggregateRating`, and a `FAQPage` block. This is what makes Google show rich results and what answer engines (AEO) pull from.
- **Per-page SEO** — every product page sets its own `<title>` + meta description (portal values win, auto-generated fallback otherwise).
- **robots.txt + sitemap.xml** — shipped in `public/`; regenerate the sitemap from the Admin Portal → SEO tab after adding listings.
- **Image hygiene** — all photos live in `public/images/` with clean names; `alt` text is set everywhere.
- **Semantic HTML** — one `h1` per page, real `h2/h3`, buttons and landmarks.

## Do this once (indexing)

1. **Google Search Console** → add your domain → verify with the HTML-tag code
   (paste it in Admin Portal → SEO tab → *Apply*).
2. In GSC: **Sitemaps** → submit `/sitemap.xml`.
3. **Request indexing** for your homepage in the URL Inspection tool.
4. Connect **GA4**: create a property, copy the `G-…` ID into the portal SEO tab.

## Do this weekly (off-page — this is what actually ranks you)

- **One new listing or story per week.** Fresh content is the #1 crawl trigger.
- **Answer real questions in public.** Reply to knife forums, Reddit (r/knifeclub,
  r/bladesmith), Quora — link back to the matching product page, not the homepage.
- **Google Business / Merchant Center.** Even a home forge can register; product
  feeds from your JSON-LD can surface in Google Shopping.
- **Backlinks from makers.** Trade a piece for a review on a blade blog or YouTube
  channel — one good review outranks ten social posts.
- **Pinterest + Instagram** with keyword-rich captions ("handmade damascus chef
  knife") — image search is huge for blades.
- **Keep FAQs current** — the visible FAQ section doubles as your AEO source.

## AEO (ranking in AI answers)

Answer engines quote pages that state facts plainly. The shop already:
- answers six core questions in plain sentences (FAQ section + schema),
- publishes specs as label/value pairs (Materials & Measurements),
- names prices and policies explicitly.
When you write listings, lead with a one-sentence plain-English summary — that's
the sentence an AI will quote.
