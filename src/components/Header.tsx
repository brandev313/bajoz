/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Heart,
  Search,
  ArrowUpRight,
  Mic,
} from 'lucide-react';
import { ProductImage } from './ProductImage';
import { BAJOZ_LOGOS } from '../lib/brandAssets';
import { ScallopedHeaderEdge } from './WaveDivider';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    user,
    logoutUser,
    openAccountModal,
    setActiveProductId,
    activeProductId,
    activePageSlug,
    setActivePageSlug,
    favorites,
    setIsFavoritesOpen,
    products,
    setIsVoiceConciergeOpen,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const publishedProducts = products.filter((p) => p.isPublished !== false);

  const filteredSearchProducts = searchQuery.trim()
    ? publishedProducts.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        const inSub = (p.subtitle || '').toLowerCase().includes(q);
        const inDesc = (p.description || '').toLowerCase().includes(q);
        const inIng = (p.ingredients || []).some((i) =>
          i.toLowerCase().includes(q)
        );
        const inVar = (p.variants || []).some((v) =>
          v.name.toLowerCase().includes(q)
        );
        return inName || inCat || inSub || inDesc || inIng || inVar;
      })
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateHomeSection = (sectionId?: string) => {
    setActiveProductId(null);
    setActivePageSlug(null);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    {
      label: 'Shop All',
      isActive: activePageSlug === 'shop',
      onClick: () => {
        setActiveProductId(null);
        setActivePageSlug('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'SpiceMix',
      isActive: activeProductId === 'spicemix',
      onClick: () => {
        setActivePageSlug(null);
        setActiveProductId('spicemix');
      },
    },
    {
      label: 'Panjeeri',
      isActive: activeProductId === 'panjeeri',
      onClick: () => {
        setActivePageSlug(null);
        setActiveProductId('panjeeri');
      },
    },
    {
      label: 'Tooth Guardian',
      isActive: activeProductId === 'toothpowder',
      onClick: () => {
        setActivePageSlug(null);
        setActiveProductId('toothpowder');
      },
    },
    {
      label: 'Recipe Guide',
      isActive: activePageSlug === 'guide',
      onClick: () => {
        setActiveProductId(null);
        setActivePageSlug('guide');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'Our Story',
      isActive: activePageSlug === 'our-story',
      onClick: () => {
        setActiveProductId(null);
        setActivePageSlug('our-story');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F2EBD0]/98 backdrop-blur-md">
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 lg:gap-8">
          {/* Zone 1: Brand Wordmark Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              navigateHomeSection();
            }}
            aria-label="BAJOZ — The House of Naturals Home"
            className="flex items-center shrink-0 whitespace-nowrap py-1"
          >
            <img
              src={BAJOZ_LOGOS.primaryGreen}
              alt="BAJOZ — The House of Naturals"
              className="h-9 sm:h-10 lg:h-11 w-auto object-contain"
            />
          </a>

          {/* Zone 2: Minimal Single-Line Navigation Anchors (Tablet Landscape lg+ & Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-3 xl:gap-5 font-dm text-sm font-semibold tracking-tight text-[#40563D]"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`relative px-2.5 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                  item.isActive
                    ? 'bg-[#5A4E38] text-[#F2EBD0] font-bold'
                    : 'text-[#40563D]/90 hover:bg-[#5A4E38] hover:text-[#F2EBD0]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Minimal Utility Icons + Primary Bag Action */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Expandable Desktop Search */}
            <div ref={searchContainerRef} className="hidden sm:block relative">
              {searchOpen ? (
                <div className="relative flex items-center w-52 lg:w-64">
                  <Search className="w-3.5 h-3.5 text-[#40563D] absolute left-3.5 pointer-events-none" />
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    placeholder="Search Panjeeri, SpiceMix..."
                    aria-label="Search BAJOZ products"
                    className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#5A4E38] font-dm text-xs text-[#40563D] placeholder:text-[#5A4E38]/65 focus:outline-none focus:border-[#40563D] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchOpen(false);
                    }}
                    aria-label="Close search"
                    className="absolute right-2.5 p-0.5 text-[#40563D] hover:text-[#5A4E38] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search products"
                  title="Search products"
                  className="w-10 h-10 flex items-center justify-center text-[#40563D] hover:bg-[#DCE7C9]/60 rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Search Dropdown Results */}
              {searchOpen && isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-[#F2EBD0] rounded-xl border-2 border-[#5A4E38] shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                  {filteredSearchProducts.length > 0 ? (
                    <div className="divide-y divide-[#5A4E38]/25">
                      {filteredSearchProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setActivePageSlug(null);
                            setActiveProductId(product.id);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            setSearchOpen(false);
                          }}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-[#DCE7C9]/50 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-[#FAF9F4] border border-[#5A4E38] overflow-hidden shrink-0 flex items-center justify-center">
                              <ProductImage
                                type={product.imageType}
                                productId={product.id}
                                customImageUrl={product.customImageUrl}
                                fit="cover"
                                className="w-full h-full"
                                alt={product.name}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-display text-sm font-bold text-[#40563D] truncate">
                                {product.name}
                              </p>
                              <p className="font-dm text-[11px] font-medium truncate text-[#5A4E38]">
                                {product.category}
                              </p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-[#40563D] shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-5 text-center space-y-1">
                      <p className="font-display text-sm font-bold text-[#40563D]">
                        No matching products found
                      </p>
                      <p className="font-dm text-xs text-[#5A4E38]">
                        Try searching for SpiceMix, Panjeeri, or Tooth Guardian.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Voice Kitchen Concierge */}
            <button
              type="button"
              onClick={() => setIsVoiceConciergeOpen(true)}
              aria-label="Open BAJOZ Voice Kitchen & Nutrition Guide"
              title="Voice Kitchen Guide"
              className="w-10 h-10 flex items-center justify-center text-[#40563D] hover:bg-[#DCE7C9]/60 rounded-lg transition-colors duration-150 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Favorites */}
            <button
              type="button"
              onClick={() => setIsFavoritesOpen(true)}
              aria-label={`Saved Favorites (${favorites.length} items)`}
              title="Saved Favorites"
              className="relative min-w-[40px] h-10 px-2 text-[#40563D] hover:bg-[#DCE7C9]/60 rounded-lg transition-colors duration-150 cursor-pointer flex items-center justify-center"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorites.length > 0 ? 'fill-[#40563D] text-[#40563D]' : ''
                }`}
              />
              {favorites.length > 0 && (
                <span className="ml-1 font-dm text-[11px] font-bold text-[#40563D] tabular-nums">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Account */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DCE7C9] hover:bg-[#E9F390] text-[#40563D] font-dm text-xs font-bold transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#F2EBD0] rounded-xl shadow-lg border-2 border-[#5A4E38] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#5A4E38]/25">
                      <p className="font-dm text-xs font-bold text-[#40563D] truncate">
                        {user.name}
                      </p>
                      <p className="font-dm text-[11px] text-[#5A4E38] truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left font-dm text-xs text-[#40563D] hover:bg-[#DCE7C9]/50 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAccountModal('signin')}
                aria-label="Sign in or manage account"
                title="Account"
                className="hidden sm:inline-flex w-10 h-10 items-center justify-center text-[#40563D] hover:bg-[#DCE7C9]/60 rounded-lg transition-colors duration-150 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
              </button>
            )}

            {/* Primary Action: Shopping Bag CTA (Fresh Lime Yellow + Earthy Brown text/shadow) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping bag (${cartCount} items)`}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 sm:px-4 py-2 bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-dm text-xs font-bold uppercase tracking-[0.05em] tabular-nums">
                Bag ({cartCount})
              </span>
            </button>

            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#40563D] hover:bg-[#DCE7C9]/60 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu — Warm Cream (#F2EBD0) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F2EBD0] border-t border-[#5A4E38]/25 px-5 sm:px-8 pt-5 pb-8 space-y-2 max-h-[82vh] overflow-y-auto">
          {/* Mobile Search Bar */}
          <div className="pb-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#40563D] absolute left-3.5 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Panjeeri, SpiceMix, Tooth Guardian..."
                aria-label="Search BAJOZ products"
                className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-[#FAF9F4] border border-[#5A4E38] font-dm text-xs font-medium text-[#40563D] placeholder:text-[#5A4E38]/70 focus:outline-none focus:border-[#40563D]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 p-1 text-[#5A4E38]/70 hover:text-[#40563D] rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery.trim().length > 0 && (
              <div className="mt-2 rounded-xl bg-[#FAF9F4] border border-[#5A4E38] divide-y divide-[#5A4E38]/25 overflow-hidden">
                {filteredSearchProducts.length > 0 ? (
                  filteredSearchProducts.map((product) => (
                    <button
                      key={`mob-search-${product.id}`}
                      type="button"
                      onClick={() => {
                        setActivePageSlug(null);
                        setActiveProductId(product.id);
                        setMobileMenuOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-[#DCE7C9]/60 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="font-display text-sm font-bold text-[#40563D]">
                        {product.name}
                      </span>
                      <span className="font-dm text-xs font-bold text-[#5A4E38]">
                        View →
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3.5 py-3 text-xs text-[#5A4E38] text-center">
                    No matching products found.
                  </p>
                )}
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full text-left min-h-[48px] py-2.5 font-heading text-xl font-bold text-[#40563D] border-b border-[#5A4E38]/20 cursor-pointer"
            >
              {item.label}
            </button>
          ))}

          {!user && (
            <div className="pt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAccountModal('signin');
                }}
                className="flex-1 min-h-[46px] py-3 px-5 rounded-lg bg-[#E9F390] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] font-dm text-xs font-bold text-[#5A4E38] text-center uppercase tracking-wider cursor-pointer"
              >
                Login / Account
              </button>
            </div>
          )}
        </div>
      )}
      <ScallopedHeaderEdge fillColor="#F2EBD0" strokeColor="#5A4E38" />
    </header>
  );
};
