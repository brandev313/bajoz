/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WaveDivider } from './WaveDivider';
import { ArrowUpRight, MapPin } from 'lucide-react';

export const HomepageConversionSections: React.FC = () => {
  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFDF9]">
      {/* =====================================================================
          ABOUT US (Full-Width #FFFDF9 Pure White Cream Editorial Section)
          ===================================================================== */}
      <section
        id="about-us"
        className="py-20 sm:py-28 lg:py-36 bg-[#FFFDF9] scroll-mt-20 bajoz-seamless-section"
      >
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-16 sm:space-y-20 lg:space-y-24">
          {/* Centered Section Headline & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <p className="bajoz-script-kicker text-2xl sm:text-3xl lg:text-4xl text-[#40563D]">
              About BAJOZ — The House of Naturals
            </p>
            <h2 className="bajoz-poster-display text-3xl sm:text-5xl lg:text-6xl text-[#4A2E1B]">
              Born in a Family Kitchen to Preserve What Matters
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#2C221E] font-medium leading-relaxed pt-2 max-w-3xl mx-auto">
              Preserving generational Pakistani recipes with 100% pure ingredients—crafted
              in small batches and delivered fresh across Pakistan.
            </p>
          </div>

          {/* Open 2-Column Architectural Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-18 xl:gap-24 items-center">
            {/* Left Column: Brand Story & Outlined Commitments Box */}
            <div className="lg:col-span-6 space-y-7">
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 sm:p-9 space-y-5 text-base sm:text-lg text-[#2C221E] font-medium leading-relaxed">
                <p>
                  BAJOZ began with a simple observation: modern Pakistani families still
                  crave the deeply nourishing Panjeeri, aromatic handi masalas, and natural
                  oral care remedies our grandmothers made—but very few have four uninterrupted hours
                  to roast, grind, and prepare them from scratch.
                </p>
                <p>
                  Instead of letting these generational recipes fade or be replaced by
                  preservative-heavy factory substitutes, we set up our small-batch kitchen
                  in Lahore with one rule:{' '}
                  <strong className="text-[#40563D] font-extrabold">
                    never put anything in a BAJOZ jar that we wouldn’t serve to our own
                    children and parents.
                  </strong>
                </p>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-5">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={scrollToCollection}
                    className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                  >
                    Explore Our Products
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCollection}
                    aria-label="Explore Our Products"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-transform duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Uploaded Pakistani Mother & Kids Dining Table Photo inside Single Rounded Card */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[540px] aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#B4CBA2] border-[1.5px] border-[#7A5C38] group">
                <img
                  src="/assets/aistudio/image_fe2f1b15_327761c4.jpg"
                  alt="Pakistani mother enjoying homemade biryani and karahi with her children at the dining table with BAJOZ SpiceMix"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Sweeping Wave Transition from About BAJOZ (#FFFDF9) into FAQs (#F5EBC8) */}
      <WaveDivider fromColor="#FFFDF9" toColor="#F5EBC8" flip />
    </div>
  );
};
