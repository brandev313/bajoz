/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { CustomPageSection } from '../types/shop';
import { WaveDivider } from './WaveDivider';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';

export const SectionBlockRenderer: React.FC<{
  section: CustomPageSection;
  index?: number;
  isLast?: boolean;
  onCtaClick?: (link?: string) => void;
}> = ({ section, index = 0, onCtaClick }) => {
  const isIvory = index % 2 === 0;
  const currentBg = isIvory ? '#FAF9F4' : '#F2EBD0';
  const prevBg = isIvory ? '#F2EBD0' : '#FAF9F4';
  const bgClass = isIvory
    ? 'bg-[#FAF9F4] text-[#40563D]'
    : 'bg-[#F2EBD0] text-[#40563D]';
  return (
    <>
      <WaveDivider fromColor={prevBg} toColor={currentBg} strokeColor="#5A4E38" />
      <section className={`py-20 sm:py-26 lg:py-32 ${bgClass} bajoz-seamless-section`}>
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-8">
          <div className="space-y-3 max-w-4xl">
            {section.kicker && (
              <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#5A4E38]">
                {section.kicker}
              </p>
            )}

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#40563D]">
              {section.heading}
            </h2>
          </div>

          {section.body && (
            <p className="font-sans text-base sm:text-lg lg:text-xl leading-relaxed whitespace-pre-line text-[#40563D] max-w-4xl">
              {section.body}
            </p>
          )}

          {section.bulletPoints && section.bulletPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#5A4E38]/25">
              {section.bulletPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="py-3.5 border-b border-[#5A4E38]/25 flex items-start gap-2.5 font-sans text-sm sm:text-base font-medium text-[#40563D]"
                >
                  <span className="w-4 h-4 rounded-full bg-[#DCE7C9] text-[#40563D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}

          {section.ctaText && (
            <div className="pt-4">
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onCtaClick && onCtaClick(section.ctaLink)}
                  className="px-8 py-3.5 bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-serif text-base sm:text-lg font-extrabold tracking-tight rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <span>{section.ctaText}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onCtaClick && onCtaClick(section.ctaLink)}
                  aria-label={section.ctaText}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] border border-[#40563D] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                >
                  <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export const CustomHomeSections: React.FC = () => {
  const { siteCopy, setActivePageSlug } = useShop();
  const sections = siteCopy.customHomeSections || [];

  if (sections.length === 0) return null;

  const handleCta = (link?: string) => {
    if (!link) return;
    if (link.startsWith('#')) {
      const id = link.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else if (link.startsWith('/page/')) {
      setActivePageSlug(link.replace('/page/', ''));
    } else if (link.startsWith('/dtcss/page/')) {
      setActivePageSlug(link.replace('/dtcss/page/', ''));
    } else if (link === '/shop') {
      setActivePageSlug('shop');
    } else {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {sections.map((sec, idx) => (
        <SectionBlockRenderer
          key={sec.id}
          section={sec}
          index={idx}
          onCtaClick={handleCta}
        />
      ))}
    </>
  );
};

export const CustomPageView: React.FC = () => {
  const { customPages, activePageSlug, setActivePageSlug } = useShop();
  const page = customPages.find((p) => p.slug === activePageSlug);

  const handleCta = (link?: string) => {
    setActivePageSlug(null);
    setTimeout(() => {
      const targetId = link?.startsWith('#') ? link.slice(1) : 'collection';
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  if (!page) {
    return (
      <div className="bg-[#F2EBD0]">
        <div className="py-28 w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 text-center space-y-5">
          <p className="font-serif italic text-2xl sm:text-3xl text-[#5A4E38]">
            BAJOZ Storefront
          </p>
          <h1 className="font-h1 text-4xl sm:text-5xl font-medium text-[#40563D]">
            Page Not Found
          </h1>
          <p className="font-sans text-base text-[#5A4E38]">
            The requested page does not exist or has been unpublished.
          </p>
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActivePageSlug(null)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-serif text-base font-extrabold rounded-full cursor-pointer transition-all duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePageSlug(null)}
              aria-label="Return to Storefront"
              className="w-11 h-11 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] border border-[#40563D] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F2EBD0]">
      {/* Page Hero Banner in Heritage Cream (#F2EBD0) */}
      <div className="bg-[#F2EBD0] text-[#40563D] pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bajoz-seamless-section">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2.5 font-dm text-sm sm:text-[15px] font-medium text-[#5A4E38]"
            >
              <button
                type="button"
                onClick={() => setActivePageSlug(null)}
                className="hover:bg-[#5A4E38] hover:text-[#F2EBD0] cursor-pointer font-semibold"
              >
                Home
              </button>
              <span className="text-[#5A4E38]/60">/</span>
              <span className="text-[#40563D] font-bold">{page.title}</span>
            </nav>

            <button
              type="button"
              onClick={() => setActivePageSlug(null)}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md font-dm text-sm sm:text-[15px] font-bold text-[#40563D] hover:bg-[#5A4E38] hover:text-[#F2EBD0] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
          </div>

          {page.kicker && (
            <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#5A4E38]">
              {page.kicker}
            </p>
          )}

          <h1 className="font-h1 text-4xl sm:text-6xl font-medium text-[#40563D]">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="font-sans text-base sm:text-lg lg:text-xl text-[#5A4E38] max-w-3xl leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Page Content Sections */}
      {page.sections.map((sec, idx) => (
        <SectionBlockRenderer
          key={sec.id}
          section={sec}
          index={idx}
          isLast={idx === page.sections.length - 1}
          onCtaClick={handleCta}
        />
      ))}

      {page.sections.length > 0 && (
        <WaveDivider
          fromColor={(page.sections.length - 1) % 2 === 0 ? '#FAF9F4' : '#F2EBD0'}
          toColor="#F2EBD0"
          strokeColor="#5A4E38"
        />
      )}
    </div>
  );
};
