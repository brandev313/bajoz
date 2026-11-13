/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, LogOut, ArrowUpRight, UserCheck, Package } from 'lucide-react';
import { BAJOZ_MASTER_VECTORS } from '../lib/brandAssets';

export const CustomerAccountModal: React.FC = () => {
  const {
    user,
    orders,
    isSupabaseReady,
    isAccountOpen,
    setIsAccountOpen,
    accountModalMode,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    loginWithOutlook,
    logoutUser,
    setIsTrackingOpen,
    setTrackingOrderQuery,
  } = useShop();

  const [mode, setMode] = useState<'signin' | 'signup' | 'track'>(
    accountModalMode || 'signup'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('03');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [trackCodeInput, setTrackCodeInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAccountOpen && accountModalMode) {
      setMode(accountModalMode);
    }
  }, [isAccountOpen, accountModalMode]);

  if (!isAccountOpen) return null;

  const userOrders = user
    ? orders.filter(
        (o) =>
          o.customer.email.toLowerCase() === user.email.toLowerCase() ||
          (user.phone &&
            o.customer.phone.replace(/\D/g, '').includes(user.phone.replace(/\D/g, '')))
      )
    : [];

  const handleTrackLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = trackCodeInput.trim().replace(/^#/, '');
    setTrackingOrderQuery(cleaned);
    setIsAccountOpen(false);
    setIsTrackingOpen(true);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await loginWithEmail(email, password);
      setFeedback(res.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await registerWithEmail({
        name,
        email,
        password,
        phone,
        city,
        address,
      });
      setFeedback(res.message);
    } finally {
      setIsSubmitting(false);
    }
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
                BAJOZ — The House of Naturals
              </p>
              <h2 className="bajoz-poster-display text-2xl sm:text-3xl text-[#4A2E1B] mt-1">
                {user ? `Welcome, ${user.name}` : 'Customer Account Portal'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAccountOpen(false);
              setFeedback(null);
            }}
            aria-label="Close Account Portal"
            className="w-10 h-10 rounded-full bg-[#F5EBC8] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 bg-[#F5EBC8]">
          {feedback && (
            <div className="p-4 bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] rounded-2xl text-xs sm:text-sm font-bold">
              {feedback}
            </div>
          )}

          {user ? (
            <div className="space-y-6">
              {/* Signed-In Profile Card */}
              <div className="bg-[#F9F5E9] rounded-[1.5rem] p-5 sm:p-6 border-[1.5px] border-[#7A5C38] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-serif text-xs font-extrabold">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Verified Household Member</span>
                  </span>
                  <span className="font-serif text-2xl font-extrabold text-[#4A2E1B] block pt-1">
                    {user.name}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#2C221E] block">
                    {user.email} · {user.phone} · {user.city}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void logoutUser()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFDF9] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Track Any Order Box in Signed-In Account Portal */}
              <div className="bg-[#F9F5E9] rounded-[1.5rem] p-5 sm:p-6 border-[1.5px] border-[#7A5C38] space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#40563D]">
                    Track Your Parcel
                  </h3>
                  <span className="px-3 py-0.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] text-[11px] font-mono font-bold">
                    5-Char Order ID or Phone
                  </span>
                </div>
                <form onSubmit={handleTrackLookup} className="flex flex-col xs:flex-row gap-2.5">
                  <input
                    type="text"
                    value={trackCodeInput}
                    onChange={(e) => setTrackCodeInput(e.target.value)}
                    placeholder="Enter Order ID (e.g. B7K2Q) or Phone..."
                    className="flex-1 px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-full text-xs sm:text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base font-extrabold rounded-full cursor-pointer shrink-0 transition-colors"
                  >
                    Track Order
                  </button>
                </form>
              </div>

              {/* Recent Orders Card */}
              <div className="bg-[#F9F5E9] rounded-[1.5rem] p-5 sm:p-6 border-[1.5px] border-[#7A5C38] space-y-3.5">
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#40563D] flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span>Your Recent Orders ({userOrders.length})</span>
                </h3>
                {userOrders.length === 0 ? (
                  <p className="text-xs sm:text-sm text-[#2C221E] font-medium bg-[#FFFDF9] p-4 rounded-2xl border border-[#7A5C38]/40">
                    No orders found for this account yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {userOrders.map((o) => (
                      <div
                        key={o.orderNumber}
                        className="bg-[#FFFDF9] p-4 rounded-2xl border-[1.5px] border-[#7A5C38] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
                      >
                        <div>
                          <span className="font-mono font-extrabold text-[#4A2E1B]">
                            #{o.orderNumber}
                          </span>
                          <span className="text-[#2C221E] font-medium">
                            {' '}
                            · {o.fulfillmentStatus} ·{' '}
                            <strong className="font-mono text-[#40563D]">
                              Price: N/A
                            </strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTrackingOrderQuery(o.orderNumber);
                            setIsAccountOpen(false);
                            setIsTrackingOpen(true);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-serif font-extrabold text-xs cursor-pointer"
                        >
                          Track Parcel
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Mode Switcher Tabs (Sign In | Create Account | Track Order) */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-[#F9F5E9] border-[1.5px] border-[#7A5C38] rounded-full">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2.5 px-4 font-serif text-sm sm:text-base font-extrabold rounded-full cursor-pointer transition-colors ${
                    mode === 'signin'
                      ? 'bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38]'
                      : 'text-[#2C221E] hover:text-[#40563D]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 px-4 font-serif text-sm sm:text-base font-extrabold rounded-full cursor-pointer transition-colors ${
                    mode === 'signup'
                      ? 'bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38]'
                      : 'text-[#2C221E] hover:text-[#40563D]'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setMode('track')}
                  className={`flex-1 py-2.5 px-4 font-serif text-sm sm:text-base font-extrabold rounded-full cursor-pointer transition-colors ${
                    mode === 'track'
                      ? 'bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38]'
                      : 'text-[#2C221E] hover:text-[#40563D]'
                  }`}
                >
                  Track Order
                </button>
              </div>

              {/* Quick Access / Social Sign-In */}
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-4 sm:p-5 space-y-3">
                {isSupabaseReady && (
                  <button
                    type="button"
                    onClick={() => void loginWithGoogle()}
                    className="w-full py-3 px-4 bg-[#FFFDF9] hover:bg-[#E9F399] border-[1.5px] border-[#7A5C38] text-[#40563D] rounded-full font-serif text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Continue with Google</span>
                  </button>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#2C221E] font-bold">
                    Quick Customer Profiles:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        void loginWithGoogle({
                          email: 'ayesha.malik@gmail.com',
                          name: 'Ayesha Malik',
                        })
                      }
                      className="px-3.5 py-1.5 bg-[#FFFDF9] hover:bg-[#E9F399] border border-[#7A5C38] text-[#40563D] rounded-full font-serif font-extrabold cursor-pointer transition-colors"
                    >
                      Ayesha (Lahore)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void loginWithOutlook({
                          email: 'tariq.mehmood@outlook.com',
                          name: 'Tariq Mehmood',
                        })
                      }
                      className="px-3.5 py-1.5 bg-[#FFFDF9] hover:bg-[#E9F399] border border-[#7A5C38] text-[#40563D] rounded-full font-serif font-extrabold cursor-pointer transition-colors"
                    >
                      Tariq (Lahore)
                    </button>
                  </div>
                </div>
              </div>

              {mode === 'track' ? (
                <form
                  onSubmit={handleTrackLookup}
                  className="bg-[#F9F5E9] rounded-[1.5rem] p-5 sm:p-7 border-[1.5px] border-[#7A5C38] space-y-4"
                >
                  <div className="space-y-1">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-serif text-xs font-extrabold">
                      Instant Courier Lookup
                    </span>
                    <h3 className="font-serif text-2xl font-extrabold text-[#4A2E1B] pt-1">
                      Track Your BAJOZ Order
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2C221E] font-medium">
                      Enter your 5-character Order ID (e.g. #B7K2Q) or registered mobile number to check live dispatch status.
                    </p>
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Order ID or Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={trackCodeInput}
                      onChange={(e) => setTrackCodeInput(e.target.value)}
                      placeholder="e.g. B7K2Q or 03008459123"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm font-mono font-bold text-[#2C221E] focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1.5 w-full">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold rounded-full cursor-pointer transition-colors"
                    >
                      View Live Order Status
                    </button>
                    <button
                      type="submit"
                      aria-label="View Live Order Status"
                      className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                    </button>
                  </div>
                </form>
              ) : mode === 'signin' ? (
                <form
                  onSubmit={handleSignIn}
                  className="bg-[#F9F5E9] rounded-[1.5rem] p-5 sm:p-7 border-[1.5px] border-[#7A5C38] space-y-4"
                >
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ayesha.malik@gmail.com"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-extrabold text-[#4A2E1B] mb-1.5">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1.5 w-full pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold rounded-full cursor-pointer disabled:opacity-60 transition-colors"
                    >
                      {isSubmitting ? 'Signing In...' : 'Sign In to Account'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-label="Sign In"
                      className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={handleSignUp}
                  className="bg-[#F9F5E9] rounded-[1.5rem] p-5 sm:p-7 border-[1.5px] border-[#7A5C38] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-serif text-xs sm:text-sm font-extrabold text-[#4A2E1B] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ayesha Malik"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                      />
                    </div>
                    <div>
                      <label className="block font-serif text-xs sm:text-sm font-extrabold text-[#4A2E1B] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ayesha@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-serif text-xs sm:text-sm font-extrabold text-[#4A2E1B] mb-1">
                        WhatsApp Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="03008459123"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                      />
                    </div>
                    <div>
                      <label className="block font-serif text-xs sm:text-sm font-extrabold text-[#4A2E1B] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Lahore"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-serif text-xs sm:text-sm font-extrabold text-[#4A2E1B] mb-1">
                        Street Delivery Address
                      </label>
                      <input
                        type="text"
                        placeholder="House #, Street, Sector"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                      />
                    </div>
                    <div>
                      <label className="block font-serif text-xs sm:text-sm font-extrabold text-[#4A2E1B] mb-1">
                        Password (6+ chars)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] rounded-xl text-sm text-[#2C221E] font-medium focus:outline-none focus:border-[#40563D]"
                      />
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 w-full pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold rounded-full cursor-pointer disabled:opacity-60 transition-colors"
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create BAJOZ Account'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-label="Create Account"
                      className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
