/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const STORY_PILLARS = [
  {
    title: 'Pure Ancestral Ingredients Without Hidden Shortcuts',
    bullets: [
      'Slow-roasted in 100% pure grass-fed Desi Ghee daily.',
      'Preserved naturally in cold-pressed mustard oil without chemicals.',
      'Loaded with whole Californian almonds, cashews, and pistachios.',
      'Sweetened gently with unrefined shakkar instead of white sugar.',
      'Zero palm oil, synthetic preservatives, or artificial food colors.',
    ],
  },
  {
    title: 'Homemade Tradition Without Weekend Kitchen Exhaustion',
    bullets: [
      'Skip hours of cleaning, peeling, and roasting fifteen ingredients.',
      'Cook ghar-jaisa Karahi, Pulao, and Daal in fifteen minutes.',
      'Enjoy ready-to-eat Desi Ghee Panjeeri straight from the jar.',
      'Supports new mothers, working parents, students, and elders daily.',
      'Fresh-sealed in airtight jars for effortless pantry storage.',
    ],
  },
  {
    title: '100% Radical Ingredient Honesty on Every Jar',
    bullets: [
      'Every nut, seed, spice, and botanical is listed openly.',
      'Zero water fillers so you only pay for real nutrition.',
      'Handcrafted in small batches in Model Town, Lahore.',
      '100% natural homemade mineral and botanical oral care.',
      'Delivered nationwide across Pakistan with Cash on Delivery.',
    ],
  },
];

export const OurStoryPage: React.FC = () => {
  const {
    siteCopy,
    products,
    setActivePageSlug,
    setActiveProductId,
  } = useShop();

  const publishedProducts = products.filter((p) => p.isPublished !== false);

  const handleShopProducts = () => {
    setActivePageSlug(null);
    setActiveProductId(null);
    setTimeout(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleBackHome = () => {
    setActivePageSlug(null);
    setActiveProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F5EBC8] bajoz-grain-canvas text-[#5A4E38] min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#F9F5E9]/80 border-b border-[#E6DDC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#40563D] hover:text-[#5A4E38] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <nav aria-label="Breadcrumb" className="text-xs text-[#786C57] truncate">
            <span
              onClick={handleBackHome}
              className="hover:text-[#40563D] cursor-pointer"
            >
              Home
            </span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-[#5A4E38]">Our Story</span>
          </nav>
        </div>
      </div>

      {/* =====================================================================
          1. OUR STORY HERO — "A Little of Home, in Every Day"
          ===================================================================== */}
      <section
        id="about-us"
        className="py-12 sm:py-16 lg:py-20 bg-[#F9F5E9] bajoz-seamless-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            {/* LEFT COLUMN: ABOUT BAJOZ Story & CTA */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
                {siteCopy.craftKicker || 'Our Story · About BAJOZ'}
              </p>

              <h1 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B] leading-tight">
                {siteCopy.craftHeading || 'A Little of Home, in Every Day'}
              </h1>

              {siteCopy.craftParagraphs && siteCopy.craftParagraphs.length > 0 ? (
                siteCopy.craftParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-[#5A4E38] leading-relaxed"
                  >
                    {para}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-sm sm:text-base text-[#5A4E38] leading-relaxed">
                    <strong>BAJOZ — The House of Naturals</strong> started with one promise: bring back the pure, slow-roasted foods and natural oral care our families grew up trusting — ready for your busy routine.
                  </p>

                  <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
                    Whether it is pure Desi Ghee Panjeeri, 15-minute SpiceMix (no onion), or natural homemade Tooth Guardian, every jar is small-batch crafted with full ingredient transparency.
                  </p>
                </>
              )}

              <p className="font-serif text-lg italic text-[#40563D] leading-relaxed">
                Real ingredients. Zero shortcuts. Warmth you can taste in every spoonful.
              </p>

              <div className="pt-2 sm:pt-3 flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
                <button
                  type="button"
                  onClick={handleShopProducts}
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  <span>Shop Our Products</span>
                  <ArrowRight className="w-4 h-4 text-[#F9F5E9]" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Brand Heritage Studio Visual (Open Layout) */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div className="flex items-start sm:items-center justify-between gap-3 border-b border-[#40563D]/20 pb-3.5 sm:pb-4">
                <div className="min-w-0">
                  <span className="text-[10px] xs:text-[11px] font-bold uppercase tracking-widest text-[#40563D] block">
                    Rooted in Tradition · Made for Today
                  </span>
                  <h2 className="font-serif text-xl xs:text-2xl font-bold text-[#5A4E38] leading-snug mt-0.5">
                    BAJOZ — The House of Naturals
                  </h2>
                </div>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#C98A6A] shrink-0 mt-0.5 sm:mt-0" />
              </div>

              <div className="aspect-4/3 sm:aspect-16/10 p-4 sm:p-6 flex items-center justify-center">
                <ProductImage
                  type="panjeeri"
                  productId="panjeeri"
                  className="w-full h-full max-h-[200px] sm:max-h-[240px] object-contain"
                  alt="BAJOZ Artisanal Heritage"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#40563D]/20">
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#5A4E38] block">
                    Traditional
                  </span>
                  <span className="text-xs text-[#5A4E38]/80">
                    Foods &amp; Natural Care
                  </span>
                </div>
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#5A4E38] block">
                    Thoughtful
                  </span>
                  <span className="text-xs text-[#5A4E38]/80">
                    Clear Product Details
                  </span>
                </div>
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#5A4E38] block">
                    Everyday
                  </span>
                  <span className="text-xs text-[#5A4E38]/80">
                    Made for Modern Homes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smooth Wave Transition out of #F9F5E9 into #F5EBC8 */}
      <div className="bg-[#F9F5E9] w-full overflow-hidden leading-none pointer-events-none select-none -mb-1">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 lg:h-16"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C420,-15 960,95 1440,25 L1440,90 L0,90 Z"
            fill="#F5EBC8"
          />
        </svg>
      </div>

      {/* =====================================================================
          2. OUR HOUSE STANDARDS — 3 Crisp Open Bullet-Driven Pillars
          ===================================================================== */}
      <section className="py-10 sm:py-14 lg:py-18 bajoz-seamless-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
              Why We Built BAJOZ
            </p>
            <h2 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B]">
              The Standards We Never Compromise On
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:divide-x divide-[#5A4E38]/15">
            {STORY_PILLARS.map((pillar, idx) => (
              <article
                key={pillar.title}
                className={`flex flex-col justify-between ${
                  idx > 0 ? 'lg:pl-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-[#5A4E38]/15' : ''
                }`}
              >
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#5A4E38] leading-snug pb-4 border-b border-[#5A4E38]/15">
                  {pillar.title}
                </h3>
                <ul className="mt-4 space-y-2.5 flex-1">
                  {pillar.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#5A4E38] leading-snug"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#40563D] text-[#F9F5E9] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="bajoz-soft-divider" aria-hidden="true" />

      {/* =====================================================================
          3. EXPLORE OUR THREE FOUNDING CREATIONS (Open Layout, Price: N/A)
          ===================================================================== */}
      <section className="py-10 sm:py-14 lg:py-18 bajoz-seamless-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
              From Our Kitchen to Yours
            </p>
            <h2 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B]">
              Meet Our Three Household Essentials
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {publishedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setActivePageSlug(null);
                  setActiveProductId(product.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group pb-6 border-b border-[#5A4E38]/15 flex flex-col justify-between cursor-pointer transition-all"
              >
                <div>
                  <div className="aspect-square p-5 flex items-center justify-center mb-4">
                    <ProductImage
                      type={product.imageType}
                      productId={product.id}
                      customImageUrl={product.customImageUrl}
                      className="w-full h-full max-h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
                      alt={product.name}
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#5A4E38] group-hover:text-[#40563D] transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-serif text-lg font-bold text-[#40563D] shrink-0">
                      Price: N/A
                    </span>
                  </div>
                  <p className="text-xs text-[#786C57] mt-1">Size: N/A</p>
                  <p className="text-xs text-[#786C57] mt-2 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#5A4E38]/15 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#40563D]">
                  <span>View Full Details &amp; Benefits</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Trust Strip */}
          <div className="pt-8 border-t border-[#5A4E38]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#DCE7C9] flex items-center justify-center shrink-0 text-[#40563D]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#40563D]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Handcrafted in Model Town, Lahore · Shipped Nationwide</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl font-semibold text-[#5A4E38]">
                  Ready to bring pure, homemade goodness back to your table?
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShopProducts}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer shrink-0"
            >
              <span>Browse All Products</span>
              <ArrowRight className="w-4 h-4 text-[#F9F5E9]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
