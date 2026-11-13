/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';

export const BrandStory: React.FC = () => {
  const { siteCopy } = useShop();

  return (
    <section
      id="craftsmanship"
      className="py-14 lg:py-20 bg-gradient-to-b from-white via-white to-[#F5EFDC] scroll-mt-16 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[340px] bg-[#DCE6C8] border border-[#4A5D23]/15 rounded-3xl p-8 flex flex-col items-center">
              <svg
                viewBox="0 0 280 260"
                className="w-full h-auto"
                fill="none"
                aria-label="Artisanal small-batch roasting illustration"
              >
                <g
                  stroke="#4A5D23"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 55 30 L 82 58 C 92 68, 94 86, 86 102 L 72 124 C 68 130, 62 126, 65 118 L 74 98 M 55 30 L 32 54 C 24 64, 26 84, 38 100 L 56 122 C 60 128, 66 124, 62 116" />
                  <path d="M 225 30 L 198 58 C 188 68, 186 86, 194 102 L 208 124 C 212 130, 218 126, 215 118 L 206 98 M 225 30 L 248 54 C 256 64, 254 84, 242 100 L 224 122 C 220 128, 214 124, 218 116" />
                  <ellipse cx="115" cy="128" rx="10" ry="5.5" transform="rotate(-25 115 128)" />
                  <ellipse cx="165" cy="126" rx="10" ry="5.5" transform="rotate(28 165 126)" />
                  <path d="M 136 112 C 136 102, 144 102, 144 112 C 144 122, 136 122, 136 112 Z" />
                  <circle cx="140" cy="142" r="4" stroke="#C86D3B" />
                  <circle cx="126" cy="148" r="3" stroke="#D99B26" />
                  <circle cx="154" cy="148" r="3" stroke="#D99B26" />
                  <path d="M 64 166 L 216 166 C 212 206, 182 224, 140 224 C 98 224, 68 206, 64 166 Z" />
                  <path d="M 64 174 C 46 170, 46 192, 68 190" />
                  <path d="M 216 174 C 234 170, 234 192, 212 190" />
                  <rect x="56" y="232" width="168" height="16" rx="8" />
                  {[78, 102, 126, 154, 178, 202].map((cx, i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy="240"
                      r="3.2"
                      stroke={i % 2 === 0 ? '#4A5D23' : '#C86D3B'}
                    />
                  ))}
                </g>
              </svg>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#4A5D23]">
              {siteCopy.craftKicker}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2C221E] leading-[1.12]">
              {siteCopy.craftHeading}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#655549] leading-relaxed max-w-2xl">
              {(siteCopy.craftParagraphs || []).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {siteCopy.craftPillars && siteCopy.craftPillars.length > 0 && (
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {siteCopy.craftPillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="bg-[#DCE6C8] border border-[#4A5D23]/15 rounded-2xl p-4"
                  >
                    <h3 className="font-serif text-lg font-semibold text-[#2C221E]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#2C221E]/80 mt-1 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
