/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { WaveDivider } from './WaveDivider';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  HeartHandshake,
  ShieldCheck,
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
      'Handcrafted in small batches at 3 Km, Defence Road, Lahore, Pakistan.',
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
    setActivePageSlug('shop');
    setActiveProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    setActivePageSlug(null);
    setActiveProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F2EBD0] text-[#40563D] min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#FAF9F4] pt-12 sm:pt-14 pb-3">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackHome}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md font-dm text-sm sm:text-[15px] font-semibold text-[#40563D] hover:bg-[#5A4E38] hover:text-[#F2EBD0] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <nav aria-label="Breadcrumb" className="font-dm text-sm sm:text-[15px] text-[#5A4E38] truncate flex items-center gap-2">
            <button
              type="button"
              onClick={handleBackHome}
              className="hover:bg-[#5A4E38] hover:text-[#F2EBD0] cursor-pointer"
            >
              Home
            </button>
            <span className="text-[#5A4E38]/60">/</span>
            <span className="font-bold text-[#40563D]">Our Story</span>
          </nav>
        </div>
      </div>

      {/* =====================================================================
          1. OUR STORY HERO — Heritage Cream (#F2EBD0)
          ===================================================================== */}
      <section
        id="about-us"
        className="pt-10 pb-18 sm:pt-14 sm:pb-24 lg:pb-30 bg-[#FAF9F4] bajoz-seamless-section"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-14 lg:gap-18 items-center">
            {/* LEFT COLUMN: ABOUT BAJOZ Story & CTA */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7">
              <p className="font-serif italic text-2xl sm:text-3xl text-[#5A4E38]">
                {siteCopy.craftKicker || 'Our Story · About BAJOZ'}
              </p>

              <h1 className="font-h1 text-3xl sm:text-4xl lg:text-5xl font-medium text-[#40563D] leading-tight">
                {siteCopy.craftHeading || 'A Little of Home, in Every Day'}
              </h1>

              <div className="rounded-[1.5rem] bg-[#FAF9F4] border border-[#5A4E38] px-7 py-7 sm:px-9 sm:py-9 space-y-4 shadow-[0_12px_30px_-12px_rgba(64,86,61,0.1)]">
                {siteCopy.craftParagraphs && siteCopy.craftParagraphs.length > 0 ? (
                  siteCopy.craftParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className="font-sans text-sm sm:text-base text-[#40563D] leading-relaxed"
                    >
                      {para}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="font-sans text-sm sm:text-base text-[#40563D] leading-relaxed">
                      <strong>BAJOZ — The House of Naturals</strong> started with one promise: bring back the pure, slow-roasted foods and natural oral care our families grew up trusting — ready for your busy routine.
                    </p>

                    <p className="font-sans text-sm sm:text-base text-[#40563D] leading-relaxed">
                      Whether it is pure Desi Ghee Panjeeri, 15-minute SpiceMix (no onion), or natural homemade Tooth Guardian, every jar is freshly crafted with full ingredient transparency.
                    </p>
                  </>
                )}

                <p className="font-serif italic text-xl font-bold text-[#5A4E38] leading-relaxed pt-1">
                  Real ingredients. Zero shortcuts. Warmth you can taste in every spoonful.
                </p>
              </div>

              {/* PDP 'Buy Now' Style CTA */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleShopProducts}
                    className="px-7 py-3.5 rounded-full bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-serif text-base sm:text-lg font-extrabold tracking-tight transition-all duration-150 cursor-pointer whitespace-nowrap"
                  >
                    Shop Our Products
                  </button>
                  <button
                    type="button"
                    onClick={handleShopProducts}
                    aria-label="Shop Our Products"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] border border-[#40563D] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Brand Heritage Studio Visual */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 rounded-[1.75rem] bg-[#F2EBD0] border border-[#5A4E38] px-7 py-8 sm:px-10 sm:py-10 shadow-[0_14px_34px_-12px_rgba(64,86,61,0.12)]">
              <div className="flex items-start sm:items-center justify-between gap-3 border-b border-[#5A4E38]/25 pb-4">
                <div className="min-w-0">
                  <span className="font-dm text-[10px] xs:text-[11px] font-bold uppercase tracking-widest text-[#5A4E38] block">
                    Rooted in Tradition · Made for Today
                  </span>
                  <h2 className="font-serif text-xl xs:text-2xl font-bold text-[#40563D] leading-snug mt-0.5">
                    BAJOZ — The House of Naturals
                  </h2>
                </div>
                <span className="font-dm text-xs font-bold uppercase tracking-[0.12em] text-[#5A4E38] shrink-0">
                  Est. Lahore
                </span>
              </div>

              {/* Product Image Card — Pure White Cream (#FAF9F4) Background */}
              <div className="aspect-4/3 sm:aspect-16/10 p-5 sm:p-7 flex items-center justify-center rounded-2xl bg-[#FAF9F4] border border-[#5A4E38]">
                <ProductImage
                  type="panjeeri"
                  productId="panjeeri"
                  className="w-full h-full max-h-[200px] sm:max-h-[240px] object-contain"
                  alt="BAJOZ Artisanal Heritage"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#5A4E38]/25">
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#40563D] block">
                    Traditional
                  </span>
                  <span className="font-dm text-xs text-[#5A4E38]">
                    Foods &amp; Natural Care
                  </span>
                </div>
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#40563D] block">
                    Thoughtful
                  </span>
                  <span className="font-dm text-xs text-[#5A4E38]">
                    Clear Product Details
                  </span>
                </div>
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#40563D] block">
                    Everyday
                  </span>
                  <span className="font-dm text-xs text-[#5A4E38]">
                    Made for Modern Homes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#FAF9F4" toColor="#F2EBD0" strokeColor="#5A4E38" />

      {/* =====================================================================
          2. OUR HOUSE STANDARDS — Primary Warm Alabaster Canvas (#F2EBD0)
          ===================================================================== */}
      <section className="py-18 sm:py-24 lg:py-30 bg-[#F2EBD0] text-[#40563D] bajoz-seamless-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="font-serif italic text-2xl sm:text-3xl text-[#5A4E38]">
              Why We Built BAJOZ
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#40563D]">
              The Standards We Never Compromise On
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {STORY_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[1.5rem] bg-[#F2EBD0] border border-[#5A4E38] px-7 py-8 sm:px-9 sm:py-9 flex flex-col justify-between shadow-[0_12px_30px_-12px_rgba(64,86,61,0.1)]"
              >
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D] leading-snug pb-4 border-b border-[#5A4E38]/25">
                  {pillar.title}
                </h3>
                <ul className="mt-4 divide-y divide-[#5A4E38]/20 flex-1">
                  {pillar.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="py-2.5 flex items-start gap-2 font-sans text-xs sm:text-sm font-medium text-[#40563D] leading-snug"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#DCE7C9] text-[#40563D] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.75]" />
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

      <WaveDivider fromColor="#F2EBD0" toColor="#FAF9F4" flip strokeColor="#5A4E38" />

      {/* =====================================================================
          3. EXPLORE OUR THREE FOUNDING CREATIONS (#FAF9F4 Pure White Cream)
          ===================================================================== */}
      <section className="py-18 sm:py-24 lg:py-30 bg-[#FAF9F4] text-[#40563D] bajoz-seamless-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="font-serif italic text-2xl sm:text-3xl text-[#5A4E38]">
              From Our Kitchen to Yours
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#40563D]">
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
                className="group rounded-[1.5rem] bg-[#F2EBD0] text-[#40563D] border border-[#5A4E38] px-7 py-7 flex flex-col justify-between cursor-pointer transition-all shadow-[0_12px_30px_-12px_rgba(64,86,61,0.12)] hover:-translate-y-0.5"
              >
                <div>
                  {/* Product Image Card — Pure White Cream (#FAF9F4) Background */}
                  <div className="aspect-square rounded-2xl bg-[#FAF9F4] border border-[#5A4E38] p-5 flex items-center justify-center mb-4">
                    <ProductImage
                      type={product.imageType}
                      productId={product.id}
                      customImageUrl={product.customImageUrl}
                      className="w-full h-full max-h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
                      alt={product.name}
                    />
                  </div>
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#DCE7C9] text-[#40563D] font-dm text-[10px] font-bold tracking-[0.04em]">
                      {product.id === 'panjeeri'
                        ? 'Tasty, Crunchy, Nut-Rich'
                        : product.id === 'spicemix'
                        ? "Pakistan's 1st All-in-One Cooking Paste"
                        : product.id === 'toothpowder'
                        ? 'Natural, Chemical-Free, Non-Abrasive'
                        : product.category}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D] group-hover:text-[#5A4E38] transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-dm text-sm font-bold text-[#40563D] shrink-0">
                      Price: N/A
                    </span>
                  </div>
                  <p className="font-dm text-xs text-[#5A4E38] mt-1">Size: N/A</p>
                  <p className="font-sans text-xs text-[#40563D] mt-2 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                {/* PDP 'Buy Now' Style CTA inside Card */}
                <div className="pt-5 mt-4 border-t border-[#5A4E38]/25">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="px-5 py-2.5 rounded-full bg-[#E9F390] group-hover:bg-[#40563D] text-[#40563D] group-hover:text-[#F2EBD0] border border-[#40563D] shadow-[3px_3px_0px_#40563D] group-hover:shadow-none font-serif text-sm font-extrabold tracking-tight transition-all duration-150">
                      View Full Details
                    </span>
                    <span className="w-10 h-10 rounded-full bg-[#40563D] group-hover:bg-[#E9F390] text-[#F2EBD0] group-hover:text-[#40563D] border border-[#40563D] flex items-center justify-center shrink-0 transition-all duration-150">
                      <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Trust Strip */}
          <div className="rounded-3xl bg-[#F2EBD0] border-[1.5px] border-[#5A4E38] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#DCE7C9] border border-[#5A4E38] flex items-center justify-center shrink-0 text-[#40563D]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-dm text-xs font-bold uppercase tracking-wider text-[#5A4E38]">
                  <ShieldCheck className="w-4 h-4 text-[#40563D]" />
                  <span>Handcrafted at 3 Km, Defence Road, Lahore, Pakistan · Shipped Nationwide</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D]">
                  Ready to bring pure, homemade goodness back to your table?
                </h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleShopProducts}
                className="px-7 py-3.5 rounded-full bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-serif text-base sm:text-lg font-extrabold tracking-tight transition-all duration-150 cursor-pointer whitespace-nowrap"
              >
                Browse All Products
              </button>
              <button
                type="button"
                onClick={handleShopProducts}
                aria-label="Browse All Products"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] border border-[#40563D] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
              >
                <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider
        fromColor="#FAF9F4"
        toColor="#F2EBD0"
        strokeColor="#5A4E38"
      />
    </div>
  );
};
