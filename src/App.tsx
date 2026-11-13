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
import { CustomPageView, CustomHomeSections } from './components/CustomPageView';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ShopPage } from './components/ShopPage';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { ReviewModal } from './components/ReviewModal';
import { VoiceConcierge } from './components/VoiceConcierge';
import { AdminPortal } from './components/AdminPortal';
import { RecipeGuidePage } from './components/RecipeGuidePage';

const StorefrontContent: React.FC = () => {
  const { currentView, activePageSlug, activeProductId, siteCopy } = useShop();

  useEffect(() => {
    if (currentView === 'admin') return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.bajoz-seamless-section')
    );

    if (typeof IntersectionObserver === 'undefined') {
      sections.forEach((el) => el.classList.add('section-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('section-hidden');
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.08,
      }
    );

    sections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('section-visible');
      } else {
        el.classList.add('section-hidden');
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [currentView, activePageSlug, activeProductId]);

  if (currentView === 'admin') {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EBC8] text-[#5A4E38] overflow-x-hidden">
      {/* Slim Dismissible Top Utility & Announcement Strip */}
      <AnnouncementBar />

      {/* 1. Navbar */}
      <Header />

      {/* Main Content, Product Detail Page, Shop Page, Recipe Guide Page, or Dedicated Custom Page */}
      <main
        key={activeProductId || activePageSlug || 'home'}
        className="flex-1 bajoz-fade-in"
      >
        {activeProductId ? (
          <ProductDetailPage />
        ) : activePageSlug === 'guide' ? (
          <RecipeGuidePage />
        ) : activePageSlug === 'shop' ? (
          <ShopPage />
        ) : activePageSlug ? (
          <CustomPageView />
        ) : (
          <>
            {/* 2. Hero Section + 3. Credibility Banner */}
            <Hero />

            {/* 4. Product Showcases (SpiceMix, Homemade Panjeeri, Tooth Guardian) */}
            <FeaturedProducts />

            {/* 5. Customer Reviews */}
            <TestimonialsSection />

            {/* 6. About Us */}
            <HomepageConversionSections />

            {/* Optional Custom CMS Sections */}
            <CustomHomeSections />

            {/* 7. Frequently Asked Questions + Final Conversion CTA */}
            <FaqSection />
          </>
        )}
      </main>

      {/* Pre-Footer Important Notice Section — Styled in Signature BAJOZ Card & Pill Design */}
      <section
        aria-label="Important Notice"
        className="bg-[#F5EBC8] py-8 sm:py-10 bajoz-seamless-section"
      >
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] px-5 py-4 sm:px-7 sm:py-5 flex flex-col md:flex-row items-start md:items-center gap-3.5 sm:gap-5 text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold tracking-tight shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#40563D] shrink-0" />
              <span>
                {(siteCopy.disclaimerBadge || 'Important Notice').replace(/:$/, '')}
              </span>
            </span>
            <p className="text-xs sm:text-sm lg:text-base font-medium text-[#2C221E] leading-relaxed">
              {siteCopy.disclaimerText ||
                'The products and information presented on this website are purely traditional foods and natural remedies for everyday routines and are not medical advice. None of these statements or products are intended to diagnose, treat, cure, or prevent any disease.'}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Interactive Drawers & Modals */}
      <CartDrawer />
      <FavoritesDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <CustomerAccountModal />
      <ReviewModal />
      <VoiceConcierge />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <StorefrontContent />
    </ShopProvider>
  );
}

