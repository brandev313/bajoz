/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Search,
  Check,
  Calendar,
  Clock,
  ArrowUpRight,
  PackageCheck,
} from 'lucide-react';
import { BAJOZ_MASTER_VECTORS } from '../lib/brandAssets';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    trackingOrderQuery,
    setTrackingOrderQuery,
    orders,
  } = useShop();

  const [query, setQuery] = useState(trackingOrderQuery);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (trackingOrderQuery) {
      setQuery(trackingOrderQuery);
      setSearched(true);
    }
  }, [trackingOrderQuery]);

  if (!isTrackingOpen) return null;

  const clean = query.trim().toUpperCase().replace('#', '');
  const matchedOrder = orders.find(
    (o) =>
      o.orderNumber.toUpperCase() === clean ||
      (clean.length >= 4 && o.customer.phone.includes(clean))
  );

  const steps = [
    {
      key: 'Order Placed',
      label: 'Order Placed',
      desc: 'Logged in our small-batch dispatch queue in Model Town, Lahore',
    },
    {
      key: 'Scheduled',
      label: 'Scheduled for Dispatch',
      desc: 'Reserved for your scheduled roasting & delivery date window',
    },
    {
      key: 'Confirmed',
      label: 'Confirmed & Prepared',
      desc: 'Ingredients freshly prepared and inspected in our Lahore kitchen',
    },
    {
      key: 'Processing',
      label: 'Fresh-Sealed & Cushioned',
      desc: 'Packed in an airtight jar with protective shock cushioning',
    },
    {
      key: 'Dispatched',
      label: 'Dispatched via Courier',
      desc: 'Handed to nationwide courier with live tracking number',
    },
    {
      key: 'Delivered',
      label: 'Delivered',
      desc: 'Received at customer doorstep',
    },
  ];

  const getStepState = (stepKey: string, currentStatus: string) => {
    const currentIdx = steps.findIndex((s) => s.key === currentStatus);
    const stepIdx = steps.findIndex((s) => s.key === stepKey);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2C221E]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#F5EBC8] rounded-[2rem] border-[1.5px] border-[#7A5C38] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-8 sm:py-5 bg-[#F9F5E9] border-b-[1.5px] border-[#7A5C38] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={BAJOZ_MASTER_VECTORS.masterSvg}
              alt="BAJOZ Emblem"
              referrerPolicy="no-referrer"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-[#7A5C38]/40 object-contain shrink-0 select-none"
            />
            <div className="min-w-0">
              <p className="bajoz-script-kicker text-xl sm:text-2xl text-[#40563D] leading-none">
                Nationwide Dispatch Tracker
              </p>
              <h2 className="bajoz-poster-display text-2xl sm:text-3xl text-[#4A2E1B] mt-1">
                Track Your BAJOZ Parcel
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsTrackingOpen(false);
              setTrackingOrderQuery('');
            }}
            aria-label="Close Order Tracking"
            className="w-10 h-10 rounded-full bg-[#F5EBC8] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 bg-[#F5EBC8]">
          {/* Search Form Card */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(true);
            }}
            className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5 sm:p-6 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-serif text-base sm:text-lg font-extrabold text-[#40563D]">
                Enter 5-Character Order ID or Phone Number
              </label>
              <span className="px-3 py-0.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-mono text-[11px] font-bold">
                Sample IDs: B7K2Q · M4P9X
              </span>
            </div>

            <div className="flex flex-col xs:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. B7K2Q or 0300..."
                  className="w-full pl-10 pr-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-full text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#2C221E] placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D]"
                />
                <Search className="w-4 h-4 text-[#40563D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="inline-flex items-center gap-1.5">
                <button
                  type="submit"
                  className="flex-1 xs:flex-initial px-6 py-3 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base font-extrabold tracking-tight cursor-pointer transition-colors"
                >
                  Track Parcel
                </button>
                <button
                  type="submit"
                  aria-label="Track Parcel"
                  className="w-11 h-11 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:translate-x-0.5 hover:-translate-y-0.5"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
                </button>
              </div>
            </div>
          </form>

          {matchedOrder ? (
            <div className="space-y-5">
              {/* Order Summary Header Card */}
              <div className="bg-[#F9F5E9] rounded-[1.5rem] p-5 sm:p-6 border-[1.5px] border-[#7A5C38] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-serif text-xs font-extrabold">
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>{matchedOrder.fulfillmentStatus}</span>
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4A2E1B] block pt-1">
                    Order #{matchedOrder.orderNumber}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#2C221E] block">
                    {matchedOrder.customer.name} · {matchedOrder.customer.city}
                  </span>
                </div>
                <div className="sm:text-right space-y-1">
                  <span className="font-serif text-xl sm:text-2xl font-extrabold text-[#40563D] block tabular-nums">
                    Price: N/A
                  </span>
                  <span className="text-xs font-semibold text-[#5A4E38] block">
                    {matchedOrder.paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : 'Meezan Bank Transfer'}{' '}
                    · {matchedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {(matchedOrder.scheduledDate || matchedOrder.scheduledSlot) && (
                <div className="p-4 bg-[#E9F399] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#40563D] border-[1.5px] border-[#7A5C38]">
                  <span className="inline-flex items-center gap-2 font-serif font-extrabold">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Scheduled Delivery: {matchedOrder.scheduledDate || 'Confirmed'}
                    </span>
                  </span>
                  {matchedOrder.scheduledSlot && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{matchedOrder.scheduledSlot}</span>
                    </span>
                  )}
                </div>
              )}

              {matchedOrder.trackingNumber && (
                <div className="p-4 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-2xl flex items-center justify-between text-xs sm:text-sm text-[#2C221E]">
                  <span className="font-medium">
                    Courier Partner: <strong className="font-serif font-extrabold text-[#40563D]">{matchedOrder.courierName}</strong>
                  </span>
                  <span className="font-mono font-extrabold text-[#40563D]">
                    #{matchedOrder.trackingNumber}
                  </span>
                </div>
              )}

              {/* Step-by-Step Fulfillment Progress */}
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5 sm:p-6 space-y-3.5">
                <span className="font-serif text-lg sm:text-xl font-extrabold text-[#40563D] block">
                  Fulfillment Progress
                </span>
                <div className="space-y-2.5">
                  {steps
                    .filter(
                      (s) =>
                        s.key !== 'Scheduled' ||
                        Boolean(matchedOrder.scheduledDate) ||
                        matchedOrder.fulfillmentStatus === 'Scheduled'
                    )
                    .map((step) => {
                      const state = getStepState(
                        step.key,
                        matchedOrder.fulfillmentStatus
                      );
                      return (
                        <div
                          key={step.key}
                          className={`p-4 rounded-2xl border-[1.5px] flex items-start gap-3.5 text-xs sm:text-sm transition-colors ${
                            state === 'current'
                              ? 'bg-[#E9F399] border-[#7A5C38] text-[#40563D]'
                              : state === 'done'
                              ? 'bg-[#FFFDF9] border-[#7A5C38]'
                              : 'bg-[#FFFDF9]/60 border-[#7A5C38]/40 opacity-65'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border border-[#7A5C38] flex items-center justify-center shrink-0 mt-0.5 ${
                              state === 'done' || state === 'current'
                                ? 'bg-[#40563D] text-[#F9F5E9]'
                                : 'bg-[#F5EBC8] text-[#786C57]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                          </div>
                          <div>
                            <span className="font-serif text-base font-extrabold text-[#4A2E1B] block">
                              {step.label}
                            </span>
                            <span className="text-xs text-[#2C221E] font-medium">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {matchedOrder.statusHistory && matchedOrder.statusHistory.length > 0 && (
                <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5 space-y-2.5">
                  <span className="font-serif text-base font-extrabold text-[#40563D] block">
                    Live Dispatch Log
                  </span>
                  <div className="space-y-2">
                    {matchedOrder.statusHistory.map((h, i) => (
                      <div
                        key={i}
                        className="text-xs bg-[#FFFDF9] border border-[#7A5C38]/40 px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-extrabold text-[#40563D]">{h.status}: </span>
                          <span className="text-[#2C221E] font-medium">{h.note || 'Updated'}</span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-[#5A4E38] shrink-0">
                          {new Date(h.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : searched ? (
            <div className="text-center py-10 px-6 bg-[#F9F5E9] rounded-[1.5rem] border-[1.5px] border-[#7A5C38] space-y-2">
              <p className="font-serif text-2xl text-[#4A2E1B] font-extrabold">
                No Matching Parcel Found
              </p>
              <p className="text-xs sm:text-sm text-[#2C221E] font-medium max-w-md mx-auto">
                Please double-check your 5-character Order ID (e.g. B7K2Q) or message us on WhatsApp at 0315-4388166.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
