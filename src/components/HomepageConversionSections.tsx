/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Sparkles,
  Flame,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';

export const HomepageConversionSections: React.FC = () => {
  const { siteCopy } = useShop();

  const benefitItems = [
    {
      icon: Sparkles,
      title: siteCopy.benefit1Title || '100% Pure, Nothing Hidden',
      description:
        siteCopy.benefit1Desc ||
        'Every ingredient is listed in plain sight. No synthetic preservatives, artificial food colors, or fillers.',
    },
    {
      icon: Flame,
      title: siteCopy.benefit2Title || 'Slow-Crafted in Small Batches',
      description:
        siteCopy.benefit2Desc ||
        'Roasted nuts, freshly ground spices, and pure botanicals prepared in controlled batches in Lahore.',
    },
    {
      icon: ShieldCheck,
      title: siteCopy.benefit3Title || 'Hours Saved in the Kitchen',
      description:
        siteCopy.benefit3Desc ||
        'Reclaim your evenings without sacrificing homemade taste—ready straight from the jar.',
    },
    {
      icon: HeartHandshake,
      title: 'Generational Family Recipes',
      description:
        'Authentic Pakistani household proportions passed down over generations for everyday modern homes.',
    },
  ];

  return (
    <section
      id="why-choose-bajoz"
      className="py-18 sm:py-24 lg:py-28 bg-[#F2EBD0] text-[#40563D] scroll-mt-20 bajoz-seamless-section"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-14 sm:space-y-18">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="font-dm text-xs font-bold uppercase tracking-[0.14em] text-[#5A4E38]">
            {siteCopy.benefitsKicker || 'Crafted Pure, Zero Shortcuts'}
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#40563D] text-balance">
            {siteCopy.benefitsHeading || 'What Makes BAJOZ Pure?'}
          </h2>
        </div>

        {/* Responsive Radial Grid: Stacked Mobile · 2x2 Tablet · 3-Column Flanking Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center max-w-6xl mx-auto">
          {/* Left 2 Pillars */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 sm:gap-10 lg:gap-12 text-center">
            {benefitItems.slice(0, 2).map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="space-y-3 max-w-xs mx-auto">
                  <div className="w-11 h-11 rounded-full bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38] flex items-center justify-center mx-auto">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D]">
                    {b.title}
                  </h3>
                  <p className="font-dm text-xs sm:text-sm text-[#5A4E38] leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Center Circular Focal Product Emblem */}
          <div className="lg:col-span-4 flex justify-center py-2">
            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full bg-[#FAF9F4] border-4 border-[#5A4E38] shadow-[0_18px_40px_-14px_rgba(90,78,56,0.28)] overflow-hidden p-3 flex items-center justify-center">
              <img
                src="/assets/aistudio/image_6390b844_c4cccf98.jpg"
                alt="BAJOZ Homemade Natural Ingredients"
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right 2 Pillars */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 sm:gap-10 lg:gap-12 text-center">
            {benefitItems.slice(2, 4).map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="space-y-3 max-w-xs mx-auto">
                  <div className="w-11 h-11 rounded-full bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38] flex items-center justify-center mx-auto">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D]">
                    {b.title}
                  </h3>
                  <p className="font-dm text-xs sm:text-sm text-[#5A4E38] leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
