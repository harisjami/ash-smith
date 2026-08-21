import { AnimatePresence, motion } from "framer-motion";
import { ShopProvider, routeKey, useShop } from "./shop";
import TopChrome from "./components/TopChrome";
import Hero from "./components/Hero";
import { FeaturedProducts, PopularCategories } from "./components/Catalog";
import { BestSellers, BrandBanners, KnifeSpotlight } from "./components/Showcase";
import CollectionCarousel from "./components/CollectionCarousel";
import NewArrivals from "./components/NewArrivals";
import ChefCarousel from "./components/ChefCarousel";
import ClientBest, { ClientBestBento } from "./components/ClientBest";
import FlashSale from "./components/FlashSale";
import MakingProcess from "./components/MakingProcess";
import { Newsletter, Testimonials } from "./components/Social";
import TeamCarousel from "./components/TeamCarousel";
import BottomNav from "./components/BottomNav";
import MenuDrawer from "./components/MenuDrawer";
import ProductPage from "./components/ProductPage";
import CategoryPage from "./components/CategoryPage";
import { CartPage, WishlistPage } from "./components/BagPages";
import { CustomKnifeTeaser } from "./components/CustomKnife";
import CustomKnifePage from "./components/CustomKnife";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider } from "./auth";
import AccountPage from "./components/AccountPage";

function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 hidden md:block">
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#161618] to-[#0a0a0a]" />
      <div className="ambient-grid absolute inset-0" />
      <div className="absolute left-[18%] top-[16%] h-72 w-72 rounded-full bg-zinc-500/15 blur-[110px]" />
      <div className="absolute bottom-[12%] right-[16%] h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />
      <p className="font-display absolute left-1/2 top-8 w-full -translate-x-1/2 text-center text-[13px] font-semibold tracking-[0.35em] text-blue-200/40 uppercase">
        Forge Of Ash · Hand-Forged Blades
      </p>
    </div>
  );
}

function HomeView() {
  return (
    <>
      <main className="pb-28 pt-[76px]">
        <Hero />
        <PopularCategories />
        <FeaturedProducts />
        <FlashSale />
        <ClientBest />
        <KnifeSpotlight />
        <CollectionCarousel />
        <NewArrivals />
        <BrandBanners />
        <BestSellers />
        <ClientBestBento />
        <ChefCarousel />
        <MakingProcess />
        <CustomKnifeTeaser />
        <Testimonials />
        <TeamCarousel />
        <Newsletter />
      </main>
    </>
  );
}

function Shell() {
  const { route } = useShop();
  return (
    <>
      <AmbientBackdrop />
      <TopChrome />
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-clip bg-[#f6f7fb] shadow-2xl shadow-black/50">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={routeKey(route)}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {route.name === "home" && <HomeView />}
            {route.name === "product" && <ProductPage id={route.id} />}
            {route.name === "category" && <CategoryPage cat={route.cat} />}
            {route.name === "cart" && <CartPage />}
            {route.name === "wishlist" && <WishlistPage />}
            {route.name === "custom" && <CustomKnifePage />}
            {route.name === "account" && <AccountPage />}
          </motion.div>
        </AnimatePresence>
        <BottomNav />
      </div>
      <MenuDrawer />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ShopProvider>
          <Shell />
        </ShopProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
