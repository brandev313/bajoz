/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { TestimonialsSection } from './components/TestimonialsSection';
import { HomepageConversionSections } from './components/HomepageConversionSections';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPortal } from './components/AdminPortal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CustomPageView, CustomHomeSections } from './components/CustomPageView';
import { OurStoryPage } from './components/OurStoryPage';
import { ShopPage } from './components/ShopPage';
import { RecipeGuidePage } from './components/RecipeGuidePage';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { VoiceConcierge } from './components/VoiceConcierge';
import { WaveDivider } from './components/WaveDivider';

const StorefrontContent: React.FC = () => {
  const {
    activeProductId,
    activePageSlug,
    currentView,
    setCurrentView,
    siteCopy,
  } = useShop();

  const showAdmin = currentView === 'admin';

  // Smooth scroll-triggered section reveal transitions
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.bajoz-seamless-section')
    );
    if (sections.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      sections.forEach((sec) => sec.classList.add('section-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            entry.target.classList.remove('section-hidden');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -4% 0px',
        threshold: 0.04,
      }
    );

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        sec.classList.add('section-visible');
        sec.classList.remove('section-hidden');
      } else {
        sec.classList.add('section-hidden');
        observer.observe(sec);
      }
    });

    return () => observer.disconnect();
  }, [activeProductId, activePageSlug, showAdmin]);

  if (showAdmin) {
    return <AdminPortal />;
  }

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col bg-[#F2EBD0] text-[#40563D] font-sans"
    >
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {activeProductId ? (
          <ProductDetailPage />
        ) : activePageSlug === 'shop' ? (
          <ShopPage />
        ) : activePageSlug === 'guide' ? (
          <RecipeGuidePage />
        ) : activePageSlug === 'our-story' ? (
          <OurStoryPage />
        ) : activePageSlug ? (
          <CustomPageView />
        ) : (
          <>
            {/* 1. Minimal DTC Hero Banner (#F2EBD0) + Forest Olive Credibility Bar (#40563D) */}
            <Hero />

            {/* 2. Signature Best Sellers Grid & Detailed Collections (#F2EBD0) */}
            <FeaturedProducts />

            {/* 3. Radial Pillars + Shop By Needs + 4-Step Routine + About BAJOZ */}
            <HomepageConversionSections />

            {/* 4. Custom Homepage Sections (Admin-created) */}
            <CustomHomeSections />

            {/* 5. Customer Reviews Grid */}
            <TestimonialsSection />

            {/* 6. Minimal FAQs & Conversion Banner */}
            <FaqSection />
          </>
        )}

        {/* Pre-Footer Important Notice Strip — Warm Cream (#F2EBD0) */}
        <section
          aria-label="Important Notice"
          className="relative bg-[#F2EBD0] text-[#40563D] py-14 sm:py-18 lg:py-20 bajoz-seamless-section"
        >
          <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16">
            <div className="max-w-4xl mx-auto rounded-2xl bg-[#FAF9F4] border-2 border-[#5A4E38] px-6 py-7 sm:px-10 sm:py-9 text-center space-y-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#DCE7C9] text-[#40563D] font-dm text-[11px] font-bold uppercase tracking-[0.14em]">
                {siteCopy.disclaimerBadge || 'Important Notice'}
              </span>
              <p className="font-dm text-xs sm:text-sm text-[#40563D]/90 leading-relaxed max-w-3xl mx-auto">
                {siteCopy.disclaimerText ||
                  'All BAJOZ products are 100% natural, homemade food and botanical oral-care preparations crafted from traditional recipes. Product information on this website is for general informational purposes and is not intended as medical advice or to diagnose, treat, cure, or prevent any disease. Please review the full ingredient list for potential allergens before ordering. All sales are final — no returns or refunds.'}
              </p>
            </div>
          </div>
        </section>

        {/* Postage-Stamp Scalloped Divider curving upward into Forest Olive (#40563D) Footer */}
        <WaveDivider
          fromColor="#F2EBD0"
          toColor="#40563D"
          flip
          strokeColor="none"
        />
      </main>
      <Footer onOpenAdmin={() => setCurrentView('admin')} />
      <CartDrawer />
      <FavoritesDrawer />
      <CheckoutModal />
      <CustomerAccountModal />
      <OrderTrackingModal />
      <ProductDetailModal />
      <ReviewModal />
      <VoiceConcierge />
      <FloatingWhatsApp />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <StorefrontContent />
    </ShopProvider>
  );
}

export default App;
