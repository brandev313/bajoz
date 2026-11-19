/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { WaveDivider } from './WaveDivider';

export const TestimonialsSection: React.FC = () => {
  const {
    reviews,
    setIsReviewModalOpen,
    siteCopy,
    setActiveProductId,
    setActivePageSlug,
  } = useShop();

  const approvedReviews = (Array.isArray(reviews) ? reviews : []).filter(
    (r) => r.isApproved
  );

  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    if (approvedReviews.length <= 3) return;
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, approvedReviews.length - 3) : prev - 1
    );
  };

  const handleNext = () => {
    if (approvedReviews.length <= 3) return;
    setStartIndex((prev) =>
      prev + 3 >= approvedReviews.length ? 0 : prev + 1
    );
  };

  const displayedReviews =
    approvedReviews.length > 3
      ? [
          approvedReviews[startIndex % approvedReviews.length],
          approvedReviews[(startIndex + 1) % approvedReviews.length],
          approvedReviews[(startIndex + 2) % approvedReviews.length],
        ]
      : approvedReviews.slice(0, 3);

  const handleOrderNow = () => {
    setActiveProductId(null);
    setActivePageSlug('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <WaveDivider fromColor="#F2EBD0" toColor="#40563D" flip strokeColor="none" />
      <section
        id="reviews"
        className="py-18 sm:py-24 lg:py-28 bg-[#40563D] text-[#F2EBD0] scroll-mt-20 bajoz-seamless-section"
      >
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-12 sm:space-y-14">
          {/* Centered Reviews Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-1 text-[#E9F390]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F2EBD0] text-balance">
              +500 Happy Households
            </h2>
            <p className="font-dm text-xs sm:text-sm text-[#E9F390] font-medium">
              {siteCopy.reviewsDescription ||
                'Genuine feedback from mothers, professionals, and families across Pakistan.'}
            </p>
          </div>

          {/* Responsive Review Grid: 1-col Mobile · 2-col Tablet · 3-col Desktop */}
          <div className="relative flex items-center gap-4 lg:gap-6">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Customer Reviews"
              className="hidden xl:flex w-11 h-11 rounded-lg bg-[#F2EBD0] hover:bg-[#E9F390] text-[#40563D] border border-[#5A4E38] items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedReviews.map((review) => (
                <article
                  key={review.id}
                  className="w-full h-[350px] sm:h-[370px] rounded-2xl bg-[#F2EBD0] text-[#40563D] border-2 border-[#5A4E38] p-6 sm:p-8 flex flex-col justify-between text-center shadow-md overflow-hidden"
                >
                  <div className="flex-1 min-h-0 flex flex-col space-y-3.5 overflow-hidden">
                    {/* Stars + Subtle Pistachio Sage Micro Tag */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-[#5A4E38]">
                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      {review.productTag && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-[#DCE7C9] text-[#40563D] font-dm text-[10px] font-bold uppercase tracking-wider">
                          {review.productTag}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D] leading-snug line-clamp-2 shrink-0">
                      “{review.title}”
                    </h3>

                    <p className="font-dm text-xs sm:text-sm text-[#40563D]/90 leading-relaxed whitespace-pre-line overflow-y-auto pr-1 flex-1">
                      {review.comment}
                    </p>
                  </div>

                  {/* Reviewer Footer */}
                  <div className="pt-4 mt-4 shrink-0 border-t border-[#5A4E38]/35 flex flex-wrap items-center justify-center gap-1.5 font-dm text-xs font-bold text-[#5A4E38]">
                    <span>{review.customerName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#40563D]" />
                    <span className="font-medium opacity-80">· {review.city}</span>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Customer Reviews"
              className="hidden xl:flex w-11 h-11 rounded-lg bg-[#F2EBD0] hover:bg-[#E9F390] text-[#40563D] border border-[#5A4E38] items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile & Tablet Carousel Controls */}
          {approvedReviews.length > 3 && (
            <div className="flex xl:hidden items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Customer Reviews"
                className="w-11 h-11 rounded-lg bg-[#F2EBD0] hover:bg-[#E9F390] text-[#40563D] border border-[#5A4E38] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Customer Reviews"
                className="w-11 h-11 rounded-lg bg-[#F2EBD0] hover:bg-[#E9F390] text-[#40563D] border border-[#5A4E38] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Section Conversion CTAs */}
          <div className="pt-2 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={handleOrderNow}
              className="min-h-[46px] px-8 py-3 rounded-lg bg-[#E9F390] hover:bg-[#DCE7C9] text-[#5A4E38] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-extrabold uppercase tracking-[0.08em] transition-all duration-150 cursor-pointer"
            >
              Order Now
            </button>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="min-h-[46px] px-7 py-3 rounded-lg bg-[#F2EBD0] hover:bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38] font-dm text-xs font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer"
            >
              Write a Review
            </button>
          </div>
        </div>
      </section>
      <WaveDivider fromColor="#40563D" toColor="#FAF9F4" strokeColor="none" />
    </>
  );
};
