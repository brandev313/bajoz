/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { WaveDivider } from './WaveDivider';
import { X, ShieldAlert, Truck, FileText, Lock, ArrowRight } from 'lucide-react';
import { BAJOZ_LOGOS } from '../lib/brandAssets';

type PolicyModalType = 'shipping' | 'returns' | 'privacy' | 'terms' | null;

export const Footer: React.FC = () => {
  const {
    settings,
    siteCopy,
    activePageSlug,
    setActivePageSlug,
    activeProductId,
    setActiveProductId,
    setIsTrackingOpen,
    setIsAccountOpen,
  } = useShop();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<PolicyModalType>(null);

  const navigateToSection = (sectionId: string) => {
    if (activePageSlug || activeProductId) {
      setActivePageSlug(null);
      setActiveProductId(null);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  const renderPolicyModalContent = () => {
    if (!activePolicyModal) return null;

    const config = {
      shipping: {
        title: 'Shipping Information & Nationwide Delivery',
        badge: 'Shipping Policy',
        icon: <Truck className="w-5 h-5 text-[#40563D]" />,
        body:
          siteCopy.shippingPolicyText ||
          'We dispatch fresh jars across Pakistan via trusted courier partners (2–4 working days nationwide, same/next-day options in Lahore). Standard courier fee is PKR 200, with complimentary free shipping on orders above PKR 2,500.',
      },
      returns: {
        title: 'No Returns & No Refunds Policy',
        badge: 'Strict Final Sale Policy',
        icon: <ShieldAlert className="w-5 h-5 text-[#9B6A73]" />,
        body:
          siteCopy.returnsPolicyText ||
          'All sales are final. Because BAJOZ products are freshly prepared, consumable food and personal-care items, we do not offer returns, exchanges, or refunds once an order is placed or delivered. Please review all listed ingredients, pack sizes, and product details carefully before ordering.',
      },
      privacy: {
        title: 'Privacy Policy',
        badge: 'Customer Privacy',
        icon: <Lock className="w-5 h-5 text-[#40563D]" />,
        body:
          siteCopy.privacyPolicyText ||
          'Your personal contact and delivery details are used strictly to process, dispatch, and support your BAJOZ orders. We never sell or share your household data with third-party marketers.',
      },
      terms: {
        title: 'Terms & Conditions',
        badge: 'Storefront Terms',
        icon: <FileText className="w-5 h-5 text-[#40563D]" />,
        body:
          siteCopy.termsConditionsText ||
          'By ordering from BAJOZ — The House of Naturals, you acknowledge that our products are traditional foods and natural personal-care items (not medical advice or treatment) and that all purchases are final with no returns or refunds.',
      },
    }[activePolicyModal];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5A4E38]/65 backdrop-blur-2xs">
        <div className="relative w-full max-w-lg bg-[#FFFDF9] text-[#5A4E38] rounded-3xl p-6 sm:p-8 border border-[#E6DDC8] shadow-2xl space-y-5">
          <div className="flex items-start justify-between gap-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F5EBC8] border border-[#E6DDC8] flex items-center justify-center shrink-0">
                {config.icon}
              </div>
              <div>
                <span className="bajoz-script-kicker text-lg text-[#40563D] block">
                  {config.badge}
                </span>
                <h3 className="bajoz-poster-display text-xl sm:text-2xl text-[#4A2E1B]">
                  {config.title}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActivePolicyModal(null)}
              className="p-1.5 text-[#786C57] hover:text-[#5A4E38] rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-2 text-xs sm:text-sm text-[#5A4E38] leading-relaxed whitespace-pre-line">
            {config.body}
          </div>

          <div className="pt-2 text-xs text-[#5A4E38] leading-relaxed">
            <strong className="text-[#40563D] font-semibold">
              {siteCopy.disclaimerBadge || 'Disclaimer'}:
            </strong>{' '}
            {siteCopy.disclaimerText}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            {activePolicyModal === 'shipping' && (
              <button
                type="button"
                onClick={() => {
                  setActivePolicyModal(null);
                  setIsTrackingOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9] text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Track Existing Order
              </button>
            )}
            <button
              type="button"
              onClick={() => setActivePolicyModal(null)}
              className="px-6 py-2.5 rounded-full bg-[#F5EBC8] hover:bg-[#E9F399] text-[#4A2E1B] border border-[#40563D]/35 text-xs font-extrabold uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Seamless Wavy Starting Transition into Footer (#F9F5E9 Soft Ivory) */}
      <WaveDivider fromColor="#F5EBC8" toColor="#F9F5E9" />

      <footer className="bg-[#F9F5E9] text-[#5A4E38] pt-16 sm:pt-24 pb-24 sm:pb-20">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-14 lg:gap-16 pb-12 sm:pb-16">
            {/* Brand & Stay Connected Column */}
            <div className="sm:col-span-2 lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePageSlug(null);
                    setActiveProductId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label={settings.businessName || 'BAJOZ — The House of Naturals'}
                  className="inline-block focus:outline-none group"
                >
                  <img
                    src={BAJOZ_LOGOS.primaryGreen}
                    alt={settings.businessName || 'BAJOZ — The House of Naturals'}
                    referrerPolicy="no-referrer"
                    className="h-16 sm:h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] select-none"
                  />
                </a>
                <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
                  {siteCopy.footerTagline || 'The goodness of home, made for today.'}
                </p>
              </div>

              <div className="pt-2 space-y-3.5 max-w-md">
                <h4 className="bajoz-script-kicker text-2xl text-[#40563D]">
                  Join Our Family Table
                </h4>
                <p className="text-sm text-[#5A4E38] leading-relaxed">
                  Follow BAJOZ for fresh batch updates, traditional recipes, and everyday
                  homemade goodness.
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-5 py-3.5 rounded-full bg-[#FFFDF9] border border-[#E6DDC8] focus:border-[#40563D] text-xs sm:text-sm text-[#4A2E1B] placeholder:text-[#786C57] focus:outline-none transition-colors duration-150"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9] text-xs font-extrabold uppercase tracking-[0.1em] transition-colors duration-150 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>{subscribed ? 'Signed Up' : 'Sign Me Up'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Shop Column */}
            <div className="lg:col-span-2 space-y-4">
              <p className="bajoz-script-kicker text-xl text-[#40563D]">
                {siteCopy.footerCollectionHeading || 'Our Range'}
              </p>
              <h4 className="bajoz-poster-display text-lg text-[#4A2E1B]">
                Shop Products
              </h4>
              <ul className="space-y-3 text-sm text-[#5A4E38] pt-1">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProductId(null);
                      setActivePageSlug('shop');
                    }}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    View All Products
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveProductId('panjeeri')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Panjeeri
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveProductId('spicemix')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    SpiceMix
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveProductId('toothpowder')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Tooth Guardian
                  </button>
                </li>
              </ul>
            </div>

            {/* Help & Policies Column */}
            <div className="lg:col-span-3 space-y-4">
              <p className="bajoz-script-kicker text-xl text-[#40563D]">
                Customer Care
              </p>
              <h4 className="bajoz-poster-display text-lg text-[#4A2E1B]">
                {siteCopy.footerDispatchHeading || 'Help & Policies'}
              </h4>
              <ul className="space-y-3 text-sm text-[#5A4E38] pt-1">
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                      settings.whatsappGreeting
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#40563D] transition-colors duration-150 font-medium"
                  >
                    Order Now on WhatsApp
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('faq')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('shipping')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Shipping Information
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('returns')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    No Returns / No Refunds Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Discover BAJOZ Column */}
            <div className="lg:col-span-2 space-y-4">
              <p className="bajoz-script-kicker text-xl text-[#40563D]">
                Heritage &amp; Trust
              </p>
              <h4 className="bajoz-poster-display text-lg text-[#4A2E1B]">
                Discover BAJOZ
              </h4>
              <ul className="space-y-3 text-sm text-[#5A4E38] pt-1">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('about-us')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Our Story
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('reviews')}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Customer Reviews
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsTrackingOpen(true)}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(true)}
                    className="hover:text-[#40563D] transition-colors duration-150 cursor-pointer text-left font-medium"
                  >
                    Customer Account
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#7A5C38]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#786C57]">
            <div className="flex items-center gap-3">
              <img
                src={BAJOZ_LOGOS.monoBark}
                alt="BAJOZ Monochrome Emblem"
                referrerPolicy="no-referrer"
                className="h-8 w-auto object-contain opacity-85 select-none"
              />
              <span>© BAJOZ — The House of Naturals. All rights reserved.</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setActivePolicyModal('privacy')}
                className="hover:text-[#40563D] underline-offset-4 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setActivePolicyModal('terms')}
                className="hover:text-[#40563D] underline-offset-4 hover:underline cursor-pointer"
              >
                Terms and Conditions
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setActivePolicyModal('shipping')}
                className="hover:text-[#40563D] underline-offset-4 hover:underline cursor-pointer"
              >
                Shipping Policy
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setActivePolicyModal('returns')}
                className="hover:text-[#40563D] underline-offset-4 hover:underline cursor-pointer font-semibold text-[#40563D]"
              >
                No Returns / Refunds Policy
              </button>
            </div>
          </div>
        </div>

        {renderPolicyModalContent()}
      </footer>
    </>
  );
};
