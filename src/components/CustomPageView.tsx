/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { CustomPageSection } from '../types/shop';
import { WaveDivider } from './WaveDivider';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export const SectionBlockRenderer: React.FC<{
  section: CustomPageSection;
  index?: number;
  isLast?: boolean;
  onCtaClick?: (link?: string) => void;
}> = ({ section, isLast, onCtaClick }) => {
  const bgClass = isLast ? 'bg-[#FFFDF9]' : 'bg-[#F5EBC8]';
  return (
    <>
      {isLast && <WaveDivider fromColor="#F5EBC8" toColor="#FFFDF9" />}
      <section className={`py-20 sm:py-28 lg:py-36 ${bgClass} text-[#5A4E38]`}>
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-8">
          <div className="space-y-3 max-w-4xl">
            {section.kicker && (
              <p className="bajoz-script-kicker text-2xl sm:text-3xl lg:text-4xl text-[#40563D]">
                {section.kicker}
              </p>
            )}

            <h2 className="bajoz-poster-display text-3xl sm:text-5xl lg:text-6xl text-[#4A2E1B]">
              {section.heading}
            </h2>
          </div>

          {section.body && (
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed whitespace-pre-line text-[#5A4E38]/90 max-w-4xl">
              {section.body}
            </p>
          )}

          {section.bulletPoints && section.bulletPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#5A4E38]/15">
              {section.bulletPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="py-3.5 border-b border-[#5A4E38]/15 flex items-start gap-3.5 text-sm sm:text-base font-medium text-[#5A4E38]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#40563D] text-[#F9F5E9] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}

          {section.ctaText && (
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onCtaClick && onCtaClick(section.ctaLink)}
                className="inline-flex items-center gap-2.5 px-9 py-4 sm:py-5 bg-[#40563D] hover:bg-[#334530] text-[#F9F5E9] text-xs sm:text-sm font-extrabold uppercase tracking-[0.12em] rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap"
              >
                <span>{section.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#F9F5E9]" />
              </button>
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
      <div className="bg-[#FFFDF9]">
        <div className="py-28 w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 text-center space-y-5">
          <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">BAJOZ Storefront</p>
          <h1 className="bajoz-poster-display text-4xl sm:text-5xl text-[#4A2E1B]">Page Not Found</h1>
          <p className="text-base text-[#786C57]">
            The requested page does not exist or has been unpublished.
          </p>
          <button
            type="button"
            onClick={() => setActivePageSlug(null)}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#40563D] hover:bg-[#334530] text-[#F9F5E9] text-xs font-extrabold uppercase tracking-[0.12em] rounded-full cursor-pointer transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>
        <WaveDivider fromColor="#FFFDF9" toColor="#F5EBC8" flip />
      </div>
    );
  }

  return (
    <div className="bg-[#F5EBC8]">
      {/* Page Hero Banner */}
      <div className="bg-[#F9F5E9] text-[#5A4E38] py-16 sm:py-24 lg:py-28">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-5">
          <button
            type="button"
            onClick={() => setActivePageSlug(null)}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#40563D] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>

          {page.kicker && (
            <p className="bajoz-script-kicker text-2xl sm:text-3xl lg:text-4xl text-[#40563D]">
              {page.kicker}
            </p>
          )}

          <h1 className="bajoz-poster-display text-4xl sm:text-6xl text-[#4A2E1B]">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-base sm:text-lg lg:text-xl text-[#5A4E38]/85 max-w-3xl leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Smooth Wave Transition from Page Hero (#F9F5E9) into Page Sections */}
      <WaveDivider fromColor="#F9F5E9" toColor="#F5EBC8" compact />

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

      {/* Seamless Wave Transition into Pre-Footer Important Notice Section (#F5EBC8) */}
      <WaveDivider
        fromColor={page.sections.length > 0 ? '#FFFDF9' : '#F5EBC8'}
        toColor="#F5EBC8"
        flip
      />
    </div>
  );
};
