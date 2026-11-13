/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  User,
  Search,
  X,
  ArrowRight,
  Menu,
  Heart,
  Mic,
} from 'lucide-react';
import { ProductImage } from './ProductImage';
import { BAJOZ_LOGOS } from '../lib/brandAssets';

export const Header: React.FC = () => {
  const {
    settings,
    products,
    activePageSlug,
    setActivePageSlug,
    activeProductId,
    setActiveProductId,
    cartCount,
    setIsCartOpen,
    setCurrentView,
    setActiveCategoryFilter,
    addToCart,
    user,
    openAccountModal,
    favorites,
    setIsFavoritesOpen,
    toggleFavorite,
    isFavorite,
    setIsVoiceConciergeOpen,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const publishedProducts = products.filter((p) => p.isPublished !== false);
    if (!q) return publishedProducts;
    return publishedProducts.filter((product) => {
      const inName = product.name.toLowerCase().includes(q);
      const inCategory = product.category.toLowerCase().includes(q);
      const inDesc = product.description.toLowerCase().includes(q);
      const inSubtitle = (product.subtitle || '').toLowerCase().includes(q);
      const inTagline = (product.tagline || '').toLowerCase().includes(q);
      const inIngredients = (product.ingredients || []).some((i) =>
        i.toLowerCase().includes(q)
      );
      const inVariants = (product.variants || []).some(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.description || '').toLowerCase().includes(q)
      );
      return (
        inName ||
        inCategory ||
        inDesc ||
        inSubtitle ||
        inTagline ||
        inIngredients ||
        inVariants
      );
    });
  }, [products, searchQuery]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const handleSelectProduct = (productId: string) => {
    setCurrentView('store');
    setActivePageSlug(null);
    setActiveProductId(productId);
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchFocused || filteredProducts.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredProducts.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredProducts.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredProducts[highlightedIndex] || filteredProducts[0];
      if (target) {
        handleSelectProduct(target.id);
      }
    }
  };

  const navigateToSection = (category: string, sectionId: string) => {
    setActiveCategoryFilter(category);
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
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

  const renderSearchResults = () => (
    <div
      role="listbox"
      aria-label="Product search results"
      className="absolute left-0 right-0 md:left-auto md:right-0 md:w-[28rem] mt-2.5 bg-[#FFFDF9] border border-[#E6DDC8] rounded-2xl shadow-xl overflow-hidden z-50"
    >
      <div className="px-4 py-2.5 border-b border-[#E6DDC8] flex items-center justify-between bg-[#F9F5E9]">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#786C57]">
          {searchQuery.trim() ? 'Matching Products' : 'Shop Collection'}
        </span>
        <span className="text-[11px] font-medium text-[#786C57] tabular-nums">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="max-h-[60dvh] sm:max-h-88 overflow-y-auto divide-y divide-[#E6DDC8]">
          {filteredProducts.map((product, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={product.id}
                role="option"
                aria-selected={isHighlighted}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`w-full px-4 py-3 flex items-center gap-3.5 text-left transition-colors duration-150 group ${
                  isHighlighted ? 'bg-[#F9F5E9]' : 'hover:bg-[#F9F5E9]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-3.5 flex-1 min-w-0 text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5EBC8] shrink-0 border border-[#E6DDC8] p-1.5">
                    <ProductImage
                      type={product.imageType}
                      productId={product.id}
                      customImageUrl={product.customImageUrl}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-serif font-bold text-[#4A2E1B] truncate group-hover:text-[#40563D] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#786C57] truncate mt-0.5">
                      {product.category} ·{' '}
                      {product.packSizes?.map((pk) => pk.unitWeight).join(', ') ||
                        '250 gm, 450 gm, 950 gm'}{' '}
                      · Price: N/A
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    aria-label={
                      isFavorite(product.id)
                        ? `Remove ${product.name} from Favorites`
                        : `Save ${product.name} to Favorites`
                    }
                    aria-pressed={isFavorite(product.id)}
                    className={`p-2 rounded-full border transition-colors duration-150 cursor-pointer ${
                      isFavorite(product.id)
                        ? 'bg-[#E9F399] border-[#E6DDC8] text-[#9B6A73]'
                        : 'bg-[#FFFDF9] hover:bg-[#F5EBC8] border-[#E6DDC8] text-[#786C57] hover:text-[#9B6A73]'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorite(product.id) ? 'fill-[#9B6A73] text-[#9B6A73]' : ''
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const firstVariant = product.variants?.[0]?.id || 'default';
                      const firstPack = product.packSizes?.[0]?.id || 'default';
                      addToCart(product, firstVariant, firstPack, 1);
                      setIsSearchFocused(false);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-6 py-8 text-center space-y-3">
          <p className="text-sm font-medium text-[#4A2E1B]">
            No products found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-[#786C57]">
            Try searching for Panjeeri, SpiceMix, Tooth Guardian, or Desi Ghee.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsSearchFocused(false);
              setIsMobileMenuOpen(false);
              setActiveProductId(null);
              setActivePageSlug('shop');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#40563D] text-[#F9F5E9] cursor-pointer whitespace-nowrap"
          >
            <span>Browse All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header
      ref={searchContainerRef}
      className="sticky top-0 z-40 bg-[#F9F5E9]/98 backdrop-blur-xs border-b border-[#7A5C38]/20 transition-colors duration-200"
    >
      <div className="w-full max-w-[1680px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-24 min-h-15 sm:min-h-18 lg:min-h-20 py-2 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 xl:gap-7">
        {/* Zone 1: Mobile/Tablet Menu Button + Brand Wordmark / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
              setIsSearchFocused(false);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-[#4A2E1B] bg-[#FFFDF9] hover:bg-[#E9F399] border-[1.5px] border-[#7A5C38] rounded-full transition-colors duration-150 cursor-pointer shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-[#40563D]" />
            ) : (
              <Menu className="w-4 h-4 text-[#40563D]" />
            )}
          </button>

          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('store');
              setActivePageSlug(null);
              setActiveProductId(null);
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={settings.businessName || 'BAJOZ — The House of Naturals'}
            className="inline-flex items-center shrink-0 group focus:outline-none"
          >
            <img
              src={BAJOZ_LOGOS.primaryGreen}
              alt={settings.businessName || 'BAJOZ — The House of Naturals'}
              referrerPolicy="no-referrer"
              className="h-10 xs:h-11 sm:h-12 lg:h-14 xl:h-15 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] select-none"
            />
          </a>
        </div>

        {/* Zone 2: Clean Editorial Navigation Links (Desktop >= 1024px) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-10 text-xs xl:text-sm font-bold text-[#4A2E1B] shrink-0"
        >
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              setIsSearchFocused(false);
              setActiveProductId(null);
              setActivePageSlug('shop');
            }}
            className={`py-1 hover:text-[#40563D] hover:underline underline-offset-8 decoration-[#40563D] transition-colors duration-150 whitespace-nowrap shrink-0 ${
              activePageSlug === 'shop' && !activeProductId
                ? 'text-[#40563D] underline'
                : ''
            }`}
          >
            Shop All
          </a>
          <a
            href="/product/spicemix"
            onClick={(e) => {
              e.preventDefault();
              setActiveProductId('spicemix');
            }}
            className="py-1 hover:text-[#40563D] hover:underline underline-offset-8 decoration-[#40563D] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            SpiceMix
          </a>
          <a
            href="/product/panjeeri"
            onClick={(e) => {
              e.preventDefault();
              setActiveProductId('panjeeri');
            }}
            className="py-1 hover:text-[#40563D] hover:underline underline-offset-8 decoration-[#40563D] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Panjeeri
          </a>
          <a
            href="/product/toothpowder"
            onClick={(e) => {
              e.preventDefault();
              setActiveProductId('toothpowder');
            }}
            className="py-1 hover:text-[#40563D] hover:underline underline-offset-8 decoration-[#40563D] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Tooth Guardian
          </a>
          <a
            href="/guide"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              setIsSearchFocused(false);
              setActiveProductId(null);
              setActivePageSlug('guide');
            }}
            className="py-1 hover:text-[#40563D] hover:underline underline-offset-8 decoration-[#40563D] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Recipe Guide
          </a>
          <a
            href="#about-us"
            onClick={(e) => {
              e.preventDefault();
              navigateToSection('All', 'about-us');
            }}
            className="py-1 hover:text-[#40563D] hover:underline underline-offset-8 decoration-[#40563D] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Our Story
          </a>
        </nav>

        {/* Zone 3: Search, Voice Guide, Account, Saved & Cart (Responsive Across Mobile, Tablet & Desktop) */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 xl:gap-3 shrink-0">
          {/* Tablet & Desktop Search Bar (>= 768px) */}
          <div className="relative hidden md:block w-42 lg:w-44 xl:w-58 2xl:w-72">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const target = filteredProducts[highlightedIndex] || filteredProducts[0];
                if (target) {
                  handleSelectProduct(target.id);
                }
              }}
              className="relative flex items-center"
            >
              <Search className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#786C57] absolute left-3.5 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search products..."
                aria-label="Search products across the shop"
                className="w-full pl-9 pr-7 py-2 text-xs font-medium text-[#4A2E1B] placeholder-[#786C57] bg-[#FFFDF9] hover:bg-[#F5EBC8]/45 focus:bg-[#FFFDF9] border-[1.5px] border-[#7A5C38]/50 focus:border-[#40563D] rounded-full outline-none transition-colors duration-150"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 p-0.5 text-[#786C57] hover:text-[#4A2E1B] rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {isSearchFocused && renderSearchResults()}
          </div>

          {/* Mobile Search Toggle Button (< 768px) */}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen((prev) => !prev);
              setIsMobileMenuOpen(false);
            }}
            aria-label="Toggle product search"
            aria-expanded={isMobileSearchOpen}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-[#40563D] bg-[#FFFDF9] hover:bg-[#E9F399] border-[1.5px] border-[#7A5C38] rounded-full transition-colors duration-150 cursor-pointer shrink-0"
          >
            {isMobileSearchOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>

          {/* Live Voice Guide Button */}
          <button
            type="button"
            onClick={() => setIsVoiceConciergeOpen(true)}
            aria-label="Open Live Voice Guide"
            title="Context-Aware Live Voice Guide"
            className="inline-flex items-center justify-center gap-1.5 w-9 h-9 sm:w-10 sm:h-10 2xl:w-auto 2xl:px-3.5 text-xs font-extrabold text-[#40563D] bg-[#E9F399] hover:bg-[#dfeb82] border-[1.5px] border-[#7A5C38] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#40563D] shrink-0" />
            <span className="hidden 2xl:inline">Voice Guide</span>
          </button>

          {/* Account / Sign In Button */}
          <button
            type="button"
            onClick={() => openAccountModal('signin')}
            aria-label={user ? `Account (${user.name})` : 'Sign In'}
            className="inline-flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:h-10 sm:px-3.5 text-xs font-semibold text-[#4A2E1B] bg-[#FFFDF9] hover:bg-[#F5EBC8] border-[1.5px] border-[#7A5C38] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <User className="w-4 h-4 text-[#40563D] shrink-0" />
            <span className="hidden sm:inline max-w-[84px] truncate">
              {user ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Favorites Button */}
          <button
            type="button"
            onClick={() => setIsFavoritesOpen(true)}
            aria-label={`Open Favorites (${favorites.length} saved)`}
            title="Saved Favorites"
            className="relative inline-flex items-center justify-center gap-1 min-w-9 h-9 sm:min-w-10 sm:h-10 px-2.5 sm:px-3 text-xs font-semibold text-[#4A2E1B] bg-[#FFFDF9] hover:bg-[#F5EBC8] border-[1.5px] border-[#7A5C38] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 shrink-0 transition-colors ${
                favorites.length > 0
                  ? 'fill-[#9B6A73] text-[#9B6A73]'
                  : 'text-[#40563D]'
              }`}
            />
            {favorites.length > 0 && (
              <span className="font-mono text-[11px] sm:text-xs font-bold text-[#40563D] tabular-nums">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`View Cart (${cartCount} items)`}
            className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2.5 xs:px-3 sm:px-4 text-xs font-bold tracking-wider uppercase text-[#F9F5E9] bg-[#40563D] hover:bg-[#344731] border-[1.5px] border-[#7A5C38] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono text-[11px] sm:text-xs tabular-nums">
              ({cartCount})
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Bar Row (< 768px) */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-3 xs:px-4 sm:px-6 pb-3 pt-1 bg-[#F9F5E9] border-t border-[#E6DDC8]/60 relative">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const target = filteredProducts[highlightedIndex] || filteredProducts[0];
              if (target) {
                handleSelectProduct(target.id);
                setIsMobileSearchOpen(false);
              }
            }}
            className="relative flex items-center"
          >
            <Search className="w-4 h-4 text-[#786C57] absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              autoFocus
              onFocus={() => {
                setIsSearchFocused(true);
                setIsMobileMenuOpen(false);
              }}
              onKeyDown={handleSearchKeyDown}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              placeholder="Search SpiceMix, Panjeeri, Tooth Guardian..."
              aria-label="Search products across the shop"
              className="w-full pl-10 pr-9 py-2.5 text-xs font-medium text-[#4A2E1B] placeholder-[#786C57] bg-[#FFFDF9] focus:bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-full outline-none transition-colors duration-150"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 p-0.5 text-[#786C57] hover:text-[#4A2E1B] rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {isSearchFocused && renderSearchResults()}
        </div>
      )}

      {/* Mobile & Tablet Navigation Drawer (< 1024px) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 sm:px-8 py-5 bg-[#F9F5E9] border-t border-[#7A5C38]/30 space-y-4 shadow-xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
          {/* Quick Search Inside Mobile Menu Drawer (< md) */}
          <div className="md:hidden relative">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const target = filteredProducts[highlightedIndex] || filteredProducts[0];
                if (target) {
                  handleSelectProduct(target.id);
                }
              }}
              className="relative flex items-center"
            >
              <Search className="w-4 h-4 text-[#786C57] absolute left-3.5 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full pl-10 pr-9 py-2.5 text-xs font-medium text-[#4A2E1B] placeholder-[#786C57] bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-full outline-none"
              />
            </form>
            {isSearchFocused && renderSearchResults()}
          </div>

          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col divide-y divide-[#7A5C38]/20 text-sm font-bold text-[#4A2E1B]"
          >
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setIsSearchFocused(false);
                setActiveProductId(null);
                setActivePageSlug('shop');
              }}
              className="py-3.5 flex items-center justify-between hover:text-[#40563D]"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4 text-[#40563D]" />
            </a>
            <button
              type="button"
              onClick={() => handleSelectProduct('spicemix')}
              className="py-3.5 flex items-center justify-between hover:text-[#40563D] text-left cursor-pointer"
            >
              <span>SpiceMix</span>
              <ArrowRight className="w-4 h-4 text-[#40563D]" />
            </button>
            <a
              href="/guide"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setIsSearchFocused(false);
                setActiveProductId(null);
                setActivePageSlug('guide');
              }}
              className="py-3.5 flex items-center justify-between hover:text-[#40563D]"
            >
              <span>Interactive Kitchen Recipe Guide</span>
              <ArrowRight className="w-4 h-4 text-[#40563D]" />
            </a>
            <button
              type="button"
              onClick={() => handleSelectProduct('panjeeri')}
              className="py-3.5 flex items-center justify-between hover:text-[#40563D] text-left cursor-pointer"
            >
              <span>Panjeeri</span>
              <ArrowRight className="w-4 h-4 text-[#40563D]" />
            </button>
            <button
              type="button"
              onClick={() => handleSelectProduct('toothpowder')}
              className="py-3.5 flex items-center justify-between hover:text-[#40563D] text-left cursor-pointer"
            >
              <span>Tooth Guardian</span>
              <ArrowRight className="w-4 h-4 text-[#40563D]" />
            </button>
            <a
              href="#about-us"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection('All', 'about-us');
              }}
              className="py-3.5 flex items-center justify-between hover:text-[#40563D]"
            >
              <span>Our Story</span>
              <ArrowRight className="w-4 h-4 text-[#40563D]" />
            </a>
            <a
              href="#reviews"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection('All', 'reviews');
              }}
              className="py-3.5 flex items-center justify-between hover:text-[#40563D]"
            >
              <span>Customer Reviews</span>
              <ArrowRight className="w-4 h-4 text-[#40563D]" />
            </a>
          </nav>

          {/* Quick Actions in Mobile/Tablet Menu */}
          <div className="pt-2 grid grid-cols-1 xs:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsVoiceConciergeOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#40563D] bg-[#E9F399] hover:bg-[#dfeb82] border-[1.5px] border-[#7A5C38] rounded-full cursor-pointer whitespace-nowrap"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Live Voice Guide</span>
            </button>

            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAccountModal('signin');
                }}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#4A2E1B] bg-[#FFFDF9] hover:bg-[#F5EBC8] border-[1.5px] border-[#7A5C38] rounded-full cursor-pointer whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-[#40563D]" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAccountModal('signin');
                }}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#4A2E1B] bg-[#FFFDF9] hover:bg-[#F5EBC8] border-[1.5px] border-[#7A5C38] rounded-full cursor-pointer whitespace-nowrap truncate"
              >
                <User className="w-3.5 h-3.5 text-[#40563D]" />
                <span className="truncate">My Account ({user.name.split(' ')[0]})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
