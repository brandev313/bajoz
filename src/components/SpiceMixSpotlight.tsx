/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const SpiceMixSpotlight: React.FC = () => {
  const { products, siteCopy, addToCart, setActiveProductId } = useShop();

  if (siteCopy.showSpiceMixSpotlight === false) return null;

  const spiceMix =
    products.find((p) => p.id === 'spicemix') ||
    products.find((p) => p.category === 'Cooking Paste') ||
    products[0];

  if (!spiceMix) return null;

  const dishes = siteCopy.spotlightDishes || [];

  return (
    <section
      id="spicemix-spotlight"
      className="py-14 lg:py-20 bg-[#F9F5E9] border-y border-[#4A5D23]/15 scroll-mt-16 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 bg-[#F5EBC8] border border-[#4A5D23]/20 rounded-3xl p-7 sm:p-9 flex flex-col justify-between shadow-2xs">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#4A5D23] mb-2">
                  {siteCopy.spotlightLeftKicker}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C221E]">
                  {siteCopy.spotlightLeftHeading}
                </h3>
              </div>

              <div className="divide-y divide-[#4A5D23]/15">
                {dishes.map((dish) => (
                  <div key={dish.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif text-lg font-semibold text-[#2C221E]">
                        {dish.index}. {dish.name}
                      </span>
                      <span className="font-mono text-xs text-[#4A5D23] font-semibold tabular-nums shrink-0">
                        {dish.prepTime}
                      </span>
                    </div>
                    <p className="text-xs text-[#2C221E]/80 mt-1 leading-relaxed">
                      {dish.method}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#4A5D23]/15 flex items-center justify-between text-xs text-[#4A5D23] font-medium">
              <span>{siteCopy.spotlightLeftFooterLeft}</span>
              <span>·</span>
              <span>{siteCopy.spotlightLeftFooterRight}</span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/95 rounded-3xl p-7 sm:p-10 border border-[#4A5D23]/15 flex flex-col justify-between shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
              <div className="md:col-span-7 space-y-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#4A5D23]">
                  {siteCopy.spotlightRightKicker}
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2C221E] leading-[1.1]">
                  {siteCopy.spotlightRightHeading}
                </h2>

                <p className="text-sm sm:text-base text-[#2C221E]/85 leading-relaxed">
                  {siteCopy.spotlightRightDescription}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      addToCart(
                        spiceMix,
                        spiceMix.variants[0]?.id || 'original',
                        spiceMix.packSizes[0]?.id || '350g',
                        1
                      )
                    }
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>
                      Add {spiceMix.name} · Price: N/A
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveProductId(spiceMix.id)}
                    className="inline-flex items-center gap-1.5 px-5 py-3.5 bg-white hover:bg-[#2C221E] text-[#2C221E] hover:text-[#F5EFDC] border border-[#2C221E]/15 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>View Product</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                onClick={() => setActiveProductId(spiceMix.id)}
                className="md:col-span-5 flex flex-col items-center justify-center cursor-pointer bg-white rounded-2xl p-6 border border-[#4A5D23]/10"
              >
                <div className="w-full max-w-[260px] aspect-square flex items-center justify-center">
                  <ProductImage
                    type={spiceMix.imageType}
                    productId={spiceMix.id}
                    customImageUrl={spiceMix.customImageUrl}
                    className="w-full h-full hover:scale-103 transition-transform"
                    alt={spiceMix.name}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

