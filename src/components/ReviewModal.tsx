/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, CheckCircle2 } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, addCustomerReview } = useShop();
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState('');
  const [productTag, setProductTag] = useState('Ghar Ki Panjeeri');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !title.trim() || !comment.trim()) return;
    addCustomerReview({
      customerName: customerName.trim(),
      city: city.trim() || 'Lahore',
      rating,
      productTag,
      title: title.trim(),
      comment: comment.trim(),
      verified: true,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsReviewModalOpen(false);
      setCustomerName('');
      setCity('');
      setTitle('');
      setComment('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5A4E38]/55 backdrop-blur-2xs">
      <div className="relative w-full max-w-lg bg-[#F9F5E9] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#E6DDC8]">
        <button
          type="button"
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-[#786C57] hover:text-[#5A4E38] hover:bg-[#F1EBD9] rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#40563D] mx-auto" />
            <h3 className="font-serif text-2xl font-semibold text-[#5A4E38]">
              Thank you for sharing your review
            </h3>
            <p className="text-xs text-[#786C57]">
              Your feedback has been added to our verified household wall.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#5A4E38]">
                Share your BAJOZ experience
              </h3>
              <p className="text-xs text-[#786C57]">
                Help other Pakistani households discover clean, homemade nourishment.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#786C57] mb-1">
                Product Ordered
              </label>
              <select
                value={productTag}
                onChange={(e) => setProductTag(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5EBC8] border border-[#E6DDC8] rounded-xl text-xs text-[#5A4E38]"
              >
                <option value="Ghar Ki Panjeeri">Ghar Ki Panjeeri (500g)</option>
                <option value="BAJOZ SpiceMix">BAJOZ SpiceMix (350g)</option>
                <option value="Natural Tooth Powder">
                  Natural Homemade Tooth Powder (120g)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#786C57] mb-1">
                Rating
              </label>
              <div className="flex items-center gap-1 text-[#C98A6A]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'fill-current' : 'text-[#5A4E38]/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5EBC8] border border-[#E6DDC8] rounded-xl text-xs text-[#5A4E38]"
              />
              <input
                type="text"
                placeholder="City / Area (e.g. DHA, Lahore)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5EBC8] border border-[#E6DDC8] rounded-xl text-xs text-[#5A4E38]"
              />
            </div>

            <input
              type="text"
              required
              placeholder="Review Headline *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5EBC8] border border-[#E6DDC8] rounded-xl text-xs text-[#5A4E38]"
            />

            <textarea
              rows={3}
              required
              placeholder="Tell us about the aroma, taste, and packaging..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5EBC8] border border-[#E6DDC8] rounded-xl text-xs text-[#5A4E38] resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#786C57] hover:text-[#5A4E38] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#40563D] hover:bg-[#334530] text-[#F9F5E9] text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
