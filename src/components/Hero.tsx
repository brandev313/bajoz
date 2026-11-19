/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { WaveDivider } from './WaveDivider';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Leaf,
  Truck,
  Sparkles,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    products,
    settings,
    siteCopy,
    setActiveProductId,
    setActivePageSlug,
  } = useShop();

  const publishedProducts = products.filter((p) => p.isPublished);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides =
    publishedProducts.length > 0
      ? publishedProducts.map((p) => ({
          id: p.id,
          name: p.id === 'panjeeri' ? 'HomeMade Panjeeri' : p.name,
          tag:
            p.id === 'panjeeri'
              ? 'Tasty, Crunchy, Nut-Rich'
              : p.id === 'spicemix'
              ? "Pakistan's 1st All-in-One Cooking Paste"
              : p.id === 'toothpowder'
              ? 'Natural, Chemical-Free, Non-Abrasive'
              : p.category,
          imageType: p.imageType,
          customImageUrl: p.customImageUrl,
        }))
      : [
          {
            id: 'spicemix',
            name: 'All-in-1 SpiceMix Paste',
            tag: "Pakistan's 1st All-in-One Cooking Paste",
            imageType: 'spicemix' as const,
            customImageUrl: '',
          },
          {
            id: 'panjeeri',
            name: 'HomeMade Panjeeri',
            tag: 'Tasty, Crunchy, Nut-Rich',
            imageType: 'panjeeri' as const,
            customImageUrl: '',
          },
          {
            id: 'toothpowder',
            name: 'Tooth Guardian Powder',
            tag: 'Natural, Chemical-Free, Non-Abrasive',
            imageType: 'toothpowder' as const,
            customImageUrl: '',
          },
        ];

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length, isPaused]);

  const currentSlide = slides[activeSlideIdx % slides.length] || slides[0];

  const handlePrevSlide = () => {
    setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setActiveSlideIdx((prev) => (prev + 1) % slides.length);
  };

  const cleanWhatsapp = (settings.whatsappNumber || '923154388166').replace(
    /\D/g,
    ''
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Assalam-o-Alaikum BAJOZ — The House of Naturals! I would like to place an order.'
  )}`;

  const heroBrandBadge =
    siteCopy.heroKickers?.[0]?.trim() || 'Best Traditional Pakistani Foods Brand';
  const heroTitle =
    siteCopy.heroHeadline?.trim() || 'BAJOZ- The House Of Naturals';
  const heroSubheadline =
    siteCopy.heroSubheadline?.trim() ||
    'A Hub of Ancestral, Natural, Easy-to-Use Goodness for Modern Living';
  const heroDescription =
    siteCopy.heroDescription?.trim() ||
    "Reclaim the benefits of things your mothers and grandmother used to make without the hours of kitchen prep and losing the taste of home. Bajoz makes natural, and ready-to-use food items with our Nani and Amma's recipes tailored for modern living.";
  const heroPrimaryCta =
    siteCopy.heroViewProductsCta?.trim() || 'View All Products';

  const heroProductRange = [
    { label: 'SpiceMix', productId: 'spicemix' },
    { label: 'Panjeeri', productId: 'panjeeri' },
    { label: 'Tooth Powder', productId: 'toothpowder' },
  ];

  const credibilityStripItems = [
    { icon: Leaf, text: '100% Natural Ingredients' },
    { icon: Sparkles, text: 'Freshly Crafted in Lahore' },
    { icon: ShieldCheck, text: 'Zero Preservatives or Colors' },
    { icon: Truck, text: 'Nationwide Cash on Delivery' },
    { icon: CheckCircle2, text: 'Best Traditional Pakistani Foods Brand' },
  ];

  return (
    <>
      {/* =====================================================================
          HERO BANNER — Editorial Warm Cream (#F2EBD0) Brand Showcase
          ===================================================================== */}
      <section className="relative overflow-hidden bg-[#F2EBD0] text-[#40563D]">
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">
            {/* LEFT COLUMN: Brand Recognition + H1 Title + DM Sans Bold Sub-Headline + Description + Product Range + Primary CTA */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left max-w-2xl lg:max-w-none">
              {/* Brand Distinction Bar */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#FAF9F4] border border-[#5A4E38] shadow-2xs">
                <div className="flex items-center gap-0.5 text-[#5A4E38]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-dm text-[11px] font-bold uppercase tracking-[0.08em] text-[#40563D]">
                  {heroBrandBadge}
                </span>
              </div>

              {/* Editorial H1 Title + DM Sans Bold Sub-Headline */}
              <div className="space-y-4">
                <h1 className="font-h1 text-[2.25rem] sm:text-5xl lg:text-[3.5rem] font-semibold text-[#40563D] leading-[1.08] tracking-tight text-balance">
                  {heroTitle}
                </h1>
                <p className="bajoz-subheadline w-full max-w-xl text-base sm:text-lg lg:text-[1.2rem] text-[#5A4E38] leading-snug">
                  {heroSubheadline}
                </p>
              </div>

              {/* Brand Story Description */}
              <div className="w-full max-w-xl">
                <p className="w-full text-sm sm:text-base text-[#40563D]/90 leading-relaxed">
                  {heroDescription}
                </p>
              </div>

              {/* Homemade Product Range — Simple Checkmark Bullet Points in White Box */}
              <div className="w-full max-w-xl rounded-2xl bg-[#FAF9F4] border-2 border-[#5A4E38] shadow-[4px_4px_0px_#5A4E38] p-5 sm:p-6 space-y-3.5">
                <p className="bajoz-subheadline text-sm sm:text-[15px] text-[#40563D]">
                  Our homemade product range includes:
                </p>

                <ul className="space-y-2.5">
                  {heroProductRange.map((item) => {
                    const isPreviewed =
                      slides[activeSlideIdx % slides.length]?.id === item.productId;
                    return (
                      <li key={item.productId} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-[#DCE7C9] text-[#40563D] flex items-center justify-center shrink-0 mt-1">
                          <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                        </span>
                        <button
                          type="button"
                          onMouseEnter={() => {
                            const matchIdx = slides.findIndex(
                              (s) => s.id === item.productId
                            );
                            if (matchIdx >= 0) setActiveSlideIdx(matchIdx);
                          }}
                          onClick={() => {
                            setActiveProductId(item.productId);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`text-left text-sm sm:text-base font-medium leading-snug transition-colors cursor-pointer ${
                            isPreviewed
                              ? 'text-[#5A4E38] underline decoration-[#5A4E38]/50 underline-offset-4'
                              : 'text-[#40563D] hover:text-[#5A4E38] hover:underline decoration-[#5A4E38]/50 underline-offset-4'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Primary CTA + Secondary WhatsApp Order Action */}
              <div className="w-full max-w-xl pt-1">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProductId(null);
                      setActivePageSlug('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 min-h-[48px] py-3.5 px-7 rounded-lg bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border-[1.5px] border-[#5A4E38] shadow-[3px_3px_0px_#5A4E38] hover:shadow-none font-dm text-sm font-extrabold uppercase tracking-[0.06em] transition-all duration-150 cursor-pointer whitespace-nowrap text-center flex items-center justify-center"
                  >
                    {heroPrimaryCta}
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] py-3.5 px-6 rounded-lg bg-[#FAF9F4] hover:bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38] font-dm text-xs font-bold uppercase tracking-[0.06em] transition-colors duration-150 whitespace-nowrap text-center flex items-center justify-center"
                  >
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Clean DTC Studio Product Showcase on Warm Cream (#F2EBD0) */}
            <div
              className="lg:col-span-6 w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative w-full h-[470px] sm:h-[540px] lg:h-[560px] rounded-2xl bg-[#FAF9F4] border-2 border-[#5A4E38] p-5 sm:p-7 lg:p-8 flex flex-col justify-between gap-4 sm:gap-5 shadow-[0_20px_50px_-24px_rgba(64,86,61,0.12)] overflow-hidden">
                {/* Top Strip: Single Product Tag + Slide Controls (Fixed Height) */}
                <div className="flex items-center justify-between gap-3 h-9 shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded bg-[#DCE7C9] text-[#40563D] font-dm text-[11px] font-bold truncate max-w-[calc(100%-5rem)]">
                    {currentSlide.tag}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      aria-label="Previous product slide"
                      className="w-8 h-8 rounded-lg bg-[#F2EBD0] hover:bg-[#5A4E38] text-[#40563D] hover:text-[#F2EBD0] border border-[#5A4E38] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      aria-label="Next product slide"
                      className="w-8 h-8 rounded-lg bg-[#F2EBD0] hover:bg-[#5A4E38] text-[#40563D] hover:text-[#F2EBD0] border border-[#5A4E38] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Packaging Visual Stage — Locked Identical Size for Every Product */}
                <div
                  onClick={() => setActiveProductId(currentSlide.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${currentSlide.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveProductId(currentSlide.id);
                    }
                  }}
                  className="relative w-full flex-1 min-h-0 rounded-xl bg-[#F2EBD0] border border-[#5A4E38] overflow-hidden cursor-pointer group flex items-center justify-center"
                >
                  <ProductImage
                    type={currentSlide.imageType}
                    productId={currentSlide.id}
                    customImageUrl={currentSlide.customImageUrl}
                    fit="cover"
                    className="w-full h-full transition-transform duration-500 group-hover:scale-103"
                    alt={currentSlide.name}
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38]/35 font-dm text-[11px] font-bold uppercase tracking-wider">
                    Fresh Batch
                  </span>
                </div>

                {/* Bottom Product Caption & Explore Button (Fixed Height) */}
                <div className="flex items-center justify-between gap-4 h-[58px] shrink-0">
                  <div className="min-w-0 flex-1">
                    <h2
                      onClick={() => setActiveProductId(currentSlide.id)}
                      className="font-serif text-xl sm:text-[1.65rem] font-bold text-[#40563D] hover:underline cursor-pointer leading-tight truncate"
                    >
                      {currentSlide.name}
                    </h2>
                    <p className="bajoz-price text-xs sm:text-sm text-[#5A4E38] mt-1 tabular-nums truncate">
                      Price: N/A
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveProductId(currentSlide.id)}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 text-center"
                  >
                    View Product
                  </button>
                </div>

                {/* Clean Line Slide Indicators (Fixed Height) */}
                <div className="flex items-center justify-between pt-2.5 h-7 shrink-0 border-t border-[#5A4E38]/30">
                  <div className="flex items-center gap-1.5">
                    {slides.map((s, idx) => {
                      const isActive = idx === activeSlideIdx % slides.length;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveSlideIdx(idx)}
                          aria-label={`View ${s.name}`}
                          className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'w-7 bg-[#40563D]'
                              : 'w-2 bg-[#DCE7C9] hover:bg-[#5A4E38]'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="font-dm text-[11px] font-semibold text-[#5A4E38] tabular-nums">
                    0{(activeSlideIdx % slides.length) + 1} / 0{slides.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FULL-WIDTH CREDIBILITY STRIP — Curved Triangle Top & Bottom
          Forest Olive (#40563D) Background with Fresh Lime Yellow (#E9F390) Accents
          ===================================================================== */}
      <WaveDivider fromColor="#F2EBD0" toColor="#40563D" flip compact strokeColor="none" />
      <div
        aria-label="BAJOZ Credibility Highlights"
        className="bajoz-marquee-wrapper relative z-10 -my-[2px] bg-[#40563D] text-[#F2EBD0] py-6 sm:py-7 overflow-hidden"
      >
        {/* Subtle edge fades so sliding items glide smoothly in and out */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 z-20 bg-gradient-to-r from-[#40563D] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 z-20 bg-gradient-to-l from-[#40563D] to-transparent"
        />

        <div className="bajoz-marquee-track">
          {[0, 1].map((loopIdx) => (
            <div
              key={loopIdx}
              aria-hidden={loopIdx === 1}
              className="flex items-center gap-10 sm:gap-14 lg:gap-16 pr-10 sm:pr-14 lg:pr-16 shrink-0"
            >
              {credibilityStripItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${loopIdx}-${item.text}`}
                    className="inline-flex items-center gap-2.5 sm:gap-3 font-dm text-sm sm:text-base lg:text-[17px] font-bold text-[#F2EBD0] whitespace-nowrap shrink-0"
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E9F390] shrink-0 stroke-[2.25]" />
                    <span>{item.text}</span>
                    <span
                      aria-hidden="true"
                      className="ml-6 sm:ml-8 text-[#E9F390]/50 font-normal select-none"
                    >
                      •
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <WaveDivider fromColor="#40563D" toColor="#F2EBD0" compact strokeColor="none" />
    </>
  );
};
