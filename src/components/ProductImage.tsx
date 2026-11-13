/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProductImageType } from '../types/shop';
import { useShop } from '../context/ShopContext';

interface ProductImageProps {
  type: ProductImageType;
  productId?: string;
  customImageUrl?: string;
  className?: string;
  alt?: string;
  fit?: 'contain' | 'cover';
}

export const OFFICIAL_PRODUCT_IMAGES: Record<ProductImageType, { src: string; alt: string }> = {
  panjeeri: {
    src: '/assets/aistudio/image_fee0cd04_a0af1ff4.png',
    alt: 'BAJOZ Panjeeri Airtight Jar',
  },
  spicemix: {
    src: '/assets/aistudio/image_46d9bf55_06e518ca.jpg',
    alt: 'BAJOZ SpiceMix Cooking Paste Jar',
  },
  toothpowder: {
    src: '/assets/aistudio/image_2d948939_cf968239.png',
    alt: 'BAJOZ Tooth Guardian Oral Care Powder Jar',
  },
};

/**
 * Renders the official or custom-uploaded product photograph.
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  type,
  productId,
  customImageUrl,
  className = '',
  alt,
  fit = 'contain',
}) => {
  const { products } = useShop();
  const matchedProduct = productId
    ? products.find((p) => p.id === productId)
    : products.find((p) => p.imageType === type);
  const official = OFFICIAL_PRODUCT_IMAGES[type] || OFFICIAL_PRODUCT_IMAGES.panjeeri;
  const imageSrc =
    customImageUrl || matchedProduct?.customImageUrl || official.src;
  const imageAlt = alt || matchedProduct?.name || official.alt;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        loading="eager"
        decoding="async"
        className={`w-full h-full ${
          fit === 'cover'
            ? 'object-cover object-center'
            : 'object-contain drop-shadow-[0_14px_28px_rgba(44,34,30,0.08)]'
        } transition-transform duration-500`}
      />
    </div>
  );
};
