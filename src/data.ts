export type CategoryName = "Pocket Knives" | "Chef Knives" | "Beauty" | "Home" | "Grocery" | "Sports" | "Folding Knives" | "Viking Knives";

export type Product = {
  id: string;
  name: string;
  spec?: string;
  category: CategoryName;
  rating: number;
  reviews: string;
  price: number;
  oldPrice: number;
  img: string;
  description: string;
};

// Lightweight delivery: the app never renders wider than ~430px, so a single
// 650px-wide JPEG covers retina displays at a fraction of the bytes.
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=650`;

export const discountOf = (p: Product) => `-${Math.round((1 - p.price / p.oldPrice) * 100)}%`;
export const money = (n: number) => `$${n.toFixed(2)}`;

export const products: Product[] = [
  // ---- Pocket Knives ----
  { id: "knife-pocket", name: "Handmade Small Pocket Knife", spec: "Antler handle · Jute wrap", category: "Pocket Knives", rating: 5, reviews: "147", price: 39.99, oldPrice: 54.99, img: "images/pocket-knife.png", description: "A palm-sized handmade blade with a satin spear point and honest forge scale on the spine. The handle is a single curved deer-antler tine, bound at the neck with hand-wrapped jute twine. Small enough to forget, sharp enough to remember." },
  { id: "knife-antler", name: "Antler Grip Neck Knife", spec: "Deer antler · Spear point", category: "Pocket Knives", rating: 5, reviews: "98", price: 34.99, oldPrice: 49.99, img: "images/pocket-knife-grip.png", description: "The same forged spear point tuned for a fist-full grip — the antler pommel locks into your palm for precise push cuts and carving." },
  { id: "knife-rustic", name: "Rustic Twine Pocket Knife", spec: "Fixed blade · Twine lanyard", category: "Pocket Knives", rating: 4, reviews: "76", price: 29.99, oldPrice: 44.99, img: px(18268059), description: "A no-nonsense fixed blade with a rustic twine-wrapped handle and lanyard. Made for camp chores and whittling." },
  { id: "knife-woodfold", name: "Classic Wooden Folder", spec: "Hardwood scales · Slipjoint", category: "Pocket Knives", rating: 4, reviews: "132", price: 27.99, oldPrice: 39.99, img: px(18268034), description: "An old-school slipjoint folder with oiled hardwood scales. Snaps open, tucks flat, rides in the coin pocket." },
  // ---- Chef Knives ----
  { id: "chef-set-5", name: "Handmade Damascus Chef Set", spec: "5-piece · Twisted steel handles", category: "Chef Knives", rating: 5, reviews: "89", price: 249.99, oldPrice: 349.99, img: "images/chef-set.png", description: "Five hand-forged damascus blades — cleaver to paring — each with a hammered, textured face and a twisted sculpted steel handle that grips like rope. Balanced on the finger, sharp out of the forge." },
  { id: "chef-forge", name: "Chef Set — Forge Finish Spines", spec: "Full tang · Layered damascus", category: "Chef Knives", rating: 5, reviews: "64", price: 229.99, oldPrice: 319.99, img: "images/chef-handles.png", description: "The same five blades shown spine-up: layered damascus running the full tang into twisted handles. A set that works as hard as it displays." },
  { id: "chef-single", name: 'Damascus Chef Knife 8"', spec: "Hammered · Wooden handle", category: "Chef Knives", rating: 5, reviews: "212", price: 89.99, oldPrice: 129.99, img: px(16457332), description: "A single 8-inch damascus chef knife with a hammered finish and oiled wooden handle. The one blade that does everything." },
  { id: "chef-duo", name: "Damascus Kitchen Duo", spec: "Chef + utility · Wood scales", category: "Chef Knives", rating: 4, reviews: "156", price: 119.99, oldPrice: 169.99, img: px(16457340), description: "A chef and a utility knife in matching damascus with contoured wood scales. The starter pair for a serious kitchen." },
  { id: "chef-cleaver", name: "Damascus Cleaver", spec: "Hammered · Wide blade", category: "Chef Knives", rating: 5, reviews: "118", price: 79.99, oldPrice: 109.99, img: px(16457318), description: "A wide hammered damascus cleaver that drops through herbs, bone and hard squash alike." },
  { id: "chef-balance", name: "Balanced Forge Chef Knife", spec: "Finger-balanced · 8 in", category: "Chef Knives", rating: 5, reviews: "94", price: 94.99, oldPrice: 129.99, img: px(16468221), description: "Tuned to balance on a fingertip — proof of a perfectly distributed hand forge." },
  // ---- Beauty ----
  { id: "velvet", name: "Velvet Matte Lipstick Trio", spec: "3 shades · Gold case", category: "Beauty", rating: 5, reviews: "1,408", price: 24.99, oldPrice: 39.99, img: px(90269), description: "Three weightless matte shades in a luxurious gold bullet. Hydrating formula with 8-hour wear." },
  { id: "colorpop", name: "Color Pop Lipstick Set", spec: "6 shades", category: "Beauty", rating: 4, reviews: "902", price: 19.99, oldPrice: 29.99, img: px(7810600), description: "A rainbow of creamy, buildable shades from nude to neon. Vegan and cruelty-free." },
  { id: "silk", name: "Silk Finish Lipsticks", spec: "Satin · Vitamin E", category: "Beauty", rating: 4, reviews: "655", price: 22.99, oldPrice: 34.99, img: px(4889718), description: "Satin-smooth color infused with vitamin E and shea butter for a cushiony, non-drying feel." },
  // ---- Home ----
  { id: "armchair", name: "Nordic Accent Armchair", spec: "Bouclé · Oak legs", category: "Home", rating: 5, reviews: "421", price: 189.99, oldPrice: 249.99, img: px(6078545), description: "Sculpted bouclé armchair with solid oak legs. The cozy corner upgrade your living room deserves." },
  { id: "sofa", name: "Modern 3-Seater", spec: "Fabric Sofa", category: "Home", rating: 4, reviews: "542", price: 299.99, oldPrice: 379.99, img: px(11295890), description: "Deep-seat comfort with stain-resistant fabric and kiln-dried hardwood frame. Seats three generously." },
  { id: "loungeset", name: "Lounge Chair & Table Set", spec: "3-piece", category: "Home", rating: 4, reviews: "288", price: 329.99, oldPrice: 429.99, img: px(2079246), description: "Two sculpted lounge chairs and a round walnut table — a mid-century conversation set." },
  { id: "airfryer", name: "Air Fryer 4.5L", spec: "Digital Display", category: "Home", rating: 4, reviews: "862", price: 75.99, oldPrice: 99.99, img: px(29461935), description: "Crispy results with 90% less oil. 8 one-touch presets and a dishwasher-safe basket." },
  // ---- Grocery ----
  { id: "veggiebox", name: "Fresh Veggie Box", spec: "5kg · 12 varieties", category: "Grocery", rating: 5, reviews: "1,954", price: 29.99, oldPrice: 39.99, img: px(37083826), description: "A rotating box of 12 farm-fresh vegetables, harvested within 24 hours of delivery." },
  { id: "greens", name: "Organic Greens Basket", spec: "2kg · Certified organic", category: "Grocery", rating: 4, reviews: "766", price: 19.99, oldPrice: 27.99, img: px(5709305), description: "Leafy organic greens — bok choy, kale, spinach and herbs — picked at peak freshness." },
  // ---- Sports ----
  { id: "dumbbell10", name: "Pro Dumbbell 10kg", spec: "Hex · Rubber coated", category: "Sports", rating: 5, reviews: "1,311", price: 34.99, oldPrice: 49.99, img: px(38721839), description: "Rubber-coated hex dumbbell with a knurled steel grip. No rolling, no floor scratches." },
  { id: "dumbbellpair", name: "Iron Dumbbell Pair", spec: "2 × 7.5kg", category: "Sports", rating: 4, reviews: "590", price: 54.99, oldPrice: 74.99, img: px(669580), description: "Classic cast-iron pair for strength training. Machined grips for a secure hold." },
  // ---- Folding Knives ----
  { id: "viking-seax", name: "Handmade Viking Seax Knife", spec: "Rune-carved damascus · Bone handle", category: "Viking Knives", rating: 5, reviews: "168", price: 190, oldPrice: 259.99, img: "images/viking-seax.png", description: "A true norse seax — dark hammered damascus etched with knotwork and runic script, a polished bone grip carved with elder futhark runes, and a black spacer binding blade to handle. Forged heavy enough to chop, balanced enough to carve." },
  { id: "knife-heritage", name: "Heritage Damascus Folding Knife", spec: "Engraved copper · Horn handle", category: "Folding Knives", rating: 5, reviews: "312", price: 189.99, oldPrice: 259.99, img: "images/knife-hero.png", description: "Hand-forged 67-layer damascus blade with a clipped point, ornate floral-engraved copper bolsters and a polished black buffalo-horn handle. A working heirloom." },
  { id: "knife-artisan", name: "Artisan Wave Damascus Folder", spec: "Color-anodized · Liner lock", category: "Folding Knives", rating: 5, reviews: "428", price: 149.99, oldPrice: 199.99, img: px(20392664), description: "Swirling rainbow-anodized damascus over a smooth liner lock. Flipper tab deploys the blade in one confident flick." },
  { id: "knife-fieldset", name: "Field Pocket Knife Set", spec: "3-piece · Wood display", category: "Folding Knives", rating: 4, reviews: "265", price: 89.99, oldPrice: 119.99, img: px(12749403), description: "Three field-ready folders with hardwood scales, displayed on a rustic wood stand. The whole kit, sorted." },
  { id: "knife-craft", name: "Handcraft Damascus Collection", spec: "Decorative scales", category: "Folding Knives", rating: 4, reviews: "198", price: 129.99, oldPrice: 179.99, img: px(12749402), description: "Colorful handcrafted damascus blades with decorative handles — each piece finished by a single maker." },
  { id: "knife-sheath", name: "Engraved Blade & Leather Sheath", spec: "Brass pins · Full grain", category: "Folding Knives", rating: 4, reviews: "341", price: 74.99, oldPrice: 99.99, img: px(33508936), description: "A crisply engraved folder paired with a stitched full-grain leather sheath. Belt-ready and built to patina." },
  { id: "knife-edc", name: "Modern EDC Folding Duo", spec: "2-pack · Pocket clip", category: "Folding Knives", rating: 4, reviews: "512", price: 59.99, oldPrice: 84.99, img: px(33508946), description: "Two slim everyday-carry folders with deep-carry clips — one for the office, one for the trail." },
];

export const byId = (id: string) => products.find((p) => p.id === id);

export const categoryStrip: { name: CategoryName | "All"; img: string }[] = [
  { name: "Pocket Knives", img: "images/pocket-knife.png" },
  { name: "Chef Knives", img: "images/chef-set.png" },
  { name: "Beauty", img: px(4889718) },
  { name: "Home", img: px(6078545) },
  { name: "Grocery", img: px(37083826) },
  { name: "Sports", img: px(669580) },
  { name: "Folding Knives", img: "images/knife-hero.png" },
  { name: "Viking Knives", img: "images/viking-seax.png" },
];

export const categoryMeta: { name: CategoryName; items: string; img: string; blurb: string }[] = [
  { name: "Pocket Knives", items: "3,800+ items", img: "images/pocket-knife-grip.png", blurb: "Small handmade & antler grips" },
  { name: "Chef Knives", items: "2,600+ items", img: "images/chef-handles.png", blurb: "Handmade damascus for the kitchen" },
  { name: "Beauty", items: "8,000+ items", img: px(7810600), blurb: "Lips, skin & self-care" },
  { name: "Home", items: "12,000+ items", img: px(2079246), blurb: "Furniture & kitchen picks" },
  { name: "Grocery", items: "6,500+ items", img: px(37083826), blurb: "Fresh from the farm" },
  { name: "Sports", items: "9,000+ items", img: px(669580), blurb: "Gear for every goal" },
  { name: "Folding Knives", items: "4,200+ items", img: "images/knife-folded.png", blurb: "Hand-forged damascus & EDC" },
  { name: "Viking Knives", items: "1,400+ items", img: "images/viking-seax.png", blurb: "Rune-carved seax & norse steel" },
];

export const popularCategories = categoryMeta.slice(0, 4);

/* ---------- mosaic tiles: 15 browsable collections, each backed by a live filter ---------- */
export type CategoryTile = {
  name: string;
  img: string;
  blurb: string;
  filter: (p: Product) => boolean;
};

const inIds = (...ids: string[]) => (p: Product) => ids.includes(p.id);
const inCat = (c: CategoryName) => (p: Product) => p.category === c;
const hasWord = (w: string) => (p: Product) =>
  `${p.name} ${p.description} ${p.spec ?? ""}`.toLowerCase().includes(w);

export const categoryTiles: CategoryTile[] = [
  { name: "Folding Knives", img: "images/knife-hero.png", blurb: "Damascus & EDC folders", filter: inCat("Folding Knives") },
  { name: "Viking Knives", img: "images/viking-seax.png", blurb: "Rune-carved norse steel", filter: inCat("Viking Knives") },
  { name: "Chef Knives", img: "images/chef-set.png", blurb: "Handmade for the kitchen", filter: inCat("Chef Knives") },
  { name: "Pocket Knives", img: "images/pocket-knife.png", blurb: "Small & antler grips", filter: inCat("Pocket Knives") },
  { name: "Damascus Steel", img: px(20392664), blurb: "Layered, pattern-welded", filter: hasWord("damascus") },
  { name: "EDC Carry", img: px(33508946), blurb: "Daily pocket companions", filter: inIds("knife-edc", "knife-pocket", "knife-woodfold", "knife-sheath") },
  { name: "Hunting & Camp", img: px(18268059), blurb: "Fixed blades for the wild", filter: inIds("knife-rustic", "knife-fieldset", "knife-antler") },
  { name: "Kitchen Tools", img: px(16457332), blurb: "Blades & appliances", filter: (p) => p.category === "Chef Knives" || p.id === "airfryer" },
  { name: "Beauty", img: px(7810600), blurb: "Lips, skin & self-care", filter: inCat("Beauty") },
  { name: "Home & Living", img: px(6958126), blurb: "Comfort, styled", filter: inCat("Home") },
  { name: "Furniture", img: px(2079246), blurb: "Seats & statement pieces", filter: inIds("sofa", "armchair", "loungeset") },
  { name: "Grocery", img: px(37083826), blurb: "Fresh from the farm", filter: inCat("Grocery") },
  { name: "Sports", img: px(669580), blurb: "Gear for every goal", filter: inCat("Sports") },
  { name: "Gift Sets", img: px(12749403), blurb: "Bundles worth giving", filter: inIds("chef-set-5", "knife-fieldset", "velvet", "chef-duo") },
  { name: "Collectibles", img: px(12749402), blurb: "One-of-a-kind makers' work", filter: inIds("knife-heritage", "knife-artisan", "knife-craft") },
  { name: "New Arrivals", img: px(16468221), blurb: "Fresh off the anvil", filter: inIds("chef-balance", "knife-artisan", "knife-edc", "chef-cleaver", "knife-fieldset", "knife-craft", "knife-sheath", "velvet") },
];

export const tileCount = (t: CategoryTile) => products.filter(t.filter).length;

export const featuredProducts = products.filter((p) => ["viking-seax", "knife-pocket", "knife-heritage"].includes(p.id));
export const bestSellers = products.filter((p) => ["chef-set-5", "knife-heritage", "knife-pocket", "airfryer", "sofa"].includes(p.id));

export const testimonials = [
  {
    name: "Emily Johnson",
    role: "Verified Buyer",
    rating: 5,
    text: "Great products, fast delivery, and excellent customer service. Forge Of Ash is my go-to shopping destination!",
    avatar: px(7717254),
  },
  {
    name: "Marcus Reed",
    role: "Verified Buyer",
    rating: 5,
    text: "The flash deals are unreal — grabbed a smartwatch at 40% off and it arrived in two days. Absolutely hooked!",
    avatar: px(804009),
  },
  {
    name: "Daniel Okafor",
    role: "Verified Buyer",
    rating: 4,
    text: "Clean app, honest prices, and returns are painless. The summer collection banner sold me instantly.",
    avatar: px(14950779),
  },
];

export const brandBanners = {
  summer: { title: "Summer Collection", line1: "Up to 50% Off", line2: "On Knives & Accessories", img: px(1408978), category: "Folding Knives" as CategoryName },
  home: { title: "Home Essentials For Better Living", line1: "Up to 40% Off", line2: "On Home & Kitchen", img: px(6958126), category: "Home" as CategoryName },
};

export const flashDeal = { id: "smartwatch", price: 149.99, oldPrice: 249.99, img: px(9142237) };
