/* ============================================================================
   🔍  SEO ENGINE
   ----------------------------------------------------------------------------
   On-page + technical SEO that actually ships: meta tags, JSON-LD structured
   data (products, organization, FAQs for answer engines), GA4, Search Console
   verification, and a sitemap generator. Settings live in the Admin Portal.
   ========================================================================== */
import { products } from "./data";
import { SEO_FAQS } from "./data";
import { categoryMeta } from "./data";
import { getSeo } from "./store";

const siteUrl = () => window.location.origin + window.location.pathname;
const abs = (src: string) => {
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/* ---------- per-page title & description (product pages call this) ---------- */
export function setPageSeo(title: string, description: string) {
  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
}

/* ---------- structured data: the heart of on-page SEO + AEO ---------- */
function productJsonLd() {
  return products
    .filter((p) => p && p.name)
    .map((p) => ({
      "@type": "Product",
      name: p.name,
      image: [abs(p.img || "")],
      description: p.seo?.description || p.description || "",
      sku: p.id,
      brand: { "@type": "Brand", name: "Forge Of Ash" },
      category: p.category,
      url: `${siteUrl()}#/product/${p.id}`,
      offers: {
        "@type": "Offer",
        price: Number(p.price) || 0,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: p.buyLink || `${siteUrl()}#/product/${p.id}`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(p.rating) || 5,
        reviewCount: parseInt(String(p.reviews ?? "1").replace(/,/g, "")) || 1,
      },
    }));
}

export function injectJsonLd() {
  document.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove());
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Forge Of Ash",
      url: siteUrl(),
      logo: abs("images/logo.png"),
      slogan: "Hand-Forged · Built to Last",
      sameAs: ["https://www.facebook.com/share/1CwzZqoVqj/"],
      contactPoint: { "@type": "ContactPoint", email: "forge.of.ash1@gmail.com", contactType: "customer service" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Forge Of Ash",
      url: siteUrl(),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Hand-forged blades by Forge Of Ash",
      numberOfItems: products.length,
      itemListElement: productJsonLd().map((p, i) => ({ "@type": "ListItem", position: i + 1, item: p })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: SEO_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  blocks.forEach((b) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-seo-jsonld", "1");
    s.textContent = JSON.stringify(b);
    document.head.appendChild(s);
  });
}

/* ---------- site settings from the portal: description, GSC, GA4 ---------- */
export function applySeoSettings() {
  const seo = getSeo();

  upsertMeta("name", "description", seo.siteDescription || "Hand-forged knives, axes and blades — damascus steel, bone and horn handles, made to order at Forge Of Ash.");
  upsertMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", "Forge Of Ash");
  upsertMeta("property", "og:image", abs("images/hero-podium.png"));
  upsertMeta("name", "twitter:card", "summary_large_image");

  // canonical
  let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement("link");
    canon.rel = "canonical";
    document.head.appendChild(canon);
  }
  canon.href = siteUrl();

  // Google Search Console verification
  if (seo.gsc?.trim()) upsertMeta("name", "google-site-verification", seo.gsc.trim());

  // GA4
  if (seo.ga?.trim() && !document.getElementById("foa-gtag")) {
    const id = seo.ga.trim();
    const s1 = document.createElement("script");
    s1.id = "foa-gtag";
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s1);
    const s2 = document.createElement("script");
    s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');`;
    document.head.appendChild(s2);
  }

  injectJsonLd();
}

/* ---------- sitemap generator (also shipped statically as sitemap.xml) ---------- */
export function buildSitemapXml(): string {
  const base = siteUrl();
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: base, priority: "1.0" },
    ...categoryMeta.map((c) => ({ loc: `${base}#/category/${encodeURIComponent(c.name)}`, priority: "0.7" })),
    { loc: `${base}#/categories`, priority: "0.6" },
    { loc: `${base}#/custom`, priority: "0.6" },
    ...products.map((p) => ({ loc: `${base}#/product/${p.id}`, priority: "0.8" })),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`),
    "</urlset>",
  ].join("\n");
}

/* ---------- small SEO health audit for the portal ---------- */
export function seoAudit(): { ok: boolean; label: string }[] {
  const seo = getSeo();
  const customs = products.filter((p) => p.custom);
  return [
    { ok: Boolean(seo.siteDescription?.trim()), label: "Site meta description set" },
    { ok: Boolean(seo.gsc?.trim()), label: "Search Console verification added" },
    { ok: Boolean(seo.ga?.trim()), label: "Google Analytics (GA4) connected" },
    { ok: products.every((p) => Boolean(p.img)), label: "Every listing has an image" },
    { ok: customs.length === 0 || customs.every((p) => p.seo?.description), label: "Portal listings have SEO descriptions" },
    { ok: SEO_FAQS.length >= 4, label: "FAQ schema present for answer engines" },
    { ok: products.length > 0, label: "Product catalog indexed in structured data" },
  ];
}
