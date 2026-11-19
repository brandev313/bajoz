/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { Product } from '../types/shop';
import { WaveDivider } from './WaveDivider';
import {
  ArrowRight,
  Check,
} from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const {
    products,
    addToCart,
    setActiveProductId,
    setActivePageSlug,
    setIsCheckoutOpen,
  } = useShop();

  const publishedProducts = products.filter((p) => p.isPublished);

  const orderedProducts = [...publishedProducts].sort((a, b) => {
    const order: Record<string, number> = {
      spicemix: 1,
      panjeeri: 2,
      toothpowder: 3,
    };
    return (order[a.id] ?? 99) - (order[b.id] ?? 99);
  });

  const handleOrderNow = (product: Product) => {
    const defaultVar =
      product.id !== 'spicemix' && product.variants?.[0]?.id
        ? product.variants[0].id
        : 'default';
    const defaultPack = product.packSizes?.[0]?.id || 'default';
    addToCart(product, defaultVar, defaultPack, 1);
    setIsCheckoutOpen(true);
  };

  const companyPillars = [
    {
      title: '100% Natural, Zero Shortcuts',
      copy: 'Pure whole spices, dairy desi ghee, nuts, and botanicals—never any preservatives, artificial colors, or hidden fillers.',
    },
    {
      title: 'Hours Saved, Ghar-Jaisa Taste Kept',
      copy: 'Skip peeling, grinding, and slow-roasting while keeping the exact warmth and depth of Nani and Amma’s kitchen.',
    },
    {
      title: 'Tailored for Modern Households',
      copy: 'Ready straight from the jar for busy parents, working professionals, and families who value pure everyday nutrition.',
    },
  ];

  return (
    <div id="collection" className="scroll-mt-20">
      {/* =====================================================================
          1. COMPANY INTRODUCTION — BAJOZ Brand Positioning & Core USP
          Warm Cream (#F2EBD0) Canvas with Editorial Surface Card
          ===================================================================== */}
      <section
        id="about-bajoz-intro"
        aria-label="About BAJOZ Company Introduction"
        className="py-20 sm:py-28 lg:py-32 bg-[#F2EBD0] text-[#40563D] relative bajoz-seamless-section"
      >
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-5xl mx-auto rounded-[1.75rem] bg-[#FAF9F4] border-2 border-[#5A4E38] px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 space-y-10 shadow-[0_18px_46px_-26px_rgba(64,86,61,0.18)]">
            {/* Editorial Header + 3-Line USP & Target Audience Positioning */}
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <p className="bajoz-subheadline text-xs sm:text-sm uppercase tracking-[0.14em] text-[#5A4E38]">
                Meet BAJOZ · The House of Naturals
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#40563D] leading-tight text-balance">
                Ancestral Purity, Engineered for Modern Everyday Living
              </h2>
              <p className="text-sm sm:text-base lg:text-[17px] text-[#40563D]/90 leading-relaxed">
                BAJOZ preserves Nani and Amma’s heirloom Pakistani recipes in 100% natural, freshly crafted jars with zero preservatives, artificial colors, or chemicals. Unlike chemical-laden supermarket mixes or hours of exhausting kitchen prep, our ready-to-use SpiceMix, pure Desi Ghee Panjeeri, and botanical Tooth Powder deliver authentic homemade taste and nourishment in seconds. For busy families, working professionals, and anyone refusing to compromise on purity, BAJOZ is the simplest, most trustworthy everyday solution.
              </p>
            </div>

            {/* 3 Clean Hairline-Separated USP Proof Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#5A4E38]/20">
              {companyPillars.map((pillar) => (
                <div key={pillar.title} className="space-y-2 text-left">
                  <p className="bajoz-subheadline text-sm sm:text-[15px] text-[#40563D] flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#DCE7C9] text-[#40563D] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                    </span>
                    <span>{pillar.title}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-[#5A4E38] leading-relaxed pl-6">
                    {pillar.copy}
                  </p>
                </div>
              ))}
            </div>

            {/* Quiet Navigation Link to Full Story */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveProductId(null);
                  setActivePageSlug('our-story');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 min-h-[44px] px-7 py-3 rounded-lg bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-extrabold uppercase tracking-[0.08em] transition-all duration-150 cursor-pointer"
              >
                <span>Read Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#F2EBD0" toColor="#FAF9F4" strokeColor="#5A4E38" />

      {/* =====================================================================
          2. CLEAN EDITORIAL PRODUCT SPOTLIGHT ROWS (Detailed Specs & Recipes)
          ===================================================================== */}
      <section
        aria-label="Detailed Product Specifications"
        className="py-18 sm:py-24 lg:py-28 bg-[#FAF9F4] text-[#40563D] bajoz-seamless-section"
      >
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-12 sm:space-y-16 lg:space-y-20">
          {orderedProducts.map((product, index) => {
            const isSpiceMix = product.id === 'spicemix';
            const isPanjeeri = product.id === 'panjeeri';
            const isReversedLayout = isPanjeeri || index % 2 === 1;

            const kickerText = isSpiceMix
              ? "Pakistan's 1st All-in-One Cooking Paste"
              : isPanjeeri
              ? 'Tasty, Crunchy, Nut-Rich'
              : 'Natural, Chemical-Free, Non-Abrasive';

            const headingText = isSpiceMix
              ? 'SPICEMIX'
              : isPanjeeri
              ? 'HomeMade Panjeeri'
              : 'Tooth Guardian';

            const formulaText = isSpiceMix
              ? 'All Basic Spices + Garam Masala + Ginger + Garlic'
              : isPanjeeri
              ? 'Premium Nuts + 4 Gondain + 4 Maghaz + Pure Desi Ghee'
              : 'Alum + Cloves + Natural Salts + Tree Bark Powders';

            const descriptionText = isSpiceMix
              ? 'The right blend of subcontinental spices, garlic, and ginger. Skip peeling, grinding, and standing over the stove—cook any traditional Pakistani dish in minutes.'
              : isPanjeeri
              ? 'Ancestral recipe of premium nuts, four gond, four maghaz, and base flour slow-roasted in pure dairy desi ghee so you enjoy traditional wellness effortlessly.'
              : 'Homemade tooth cleaning and care powder packed with natural minerals and botanicals so your family keeps teeth and gums clean naturally.';

            const bulletItems = isSpiceMix
              ? [
                  '100% Homemade Blend of Spices, Ginger & Garlic (No Onion)',
                  'Best For: Busy Moms, Working Professionals & Everyday Handi',
                  'No Preservatives, Chemicals or Colors · 6-Month Shelf Life',
                  'Sizes: 250 gm, 450 gm, 950 gm',
                ]
              : isPanjeeri
              ? [
                  'Khandani Recipe with Almonds, Cashews, Pistachios & 4 Gondain',
                  'Flavours: Suji, Alsi, Daal Moong · Pure Dairy Desi Ghee',
                  'No Preservatives, Chemicals or Colors · 6-Month Shelf Life',
                  'Sizes: 250 gm, 450 gm, 950 gm',
                ]
              : [
                  'Khandani Recipe: Alum, Cloves, Natural Salts & Tree Barks',
                  'Traditional Ancestral Oral Care Routine (Non-Medicated)',
                  'No Synthetic Chemicals, Colors or Preservatives',
                  'Sizes: 40 gm, 80 gm',
                ];

            return (
              <div
                key={product.id}
                id={`product-detail-${product.id}`}
                className="rounded-2xl bg-[#FAF9F4] border-2 border-[#5A4E38] p-6 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center"
              >
                {/* Image Column */}
                <div
                  className={`lg:col-span-5 ${
                    isReversedLayout ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div
                    onClick={() => setActiveProductId(product.id)}
                    className="aspect-[4/3] w-full rounded-xl bg-[#F2EBD0] border border-[#5A4E38] overflow-hidden cursor-pointer group"
                  >
                    <ProductImage
                      type={product.imageType}
                      productId={product.id}
                      customImageUrl={product.customImageUrl}
                      fit="cover"
                      className="w-full h-full transition-transform duration-500 group-hover:scale-103"
                      alt={product.name}
                    />
                  </div>
                </div>

                {/* Copy & Spec Column */}
                <div
                  className={`lg:col-span-7 space-y-5 text-left ${
                    isReversedLayout ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded bg-[#DCE7C9] font-dm text-[11px] font-bold tracking-[0.04em] text-[#40563D]">
                      {kickerText}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#40563D]">
                      {headingText}
                    </h3>
                    <p className="inline-block px-3 py-1 rounded bg-[#E9F390] font-dm text-xs font-bold text-[#40563D]">
                      {formulaText}
                    </p>
                  </div>

                  <p className="font-dm text-sm sm:text-base text-[#40563D]/90 leading-relaxed">
                    {descriptionText}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {bulletItems.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2 font-dm text-xs sm:text-sm text-[#40563D]"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#DCE7C9] text-[#40563D] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleOrderNow(product)}
                      className="min-h-[46px] px-7 py-3 rounded-lg bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer"
                    >
                      Order Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveProductId(product.id)}
                      className="min-h-[46px] px-6 py-3 rounded-lg bg-[#F2EBD0] hover:bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38] font-dm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Full Details
                    </button>
                    {isSpiceMix && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProductId(null);
                          setActivePageSlug('guide');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-h-[44px] px-3 py-2.5 font-dm text-xs font-bold text-[#5A4E38] hover:text-[#40563D] underline underline-offset-4 cursor-pointer"
                      >
                        3-Step Recipe Guide →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <WaveDivider fromColor="#FAF9F4" toColor="#F2EBD0" strokeColor="#5A4E38" />
    </div>
  );
};
