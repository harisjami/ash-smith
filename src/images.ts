/* ============================================================================
   🖼️  ALL SITE IMAGES LIVE IN THIS ONE FILE
   ----------------------------------------------------------------------------
   Every stock photo also exists as a real file in  public/images/  — open that
   folder to browse or replace any of them with your own shots (same file name).

   The site tries the LOCAL file first; if a host doesn't have it, it quietly
   falls back to the original web copy — so images can never break again.

   HOW TO USE YOUR OWN PHOTO:
   1. Drop it into  public/images/  with the same name (e.g. chefSingle.jpg)
   2. Done — it loads automatically.
   3. LOGO: just replace  public/images/logo.png  and every logo updates.
   ========================================================================== */

// Original web copies — used only as a safety net when a local file is absent.
const w650 = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=650`;
const w200 = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200`;
const portrait = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800`;

const REMOTE = {
  /* product & category photos */
  rusticTwine: w650(18268059),
  woodFolder: w650(18268034),
  chefSingle: w650(16457332),
  chefDuo: w650(16457340),
  chefCleaver: w650(16457318),
  chefBalance: w650(16468221),
  lipstickTrio: w650(90269),
  lipstickRow: w650(7810600),
  lipstickMarble: w650(4889718),
  armchair: w650(6078545),
  sofa: w650(11295890),
  loungeSet: w650(2079246),
  airFryer: w650(29461935),
  veggieBox: w650(37083826),
  greens: w650(5709305),
  dumbbell: w650(38721839),
  dumbbellPair: w650(669580),
  damascusClose: w650(20392664),
  skinnerStump: w650(36341540),
  skinnerSheath: w650(14903002),
  swordFull: w650(6414384),
  swordOrnate: w650(37403766),
  swordHilt: w650(31350049),
  craftColorful: w650(12749402),
  fieldSet: w650(12749403),
  engravingBench: w650(33508936),
  edcDuo: w650(33508946),
  sofaCushions: w650(6958126),
  summerWoman: w650(1408978),
  smartwatch: w650(9142237),
  axeWarrior: w650(38415448),
  axeShields: w650(5023698),
  axeArmory: w650(37310701),
  /* people */
  avatarEmily: w200(7717254),
  avatarMarcus: w200(804009),
  avatarDaniel: w200(14950779),
  reviewerSofia: w200(36593090),
  teamAsh: portrait(14391923),
  teamMira: portrait(38197025),
  teamDario: portrait(9527896),
  teamElena: portrait(36177188),
  teamKael: portrait(10812247),
} as const;

// Local-first: the app asks for public/images/<name>.jpg …
export const IMG = {
  logo: "images/logo.png",
  heroPodium: "images/hero-podium.png",
  pocketKnife: "images/pocket-knife.png",
  pocketKnifeGrip: "images/pocket-knife-grip.png",
  chefSet: "images/chef-set.png",
  chefHandles: "images/chef-handles.png",
  knifeHero: "images/knife-hero.png",
  knifeFolded: "images/knife-folded.png",
  vikingSeax: "images/viking-seax.png",
  skinner: "images/skinner-1.png",
  ...Object.fromEntries(Object.keys(REMOTE).map((k) => [k, `images/${k}.jpg`])),
} as Record<string, string>;

// …and if that file is missing on the host, swap in the web copy.
export const IMG_FALLBACK: Record<string, string> = Object.fromEntries(
  Object.entries(REMOTE).map(([k, url]) => [`images/${k}.jpg`, url]),
);
