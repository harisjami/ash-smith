import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShopProvider, routeKey, useShop } from "./shop";
import TopChrome from "./components/TopChrome";
import Hero from "./components/Hero";
import Stories from "./components/Stories";
import { FeaturedProducts } from "./components/Catalog";
import CategoryMosaic from "./components/CategoryMosaic";
import PopularRail from "./components/PopularRail";
import { BestSellers, BrandBanners, KnifeSpotlight } from "./components/Showcase";
import CollectionCarousel from "./components/CollectionCarousel";
import NewArrivals from "./components/NewArrivals";
import ChefCarousel from "./components/ChefCarousel";
import ClientBest, { ClientBestBento } from "./components/ClientBest";
import FlashSale from "./components/FlashSale";
import PopularCollections from "./components/PopularCollections";
import MakingProcess from "./components/MakingProcess";
import { Newsletter, Testimonials } from "./components/Social";
import TeamCarousel from "./components/TeamCarousel";
import FaqSection from "./components/FaqSection";
import BottomNav from "./components/BottomNav";
import MenuDrawer from "./components/MenuDrawer";
import ProductPage from "./components/ProductPage";
import CategoryPage from "./components/CategoryPage";
import { CartPage, WishlistPage } from "./components/BagPages";
import { CustomKnifeTeaser } from "./components/CustomKnife";
import ReviewWall from "./components/ReviewWall";
import CustomKnifePage from "./components/CustomKnife";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider } from "./auth";
import AccountPage from "./components/AccountPage";
import CategoriesPage from "./components/CategoriesPage";
import AdminPage from "./components/AdminPage";
import { CHANGE_EVENT } from "./store";

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
        <Stories />
        <Hero />
        <CategoryMosaic />
        <FeaturedProducts />
        <PopularRail />
        <FlashSale />
        <PopularCollections />
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
        <ReviewWall />
        <Testimonials />
        <TeamCarousel />
        <FaqSection />
        <Newsletter />
      </main>
    </>
  );
}

function Shell() {
  const { route } = useShop();
  // re-render the whole shop whenever the portal adds/removes/hides listings
  const [, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(CHANGE_EVENT, bump);
    return () => window.removeEventListener(CHANGE_EVENT, bump);
  }, []);
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
            {route.name === "categories" && <CategoriesPage />}
            {route.name === "admin" && <AdminPage />}
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
