import { IMG } from "./images";

export type CategoryName = "Pocket Knives" | "Chef Knives" | "Beauty" | "Home" | "Grocery" | "Sports" | "Folding Knives" | "Viking Knives" | "Skinner Knives" | "Sword" | "Viking Axe";

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
  gallery?: string[];
  description: string;
  /* ---- portal (admin-created) fields ---- */
  custom?: boolean;
  buyLink?: string; // drives the real shop's Buy Now button when set
  details?: string; // extra dimensions / product details
  materials?: { label: string; value: string }[];
  care?: string[];
  featured?: boolean;
  story?: { label: string; caption: string };
};

export const galleryFor = (p: Product) => p.gallery ?? [p.img];

export const discountOf = (p: Product) => `-${Math.round((1 - p.price / p.oldPrice) * 100)}%`;
export const money = (n: number) => `$${n.toFixed(2)}`;

export const products: Product[] = [
  // ---- Pocket Knives ----
  { id: "knife-pocket", name: "Handmade Small Pocket Knife", spec: "Antler handle · Jute wrap", category: "Pocket Knives", rating: 5, reviews: "147", price: 39.99, oldPrice: 54.99, img: IMG.pocketKnife, gallery: [IMG.pocketKnife, IMG.pocketKnifeGrip, IMG.woodFolder], description: "A palm-sized handmade blade with a satin spear point and honest forge scale on the spine. The handle is a single curved deer-antler tine, bound at the neck with hand-wrapped jute twine. Small enough to forget, sharp enough to remember." },
  { id: "knife-antler", name: "Antler Grip Neck Knife", spec: "Deer antler · Spear point", category: "Pocket Knives", rating: 5, reviews: "98", price: 34.99, oldPrice: 49.99, img: IMG.pocketKnifeGrip, description: "The same forged spear point tuned for a fist-full grip — the antler pommel locks into your palm for precise push cuts and carving." },
  { id: "knife-rustic", name: "Rustic Twine Pocket Knife", spec: "Fixed blade · Twine lanyard", category: "Pocket Knives", rating: 4, reviews: "76", price: 29.99, oldPrice: 44.99, img: IMG.rusticTwine, description: "A no-nonsense fixed blade with a rustic twine-wrapped handle and lanyard. Made for camp chores and whittling." },
  { id: "knife-woodfold", name: "Classic Wooden Folder", spec: "Hardwood scales · Slipjoint", category: "Pocket Knives", rating: 4, reviews: "132", price: 27.99, oldPrice: 39.99, img: IMG.woodFolder, description: "An old-school slipjoint folder with oiled hardwood scales. Snaps open, tucks flat, rides in the coin pocket." },
  // ---- Chef Knives ----
  { id: "chef-set-5", name: "Handmade Damascus Chef Set", spec: "5-piece · Twisted steel handles", category: "Chef Knives", rating: 5, reviews: "89", price: 249.99, oldPrice: 349.99, img: IMG.chefSet, gallery: [IMG.chefSet, IMG.chefHandles, IMG.chefSingle], description: "Five hand-forged damascus blades — cleaver to paring — each with a hammered, textured face and a twisted sculpted steel handle that grips like rope. Balanced on the finger, sharp out of the forge." },
  { id: "chef-forge", name: "Chef Set — Forge Finish Spines", spec: "Full tang · Layered damascus", category: "Chef Knives", rating: 5, reviews: "64", price: 229.99, oldPrice: 319.99, img: IMG.chefHandles, description: "The same five blades shown spine-up: layered damascus running the full tang into twisted handles. A set that works as hard as it displays." },
  { id: "chef-single", name: 'Damascus Chef Knife 8"', spec: "Hammered · Wooden handle", category: "Chef Knives", rating: 5, reviews: "212", price: 89.99, oldPrice: 129.99, img: IMG.chefSingle, description: "A single 8-inch damascus chef knife with a hammered finish and oiled wooden handle. The one blade that does everything." },
  { id: "chef-duo", name: "Damascus Kitchen Duo", spec: "Chef + utility · Wood scales", category: "Chef Knives", rating: 4, reviews: "156", price: 119.99, oldPrice: 169.99, img: IMG.chefDuo, description: "A chef and a utility knife in matching damascus with contoured wood scales. The starter pair for a serious kitchen." },
  { id: "chef-cleaver", name: "Damascus Cleaver", spec: "Hammered · Wide blade", category: "Chef Knives", rating: 5, reviews: "118", price: 79.99, oldPrice: 109.99, img: IMG.chefCleaver, description: "A wide hammered damascus cleaver that drops through herbs, bone and hard squash alike." },
  { id: "chef-balance", name: "Balanced Forge Chef Knife", spec: "Finger-balanced · 8 in", category: "Chef Knives", rating: 5, reviews: "94", price: 94.99, oldPrice: 129.99, img: IMG.chefBalance, description: "Tuned to balance on a fingertip — proof of a perfectly distributed hand forge." },
  // ---- Beauty ----
  { id: "velvet", name: "Velvet Matte Lipstick Trio", spec: "3 shades · Gold case", category: "Beauty", rating: 5, reviews: "1,408", price: 24.99, oldPrice: 39.99, img: IMG.lipstickTrio, description: "Three weightless matte shades in a luxurious gold bullet. Hydrating formula with 8-hour wear." },
  { id: "colorpop", name: "Color Pop Lipstick Set", spec: "6 shades", category: "Beauty", rating: 4, reviews: "902", price: 19.99, oldPrice: 29.99, img: IMG.lipstickRow, description: "A rainbow of creamy, buildable shades from nude to neon. Vegan and cruelty-free." },
  { id: "silk", name: "Silk Finish Lipsticks", spec: "Satin · Vitamin E", category: "Beauty", rating: 4, reviews: "655", price: 22.99, oldPrice: 34.99, img: IMG.lipstickMarble, description: "Satin-smooth color infused with vitamin E and shea butter for a cushiony, non-drying feel." },
  // ---- Home ----
  { id: "armchair", name: "Nordic Accent Armchair", spec: "Bouclé · Oak legs", category: "Home", rating: 5, reviews: "421", price: 189.99, oldPrice: 249.99, img: IMG.armchair, description: "Sculpted bouclé armchair with solid oak legs. The cozy corner upgrade your living room deserves." },
  { id: "sofa", name: "Modern 3-Seater", spec: "Fabric Sofa", category: "Home", rating: 4, reviews: "542", price: 299.99, oldPrice: 379.99, img: IMG.sofa, description: "Deep-seat comfort with stain-resistant fabric and kiln-dried hardwood frame. Seats three generously." },
  { id: "loungeset", name: "Lounge Chair & Table Set", spec: "3-piece", category: "Home", rating: 4, reviews: "288", price: 329.99, oldPrice: 429.99, img: IMG.loungeSet, description: "Two sculpted lounge chairs and a round walnut table — a mid-century conversation set." },
  { id: "airfryer", name: "Air Fryer 4.5L", spec: "Digital Display", category: "Home", rating: 4, reviews: "862", price: 75.99, oldPrice: 99.99, img: IMG.airFryer, description: "Crispy results with 90% less oil. 8 one-touch presets and a dishwasher-safe basket." },
  // ---- Grocery ----
  { id: "veggiebox", name: "Fresh Veggie Box", spec: "5kg · 12 varieties", category: "Grocery", rating: 5, reviews: "1,954", price: 29.99, oldPrice: 39.99, img: IMG.veggieBox, description: "A rotating box of 12 farm-fresh vegetables, harvested within 24 hours of delivery." },
  { id: "greens", name: "Organic Greens Basket", spec: "2kg · Certified organic", category: "Grocery", rating: 4, reviews: "766", price: 19.99, oldPrice: 27.99, img: IMG.greens, description: "Leafy organic greens — bok choy, kale, spinach and herbs — picked at peak freshness." },
  // ---- Sports ----
  { id: "dumbbell10", name: "Pro Dumbbell 10kg", spec: "Hex · Rubber coated", category: "Sports", rating: 5, reviews: "1,311", price: 34.99, oldPrice: 49.99, img: IMG.dumbbell, description: "Rubber-coated hex dumbbell with a knurled steel grip. No rolling, no floor scratches." },
  { id: "dumbbellpair", name: "Iron Dumbbell Pair", spec: "2 × 7.5kg", category: "Sports", rating: 4, reviews: "590", price: 54.99, oldPrice: 74.99, img: IMG.dumbbellPair, description: "Classic cast-iron pair for strength training. Machined grips for a secure hold." },
  // ---- Folding / Viking / Skinner / Sword ----
  { id: "viking-seax", name: "Handmade Viking Seax Knife", spec: "Rune-carved damascus · Bone handle", category: "Viking Knives", rating: 5, reviews: "168", price: 190, oldPrice: 259.99, img: IMG.vikingSeax, gallery: [IMG.vikingSeax, IMG.damascusClose, IMG.chefBalance], description: "A true norse seax — dark hammered damascus etched with knotwork and runic script, a polished bone grip carved with elder futhark runes, and a black spacer binding blade to handle. Forged heavy enough to chop, balanced enough to carve." },
  { id: "skinner-knife", name: "Handmade Skinner Knife", spec: "Forge-textured blade · Bone handle", category: "Skinner Knives", rating: 5, reviews: "96", price: 190, oldPrice: 259.99, img: IMG.skinner, gallery: [IMG.skinner, IMG.skinnerStump, IMG.skinnerSheath], description: "A field skinner the way they used to be made — a wide curved drop-point blade left with honest forge scale, pinned to a cream bone grip that carries its own dark grain, finished with a twisted steel lanyard loop. Made to work a harvest, not pose for one." },
  { id: "handmade-sword", name: "Handmade Sword", spec: "Fullered blade · Leather-wrapped grip", category: "Sword", rating: 5, reviews: "74", price: 380, oldPrice: 499.99, img: IMG.swordFull, gallery: [IMG.swordFull, IMG.swordOrnate, IMG.swordHilt], description: "A hand-forged arming sword — a long fullered blade ground from a single high-carbon bar, a shaped steel guard and rounded pommel, and a stacked-leather grip wired tight for the swing. Balanced in the hand, honest in the steel." },
  { id: "viking-axe-set", name: "Handmade Set Of Viking Axe With Shield", spec: "Bearded axe · Linden round shield", category: "Viking Axe", rating: 5, reviews: "58", price: 480, oldPrice: 639.99, img: IMG.axeSet1, gallery: [IMG.axeSet1, IMG.axeSet2, IMG.axeWarrior], description: "A matched war-set from one fire — a hand-forged bearded axe with a shaped ash haft and leather-wrapped grip, paired with a round linden shield bound in rawhide and bossed in steel. Forged to hang together on the same wall." },
  { id: "knife-heritage", name: "Heritage Damascus Folding Knife", spec: "Engraved copper · Horn handle", category: "Folding Knives", rating: 5, reviews: "312", price: 189.99, oldPrice: 259.99, img: IMG.knifeHero, gallery: [IMG.knifeHero, IMG.knifeFolded, IMG.craftColorful], description: "Hand-forged 67-layer damascus blade with a clipped point, ornate floral-engraved copper bolsters and a polished black buffalo-horn handle. A working heirloom." },
  { id: "knife-artisan", name: "Artisan Wave Damascus Folder", spec: "Color-anodized · Liner lock", category: "Folding Knives", rating: 5, reviews: "428", price: 149.99, oldPrice: 199.99, img: IMG.damascusClose, description: "Swirling rainbow-anodized damascus over a smooth liner lock. Flipper tab deploys the blade in one confident flick." },
  { id: "knife-fieldset", name: "Field Pocket Knife Set", spec: "3-piece · Wood display", category: "Folding Knives", rating: 4, reviews: "265", price: 89.99, oldPrice: 119.99, img: IMG.fieldSet, description: "Three field-ready folders with hardwood scales, displayed on a rustic wood stand. The whole kit, sorted." },
  { id: "knife-craft", name: "Handcraft Damascus Collection", spec: "Decorative scales", category: "Folding Knives", rating: 4, reviews: "198", price: 129.99, oldPrice: 179.99, img: IMG.craftColorful, description: "Colorful handcrafted damascus blades with decorative handles — each piece finished by a single maker." },
  { id: "knife-sheath", name: "Engraved Blade & Leather Sheath", spec: "Brass pins · Full grain", category: "Folding Knives", rating: 4, reviews: "341", price: 74.99, oldPrice: 99.99, img: IMG.engravingBench, description: "A crisply engraved folder paired with a stitched full-grain leather sheath. Belt-ready and built to patina." },
  { id: "knife-edc", name: "Modern EDC Folding Duo", spec: "2-pack · Pocket clip", category: "Folding Knives", rating: 4, reviews: "512", price: 59.99, oldPrice: 84.99, img: IMG.edcDuo, description: "Two slim everyday-carry folders with deep-carry clips — one for the office, one for the trail." },
];

export const byId = (id: string) => products.find((p) => p.id === id);

export const categoryStrip: { name: CategoryName | "All"; img: string }[] = [
  { name: "Pocket Knives", img: IMG.pocketKnife },
  { name: "Chef Knives", img: IMG.chefSet },
  { name: "Beauty", img: IMG.lipstickMarble },
  { name: "Home", img: IMG.armchair },
  { name: "Grocery", img: IMG.veggieBox },
  { name: "Sports", img: IMG.dumbbellPair },
  { name: "Folding Knives", img: IMG.knifeHero },
  { name: "Viking Knives", img: IMG.vikingSeax },
  { name: "Skinner Knives", img: IMG.skinner },
  { name: "Sword", img: IMG.swordFull },
  { name: "Viking Axe", img: IMG.axeSet1 },
];

export const categoryMeta: { name: CategoryName; items: string; img: string; blurb: string }[] = [
  { name: "Pocket Knives", items: "3,800+ items", img: IMG.pocketKnifeGrip, blurb: "Small handmade & antler grips" },
  { name: "Chef Knives", items: "2,600+ items", img: IMG.chefHandles, blurb: "Handmade damascus for the kitchen" },
  { name: "Beauty", items: "8,000+ items", img: IMG.lipstickRow, blurb: "Lips, skin & self-care" },
  { name: "Home", items: "12,000+ items", img: IMG.loungeSet, blurb: "Furniture & kitchen picks" },
  { name: "Grocery", items: "6,500+ items", img: IMG.veggieBox, blurb: "Fresh from the farm" },
  { name: "Sports", items: "9,000+ items", img: IMG.dumbbellPair, blurb: "Gear for every goal" },
  { name: "Folding Knives", items: "4,200+ items", img: IMG.knifeFolded, blurb: "Hand-forged damascus & EDC" },
  { name: "Viking Knives", items: "1,400+ items", img: IMG.vikingSeax, blurb: "Rune-carved seax & norse steel" },
  { name: "Skinner Knives", items: "900+ items", img: IMG.skinner, blurb: "Bone-handle field skinners" },
  { name: "Sword", items: "600+ items", img: IMG.swordFull, blurb: "Fullered blades, leather grips" },
  { name: "Viking Axe", items: "450+ items", img: IMG.axeSet1, blurb: "Bearded axes & round shields" },
];

export const popularCategories = categoryMeta.slice(0, 4);

/* ---------- mosaic tiles: browsable collections, each backed by a live filter ---------- */
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
  { name: "Folding Knives", img: IMG.knifeHero, blurb: "Damascus & EDC folders", filter: inCat("Folding Knives") },
  { name: "Viking Knives", img: IMG.vikingSeax, blurb: "Rune-carved norse steel", filter: inCat("Viking Knives") },
  { name: "Skinner Knives", img: IMG.skinner, blurb: "Bone-handle field skinners", filter: inCat("Skinner Knives") },
  { name: "Sword", img: IMG.swordFull, blurb: "Fullered blades, leather grips", filter: inCat("Sword") },
  { name: "Viking Axe", img: IMG.axeSet1, blurb: "Bearded axes & round shields", filter: inCat("Viking Axe") },
  { name: "Chef Knives", img: IMG.chefSet, blurb: "Handmade for the kitchen", filter: inCat("Chef Knives") },
  { name: "Pocket Knives", img: IMG.pocketKnife, blurb: "Small & antler grips", filter: inCat("Pocket Knives") },
  { name: "Damascus Steel", img: IMG.damascusClose, blurb: "Layered, pattern-welded", filter: hasWord("damascus") },
  { name: "EDC Carry", img: IMG.edcDuo, blurb: "Daily pocket companions", filter: inIds("knife-edc", "knife-pocket", "knife-woodfold", "knife-sheath") },
  { name: "Hunting & Camp", img: IMG.rusticTwine, blurb: "Fixed blades for the wild", filter: inIds("knife-rustic", "knife-fieldset", "knife-antler") },
  { name: "Kitchen Tools", img: IMG.chefSingle, blurb: "Blades & appliances", filter: (p) => p.category === "Chef Knives" || p.id === "airfryer" },
  { name: "Beauty", img: IMG.lipstickRow, blurb: "Lips, skin & self-care", filter: inCat("Beauty") },
  { name: "Home & Living", img: IMG.sofaCushions, blurb: "Comfort, styled", filter: inCat("Home") },
  { name: "Furniture", img: IMG.loungeSet, blurb: "Seats & statement pieces", filter: inIds("sofa", "armchair", "loungeset") },
  { name: "Grocery", img: IMG.veggieBox, blurb: "Fresh from the farm", filter: inCat("Grocery") },
  { name: "Sports", img: IMG.dumbbellPair, blurb: "Gear for every goal", filter: inCat("Sports") },
  { name: "Gift Sets", img: IMG.fieldSet, blurb: "Bundles worth giving", filter: inIds("chef-set-5", "knife-fieldset", "velvet", "chef-duo") },
  { name: "Collectibles", img: IMG.craftColorful, blurb: "One-of-a-kind makers' work", filter: inIds("knife-heritage", "knife-artisan", "knife-craft") },
  { name: "New Arrivals", img: IMG.chefBalance, blurb: "Fresh off the anvil", filter: inIds("chef-balance", "knife-artisan", "knife-edc", "chef-cleaver", "knife-fieldset", "knife-craft", "knife-sheath", "velvet") },
];

export const tileCount = (t: CategoryTile) => products.filter(t.filter).length;

export const featuredProducts = products.filter((p) => ["viking-axe-set", "handmade-sword", "skinner-knife", "viking-seax"].includes(p.id));
export const bestSellers = products.filter((p) => ["chef-set-5", "knife-heritage", "knife-pocket", "airfryer", "sofa"].includes(p.id));

export const testimonials = [
  {
    name: "Emily Johnson",
    role: "Verified Buyer",
    rating: 5,
    text: "Great products, fast delivery, and excellent customer service. Forge Of Ash is my go-to shopping destination!",
    avatar: IMG.avatarEmily,
  },
  {
    name: "Marcus Reed",
    role: "Verified Buyer",
    rating: 5,
    text: "The flash deals are unreal — grabbed a smartwatch at 40% off and it arrived in two days. Absolutely hooked!",
    avatar: IMG.avatarMarcus,
  },
  {
    name: "Daniel Okafor",
    role: "Verified Buyer",
    rating: 4,
    text: "Clean app, honest prices, and returns are painless. The summer collection banner sold me instantly.",
    avatar: IMG.avatarDaniel,
  },
];

export const brandBanners = {
  summer: { title: "Summer Collection", line1: "Up to 50% Off", line2: "On Knives & Accessories", img: IMG.summerWoman, category: "Folding Knives" as CategoryName },
  home: { title: "Home Essentials For Better Living", line1: "Up to 40% Off", line2: "On Home & Kitchen", img: IMG.sofaCushions, category: "Home" as CategoryName },
};

export const flashDeal = { id: "smartwatch", price: 149.99, oldPrice: 249.99, img: IMG.smartwatch };

/* ------------------------- maker + materials intelligence ------------------------- */
export type Maker = { name: string; years: number; place: string; img: string; line: string };

export const MAKERS: Record<string, Maker> = {
  default: { name: "Ash Rourke", years: 23, place: "Forge Of Ash, Coal Room", img: IMG.teamAsh, line: "Third-generation smith. Every billet that leaves this anvil carries his stamp." },
  chef: { name: "Mira Solis", years: 11, place: "Forge Of Ash, Finishing Bench", img: IMG.teamMira, line: "Runs the daily heat and balances every kitchen blade on a fingertip before it ships." },
  edge: { name: "Kael Brandt", years: 8, place: "Forge Of Ash, Sharpening Room", img: IMG.teamKael, line: "The last hands a blade meets — hones every edge to shaving sharp." },
};

export const makerFor = (p: Product): Maker =>
  p.category === "Chef Knives" ? MAKERS.chef : p.category === "Beauty" || p.category === "Home" ? MAKERS.edge : MAKERS.default;

export type SpecSheet = { label: string; value: string }[];

const CAT_SPECS: Partial<Record<CategoryName, SpecSheet>> = {
  "Folding Knives": [
    { label: "Steel", value: "67-layer damascus / 1095" },
    { label: "Hardness", value: "58–60 HRC" },
    { label: "Handle", value: "Horn or hardwood" },
    { label: "Tang", value: "Folder mechanism" },
    { label: "Blade", value: "2.8–3.6 in" },
    { label: "Overall", value: "7–8 in open" },
    { label: "Weight", value: "90–140 g" },
    { label: "Edge", value: "Compound, 18–20°" },
  ],
  "Pocket Knives": [
    { label: "Steel", value: "High-carbon 1095" },
    { label: "Hardness", value: "57–58 HRC" },
    { label: "Handle", value: "Deer antler, jute wrap" },
    { label: "Tang", value: "Full tang" },
    { label: "Blade", value: "2.2 in" },
    { label: "Overall", value: "5.5 in" },
    { label: "Weight", value: "60 g" },
    { label: "Edge", value: "Saber, 22°" },
  ],
  "Chef Knives": [
    { label: "Steel", value: "Hammered damascus" },
    { label: "Hardness", value: "58 HRC" },
    { label: "Handle", value: "Twisted steel / wood" },
    { label: "Tang", value: "Full tang" },
    { label: "Blade", value: "3–8 in" },
    { label: "Overall", value: "up to 13 in" },
    { label: "Weight", value: "1.9 kg (set)" },
    { label: "Edge", value: "15° per side" },
  ],
  "Viking Axe": [
    { label: "Steel", value: "Hand-forged 1095" },
    { label: "Hardness", value: "55 HRC" },
    { label: "Handle", value: "Shaped ash haft, leather" },
    { label: "Shield", value: "Linden core, rawhide rim" },
    { label: "Axe head", value: "7 in bearded" },
    { label: "Overall", value: "24 in haft · 24 in shield" },
    { label: "Weight", value: "2.6 kg (set)" },
    { label: "Edge", value: "25°, sharpened" },
  ],
  Sword: [
    { label: "Steel", value: "High-carbon, hand-forged" },
    { label: "Hardness", value: "50–52 HRC spring temper" },
    { label: "Handle", value: "Stacked leather, steel pommel" },
    { label: "Tang", value: "Full tang, peened" },
    { label: "Blade", value: "32 in, fullered" },
    { label: "Overall", value: "38 in" },
    { label: "Weight", value: "1.2 kg" },
    { label: "Edge", value: "25°, sharpened" },
  ],
  "Skinner Knives": [
    { label: "Steel", value: "High-carbon, forge-textured" },
    { label: "Hardness", value: "57–58 HRC" },
    { label: "Handle", value: "Pinned bone, natural grain" },
    { label: "Tang", value: "Full tang" },
    { label: "Blade", value: "4.5 in drop point" },
    { label: "Overall", value: "9 in" },
    { label: "Weight", value: "180 g" },
    { label: "Edge", value: "Convex, 20°" },
  ],
  "Viking Knives": [
    { label: "Steel", value: "Hammered damascus, rune-etched" },
    { label: "Hardness", value: "58–60 HRC" },
    { label: "Handle", value: "Carved bone, elder futhark" },
    { label: "Tang", value: "Hidden tang, pinned" },
    { label: "Blade", value: "5.5 in" },
    { label: "Overall", value: "10 in" },
    { label: "Weight", value: "210 g" },
    { label: "Edge", value: "Scandi, 20°" },
  ],
};

const SPEC_OVERRIDES: Record<string, SpecSheet> = {
  "knife-heritage": [
    { label: "Steel", value: "67-layer damascus" },
    { label: "Hardness", value: "60 HRC" },
    { label: "Handle", value: "Black buffalo horn" },
    { label: "Tang", value: "Slipjoint folder" },
    { label: "Blade", value: "3.5 in" },
    { label: "Overall", value: "8 in open" },
    { label: "Weight", value: "120 g" },
    { label: "Edge", value: "Compound, 18°" },
  ],
};

export const specsFor = (p: Product): SpecSheet => SPEC_OVERRIDES[p.id] ?? CAT_SPECS[p.category] ?? CAT_SPECS["Folding Knives"]!;

export const CARE = [
  { title: "Oil after use", text: "A drop of food-safe oil on the blade keeps carbon steel bright and rust-free." },
  { title: "Hone, don't grind", text: "A few passes on a 1000-grit stone restores the edge; save the coarse stones for repairs." },
  { title: "Store dry & sheathed", text: "Keep it in its sheath away from humidity — bone and horn breathe with the seasons." },
];
