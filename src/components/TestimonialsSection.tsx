/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { WaveDivider } from './WaveDivider';
import {
  Star,
  Plus,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { reviews, setIsReviewModalOpen } = useShop();
  const [startIndex, setStartIndex] = useState(0);

  const approved = reviews.filter((r) => r.isApproved);
  const totalReviews = approved.length;

  const handlePrev = () => {
    if (totalReviews === 0) return;
    setStartIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const handleNext = () => {
    if (totalReviews === 0) return;
    setStartIndex((prev) => (prev + 1) % totalReviews);
  };

  // Show 3 cards in the carousel view
  const visibleReviews =
    totalReviews <= 3
      ? approved
      : [
          approved[startIndex % totalReviews],
          approved[(startIndex + 1) % totalReviews],
          approved[(startIndex + 2) % totalReviews],
        ];

  return (
    <>
      <section
        id="reviews"
        className="py-20 sm:py-28 lg:py-36 bg-[#F9F5E9] scroll-mt-20 bajoz-seamless-section"
      >
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-14 sm:space-y-18 lg:space-y-22">
          {/* Centered Heading */}
          <div className="text-center max-w-4xl mx-auto space-y-3">
            <h2 className="bajoz-poster-display text-3xl sm:text-5xl lg:text-6xl text-[#4A2E1B]">
              See What Our Happy Customers Are Saying!
            </h2>
          </div>

          {/* 3-Card Horizontal Carousel with Responsive Controls for Mobile, Tablet & Desktop */}
          <div className="space-y-5">
            <div className="relative flex items-center gap-4 sm:gap-6 lg:gap-10">
              {/* Left Carousel Arrow (<) — Desktop/Tablet */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous customer reviews"
                className="hidden md:flex w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#FFFDF9] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </button>

              {/* 3 Outlined Review Cards */}
              <div
                key={startIndex}
                className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 bajoz-fade-in"
              >
                {visibleReviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="bg-[#FFFDF9] rounded-[1.5rem] p-6 sm:p-8 lg:p-10 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between text-left border-[1.5px] border-[#7A5C38] transition-colors duration-200"
                  >
                    <div className="space-y-4 sm:space-y-5">
                      {/* 5-Star Rating Row + Product Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[#C98A6A]">
                          {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 fill-current" />
                          ))}
                          <span className="ml-1.5 text-xs font-bold text-[#2C221E] tabular-nums">
                            {rev.rating || 5}.0
                          </span>
                        </div>
                        {rev.productTag && (
                          <span className="px-3 py-1 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-serif text-xs font-extrabold">
                            {rev.productTag}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D] leading-snug">
                        “{rev.title}”
                      </h3>

                      <p className="text-sm sm:text-base text-[#2C221E] font-medium leading-relaxed whitespace-pre-line">
                        {rev.comment}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Right Carousel Arrow (>) — Desktop/Tablet */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next customer reviews"
                className="hidden md:flex w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </button>
            </div>

            {/* Mobile Carousel Arrows (< >) */}
            <div className="flex md:hidden items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous customer reviews"
                className="w-11 h-11 rounded-full bg-[#FFFDF9] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next customer reviews"
                className="w-11 h-11 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Bottom Centered Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap"
              >
                Order Now
              </button>
              <button
                type="button"
                onClick={() =>
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
                }
                aria-label="Order Now"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-transform duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
              >
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 bg-[#FFFDF9] hover:bg-[#E9F399]/60 text-[#2C221E] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-bold tracking-tight rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#40563D]" />
              <span>Write a Customer Review</span>
            </button>
          </div>
        </div>
      </section>

      {/* Seamless Wave Transition from Reviews (#F9F5E9) into About BAJOZ (#FFFDF9 Pure White Cream) */}
      <WaveDivider fromColor="#F9F5E9" toColor="#FFFDF9" />
    </>
  );
};
