/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronDown } from 'lucide-react';
import { WaveDivider } from './WaveDivider';

export const FaqSection: React.FC = () => {
  const {
    settings,
    siteCopy,
    setActiveProductId,
    setActivePageSlug,
  } = useShop();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = Array.isArray(siteCopy.faqs) ? siteCopy.faqs : [];

  const cleanWhatsapp = (settings.whatsappNumber || '923154388166').replace(
    /\D/g,
    ''
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Assalam-o-Alaikum BAJOZ — The House of Naturals! I have a question before ordering.'
  )}`;

  const handleViewAllProducts = () => {
    setActiveProductId(null);
    setActivePageSlug('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section
        id="faq"
        className="py-18 sm:py-24 lg:py-28 bg-[#FAF9F4] text-[#40563D] scroll-mt-20 bajoz-seamless-section"
      >
        <div className="w-full max-w-[960px] mx-auto px-5 sm:px-10 space-y-12 sm:space-y-14">
          {/* Centered FAQ Heading */}
          <div className="text-center space-y-3">
            <p className="font-dm text-xs font-bold uppercase tracking-[0.14em] text-[#5A4E38]">
              {siteCopy.faqKicker || 'Got Questions? We Answer Honestly'}
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#40563D]">
              FAQ’s
            </h2>
          </div>

          {/* Clean Stacked Minimal Accordion Rows */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#FAF9F4] border-2 border-[#5A4E38] px-6 py-5 sm:px-8 sm:py-6 transition-colors"
                >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <span className="font-dm text-sm sm:text-base font-bold text-[#40563D] group-hover:text-[#5A4E38] transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#40563D] shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-[#5A4E38]/30 font-dm text-xs sm:text-sm text-[#40563D]/90 leading-relaxed pr-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

          {/* Clean Conversion Strip */}
          <div className="pt-4 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={handleViewAllProducts}
              className="min-h-[46px] px-8 py-3 rounded-lg bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-extrabold uppercase tracking-[0.08em] transition-all duration-150 cursor-pointer text-center"
            >
              View All Products
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[46px] px-7 py-3 rounded-lg bg-[#FAF9F4] hover:bg-[#DCE7C9] text-[#40563D] border border-[#5A4E38] font-dm text-xs font-bold uppercase tracking-[0.08em] transition-colors flex items-center justify-center text-center"
            >
              Ask Us on WhatsApp
            </a>
          </div>
        </div>
      </section>
      <WaveDivider fromColor="#FAF9F4" toColor="#F2EBD0" strokeColor="#5A4E38" />
    </>
  );
};
