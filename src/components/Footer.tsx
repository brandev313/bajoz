/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BAJOZ_LOGOS } from '../lib/brandAssets';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  X,
  Lock,
  Check,
} from 'lucide-react';

type PolicyType = 'privacy' | 'terms' | 'shipping' | 'returns' | 'cookies' | null;

export const Footer: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const {
    settings,
    siteCopy,
    setActiveProductId,
    setActivePageSlug,
    customPages,
  } = useShop();
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const publishedPages = customPages.filter((p) => p.isPublished);

  const navigateHomeSection = (sectionId?: string) => {
    setActiveProductId(null);
    setActivePageSlug(null);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  const renderPolicyModal = () => {
    if (!activePolicy) return null;

    const policies: Record<
      Exclude<PolicyType, null>,
      { title: string; content: string[] }
    > = {
      shipping: {
        title: 'Shipping & Delivery Policy',
        content: [
          `We dispatch fresh batches daily from our kitchen at ${settings.officeAddress}.`,
          `Standard delivery takes 2–4 business days across Lahore, Islamabad, Rawalpindi, Karachi, and major cities across Pakistan.`,
          `Enjoy FREE nationwide shipping on all orders above PKR ${settings.freeDeliveryThreshold.toLocaleString()}. Standard shipping below this threshold is PKR ${settings.standardDeliveryFee.toLocaleString()}.`,
          `Every glass and food-grade jar is cushioned in protective eco-packaging so it reaches your doorstep safely.`,
        ],
      },
      returns: {
        title: 'Returns & Refunds Policy — All Sales Are Final',
        content: [
          siteCopy.returnsPolicyText ||
            'Because BAJOZ products are freshly prepared, consumable food and personal-care items, we do not offer returns, exchanges, or refunds once an order has been placed or delivered.',
          'All sales are final. We encourage customers to review the complete ingredient list, allergen details, and pack weight on each product page before completing their order.',
          `If you have any questions about ingredients, storage, or usage before ordering, please reach out to our customer care team on WhatsApp (+${settings.whatsappNumber}) or email care@bajoz.pk.`,
        ],
      },
      privacy: {
        title: 'Privacy Policy',
        content: [
          'BAJOZ — The House of Naturals respects your privacy. Your personal details (name, phone number, and delivery address) are strictly used to process and deliver your orders.',
          'We never sell, rent, or share your contact information with third-party marketers.',
          'All customer account data and order history are stored securely.',
        ],
      },
      terms: {
        title: 'Terms of Service',
        content: [
          'By placing an order on BAJOZ — The House of Naturals, you confirm that your delivery address and contact phone number are accurate for courier dispatch.',
          'Cash on Delivery (COD) orders are verified via WhatsApp or phone call prior to dispatch.',
          'All prices are listed in Pakistani Rupees (PKR) and include applicable packaging charges.',
        ],
      },
      cookies: {
        title: 'Cookie Policy',
        content: [
          'We use essential local browser storage to keep your shopping bag, saved preferences, and session active while you browse.',
          'You can clear your browser storage at any time through your browser settings.',
        ],
      },
    };

    const current = policies[activePolicy];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#40563D]/70 backdrop-blur-xs">
        <div className="bg-[#F2EBD0] border-2 border-[#5A4E38] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-[#40563D]">
          <div className="flex items-center justify-between border-b border-[#5A4E38]/30 pb-4">
            <h3 className="font-display text-2xl font-bold text-[#40563D]">
              {current.title}
            </h3>
            <button
              type="button"
              onClick={() => setActivePolicy(null)}
              className="p-2 text-[#5A4E38] hover:text-[#40563D] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3 font-dm text-sm text-[#40563D] leading-relaxed">
            {current.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setActivePolicy(null)}
              className="px-6 py-2.5 bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-[#40563D] text-[#F2EBD0]">
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-10 pb-14 border-b border-[#E9F390]/25">
          {/* Column 1: Newsletter Capture Card + Brand Mark (Full width on tablet, 4 cols on desktop) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[#E9F390]/60 bg-[#40563D] p-6 sm:p-7 space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-bold text-[#E9F390] leading-snug">
                  Let’s stay close. Get fresh batch &amp; pantry updates.
                </h3>
                <p className="font-dm text-xs text-[#F2EBD0]/85">
                  Be first to know when fresh homemade Panjeeri &amp; SpiceMix jars roast fresh.
                </p>
              </div>

              {newsletterSubscribed ? (
                <div className="rounded-lg bg-[#DCE7C9] text-[#40563D] px-4 py-3 flex items-center gap-2 font-dm text-xs font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>You’re on the BAJOZ Pantry List!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    aria-label="Email address for fresh batch alerts"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F2EBD0] border border-[#E9F390] font-dm text-xs text-[#40563D] placeholder:text-[#5A4E38]/65 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#F2EBD0] hover:bg-[#E9F390] text-[#40563D] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-extrabold uppercase tracking-[0.08em] transition-all duration-150 cursor-pointer"
                  >
                    Join Pantry List
                  </button>
                </form>
              )}
            </div>

            <div className="flex items-center gap-2 font-dm text-xs font-semibold text-[#E9F390]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero Preservatives · 100% Halal &amp; Homemade</span>
            </div>
          </div>

          {/* Column 2: Shop (2 cols) */}
          <div className="lg:col-span-2 lg:pl-4 space-y-3.5">
            <h3 className="font-dm text-xs font-bold uppercase tracking-[0.14em] text-[#E9F390]">
              Shop
            </h3>
            <ul className="space-y-2.5 font-dm text-xs sm:text-sm text-[#F2EBD0]/90">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProductId(null);
                    setActivePageSlug('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Shop All
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePageSlug(null);
                    setActiveProductId('spicemix');
                  }}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  All-in-1 SpiceMix
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePageSlug(null);
                    setActiveProductId('panjeeri');
                  }}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Desi Ghee Panjeeri
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePageSlug(null);
                    setActiveProductId('toothpowder');
                  }}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Tooth Guardian
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProductId(null);
                    setActivePageSlug('guide');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#E9F390] hover:underline transition-colors cursor-pointer text-left font-bold"
                >
                  Recipe Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Learn (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-dm text-xs font-bold uppercase tracking-[0.14em] text-[#E9F390]">
              Learn
            </h3>
            <ul className="space-y-2.5 font-dm text-xs sm:text-sm text-[#F2EBD0]/90">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProductId(null);
                    setActivePageSlug('our-story');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateHomeSection('why-choose-bajoz')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Our Ingredients
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateHomeSection('reviews')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateHomeSection('faq')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  FAQs
                </button>
              </li>
              {publishedPages.map((page) => (
                <li key={page.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProductId(null);
                      setActivePageSlug(page.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-dm text-xs font-bold uppercase tracking-[0.14em] text-[#E9F390]">
              Policies
            </h3>
            <ul className="space-y-2.5 font-dm text-xs sm:text-sm text-[#F2EBD0]/90">
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('shipping')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Shipping &amp; Delivery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('returns')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Returns Policy (Final)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('terms')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('cookies')}
                  className="hover:text-[#E9F390] transition-colors cursor-pointer text-left"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Direct Contact (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-dm text-xs font-bold uppercase tracking-[0.14em] text-[#E9F390]">
              Contact
            </h3>
            <ul className="space-y-2.5 font-dm text-xs sm:text-sm text-[#F2EBD0]/90">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E9F390] shrink-0 mt-0.5" />
                <span>{settings.officeAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E9F390] shrink-0" />
                <span>+{settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E9F390] shrink-0" />
                <span>care@bajoz.pk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright, Brand Mark & Payment/Admin Row */}
        <div className="pt-8 sm:pt-10 flex flex-col md:flex-row items-center justify-between gap-6 font-dm text-xs text-[#F2EBD0]/85 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                navigateHomeSection();
              }}
              aria-label="BAJOZ Home"
              className="inline-block shrink-0"
            >
              <img
                src={BAJOZ_LOGOS.reversedOnGreen}
                alt="BAJOZ — The House of Naturals"
                className="h-9 w-auto object-contain"
              />
            </a>
            <p>© {new Date().getFullYear()} BAJOZ — The House of Naturals. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="px-3 py-1 rounded bg-[#DCE7C9] text-[#40563D] font-dm text-[11px] font-bold">
              Cash on Delivery
            </span>
            <span className="px-3 py-1 rounded bg-[#DCE7C9] text-[#40563D] font-dm text-[11px] font-bold">
              Bank Transfer
            </span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-2 text-[#E9F390] hover:underline transition-colors cursor-pointer font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {renderPolicyModal()}
    </footer>
  );
};
