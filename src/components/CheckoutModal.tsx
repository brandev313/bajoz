/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, ProductImageType } from '../types/shop';
import { ProductImage } from './ProductImage';
import { BAJOZ_MASTER_VECTORS } from '../lib/brandAssets';
import {
  X,
  CheckCircle2,
  Copy,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Package,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    settings,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    user,
    setIsTrackingOpen,
    setTrackingOrderQuery,
    orderNotes,
    setOrderNotes,
  } = useShop();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '03');
  const [city, setCity] = useState(user?.city || 'Lahore');
  const [address, setAddress] = useState(user?.savedAddresses[0] || '');
  const [notes, setNotes] = useState(orderNotes || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [bankRef, setBankRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.city) setCity(user.city);
      if (user.savedAddresses?.length) setAddress(user.savedAddresses[0]);
    }
  }, [user]);

  useEffect(() => {
    if (orderNotes && !notes) setNotes(orderNotes);
  }, [orderNotes, notes]);

  if (!isCheckoutOpen) return null;

  const getProductImageType = (productId: string): ProductImageType => {
    if (productId === 'spicemix') return 'spicemix';
    if (productId === 'toothpowder') return 'toothpowder';
    return 'panjeeri';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (cart.length === 0) return;

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setErrorMessage('Please complete your full name, phone number, city, and street address.');
      return;
    }

    const order = placeOrder(
      {
        name: name.trim(),
        email: email.trim() || `${phone.replace(/\D/g, '')}@customer.dtcss.pk`,
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        deliveryNotes: notes.trim(),
        orderNotes: notes.trim(),
      },
      paymentMethod,
      paymentMethod === 'bank_transfer' ? bankRef.trim() : undefined
    );
    setConfirmedOrder(order);
  };

  const copyBankDetails = () => {
    const text = `Bank: ${settings.bankDetails.bankName}\nTitle: ${settings.bankDetails.accountTitle}\nAccount: ${settings.bankDetails.accountNumber}\nIBAN: ${settings.bankDetails.iban}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2C221E]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-[#F5EBC8] rounded-[2rem] border-[1.5px] border-[#7A5C38] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Architectural Header */}
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
                {confirmedOrder
                  ? 'Small-Batch Dispatch Queue'
                  : 'BAJOZ — The House of Naturals'}
              </p>
              <h2 className="bajoz-poster-display text-2xl sm:text-3xl text-[#4A2E1B] mt-1">
                {confirmedOrder ? 'Order Booking Confirmed' : 'Order Booking Form'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCheckoutOpen(false);
              setConfirmedOrder(null);
            }}
            aria-label="Close Order Booking Form"
            className="w-10 h-10 rounded-full bg-[#F5EBC8] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 bg-[#F5EBC8]">
          {confirmedOrder ? (
            <div className="space-y-6">
              {/* Confirmed Banner Card */}
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 sm:p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#E9F399] border-[1.5px] border-[#7A5C38] text-[#40563D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.25]" />
                </div>
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold tracking-tight">
                  Booking Logged · Model Town Kitchen
                </span>
                <h3 className="bajoz-poster-display text-2xl sm:text-4xl text-[#4A2E1B]">
                  Order #{confirmedOrder.orderNumber}
                </h3>
                <p className="text-sm sm:text-base text-[#2C221E] font-medium max-w-md mx-auto leading-relaxed">
                  Save your 5-character tracking code{' '}
                  <strong className="font-mono font-extrabold text-[#40563D] bg-[#FFFDF9] px-2.5 py-0.5 rounded-lg border border-[#7A5C38]">
                    {confirmedOrder.orderNumber}
                  </strong>{' '}
                  to check live dispatch status anytime.
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#7A5C38]/30">
                  <span className="font-serif text-lg sm:text-xl font-extrabold text-[#40563D]">
                    Booking Summary
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-mono text-xs sm:text-sm font-extrabold">
                    Price: N/A
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="rounded-xl bg-[#FFFDF9] border border-[#7A5C38]/40 p-3.5">
                    <span className="block font-serif text-xs font-extrabold uppercase tracking-wider text-[#40563D] mb-1">
                      Recipient Details
                    </span>
                    <span className="font-semibold text-[#2C221E] block">
                      {confirmedOrder.customer.name}
                    </span>
                    <span className="text-[#5A4E38]">
                      {confirmedOrder.customer.phone}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#FFFDF9] border border-[#7A5C38]/40 p-3.5">
                    <span className="block font-serif text-xs font-extrabold uppercase tracking-wider text-[#40563D] mb-1">
                      Delivery Address
                    </span>
                    <span className="font-semibold text-[#2C221E] block">
                      {confirmedOrder.customer.address}
                    </span>
                    <span className="text-[#5A4E38]">
                      {confirmedOrder.customer.city}, Pakistan
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 pt-1">
                <div className="inline-flex items-center gap-1.5 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingOrderQuery(confirmedOrder.orderNumber);
                      setIsCheckoutOpen(false);
                      setConfirmedOrder(null);
                      setIsTrackingOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-7 py-3.5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold tracking-tight transition-colors cursor-pointer"
                  >
                    Track Live Parcel Status
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingOrderQuery(confirmedOrder.orderNumber);
                      setIsCheckoutOpen(false);
                      setConfirmedOrder(null);
                      setIsTrackingOpen(true);
                    }}
                    aria-label="Track Live Parcel Status"
                    className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 transition-transform cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                  </button>
                </div>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum BAJOZ — The House of Naturals! I just booked Order #${confirmedOrder.orderNumber} on your website.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full bg-[#40563D] hover:bg-[#344731] text-[#F9F5E9] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold tracking-tight text-center transition-colors"
                >
                  Confirm on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-[#FFFDF9] text-[#9B6A73] border-[1.5px] border-[#9B6A73] rounded-2xl text-xs sm:text-sm font-bold">
                  {errorMessage}
                </div>
              )}

              {/* Selected Items Summary Strip */}
              {cart.length > 0 && (
                <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-serif text-base sm:text-lg font-extrabold text-[#40563D]">
                      <Package className="w-4 h-4 text-[#40563D]" />
                      <span>Selected Jars ({cart.length})</span>
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-mono text-xs font-extrabold">
                      Price: N/A
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#FFFDF9] border border-[#7A5C38]/40 p-2.5 flex items-center gap-3"
                      >
                        <div className="w-11 h-11 rounded-lg bg-[#F5EBC8] border border-[#7A5C38]/30 p-1 shrink-0 flex items-center justify-center">
                          <ProductImage
                            type={getProductImageType(item.productId)}
                            className="w-full h-full object-contain"
                            alt={item.productName}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-sm font-extrabold text-[#4A2E1B] truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] font-medium text-[#5A4E38] truncate">
                            {item.variantName && item.productId !== 'spicemix'
                              ? `${item.variantName} · ${item.packSizeLabel || 'Standard Jar'}`
                              : item.packSizeLabel || 'Standard Jar'}{' '}
                            × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Contact & Delivery Details */}
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5 sm:p-7 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#7A5C38]/25">
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold">
                    Step 01 · Recipient &amp; Doorstep Details
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#40563D]">
                    <Truck className="w-4 h-4" />
                    <span>Nationwide Pakistan</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ayesha Malik"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03008459123"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                    >
                      <option value="Lahore">Lahore (24–48 hrs)</option>
                      <option value="Karachi">Karachi (2–3 days)</option>
                      <option value="Islamabad">Islamabad (2–3 days)</option>
                      <option value="Rawalpindi">Rawalpindi (2–3 days)</option>
                      <option value="Faisalabad">Faisalabad (2–3 days)</option>
                      <option value="Multan">Multan (2–3 days)</option>
                      <option value="Peshawar">Peshawar (2–4 days)</option>
                      <option value="Sialkot">Sialkot (2–3 days)</option>
                      <option value="Gujranwala">Gujranwala (2–3 days)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Complete Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House #, Street, Sector / Phase / Society"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ayesha@gmail.com"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Delivery or Gift Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setOrderNotes(e.target.value);
                      }}
                      placeholder="e.g. Call before ringing bell"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium placeholder:text-[#786C57] focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-5 sm:p-7 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#7A5C38]/25">
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold">
                    Step 02 · Preferred Payment Method
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#40563D]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Booking</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label
                    className={`p-4 rounded-2xl border-[1.5px] border-[#7A5C38] cursor-pointer transition-colors flex items-start gap-3 ${
                      paymentMethod === 'cod'
                        ? 'bg-[#E9F399] text-[#40563D]'
                        : 'bg-[#FFFDF9] hover:bg-[#F5EBC8] text-[#2C221E]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#40563D]"
                    />
                    <div>
                      <span className="font-serif text-base sm:text-lg font-extrabold text-[#40563D] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="block text-xs text-[#2C221E] font-medium mt-0.5 leading-relaxed">
                        Pay at your doorstep when your freshly sealed BAJOZ parcel arrives.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border-[1.5px] border-[#7A5C38] cursor-pointer transition-colors flex items-start gap-3 ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-[#E9F399] text-[#40563D]'
                        : 'bg-[#FFFDF9] hover:bg-[#F5EBC8] text-[#2C221E]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-[#40563D]"
                    />
                    <div>
                      <span className="font-serif text-base sm:text-lg font-extrabold text-[#40563D] block">
                        Meezan Bank Transfer
                      </span>
                      <span className="block text-xs text-[#2C221E] font-medium mt-0.5 leading-relaxed">
                        Direct transfer to our official BAJOZ business account.
                      </span>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-4 sm:p-5 bg-[#FFFDF9] rounded-2xl border-[1.5px] border-[#7A5C38] space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-base font-extrabold text-[#40563D]">
                        {settings.bankDetails.bankName}
                      </span>
                      <button
                        type="button"
                        onClick={copyBankDetails}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-serif text-xs font-extrabold cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copied ? 'Copied!' : 'Copy Account Info'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs text-[#2C221E] space-y-1 bg-[#F9F5E9] p-3 rounded-xl border border-[#7A5C38]/30">
                      <div>Title: {settings.bankDetails.accountTitle}</div>
                      <div>Account: {settings.bankDetails.accountNumber}</div>
                      <div>IBAN: {settings.bankDetails.iban}</div>
                    </div>
                    <input
                      type="text"
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                      placeholder="Optional transaction reference or sender name"
                      className="w-full px-4 py-2.5 bg-[#F9F5E9] border-[1.5px] border-[#7A5C38] rounded-xl text-xs sm:text-sm text-[#2C221E]"
                    />
                  </div>
                )}
              </div>

              {/* Order Total & Submit Bar */}
              <div className="p-5 sm:p-6 bg-[#F9F5E9] border-[1.5px] border-[#7A5C38] rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5A4E38] block">
                    Order Total Payable
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D] tabular-nums">
                    Price: N/A
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 w-full sm:w-auto justify-center">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors cursor-pointer text-center"
                  >
                    Confirm Order Booking
                  </button>
                  <button
                    type="submit"
                    aria-label="Confirm Order Booking"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 transition-transform cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
