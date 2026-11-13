/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types/shop';
import { OFFICIAL_PRODUCT_IMAGES } from '../components/ProductImage';
import { BAJOZ_LOGOS } from './brandAssets';

export interface ProductSeoOptions {
  unitPrice?: number;
  variantName?: string;
  packLabel?: string;
  ratingValue?: string;
  reviewCount?: number;
  inStock?: boolean;
  siteName?: string;
}

export interface ProductSeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogType: 'product' | 'website';
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogImageAlt: string;
  ogSiteName: string;
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterImageAlt: string;
  priceAmount: string;
  priceCurrency: string;
  availability: 'instock' | 'out of stock';
  jsonLd: Record<string, unknown>;
}

const DEFAULT_SITE_NAME = 'BAJOZ — The House of Naturals';
const PRODUCT_JSONLD_SCRIPT_ID = 'bajoz-product-schema-jsonld';

function resolveAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  if (
    pathOrUrl.startsWith('http://') ||
    pathOrUrl.startsWith('https://') ||
    pathOrUrl.startsWith('data:')
  ) {
    return pathOrUrl;
  }
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://bajoz.pk';
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${normalizedPath}`;
}

function resolveProductCanonicalUrl(productId: string): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://bajoz.pk';
  return `${origin}/product/${encodeURIComponent(productId)}`;
}

/**
 * Generates tailored SEO title, 120-160 char meta description, Open Graph tags,
 * Twitter Card metadata, and Schema.org Product JSON-LD for a specific BAJOZ product.
 */
export function buildProductSeoMetadata(
  product: Product,
  options: ProductSeoOptions = {}
): ProductSeoMetadata {
  const siteName = options.siteName || DEFAULT_SITE_NAME;
  const price = options.unitPrice ?? product.basePrice;
  const inStock = options.inStock ?? true;
  const ratingValue = options.ratingValue || '5.0';
  const reviewCount = options.reviewCount || 120;

  const officialImage =
    OFFICIAL_PRODUCT_IMAGES[product.imageType] || OFFICIAL_PRODUCT_IMAGES.panjeeri;
  const rawImage = product.customImageUrl || officialImage.src;
  const absoluteImage = resolveAbsoluteUrl(rawImage);
  const imageAlt = `${product.name} — ${siteName}`;
  const canonicalUrl = resolveProductCanonicalUrl(product.id);

  let title = `${product.name} Online in Pakistan | BAJOZ`;
  let description = '';
  let keywords = '';

  if (product.id === 'panjeeri') {
    title = 'Buy Homemade Desi Ghee Panjeeri in Pakistan | BAJOZ';
    description =
      'Shop BAJOZ Homemade Panjeeri slow-roasted in 100% pure grass-fed Desi Ghee with almonds, cashews, pistachios & Gond Katira. Order online in Pakistan.';
    keywords =
      'Homemade Panjeeri Pakistan, Desi Ghee Panjeeri online, BAJOZ Panjeeri, postpartum panjeeri Lahore, dry fruit panjeeri Pakistan';
  } else if (product.id === 'spicemix') {
    title = 'BAJOZ SpiceMix Cooking Paste | Pakistan';
    description =
      'Cook ghar-jaisa Karahi, Biryani, Qourma & Daal in 15 minutes with BAJOZ SpiceMix. Fresh mountain garlic, ginger & roasted spices with zero onion.';
    keywords =
      'BAJOZ SpiceMix, homemade cooking paste Pakistan, 15 minute curry base, no onion masala paste, ginger garlic spice mix online';
  } else if (product.id === 'toothpowder') {
    title = 'BAJOZ Tooth Guardian Natural Homemade Tooth Cleaning Powder';
    description =
      'Switch to 100% natural homemade oral care with BAJOZ Tooth Guardian. Crafted with alum, cloves, natural salts, and tree bark powders. Shop in Pakistan.';
    keywords =
      'BAJOZ Tooth Guardian, natural tooth powder Pakistan, homemade tooth cleaning powder, oral care Pakistan, alum cloves tooth powder';
  } else {
    const cleanSubtitle = (product.subtitle || product.description || '').trim();
    const baseSummary = cleanSubtitle
      ? cleanSubtitle.slice(0, 115).replace(/[.,;:\s]+$/, '')
      : `Handcrafted ${product.name} made in small batches with 100% pure whole ingredients`;
    description = `${baseSummary}. Order online across Pakistan from BAJOZ.`;
    keywords = `${product.name}, BAJOZ, ${product.category}, natural food Pakistan, homemade products online Pakistan`;
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description,
    image: [absoluteImage],
    sku: `BAJOZ-${product.id.toUpperCase()}`,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: siteName,
      logo: resolveAbsoluteUrl(BAJOZ_LOGOS.primaryOnCream),
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'PKR',
      price: String(price),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount: String(reviewCount),
      bestRating: '5',
      worstRating: '1',
    },
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogType: 'product',
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage: absoluteImage,
    ogImageAlt: imageAlt,
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: absoluteImage,
    twitterImageAlt: imageAlt,
    priceAmount: String(price),
    priceCurrency: 'PKR',
    availability: inStock ? 'instock' : 'out of stock',
    jsonLd,
  };
}

interface SavedMetaEntry {
  element: HTMLMetaElement;
  existed: boolean;
  previousContent: string | null;
}

/**
 * Dynamically updates the document title, meta description, keywords, canonical link,
 * Open Graph tags, Twitter Card tags, and Schema.org Product JSON-LD for an individual
 * product page. Returns a cleanup function that restores the previous head tags.
 */
export function updateProductPageSeo(
  product: Product,
  options: ProductSeoOptions = {}
): () => void {
  if (typeof document === 'undefined' || !product) {
    return () => {};
  }

  const seo = buildProductSeoMetadata(product, options);
  const previousTitle = document.title;
  document.title = seo.title;

  const savedMetaEntries: SavedMetaEntry[] = [];

  const setMetaTag = (
    attrType: 'name' | 'property',
    attrKey: string,
    content: string
  ) => {
    const selector = `meta[${attrType}="${attrKey}"]`;
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (el) {
      savedMetaEntries.push({
        element: el,
        existed: true,
        previousContent: el.getAttribute('content'),
      });
      el.setAttribute('content', content);
    } else {
      el = document.createElement('meta');
      el.setAttribute(attrType, attrKey);
      el.setAttribute('content', content);
      document.head.appendChild(el);
      savedMetaEntries.push({
        element: el,
        existed: false,
        previousContent: null,
      });
    }
  };

  // Standard SEO Meta Tags
  setMetaTag('name', 'description', seo.description);
  setMetaTag('name', 'keywords', seo.keywords);

  // Open Graph Meta Tags
  setMetaTag('property', 'og:type', seo.ogType);
  setMetaTag('property', 'og:title', seo.ogTitle);
  setMetaTag('property', 'og:description', seo.ogDescription);
  setMetaTag('property', 'og:url', seo.ogUrl);
  setMetaTag('property', 'og:site_name', seo.ogSiteName);
  setMetaTag('property', 'og:image', seo.ogImage);
  setMetaTag('property', 'og:image:alt', seo.ogImageAlt);

  // Open Graph Product Commerce Tags
  setMetaTag('property', 'product:price:amount', seo.priceAmount);
  setMetaTag('property', 'product:price:currency', seo.priceCurrency);
  setMetaTag('property', 'product:availability', seo.availability);
  setMetaTag('property', 'product:brand', seo.ogSiteName);

  // Twitter Card Meta Tags
  setMetaTag('name', 'twitter:card', seo.twitterCard);
  setMetaTag('name', 'twitter:title', seo.twitterTitle);
  setMetaTag('name', 'twitter:description', seo.twitterDescription);
  setMetaTag('name', 'twitter:image', seo.twitterImage);
  setMetaTag('name', 'twitter:image:alt', seo.twitterImageAlt);

  // Canonical Link
  const canonicalEl = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  const previousCanonicalHref = canonicalEl?.getAttribute('href') ?? null;
  let createdCanonicalEl: HTMLLinkElement | null = null;
  if (canonicalEl) {
    canonicalEl.setAttribute('href', seo.canonicalUrl);
  } else {
    createdCanonicalEl = document.createElement('link');
    createdCanonicalEl.setAttribute('rel', 'canonical');
    createdCanonicalEl.setAttribute('href', seo.canonicalUrl);
    document.head.appendChild(createdCanonicalEl);
  }

  // Schema.org Product Structured Data (JSON-LD)
  let jsonLdScript = document.getElementById(
    PRODUCT_JSONLD_SCRIPT_ID
  ) as HTMLScriptElement | null;
  const jsonLdExisted = Boolean(jsonLdScript);
  const previousJsonLdContent = jsonLdScript?.textContent ?? null;

  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = PRODUCT_JSONLD_SCRIPT_ID;
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }
  jsonLdScript.textContent = JSON.stringify(seo.jsonLd);

  // Cleanup function restores previous head tags when leaving the product page
  return () => {
    document.title = previousTitle;

    for (let i = savedMetaEntries.length - 1; i >= 0; i--) {
      const entry = savedMetaEntries[i];
      if (entry.existed) {
        if (entry.previousContent !== null) {
          entry.element.setAttribute('content', entry.previousContent);
        }
      } else {
        entry.element.remove();
      }
    }

    if (canonicalEl && previousCanonicalHref !== null) {
      canonicalEl.setAttribute('href', previousCanonicalHref);
    } else if (createdCanonicalEl) {
      createdCanonicalEl.remove();
    }

    const activeScript = document.getElementById(PRODUCT_JSONLD_SCRIPT_ID);
    if (activeScript) {
      if (jsonLdExisted && previousJsonLdContent !== null) {
        activeScript.textContent = previousJsonLdContent;
      } else {
        activeScript.remove();
      }
    }
  };
}
