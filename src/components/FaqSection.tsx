/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { WaveDivider } from './WaveDivider';
import {
  ChevronDown,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const { siteCopy, settings, setActivePageSlug, setActiveProductId } = useShop();
  const faqs: FaqItem[] = Array.isArray(siteCopy.faqs) ? siteCopy.faqs : [];

  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    const firstId = faqs[0]?.id;
    const secondId = faqs[1]?.id;
    const initial: Record<string, boolean> = {};
    if (firstId) initial[firstId] = true;
    if (secondId) initial[secondId] = true;
    return initial;
  });

  if (faqs.length === 0) return null;

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, midpoint);
  const rightColumnFaqs = faqs.slice(midpoint);

  const cleanWhatsapp = (settings.whatsappNumber || '923154388166').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Assalam-o-Alaikum BAJOZ! I have a question before placing my order.'
  )}`;

  const scrollToCollection = () => {
    setActiveProductId(null);
    setActivePageSlug('shop');
  };

  const renderFaqColumn = (columnFaqs: FaqItem[]) => (
    <div className="space-y-4">
      {columnFaqs.map((faq) => {
        const isOpen = !!openIds[faq.id];
        return (
          <div
            key={faq.id}
            className="bg-[#F9F5E9] rounded-[1.5rem] px-6 sm:px-8 py-5 sm:py-6 border-[1.5px] border-[#7A5C38] transition-colors"
          >
            <button
              type="button"
              onClick={() => toggleFaq(faq.id)}
              aria-expanded={isOpen}
              className="w-full text-left flex items-start justify-between gap-6 cursor-pointer group"
            >
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#40563D] group-hover:text-[#4A2E1B] leading-snug transition-colors duration-150">
                  {faq.q}
                </h3>
              </div>
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-[1.5px] border-[#7A5C38] transition-all duration-200 ${
                  isOpen
                    ? 'bg-[#E9F399] text-[#40563D] rotate-180'
                    : 'bg-[#FFFDF9] text-[#40563D]'
                }`}
              >
                <ChevronDown className="w-4 h-4 stroke-[2.25]" />
              </span>
            </button>

            {isOpen && (
              <div className="pt-4 pr-8">
                <p className="text-sm sm:text-base text-[#2C221E] font-medium leading-relaxed">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[#F5EBC8]">
      {/* =====================================================================
          FREQUENTLY ASKED QUESTIONS (2-Column Full-Width Accordion)
          ===================================================================== */}
      <section
        id="faq"
        className="py-20 sm:py-28 lg:py-36 bg-[#F5EBC8] scroll-mt-20 bajoz-seamless-section"
      >
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-14 sm:space-y-18 lg:space-y-22">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <p className="bajoz-script-kicker text-2xl sm:text-3xl lg:text-4xl text-[#40563D]">
              {siteCopy.faqKicker || 'Frequently Asked Questions'}
            </p>
            <h2 className="bajoz-poster-display text-3xl sm:text-5xl lg:text-6xl text-[#4A2E1B]">
              {siteCopy.faqHeading || 'Everything You Need to Know Before Ordering'}
            </h2>
            <p className="text-base sm:text-lg text-[#2C221E] font-medium pt-1 max-w-2xl mx-auto">
              Clear answers on our ingredients, shelf life, usage, and nationwide delivery
              across Pakistan.
            </p>
          </div>

          {/* 2-Column FAQ Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            {renderFaqColumn(leftColumnFaqs)}
            {renderFaqColumn(rightColumnFaqs)}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm sm:text-base text-[#2C221E] font-medium">
              Still have a specific question about ingredients or bulk family orders?{' '}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-[#40563D] underline underline-offset-4 hover:text-[#4A2E1B]"
              >
                Chat directly with our Lahore team on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Seamless Sweeping Wave Transition into the Final Conversion CTA Section (#FFFDF9 Pure White Cream) */}
      <WaveDivider fromColor="#F5EBC8" toColor="#FFFDF9" />

      {/* =====================================================================
          FINAL CONVERSION CTA SECTION (#FFFDF9 Pure White Cream Background)
          ===================================================================== */}
      <section className="py-20 sm:py-28 lg:py-36 bg-[#FFFDF9] text-[#5A4E38] bajoz-seamless-section">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="rounded-[1.75rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-8 sm:p-12 lg:p-16 text-center space-y-8 sm:space-y-10">
            <div className="space-y-4 max-w-4xl mx-auto">
              <p className="bajoz-script-kicker text-2xl sm:text-3xl lg:text-4xl text-[#40563D]">
                Fresh Small-Batch Dispatch
              </p>

              <h2 className="bajoz-poster-display text-3xl sm:text-5xl lg:text-6xl text-[#40563D] leading-tight">
                Ready to Bring Pure Traditional Goodness Back to Your Home?
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-[#2C221E] font-medium max-w-2xl mx-auto leading-relaxed pt-2">
                Order your freshly sealed jars of Desi Ghee Panjeeri, SpiceMix,
                and Tooth Guardian Oral Care Powder today—with Cash on Delivery across Pakistan.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 pt-2">
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={scrollToCollection}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  View All Products
                </button>
                <button
                  type="button"
                  onClick={scrollToCollection}
                  aria-label="View All Products"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-transform duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                >
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-[#FFFDF9] hover:bg-[#E9F399]/60 text-[#2C221E] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5 text-[#40563D]" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-[#2C221E]">
              <span>100% Pure &amp; Preservative-Free</span>
              <span aria-hidden="true" className="text-[#40563D]">·</span>
              <span>Cash on Delivery Nationwide</span>
              <span aria-hidden="true" className="text-[#40563D]">·</span>
              <span>Sealed Fresh in Airtight Jars</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Wave Transition into Pre-Footer Section (#F5EBC8) */}
      <WaveDivider fromColor="#FFFDF9" toColor="#F5EBC8" flip />
    </div>
  );
};
