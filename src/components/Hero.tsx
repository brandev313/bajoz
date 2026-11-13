/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { WaveDivider } from './WaveDivider';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

const HERO_BULLET_PRODUCTS = [
  { id: 'panjeeri', label: 'Panjeeri' },
  { id: 'spicemix', label: 'SpiceMix' },
  { id: 'toothpowder', label: 'Tooth Guardian' },
];

const CREDIBILITY_STATS = [
  { value: '100%', label: 'Natural Products' },
  { value: '500+', label: 'Happy Customers' },
  { value: '5+', label: 'Years of Legacy' },
  { value: '100%', label: 'Homemade Food Items' },
];

export const Hero: React.FC = () => {
  const { products, settings, setActiveProductId, setActivePageSlug } = useShop();
  const [activeIndex, setActiveIndex] = useState(0);

  const publishedProducts = products.filter((p) => p.isPublished);
  const displayList = publishedProducts.length > 0 ? publishedProducts : products;
  const activeProduct =
    displayList[activeIndex % Math.max(1, displayList.length)] || displayList[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayList.length);
  };

  const handleViewProducts = () => {
    setActiveProductId(null);
    setActivePageSlug('shop');
  };

  const cleanWhatsapp = (settings.whatsappNumber || '923154388166').replace(/\D/g, '');
  const whatsappOrderUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    settings.whatsappGreeting ||
      'Assalam-o-Alaikum BAJOZ — The House of Naturals! I would like to place an order.'
  )}`;

  if (!activeProduct) return null;

  return (
    <div id="top" className="relative bg-[#F5EBC8] overflow-hidden">
      {/* =====================================================================
          1. HERO SECTION — Full-Width Split Stage Matching PDF Wireframe & Reference Border Style
          ===================================================================== */}
      <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
            {/* LEFT COLUMN: Exact Hero Wireframe & Copy from PDF */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5 sm:space-y-6 order-1">
              <div className="space-y-4 sm:space-y-5">
                {/* Top Eyebrow Pill Badge */}
                <div className="inline-flex items-center px-5 py-2 rounded-full bg-[#E9F399] border-[1.5px] border-[#7A5C38] text-sm sm:text-base font-extrabold text-[#40563D] tracking-tight">
                  #1 Traditional Pakistani Foods Brand
                </div>

                {/* Main Headline */}
                <h1
                  className="bajoz-poster-display text-[#40563D] tracking-tight capitalize"
                  style={{ fontSize: 'clamp(2rem, 3.35vw, 3.4rem)', lineHeight: 1.08 }}
                >
                  Bring Traditional Goodness Into Modern Routines, Without The Hours Of Prep Or The Compromise On Quality
                </h1>

                {/* Description Paragraph */}
                <p className="text-base sm:text-lg text-[#2C221E] leading-relaxed max-w-2xl font-medium">
                  If you value familiar tastes, traditional ingredients and homemade care, you’re in the right place. BAJOZ is made for modern households that refuse to let desi things fade away.
                </p>

                {/* Outlined Product Range Box */}
                <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-4 sm:p-5 space-y-2.5">
                  <p className="text-base sm:text-lg font-extrabold text-[#40563D]">
                    Our homemade products range includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5 text-base sm:text-lg font-semibold text-[#2C221E]">
                    {HERO_BULLET_PRODUCTS.map((item) => (
                      <li key={item.id} className="marker:text-[#40563D]">
                        <button
                          type="button"
                          onClick={() => setActiveProductId(item.id)}
                          className="text-left hover:text-[#40563D] hover:underline transition-colors duration-150 cursor-pointer font-bold"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 2 CTA Buttons with Signature Pill + Circular Arrow Style */}
              <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-5">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleViewProducts}
                    className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                  >
                    View All Products
                  </button>
                  <button
                    type="button"
                    onClick={handleViewProducts}
                    aria-label="View All Products"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-transform duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                  </button>
                </div>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#F9F5E9] hover:bg-[#E9F399] text-[#2C221E] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5 text-[#40563D]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Top-Aligned Single Clean Straight Rounded Product Carousel Card */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-start self-start pt-0 order-2">
              <div
                key={activeProduct.id}
                onClick={() => setActiveProductId(activeProduct.id)}
                className="relative z-10 w-full max-w-[380px] sm:max-w-[450px] lg:max-w-[480px] xl:max-w-[500px] aspect-square rounded-[2rem] bg-[#B4CBA2] border-[1.5px] border-[#7A5C38] overflow-hidden flex items-center justify-center cursor-pointer group bajoz-fade-in"
              >
                <ProductImage
                  type={activeProduct.imageType}
                  productId={activeProduct.id}
                  customImageUrl={activeProduct.customImageUrl}
                  fit="cover"
                  className="w-full h-full transition-transform duration-500 group-hover:scale-103"
                  alt="BAJOZ Homemade Product"
                />

                {/* Left & Right Carousel Arrows Inside the Card Stage */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous product"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F9F5E9]/95 hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-colors duration-150 cursor-pointer z-20"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.25]" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next product"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F9F5E9]/95 hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-colors duration-150 cursor-pointer z-20"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.25]" />
                </button>
              </div>

              {/* Clean Slide Dots Below Card */}
              <div className="mt-3.5 flex items-center gap-2.5 z-10">
                {displayList.map((prod, idx) => {
                  const isCurrent = idx === activeIndex % displayList.length;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2.5 rounded-full border border-[#7A5C38] transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'w-8 bg-[#E9F399]'
                          : 'w-2.5 bg-[#F9F5E9] hover:bg-[#E9F399]/60'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CREDIBILITY BANNER / STATS STRIP (Outlined Box Style)
          ===================================================================== */}
      <section
        aria-label="BAJOZ Credibility Banner"
        className="relative z-10 py-8 sm:py-12 lg:py-16"
      >
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {CREDIBILITY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center text-center"
              >
                <span className="bajoz-poster-display text-4xl sm:text-5xl lg:text-6xl text-[#40563D] tabular-nums">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm sm:text-base lg:text-lg font-bold text-[#2C221E]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seamless Wavy Ending Transition from Hero (#F5EBC8) into First Product Section (#F9F5E9 SpiceMix) */}
      <WaveDivider fromColor="#F5EBC8" toColor="#F9F5E9" />
    </div>
  );
};
