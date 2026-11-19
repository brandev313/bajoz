/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { Product } from '../types/shop';
import {
  X,
  Heart,
  Trash2,
  ShoppingBag,
  ArrowUpRight,
  Check,
  Sparkles,
} from 'lucide-react';

export const FavoritesDrawer: React.FC = () => {
  const {
    products,
    favorites,
    isFavoritesOpen,
    setIsFavoritesOpen,
    toggleFavorite,
    clearFavorites,
    addToCart,
    setActiveProductId,
    setActivePageSlug,
    setCurrentView,
    setIsCartOpen,
  } = useShop();

  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});
  const [addedAllFeedback, setAddedAllFeedback] = useState(false);

  if (!isFavoritesOpen) return null;

  const favoriteProducts = products.filter(
    (p) => favorites.includes(p.id) && p.isPublished !== false
  );

  const handleQuickAdd = (product: Product) => {
    const defaultVariantId =
      product.id !== 'spicemix' && product.variants?.[0]?.id
        ? product.variants[0].id
        : 'default';
    const defaultPackId = product.packSizes?.[0]?.id || 'default';
    addToCart(product, defaultVariantId, defaultPackId, 1);
    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  const handleAddAllToCart = () => {
    if (favoriteProducts.length === 0) return;
    favoriteProducts.forEach((product) => {
      const defaultVariantId =
        product.id !== 'spicemix' && product.variants?.[0]?.id
          ? product.variants[0].id
          : 'default';
      const defaultPackId = product.packSizes?.[0]?.id || 'default';
      addToCart(product, defaultVariantId, defaultPackId, 1);
    });
    setAddedAllFeedback(true);
    setTimeout(() => {
      setAddedAllFeedback(false);
      setIsFavoritesOpen(false);
      setIsCartOpen(true);
    }, 900);
  };

  const handleOpenProduct = (productId: string) => {
    setCurrentView('store');
    setActivePageSlug(null);
    setActiveProductId(productId);
    setIsFavoritesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Favorites"
    >
      <div
        onClick={() => setIsFavoritesOpen(false)}
        className="absolute inset-0 bg-[#40563D]/60 backdrop-blur-2xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#F2EBD0] border-l border-[#40563D] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-[#40563D]/25 bg-[#F2EBD0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E9F390] border border-[#5A4E38]/40 flex items-center justify-center text-[#40563D] shrink-0">
                <Heart className="w-4 h-4 fill-[#40563D] text-[#40563D]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#40563D]">
                  Your Favorites
                </h2>
                <p className="text-xs text-[#5A4E38]">
                  {favoriteProducts.length}{' '}
                  {favoriteProducts.length === 1
                    ? 'saved product'
                    : 'saved products'}{' '}
                  in your wishlist
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFavoritesOpen(false)}
              aria-label="Close favorites drawer"
              className="p-2 text-[#5A4E38] hover:text-[#40563D] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info Strip */}
          <div className="px-4 py-3 sm:px-6 bg-[#E9F390]/65 border-b border-[#40563D]/25 text-xs flex items-center justify-between gap-2 text-[#40563D]">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#40563D] shrink-0" />
              <span>Saved automatically on this device for your next visit</span>
            </span>
            {favoriteProducts.length > 0 && (
              <button
                type="button"
                onClick={clearFavorites}
                className="text-[11px] font-semibold text-[#5A4E38] hover:underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Favorites List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F2EBD0]">
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#F2EBD0] border border-[#40563D]/35 flex items-center justify-center mx-auto text-[#40563D]">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="font-serif text-2xl text-[#40563D]">
                  No favorites saved yet.
                </p>
                <p className="text-xs text-[#5A4E38] max-w-xs mx-auto leading-relaxed">
                  Tap the heart icon on any BAJOZ product card — like our HomeMade
                  Panjeeri, SpiceMix, or Tooth Guardian — to save it here for quick
                  access.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsFavoritesOpen(false);
                    document
                      .getElementById('collection')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors"
                >
                  Explore Our Products
                </button>
              </div>
            ) : (
              favoriteProducts.map((product) => {
                const defaultPack =
                  product.packSizes?.[0]?.unitWeight || 'Standard Jar';
                const isJustAdded = addedFeedback[product.id];
                const identityColorClass = 'text-[#5A4E38]';

                return (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-[#F2EBD0] border-[1.5px] border-[#5A4E38] shadow-2xs flex flex-col gap-3.5 transition-all"
                  >
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleOpenProduct(product.id)}
                        className="w-20 h-20 rounded-xl bg-[#FAF9F4] p-2 shrink-0 flex items-center justify-center border border-[#5A4E38] cursor-pointer group"
                      >
                        <ProductImage
                          type={product.imageType}
                          productId={product.id}
                          customImageUrl={product.customImageUrl}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          alt={product.name}
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenProduct(product.id)}
                            className="text-left cursor-pointer group"
                          >
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider block ${identityColorClass}`}
                            >
                              {product.category}
                            </span>
                            <h3 className="font-serif text-lg font-semibold text-[#40563D] group-hover:underline transition-colors leading-snug">
                              {product.id === 'panjeeri'
                                ? 'HomeMade Panjeeri'
                                : product.name}
                            </h3>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleFavorite(product.id)}
                            aria-label={`Remove ${product.name} from favorites`}
                            title="Remove from Favorites"
                            className="p-1.5 rounded-full text-[#5A4E38] hover:bg-[#F2EBD0] transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-[#5A4E38] mt-0.5">
                          Sizes:{' '}
                          {product.packSizes?.map((pk) => pk.unitWeight).join(', ') ||
                            defaultPack}
                        </p>
                        <p className="font-serif text-base font-bold text-[#40563D] mt-1 tabular-nums">
                          Price: N/A
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-2 border-t border-[#40563D]/20">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          isJustAdded
                            ? 'bg-[#5A4E38] text-[#F2EBD0]'
                            : 'bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D]'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenProduct(product.id)}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#F2EBD0] hover:bg-[#E9F390] text-[#40563D] border border-[#40563D]/35 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#40563D]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {favoriteProducts.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#40563D]/25 bg-[#F2EBD0] space-y-3">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="w-full py-3.5 bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {addedAllFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>All Favorites Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add All ({favoriteProducts.length}) to Shopping Bag
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
