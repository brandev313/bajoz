/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';
import { ProductImageType } from '../types/shop';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartTotals,
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
        className="absolute inset-0 bg-[#40563D]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#F2EBD0] border-l border-[#5A4E38] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[#5A4E38]/30 flex items-center justify-between bg-[#F2EBD0]">
            <div>
              <p className="font-editorial italic text-xl text-[#5A4E38] leading-none">
                BAJOZ — The House of Naturals
              </p>
              <h2 className="font-display text-2xl font-bold text-[#40563D] mt-1">
                Your Shopping Bag
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#5A4E38] hover:text-[#40563D] rounded-full bg-[#F2EBD0] border border-[#5A4E38] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F2EBD0]">
            {cart.length === 0 ? (
              <div className="rounded-3xl border border-[#5A4E38] bg-[#F2EBD0] text-center py-14 px-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#DCE7C9] border border-[#5A4E38] text-[#40563D] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-display text-xl font-bold text-[#40563D]">
                  Your bag is currently empty
                </p>
                <p className="font-dm text-xs text-[#5A4E38] max-w-xs mx-auto leading-relaxed">
                  Explore our slow-roasted Desi Ghee Panjeeri, 15-minute
                  SpiceMix, and Tooth Guardian oral care.
                </p>
                <div className="pt-2 flex justify-center">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="h-11 px-6 rounded-full bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-serif text-base font-extrabold tracking-tight transition-all duration-150 cursor-pointer"
                    >
                      Browse Products
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      aria-label="Browse Products"
                      className="w-11 h-11 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] border border-[#40563D] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                    >
                      <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#F2EBD0] rounded-2xl p-4 flex gap-4 items-center border border-[#5A4E38]"
                  >
                    <div className="bg-[#FAF9F4] border border-[#5A4E38] rounded-xl w-16 h-16 p-1.5 shrink-0 flex items-center justify-center">
                      <ProductImage
                        type={getProductImageType(item.productId)}
                        className="w-full h-full object-contain"
                        alt={item.productName}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-base font-bold text-[#40563D] truncate">
                          {item.productName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#5A4E38] hover:text-[#40563D] p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-dm text-xs text-[#5A4E38]">
                        {item.productId === 'spicemix'
                          ? item.packSizeLabel || 'Standard Jar'
                          : `${item.variantName} • ${item.packSizeLabel}`}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#5A4E38]/20">
                        <div className="inline-flex items-center bg-[#F2EBD0] border border-[#5A4E38] rounded-full">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1.5 text-[#40563D] hover:bg-[#E9F390] rounded-l-full cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-dm text-xs font-bold tabular-nums text-[#40563D]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 text-[#40563D] hover:bg-[#E9F390] rounded-r-full cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-display text-base font-bold text-[#40563D]">
                          PKR {(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Optional Gift / Delivery Note */}
                <div className="bg-[#F2EBD0] rounded-2xl p-4 space-y-2 border border-[#5A4E38]">
                  <label className="block font-dm text-xs font-bold uppercase tracking-wider text-[#40563D]">
                    Special Delivery or Gift Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add courier instructions or a gift message..."
                    className="w-full px-3 py-2 bg-[#F2EBD0] border border-[#5A4E38] rounded-xl font-dm text-xs text-[#40563D] placeholder:text-[#5A4E38]/60 focus:outline-none focus:border-[#40563D] resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#F2EBD0] border-t border-[#5A4E38] space-y-4">
              <div className="space-y-1.5 font-dm text-xs text-[#5A4E38]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#40563D]">
                    PKR {cartTotals.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-[#40563D]">
                    {cartTotals.deliveryFee === 0
                      ? 'FREE'
                      : `PKR ${cartTotals.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#40563D] pt-2 border-t border-[#5A4E38]/30">
                  <span>Total</span>
                  <span className="font-display text-xl text-[#40563D]">
                    PKR {cartTotals.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="flex-1 h-12 px-6 rounded-full bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-serif text-lg font-extrabold tracking-tight transition-all duration-150 cursor-pointer"
                >
                  Proceed to Checkout
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  aria-label="Proceed to Checkout"
                  className="w-12 h-12 rounded-full bg-[#40563D] hover:bg-[#E9F390] text-[#F2EBD0] hover:text-[#40563D] border border-[#40563D] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
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
