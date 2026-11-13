/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { ProductImageType } from '../types/shop';
import { X, Trash2, Minus, Plus, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { BAJOZ_MASTER_VECTORS } from '../lib/brandAssets';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    setIsCheckoutOpen,
    orderNotes,
    setOrderNotes,
  } = useShop();

  if (!isCartOpen) return null;

  const getProductImageType = (productId: string): ProductImageType => {
    if (productId === 'spicemix') return 'spicemix';
    if (productId === 'toothpowder') return 'toothpowder';
    return 'panjeeri';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#2C221E]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#F5EBC8] border-l-[1.5px] border-[#7A5C38] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-5 py-4 sm:px-6 sm:py-5 border-b-[1.5px] border-[#7A5C38] bg-[#F9F5E9] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={BAJOZ_MASTER_VECTORS.masterSvg}
                alt="BAJOZ Emblem"
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-2xl border border-[#7A5C38]/40 object-contain shrink-0 select-none"
              />
              <div className="min-w-0">
                <p className="bajoz-script-kicker text-xl text-[#40563D] leading-none">
                  BAJOZ — The House of Naturals
                </p>
                <h2 className="bajoz-poster-display text-2xl sm:text-3xl text-[#4A2E1B] mt-1">
                  Your Shopping Bag
                </h2>
                <p className="text-xs font-semibold text-[#5A4E38] mt-0.5">
                  {cart.length} {cart.length === 1 ? 'jar' : 'jars'} selected
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close Shopping Bag"
              className="w-10 h-10 rounded-full bg-[#F5EBC8] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Highlight Strip */}
          <div className="px-5 py-3 bg-[#E9F399] border-b-[1.5px] border-[#7A5C38] text-xs font-serif font-extrabold text-[#40563D] flex items-center justify-between">
            <span>100% Pure · Small-Batch Fresh Dispatch</span>
            <span className="font-mono">Price: N/A</span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F5EBC8]">
            {cart.length === 0 ? (
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] text-center py-14 px-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E9F399] border-[1.5px] border-[#7A5C38] text-[#40563D] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-serif text-2xl font-extrabold text-[#4A2E1B]">
                  Your bag is currently empty
                </p>
                <p className="text-xs sm:text-sm text-[#2C221E] font-medium max-w-xs mx-auto leading-relaxed">
                  Explore our slow-roasted Panjeeri, SpiceMix cooking paste,
                  and natural homemade Tooth Guardian oral care powder.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-7 py-3 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base font-extrabold rounded-full cursor-pointer"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#F9F5E9] rounded-[1.5rem] p-4 flex gap-4 items-center border-[1.5px] border-[#7A5C38]"
                  >
                    <div className="bg-[#FFFDF9] border border-[#7A5C38]/40 rounded-xl w-16 h-16 p-1.5 shrink-0 flex items-center justify-center">
                      <ProductImage
                        type={getProductImageType(item.productId)}
                        className="w-full h-full object-contain"
                        alt={item.productName}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-lg font-extrabold text-[#4A2E1B] truncate">
                          {item.productName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#786C57] hover:text-[#9B6A73] p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-[#40563D]">
                        {item.variantName && item.productId !== 'spicemix'
                          ? `${item.variantName} · ${item.packSizeLabel || 'Standard Jar'}`
                          : item.packSizeLabel || 'Standard Jar'}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#7A5C38]/25">
                        <div className="inline-flex items-center bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-full">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1.5 text-[#40563D] hover:bg-[#E9F399] rounded-l-full cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono font-extrabold tabular-nums text-[#40563D]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 text-[#40563D] hover:bg-[#E9F399] rounded-r-full cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-xs sm:text-sm font-extrabold text-[#40563D] tabular-nums">
                          Price: N/A
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Optional Gift / Delivery Note */}
                <div className="bg-[#F9F5E9] rounded-[1.5rem] p-4 space-y-2 border-[1.5px] border-[#7A5C38]">
                  <label className="block font-serif text-sm font-extrabold text-[#4A2E1B]">
                    Gift Note or Courier Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Include a gift note or call before ringing bell..."
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-xs sm:text-sm text-[#2C221E] placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D] resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#F9F5E9] border-t-[1.5px] border-[#7A5C38] space-y-4">
              <div className="space-y-1.5 text-xs sm:text-sm text-[#2C221E] font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-extrabold text-[#40563D] tabular-nums">
                    N/A
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nationwide Courier</span>
                  <span className="font-mono font-extrabold text-[#40563D] tabular-nums">
                    N/A
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#4A2E1B] pt-2.5 border-t border-[#7A5C38]/30">
                  <span className="font-serif text-lg">Total</span>
                  <span className="font-serif text-xl sm:text-2xl text-[#40563D] tabular-nums">
                    Price: N/A
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="flex-1 py-3.5 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold tracking-tight rounded-full transition-colors cursor-pointer"
                >
                  Proceed to Order Booking
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  aria-label="Proceed to Order Booking"
                  className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 transition-transform cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                >
                  <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
