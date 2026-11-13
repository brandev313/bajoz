/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types/shop';
import { ProductImage } from './ProductImage';
import { WaveDivider } from './WaveDivider';
import {
  Search,
  X,
  SlidersHorizontal,
  Heart,
  Star,
  Check,
  ShoppingBag,
  ArrowUpRight,
  ArrowLeft,
  LayoutGrid,
  List,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

type SortOption = 'featured' | 'best-selling' | 'title-asc' | 'title-desc';

export const ShopPage: React.FC = () => {
  const {
    products,
    reviews,
    addToCart,
    setIsCheckoutOpen,
    setActiveProductId,
    setActivePageSlug,
    toggleFavorite,
    isFavorite,
  } = useShop();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Search, Sort, View & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPackSize, setSelectedPackSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Per-card interactive variant & pack size selections
  const [cardVariantById, setCardVariantById] = useState<Record<string, string>>({});
  const [cardPackById, setCardPackById] = useState<Record<string, string>>({});
  const [addedById, setAddedById] = useState<Record<string, boolean>>({});

  const publishedProducts = useMemo(() => {
    const list = products.filter((p) => p.isPublished !== false);
    const orderMap: Record<string, number> = {
      spicemix: 1,
      panjeeri: 2,
      toothpowder: 3,
    };
    return [...list].sort(
      (a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99)
    );
  }, [products]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(publishedProducts.map((p) => p.category)));
    return ['All', ...unique];
  }, [publishedProducts]);

  const packSizeOptions = [
    { id: 'all', label: 'All Jar Sizes' },
    { id: '40g', label: '40 gm Jar' },
    { id: '80g', label: '80 gm Jar' },
    { id: '250g', label: '250 gm Jar' },
    { id: '450g', label: '450 gm Jar' },
    { id: '950g', label: '950 gm Jar' },
  ];

  const getProductReviewStats = (product: Product) => {
    const approved = reviews.filter((r) => r.isApproved !== false);
    const matching = approved.filter((r) => {
      const tag = (r.productTag || '').toLowerCase();
      if (product.id === 'spicemix') return tag.includes('spice');
      if (product.id === 'panjeeri') return tag.includes('panjeeri');
      if (product.id === 'toothpowder')
        return tag.includes('tooth') || tag.includes('guardian');
      return tag.includes(product.name.toLowerCase());
    });
    const list = matching.length > 0 ? matching : approved;
    const count = list.length;
    const avg =
      count > 0
        ? (list.reduce((s, r) => s + (r.rating || 5), 0) / count).toFixed(1)
        : '4.9';
    return { count, avg };
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPackSize('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedPackSize !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const filteredAndSortedProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = publishedProducts.filter((product) => {
      // 1. Search query match
      if (q) {
        const inName = product.name.toLowerCase().includes(q);
        const inCat = product.category.toLowerCase().includes(q);
        const inSub = (product.subtitle || '').toLowerCase().includes(q);
        const inDesc = (product.description || '').toLowerCase().includes(q);
        const inStory = (product.story || '').toLowerCase().includes(q);
        const inIng = (product.ingredients || []).some((i) =>
          i.toLowerCase().includes(q)
        );
        const inVar = (product.variants || []).some(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            (v.description || '').toLowerCase().includes(q)
        );
        const inDishKeywords =
          product.id === 'spicemix' &&
          [
            'biryani',
            'karahi',
            'quorma',
            'qourma',
            'nihari',
            'paya',
            'daal',
            'lentils',
            'vegetables',
            'roast',
            'fish',
            'kalaiji',
            'paste',
            'masala',
            'garlic',
            'ginger',
          ].some((kw) => kw.includes(q) || q.includes(kw));

        if (
          !inName &&
          !inCat &&
          !inSub &&
          !inDesc &&
          !inStory &&
          !inIng &&
          !inVar &&
          !inDishKeywords
        ) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Pack size filter
      if (selectedPackSize !== 'all') {
        const hasPack = (product.packSizes || []).some(
          (pk) => pk.id === selectedPackSize
        );
        if (!hasPack) return false;
      }

      // 4. Availability
      if (inStockOnly) {
        const totalStock = (product.variants || []).reduce(
          (sum, v) => sum + (v.stock ?? 20),
          0
        );
        if (totalStock <= 0 && (product.variants || []).length > 0) {
          return false;
        }
      }

      return true;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'title-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'title-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'best-selling') {
        const order: Record<string, number> = {
          spicemix: 1,
          panjeeri: 2,
          toothpowder: 3,
        };
        return (order[a.id] ?? 99) - (order[b.id] ?? 99);
      }
      return 0;
    });
  }, [
    publishedProducts,
    searchQuery,
    selectedCategory,
    selectedPackSize,
    inStockOnly,
    sortBy,
  ]);

  const handleQuickAdd = (product: Product, buyNow = false) => {
    const hasVariants =
      product.id !== 'spicemix' &&
      Array.isArray(product.variants) &&
      product.variants.length > 0;
    const variantId =
      cardVariantById[product.id] ||
      (hasVariants ? product.variants[0].id : 'default');
    const packId =
      cardPackById[product.id] || product.packSizes?.[0]?.id || 'default';

    addToCart(product, variantId, packId, 1);
    setAddedById((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedById((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);

    if (buyNow) {
      setIsCheckoutOpen(true);
    }
  };

  const renderFilterSidebarContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[#7A5C38]/25 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#40563D]" />
          <h2 className="font-serif text-base sm:text-lg font-extrabold text-[#40563D]">
            Shop Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-mono text-xs font-extrabold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#40563D] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2 border-b border-[#7A5C38]/25 pb-4">
        <h3 className="font-serif text-xs font-extrabold uppercase tracking-wider text-[#4A2E1B]">
          Category
        </h3>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? publishedProducts.length
                : publishedProducts.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]'
                    : 'bg-[#FFFDF9] hover:bg-[#F5EBC8]/70 text-[#5A4E38] border-[#7A5C38]/30'
                }`}
              >
                <span>{cat === 'All' ? 'All Products' : cat}</span>
                <span className="font-mono text-xs font-extrabold opacity-80">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pack / Jar Size Filter */}
      <div className="space-y-2 border-b border-[#7A5C38]/25 pb-4">
        <h3 className="font-serif text-xs font-extrabold uppercase tracking-wider text-[#4A2E1B]">
          Jar Size
        </h3>
        <div className="space-y-1.5">
          {packSizeOptions.map((pk) => {
            const isSelected = selectedPackSize === pk.id;
            return (
              <button
                key={pk.id}
                type="button"
                onClick={() => setSelectedPackSize(pk.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]'
                    : 'bg-[#FFFDF9] hover:bg-[#F5EBC8]/70 text-[#5A4E38] border-[#7A5C38]/30'
                }`}
              >
                <span>{pk.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#40563D]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Availability */}
      <div className="pt-0.5">
        <label className="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-[#4A2E1B] cursor-pointer select-none">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[#40563D] w-4 h-4 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F5EBC8] text-[#5A4E38]">
      {/* =====================================================================
          1. ABOVE-THE-FOLD SHOP HEADER + FILTERS + PRODUCTS IN FIRST VIEW
          ===================================================================== */}
      <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 bg-[#F5EBC8]">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-5">
          {/* Compact Top Bar: Breadcrumb + Page Title + Integrated Search & Sort */}
          <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] px-5 py-4 sm:px-7 sm:py-5 space-y-4">
            {/* Top Row: Breadcrumb & Back Link */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 font-medium text-[#786C57]"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActivePageSlug(null);
                    setActiveProductId(null);
                  }}
                  className="hover:text-[#40563D] hover:underline cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-[#40563D] font-bold">Shop All Products</span>
              </nav>

              <button
                type="button"
                onClick={() => {
                  setActivePageSlug(null);
                  setActiveProductId(null);
                }}
                className="inline-flex items-center gap-1.5 font-bold text-[#40563D] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Homepage</span>
              </button>
            </div>

            {/* Main Header Row: Page Title on Left + Search, Sort & View Controls on Right */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#40563D] leading-[1.08] tracking-tight">
                  Shop All BAJOZ Products
                </h1>
                <p className="text-xs sm:text-sm text-[#5A4E38] font-medium">
                  Showing {filteredAndSortedProducts.length} of {publishedProducts.length}{' '}
                  handcrafted household essentials
                </p>
              </div>

              {/* Search + Sort + Grid/List Controls */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 xl:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-72 lg:w-80">
                  <Search className="w-4 h-4 text-[#40563D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search SpiceMix, Panjeeri, Tooth Guardian..."
                    aria-label="Search products in shop"
                    className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] text-xs sm:text-sm font-medium text-[#2C221E] placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#786C57] hover:text-[#2C221E] rounded-full cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  {/* Mobile Filter Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen((prev) => !prev)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] text-xs font-extrabold cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#40563D] text-[#E9F399] font-mono text-[10px]">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Select */}
                  <div className="flex items-center gap-1.5">
                    <label
                      htmlFor="shop-sort-select"
                      className="text-xs font-bold text-[#5A4E38] whitespace-nowrap hidden sm:inline"
                    >
                      Sort:
                    </label>
                    <div className="relative">
                      <select
                        id="shop-sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none pl-3.5 pr-8 py-2.5 rounded-full bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] text-xs font-extrabold text-[#40563D] cursor-pointer focus:outline-none"
                      >
                        <option value="featured">Featured</option>
                        <option value="best-selling">Best Selling</option>
                        <option value="title-asc">Alphabetically: A–Z</option>
                        <option value="title-desc">Alphabetically: Z–A</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#40563D] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Grid / List Toggle */}
                  <div className="hidden sm:inline-flex items-center rounded-full bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                      className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-[#E9F399] text-[#40563D]'
                          : 'text-[#786C57] hover:text-[#40563D]'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                      className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                        viewMode === 'list'
                          ? 'bg-[#E9F399] text-[#40563D]'
                          : 'text-[#786C57] hover:text-[#40563D]'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Collapsible Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5">
              {renderFilterSidebarContent()}
            </div>
          )}

          {/* Main 2-Column Shopify Collection Grid: Left Faceted Filters + Right Product Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
            {/* Left Sidebar Filters (Desktop) */}
            <aside
              aria-label="Product Filters"
              className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5"
            >
              {renderFilterSidebarContent()}
            </aside>

            {/* Right Product Collection Grid / List */}
            <div className="lg:col-span-9">
              {filteredAndSortedProducts.length === 0 ? (
                <div className="rounded-[1.75rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-10 sm:p-14 text-center space-y-4">
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                    No Matching Products Found
                  </h2>
                  <p className="text-sm sm:text-base text-[#5A4E38] max-w-md mx-auto">
                    We couldn’t find any products matching your current search or filter
                    selection. Reset your filters to view all 3 signature BAJOZ products.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base font-extrabold cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Show All Products</span>
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6'
                      : 'space-y-5'
                  }
                >
                  {filteredAndSortedProducts.map((product) => {
                    const hasFlavourVariants =
                      product.id !== 'spicemix' &&
                      Array.isArray(product.variants) &&
                      product.variants.length > 1;
                    const activeVarId =
                      cardVariantById[product.id] ||
                      product.variants?.[0]?.id ||
                      'default';
                    const activePackId =
                      cardPackById[product.id] ||
                      product.packSizes?.[0]?.id ||
                      'default';
                    const { count: revCount, avg: revAvg } =
                      getProductReviewStats(product);
                    const isAdded = !!addedById[product.id];

                    return (
                      <article
                        key={product.id}
                        className={`rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-4 sm:p-5 flex ${
                          viewMode === 'list'
                            ? 'flex-col sm:flex-row gap-6 items-center'
                            : 'flex-col justify-between'
                        } transition-colors duration-200 hover:bg-[#FFFDF9]`}
                      >
                        {/* Product Image Stage */}
                        <div
                          className={
                            viewMode === 'list'
                              ? 'w-full sm:w-60 shrink-0'
                              : 'w-full mb-3.5'
                          }
                        >
                          <div
                            onClick={() => setActiveProductId(product.id)}
                            className="relative aspect-[4/3] sm:aspect-square rounded-[1.25rem] bg-[#B4CBA2] border-[1.5px] border-[#7A5C38] overflow-hidden flex items-center justify-center cursor-pointer group"
                          >
                            {/* Top-Left Category Badge */}
                            <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-[#F9F5E9]/95 border border-[#7A5C38] text-[10px] font-extrabold uppercase tracking-wider text-[#40563D]">
                              {product.category}
                            </span>

                            {/* Top-Right Favorite Heart Button */}
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
                              className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center border-[1.5px] border-[#7A5C38] transition-colors cursor-pointer ${
                                isFavorite(product.id)
                                  ? 'bg-[#E9F399] text-[#9B6A73]'
                                  : 'bg-[#F9F5E9]/95 hover:bg-[#E9F399] text-[#40563D]'
                              }`}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isFavorite(product.id)
                                    ? 'fill-[#9B6A73] text-[#9B6A73]'
                                    : ''
                                }`}
                              />
                            </button>

                            <ProductImage
                              type={product.imageType}
                              productId={product.id}
                              customImageUrl={product.customImageUrl}
                              fit="cover"
                              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                              alt={product.name}
                            />
                          </div>
                        </div>

                        {/* Product Details & Inline Variant/Size Controls */}
                        <div className="flex-1 flex flex-col justify-between space-y-3.5 w-full">
                          <div className="space-y-1.5">
                            {/* Rating & Price: N/A Row */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-0.5 text-[#C98A6A]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3.5 h-3.5 fill-current"
                                  />
                                ))}
                                <span className="ml-1 font-mono text-xs font-extrabold text-[#5A4E38]">
                                  {revAvg} ({revCount})
                                </span>
                              </div>
                              <span className="font-mono text-sm sm:text-base font-extrabold text-[#40563D] tabular-nums">
                                Price: N/A
                              </span>
                            </div>

                            {/* Title */}
                            <h2
                              onClick={() => setActiveProductId(product.id)}
                              className="font-serif text-lg sm:text-xl font-extrabold text-[#40563D] hover:underline cursor-pointer leading-snug"
                            >
                              {product.id === 'spicemix'
                                ? 'SpiceMix'
                                : product.id === 'panjeeri'
                                ? 'Homemade Panjeeri'
                                : product.name}
                            </h2>

                            {/* Short Description */}
                            <p className="text-xs text-[#2C221E] leading-relaxed line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          {/* Interactive Options Box (Flavour & Jar Size) */}
                          <div className="space-y-2 pt-2 border-t border-[#7A5C38]/20">
                            {hasFlavourVariants && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A4E38] block">
                                  Flavour:
                                </span>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {product.variants.map((v) => {
                                    const selected = v.id === activeVarId;
                                    return (
                                      <button
                                        key={v.id}
                                        type="button"
                                        onClick={() =>
                                          setCardVariantById((prev) => ({
                                            ...prev,
                                            [product.id]: v.id,
                                          }))
                                        }
                                        className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold border transition-colors cursor-pointer truncate ${
                                          selected
                                            ? 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]'
                                            : 'bg-[#FFFDF9] hover:bg-[#F5EBC8] text-[#5A4E38] border-[#7A5C38]/40'
                                        }`}
                                      >
                                        {v.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Jar Size Selector */}
                            {product.packSizes && product.packSizes.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A4E38] block">
                                  Jar Size:
                                </span>
                                <div
                                  className={`grid gap-1.5 ${
                                    product.packSizes.length >= 3
                                      ? 'grid-cols-3'
                                      : product.packSizes.length === 2
                                      ? 'grid-cols-2'
                                      : 'grid-cols-1'
                                  }`}
                                >
                                  {product.packSizes.map((pk) => {
                                    const selected = pk.id === activePackId;
                                    return (
                                      <button
                                        key={pk.id}
                                        type="button"
                                        onClick={() =>
                                          setCardPackById((prev) => ({
                                            ...prev,
                                            [product.id]: pk.id,
                                          }))
                                        }
                                        className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold border transition-colors cursor-pointer flex items-center justify-center text-center truncate ${
                                          selected
                                            ? 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]'
                                            : 'bg-[#FFFDF9] hover:bg-[#F5EBC8] text-[#5A4E38] border-[#7A5C38]/40'
                                        }`}
                                      >
                                        <span>{pk.unitWeight || pk.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Action Buttons */}
                          <div className="pt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(product, false)}
                              className="flex-1 py-2.5 px-3.5 rounded-full bg-[#40563D] hover:bg-[#334530] text-[#F9F5E9] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold tracking-tight transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>
                                {isAdded ? 'Added to Bag!' : 'Add · Price: N/A'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveProductId(product.id)}
                              aria-label={`View ${product.name} details`}
                              title="View Full Product Details"
                              className="px-3.5 py-2.5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <span>Details</span>
                              <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#F5EBC8" toColor="#FFFDF9" />

      {/* =====================================================================
          2. THREE CREDIBILITY BADGES UNDER ALL PRODUCTS (#FFFDF9 Pure White Cream)
             Followed by WaveDivider into #F5EBC8 so Important Notice is a separate section
          ===================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FFFDF9] bajoz-seamless-section">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-label="BAJOZ Product Credibility Badges"
            className="max-w-3xl mx-auto grid grid-cols-3 gap-4 sm:gap-8 place-items-center"
          >
            {[
              {
                top: '100%',
                label: 'HALAL',
                sub: 'Certified Pure',
                bgClass: 'bg-[#F9F5E9]',
                ringClass: 'border-[#40563D]/35',
              },
              {
                top: '100%',
                label: 'HomeMade',
                sub: 'Small Batch',
                bgClass: 'bg-[#E9F399]',
                ringClass: 'border-[#40563D]/45',
              },
              {
                top: '100%',
                label: 'Natural',
                sub: 'Zero Chemicals',
                bgClass: 'bg-[#F9F5E9]',
                ringClass: 'border-[#40563D]/35',
              },
            ].map((badge) => (
              <div
                key={badge.label}
                className={`w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full ${badge.bgClass} border-[1.5px] border-[#7A5C38] p-2.5 flex items-center justify-center text-center shadow-xs transition-transform duration-200 hover:scale-103`}
              >
                <div
                  className={`w-full h-full rounded-full border-[1.5px] border-dashed ${badge.ringClass} flex flex-col items-center justify-center px-2`}
                >
                  <span className="font-mono text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#40563D] leading-none tracking-tight">
                    {badge.top}
                  </span>
                  <span className="font-serif text-sm xs:text-base sm:text-xl lg:text-2xl font-extrabold text-[#4A2E1B] leading-tight mt-1">
                    {badge.label}
                  </span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#40563D]/85">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#40563D] shrink-0" />
                    <span>{badge.sub}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seamless Wave Transition into Pre-Footer Important Notice Section (#F5EBC8) */}
      <WaveDivider fromColor="#FFFDF9" toColor="#F5EBC8" flip />
    </div>
  );
};
