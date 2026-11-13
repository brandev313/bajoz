/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { WaveDivider } from './WaveDivider';
import { Check, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types/shop';

interface ProductShowcaseSectionConfig {
  anchorId: string;
  scriptKicker: string;
  sectionHeading: string;
  sectionSubheading: string;
  sectionBgClass: string;
  sectionBgHex: string;
  platterInnerBgClass: string;
  nextWaveFillHex: string;
  headingColorClass: string;
  subheadingColorClass: string;
  description: string;
  bullets: string[];
  imagePosition: 'left' | 'right';
  bodyTextColorClass: string;
  bulletBadgeBgClass: string;
  bulletBadgeTextClass: string;
  secondaryBtnClass: string;
  secondaryBtnIconClass: string;
  primaryBtnClass: string;
}

export const FeaturedProducts: React.FC = () => {
  const {
    products,
    addToCart,
    setIsCheckoutOpen,
    setActiveProductId,
    setActivePageSlug,
  } = useShop();
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});

  const publishedProducts = products.filter((p) => p.isPublished);

  // Order products to match the PDF wireframe sequence:
  // 1. SpiceMix- All-in-One Cooking Paste (#F9F5E9 Soft Ivory)
  // 2. Homemade Panjeeri (#FFFDF9 Pure White Cream)
  // 3. Tooth Guardian (#F5EBC8 Heritage Cream)
  const orderedProducts = [...publishedProducts].sort((a, b) => {
    const orderMap: Record<string, number> = {
      spicemix: 1,
      panjeeri: 2,
      toothpowder: 3,
    };
    const rankA = orderMap[a.id] ?? 99;
    const rankB = orderMap[b.id] ?? 99;
    return rankA - rankB;
  });

  const handleOrderNow = (product: Product) => {
    const defaultVariantId =
      product.id !== 'spicemix' && product.variants?.[0]?.id
        ? product.variants[0].id
        : 'default';
    const defaultPackId = product.packSizes?.[0]?.id || 'default';
    addToCart(product, defaultVariantId, defaultPackId, 1);
    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
    setIsCheckoutOpen(true);
  };

  const getSectionConfig = (
    product: Product,
    idx: number
  ): ProductShowcaseSectionConfig => {
    if (product.id === 'spicemix') {
      // PALETTE THEME 1 (SpiceMix): Soft Ivory (#F9F5E9) — Image LEFT, Content RIGHT
      return {
        anchorId: 'spicemix-showcase',
        scriptKicker: "Pakistan's 1st All-in-One Cooking Paste",
        sectionHeading: 'SPICEMIX',
        sectionSubheading: 'All Basic Spices + Garam Masala + Ginger + Garlic = SPICEMIX',
        sectionBgClass: 'bg-[#F9F5E9]',
        sectionBgHex: '#F9F5E9',
        platterInnerBgClass: 'bg-[#FFFDF9]',
        nextWaveFillHex: '#FFFDF9',
        headingColorClass: 'text-[#4A2E1B]',
        subheadingColorClass: 'text-[#40563D]',
        description:
          'The Right Blend of All sub-continental Spices, Garlic and Ginger. Skip peeling, grinding and long standing by cooking any sub-continental food item with BAJOZ’ ready-to-use, all-purpose cooking paste.',
        bullets: [
          '100% Homemade Blend of Spices, Ginger, & Garlic',
          'Ingredients: All Baisc Spices, Garam Masala, Ginger, Garlic.',
          'Best For: Working Women, Gen Z Mothers, Busy Moms, Chefs, High-Quality & Proven Cooking Shortcut Lovers.',
          'No Preservatives, Chemicals or Colors',
          'Made-to-Order, Delivered Fresh',
          'Shelf-Life: 6 Months',
          'Sizes: 250 gm, 450 gm, 950 gm',
          'One SpiceMix Jar Makes All Pakistani Dishes',
        ],
        imagePosition: 'left',
        bodyTextColorClass: 'text-[#5A4E38]',
        bulletBadgeBgClass: 'bg-[#40563D]',
        bulletBadgeTextClass: 'text-[#F9F5E9]',
        secondaryBtnClass:
          'bg-[#FFFDF9] hover:bg-[#E9F399] text-[#4A2E1B] border border-[#40563D]/35',
        secondaryBtnIconClass: 'text-[#40563D]',
        primaryBtnClass: 'bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9]',
      };
    }

    if (product.id === 'panjeeri') {
      // PALETTE THEME 2 (Panjeeri): Pure White Cream (#FFFDF9) — Content LEFT, Image RIGHT
      return {
        anchorId: 'panjeeri-showcase',
        scriptKicker: 'Delicious, Traditional Panjeeri',
        sectionHeading: 'PANJEERI',
        sectionSubheading:
          'Premium Nuts + 4 Gondain + 4 Maghaz + Pure Desi Ghee + Base Flour = PANJEERI',
        sectionBgClass: 'bg-[#FFFDF9]',
        sectionBgHex: '#FFFDF9',
        platterInnerBgClass: 'bg-[#F9F5E9]',
        nextWaveFillHex: '#F5EBC8',
        headingColorClass: 'text-[#4A2E1B]',
        subheadingColorClass: 'text-[#40563D]',
        description:
          'Ancestral recipie and proportion of premium nuts, four gond, four maghaz, and base flour- slow-roasted in dairy-sourced pure desi ghee so that you embrace traditional wellness without compromising on quality, and your time.',
        bullets: [
          'Khandani Recipe, Proportion and Making Process',
          'Includes All Premium Nuts, 4 Gondain, 4 Maghaz',
          'Best for: Post-Partum Mothers, Working Women, Taditional Wellness Lovers, Elders.',
          'Flavours: Suji, Alsi, Daal Moong',
          'No Preservatives, Chemicals or Colors',
          'Made-to-Order, Delivered Fresh',
          'Shelf-Life: 6 Months',
          'Sizes: 250 gm, 450 gm, 950 gm',
        ],
        imagePosition: 'right',
        bodyTextColorClass: 'text-[#5A4E38]',
        bulletBadgeBgClass: 'bg-[#40563D]',
        bulletBadgeTextClass: 'text-[#F9F5E9]',
        secondaryBtnClass:
          'bg-[#F9F5E9] hover:bg-[#E9F399] text-[#4A2E1B] border border-[#40563D]/35',
        secondaryBtnIconClass: 'text-[#40563D]',
        primaryBtnClass: 'bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9]',
      };
    }

    // PALETTE THEME 3 (Tooth Guardian): Heritage Cream (#F5EBC8) — Image LEFT, Content RIGHT
    return {
      anchorId: 'toothpowder-showcase',
      scriptKicker: 'Best Tooth Powder in Pakistan',
      sectionHeading: 'Tooth Guardian',
      sectionSubheading:
        'Alum + Cloves + Salts + Tree Bark Powders = TOOTH GUARDIAN',
      sectionBgClass: 'bg-[#F5EBC8]',
      sectionBgHex: '#F5EBC8',
      platterInnerBgClass: 'bg-[#F9F5E9]',
      nextWaveFillHex: '#F9F5E9',
      headingColorClass: 'text-[#4A2E1B]',
      subheadingColorClass: 'text-[#40563D]',
      description:
        'Homemade tooth cleaning and care powder packed with natural, and premium minerals so that you and your family keep your teeth and gums clean, and healthy with our ancestral oral care routine product.',
      bullets: [
        'Khandani Recipe, Proportion and Making Process',
        'Ingredients: Alum, Cloves, Tree Barks.',
        'Best for: Teeth Cleaning, Gum Swelling & Bleeding, Overall Mouth Cleaning & Freshness.',
        'Disclaimer: This is remedial product used by our ancestor and not a medicated products',
        'No Synthatic Chemcials, Colors or Preservatives',
        'Made-to-Order, Delivered Fresh',
        'Shelf-Life: 6 Months',
        'Sizes: 40 gm, 80 gm',
      ],
      imagePosition: idx % 2 === 0 ? 'left' : 'right',
      bodyTextColorClass: 'text-[#5A4E38]',
      bulletBadgeBgClass: 'bg-[#40563D]',
      bulletBadgeTextClass: 'text-[#F9F5E9]',
      secondaryBtnClass:
        'bg-[#F9F5E9] hover:bg-[#E9F399] text-[#4A2E1B] border border-[#40563D]/35',
      secondaryBtnIconClass: 'text-[#40563D]',
      primaryBtnClass: 'bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9]',
    };
  };

  return (
    <div id="collection" className="scroll-mt-20">
      {/* =====================================================================
          OUR PRODUCTS — Full-Width Product Sections
          Using ONLY #F9F5E9, Pure White Cream (#FFFDF9), and #F5EBC8:
          1. SpiceMix- All-in-One Cooking Paste (#F9F5E9 Soft Ivory, Image Left)
          2. Homemade Panjeeri (#FFFDF9 Pure White Cream, Content Left / Image Right)
          3. Tooth Guardian (#F5EBC8 Heritage Cream, Image Left)
          ===================================================================== */}
      {orderedProducts.map((product, idx) => {
        const config = getSectionConfig(product, idx);
        const isAdded = addedFeedback[product.id];
        const isImageLeft = config.imagePosition === 'left';

        return (
          <React.Fragment key={`showcase-${product.id}`}>
            <section
              id={config.anchorId}
              className={`py-20 sm:py-28 lg:py-36 ${config.sectionBgClass} transition-colors duration-300 bajoz-seamless-section scroll-mt-20`}
            >
              <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-14 sm:space-y-20 lg:space-y-24">
                {/* Centered Product Kicker, Heading & Formula Subheading */}
                <div className="text-center max-w-5xl mx-auto space-y-4">
                  <p
                    className={`bajoz-script-kicker text-2xl sm:text-3xl lg:text-4xl ${config.subheadingColorClass}`}
                  >
                    {config.scriptKicker}
                  </p>
                  <h2
                    className={`bajoz-poster-display text-3xl sm:text-5xl lg:text-6xl ${config.headingColorClass}`}
                  >
                    {config.sectionHeading}
                  </h2>
                  <p
                    className={`font-serif italic text-lg sm:text-2xl lg:text-3xl font-semibold pt-2 ${config.subheadingColorClass}`}
                  >
                    {config.sectionSubheading}
                  </p>
                </div>

                {/* Open 2-Column Full-Width Split Showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-18 xl:gap-24 items-center">
                  {/* PRODUCT SHOWCASE COLUMN — Single Straight Rounded Card (No Double Card Tilt) */}
                  <div
                    className={`lg:col-span-6 relative flex flex-col items-center justify-center py-2 sm:py-4 ${
                      isImageLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
                    }`}
                  >
                    <div
                      onClick={() => setActiveProductId(product.id)}
                      className="relative z-10 w-full max-w-[420px] sm:max-w-[500px] lg:max-w-[540px] aspect-square rounded-[2rem] bg-[#B4CBA2] border-[1.5px] border-[#7A5C38] overflow-hidden flex items-center justify-center cursor-pointer group"
                    >
                      <ProductImage
                        type={product.imageType}
                        productId={product.id}
                        customImageUrl={product.customImageUrl}
                        fit="cover"
                        className="w-full h-full transition-transform duration-500 group-hover:scale-103"
                        alt={config.sectionHeading}
                      />
                    </div>
                  </div>

                  {/* CONTENT COLUMN (Outlined Feature Container + Pill & Circular Arrow CTAs) */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8 ${
                      isImageLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
                    }`}
                  >
                    <div className="space-y-6">
                      {/* Lead Description Paragraph */}
                      <p className="text-base sm:text-lg lg:text-xl leading-relaxed font-medium max-w-2xl text-[#2C221E]">
                        {config.description}
                      </p>

                      {/* Outlined Box for the 8 Bullet Points */}
                      <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 sm:p-8 space-y-4">
                        <ul className="space-y-3">
                          {config.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-3 text-sm sm:text-base font-medium leading-relaxed text-[#2C221E]"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Action Buttons Inside Outlined Box: Order Now Pill + Circular Arrow | View Product */}
                        <div className="pt-3 flex flex-wrap items-center gap-4">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOrderNow(product)}
                              className="px-7 sm:px-9 py-3.5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                            >
                              {isAdded ? 'Added — Opening Checkout' : 'Order Now'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOrderNow(product)}
                              aria-label={`Order ${product.name}`}
                              className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-transform duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                            >
                              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveProductId(product.id)}
                            className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full bg-[#FFFDF9] hover:bg-[#E9F399]/60 text-[#2C221E] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                          >
                            <span>View Product</span>
                          </button>

                          {product.id === 'spicemix' && (
                            <a
                              href="/guide"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveProductId(null);
                                setActivePageSlug('guide');
                              }}
                              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#FAF9F7] hover:text-[#5A4E38] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-bold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                            >
                              <span>3-Step Recipe Guide</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seamless Sweeping Wave Transition into Next Section */}
            <WaveDivider
              fromColor={config.sectionBgHex}
              toColor={config.nextWaveFillHex}
              flip={idx % 2 === 0}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
