/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop, calculateVariantPrice } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { X, Minus, Plus, Check, Heart } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    toggleFavorite,
    isFavorite,
  } = useShop();
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedPackId, setSelectedPackId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'ingredients' | 'usage' | 'faqs'>('story');

  useEffect(() => {
    if (activeProductModal) {
      setSelectedVariantId(activeProductModal.variants[0]?.id || '');
      setSelectedPackId(activeProductModal.packSizes[0]?.id || '');
      setQuantity(1);
      setActiveTab('story');
    }
  }, [activeProductModal]);

  if (!activeProductModal) return null;

  const hasMultipleVariants =
    Array.isArray(activeProductModal.variants) &&
    activeProductModal.variants.length > 1 &&
    activeProductModal.id !== 'spicemix';
  const variant =
    activeProductModal.id !== 'spicemix' && Array.isArray(activeProductModal.variants)
      ? activeProductModal.variants.find((v) => v.id === selectedVariantId) ||
        activeProductModal.variants[0]
      : undefined;
  const pack =
    activeProductModal.packSizes.find((p) => p.id === selectedPackId) ||
    activeProductModal.packSizes[0];

  const unitPrice = calculateVariantPrice(
    activeProductModal.basePrice,
    variant ? variant.priceAdjustment : 0,
    pack ? pack.priceMultiplier : 1
  );

  const isOutOfStock = variant ? variant.stock <= 0 : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#5A4E38]/55 backdrop-blur-2xs">
      <div className="relative w-full max-w-4xl bg-[#F2EBD0] rounded-3xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col border-2 border-[#5A4E38]">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F2EBD0] border-b border-[#5A4E38]/30 flex items-center justify-between gap-2">
          <div className="text-xs text-[#40563D] font-semibold truncate">
            <span>{activeProductModal.category}</span>
            <span> · </span>
            <span className="font-mono text-[#5A4E38]">
              SKU:{' '}
              {variant?.sku ||
                (activeProductModal.id === 'spicemix' ? 'BZ-SPX-STD' : 'BAJOZ-01')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveProductModal(null)}
            className="p-1.5 text-[#5A4E38] hover:text-[#5A4E38] hover:bg-[#F2EBD0] rounded-full cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 xs:p-6 sm:p-8 space-y-6 sm:space-y-8 bg-[#F2EBD0]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Studio Image Stage — Pure White Cream (#FAF9F4) Background */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative bg-[#FAF9F4] border-[1.5px] border-[#5A4E38] rounded-2xl p-5 sm:p-6 aspect-square flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => toggleFavorite(activeProductModal.id)}
                  aria-label={
                    isFavorite(activeProductModal.id)
                      ? `Remove ${activeProductModal.name} from Favorites`
                      : `Save ${activeProductModal.name} to Favorites`
                  }
                  aria-pressed={isFavorite(activeProductModal.id)}
                  title={
                    isFavorite(activeProductModal.id)
                      ? 'Saved in Favorites — click to remove'
                      : 'Save to Favorites'
                  }
                  className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-xs ${
                    isFavorite(activeProductModal.id)
                      ? 'bg-[#E9F390] border-[#40563D]/30 text-[#9B6A73]'
                      : 'bg-[#FAF9F4] hover:bg-[#F2EBD0] border-[#E9F390] text-[#5A4E38] hover:text-[#5A4E38]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(activeProductModal.id)
                        ? 'fill-[#9B6A73] text-[#9B6A73]'
                        : ''
                    }`}
                  />
                </button>
                <ProductImage
                  type={activeProductModal.imageType}
                  productId={activeProductModal.id}
                  customImageUrl={activeProductModal.customImageUrl}
                  className="w-full h-full max-h-[240px] sm:max-h-[290px]"
                  alt={activeProductModal.name}
                />
              </div>
              <p className="text-xs text-[#5A4E38] text-center">
                {pack?.label || 'Standard Jar'} · Airtight fresh-sealed jar
              </p>
            </div>

            {/* Right Contiguous Purchase Module */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-semibold text-[#5A4E38]">
                  {activeProductModal.name}
                </h2>
                <p className="text-xs uppercase tracking-wider text-[#5A4E38] mt-1">
                  {hasMultipleVariants && variant
                    ? `${variant.name} · ${pack?.label || ''}`
                    : `${pack?.label || activeProductModal.subtitle}`}
                </p>
                <p className="text-sm text-[#5A4E38] mt-3 leading-relaxed">
                  {variant?.description || activeProductModal.description}
                </p>
              </div>

              {hasMultipleVariants && (
                <div>
                  <label className="bajoz-flavour block text-xs text-[#5A4E38] mb-2">
                    Flavour:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeProductModal.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`bajoz-flavour bajoz-variant p-2.5 rounded-xl text-xs transition-all text-left cursor-pointer border ${
                          v.id === variant?.id
                            ? 'bg-[#40563D] text-[#F2EBD0] border-[#40563D]'
                            : 'bg-[#F2EBD0] text-[#5A4E38] border-[#E9F390] hover:bg-[#F2EBD0]'
                        }`}
                      >
                        <span className="block truncate">{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeProductModal.packSizes.length > 0 && (
                <div>
                  <label className="bajoz-size block text-xs text-[#5A4E38] mb-2">
                    Jar Size:
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {activeProductModal.packSizes.map((p) => {
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPackId(p.id)}
                          className={`bajoz-size py-2.5 px-3 rounded-xl text-xs transition-all cursor-pointer border flex items-center justify-between gap-2 ${
                            p.id === pack.id
                              ? 'bg-[#40563D] text-[#F2EBD0] border-[#40563D]'
                              : 'bg-[#F2EBD0] text-[#5A4E38] border-[#E9F390] hover:bg-[#F2EBD0]'
                          }`}
                        >
                          <span className="bajoz-size">{p.label}</span>
                          <span className="bajoz-price">
                            Price: N/A
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price & Buy Bar */}
              <div className="pt-4 border-t border-[#E9F390] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="bajoz-price block text-[10px] uppercase tracking-wider text-[#5A4E38]">
                    Total Price
                  </span>
                  <span className="bajoz-price text-3xl text-[#40563D] tabular-nums">
                    N/A
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center bg-[#F2EBD0] border border-[#5A4E38] rounded-full px-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 text-[#5A4E38] disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#5A4E38] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= (variant ? variant.stock : 20)}
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 text-[#5A4E38] disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      addToCart(
                        activeProductModal,
                        variant?.id || 'default',
                        pack.id,
                        quantity
                      );
                      setActiveProductModal(null);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-serif text-sm sm:text-base font-extrabold tracking-tight transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Specification Tabs */}
          <div className="pt-6 border-t border-[#5A4E38]/30">
            <div className="flex gap-6 border-b border-[#5A4E38]/30 text-xs font-semibold text-[#5A4E38] overflow-x-auto">
              {[
                { id: 'story', label: 'Craft & Story' },
                {
                  id: 'ingredients',
                  label: `Ingredients (${activeProductModal.ingredients.length})`,
                },
                { id: 'usage', label: 'Daily Ritual' },
                { id: 'faqs', label: 'Product FAQs' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as typeof activeTab)}
                  className={`pb-3 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === t.id
                      ? 'border-b-2 border-[#40563D] text-[#5A4E38]'
                      : 'hover:text-[#5A4E38]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pt-5 text-sm text-[#5A4E38] leading-relaxed">
              {activeTab === 'story' && <p>{activeProductModal.story}</p>}

              {activeTab === 'ingredients' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeProductModal.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 bg-[#F2EBD0] hover:bg-[#F2EBD0] p-3 rounded-xl border border-[#5A4E38] text-xs text-[#5A4E38] transition-colors"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#DCE7C9] text-[#40563D] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                      </span>
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'usage' && (
                <ul className="space-y-2.5">
                  {activeProductModal.usageInstructions.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 bg-[#F2EBD0] hover:bg-[#F2EBD0] p-3.5 rounded-xl border border-[#5A4E38] text-xs text-[#5A4E38] transition-colors"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#DCE7C9] text-[#40563D] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'faqs' && (
                <div className="space-y-3">
                  {activeProductModal.faqs.map((f, i) => (
                    <div
                      key={i}
                      className="bg-[#F2EBD0] hover:bg-[#F2EBD0] p-4 rounded-xl border border-[#5A4E38] space-y-1 transition-colors"
                    >
                      <h4 className="font-serif text-lg font-semibold text-[#5A4E38]">
                        {f.question}
                      </h4>
                      <p className="text-xs text-[#5A4E38]">{f.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
