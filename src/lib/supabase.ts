/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BAJOZ Custom Hosting Database Client
 * Self-contained REST persistence layer designed for Namecheap / cPanel / Node.js hosting
 * with zero external cloud database (Supabase) dependency.
 */

import {
  Product,
  Order,
  CustomerReview,
  StoreSettings,
  CustomerUser,
} from '../types/shop';

export const isSupabaseConfigured = true;
export const supabase: null = null;

// ============================================================================
// Brand & Product Catalog Normalization Helpers
// ============================================================================

const sanitizeBrand = (val: string | undefined | null): string =>
  (val || '')
    .replace(/DTCSS/g, 'BAJOZ')
    .replace(/Dtcss/g, 'BAJOZ')
    .replace(/dtcss\.pk/gi, 'bajoz.pk')
    .replace(/dtcss/gi, 'bajoz')
    .replace(/Sunji/g, 'Suji')
    .replace(/sunji/g, 'suji')
    .replace(/Ghar Ki Panjeeri/gi, 'Panjeeri')
    .replace(/Homemade Panjeeri/gi, 'Panjeeri')
    .replace(/Natural Homemade Tooth Powder/gi, 'Tooth Guardian')
    .replace(/Natural Tooth Powder/gi, 'Tooth Guardian')
    .replace(/SpiceMix-\s*All-in-1\s*Cooking\s*Paste/gi, 'SpiceMix')
    .replace(/SpiceMix-\s*All-in-One\s*Cooking\s*Paste/gi, 'SpiceMix')
    .replace(/SpiceMix\s*\(All-in-1\s*Cooking\s*Paste\)/gi, 'SpiceMix')
    .replace(/BAJOZ SpiceMix/gi, 'SpiceMix')
    .replace(/caramelized onions,?\s*/gi, '')
    .replace(/sun-ripened vine tomatoes,?\s*/gi, '')
    .replace(/sun-ripened tomatoes,?\s*/gi, '')
    .replace(/vine tomatoes,?\s*/gi, '')
    .replace(/tomatoes,?\s*/gi, '')
    .replace(/Slow-Caramelized Golden Onions/gi, 'Roasted Whole Cumin, Coriander & Black Pepper')
    .replace(/onions,?\s*/gi, '')
    .replace(/cork-stoppered\s+glass\s+jar/gi, 'fresh-sealed jar')
    .replace(/cork-stoppered\s+apothecary\s+jar/gi, 'fresh-sealed jar')
    .replace(/apothecary\s+glass\s+jar\s+sealed\s+with\s+natural\s+cork\s+stopper/gi, 'fresh-sealed jar')
    .replace(/cork-stoppered\s+jar/gi, 'fresh-sealed jar')
    .replace(/Apothecary\s+Cork\s+Jar/gi, 'Fresh-Sealed Jar')
    .replace(/Cork\s+Jar/gi, 'Jar')
    .replace(/clear\s+glass\s+jar/gi, 'airtight jar')
    .replace(/reusable\s+glass\s+jars?/gi, 'airtight jars')
    .replace(/food-grade\s+glass\s+jars?/gi, 'airtight jars')
    .replace(/glass-safe\s+packaging/gi, 'cushioned protective packaging')
    .replace(/glass\s+jars?/gi, 'jars')
    .replace(/\bglass\b/gi, 'airtight');

const DEFAULT_PRODUCT_VARIANTS: Record<string, Product['variants']> = {
  panjeeri: [
    {
      id: 'suji',
      name: 'Suji',
      sku: 'BJ-PAN-SUJ',
      priceAdjustment: 0,
      stock: 35,
      badge: 'Signature Best-Seller',
      description:
        'Golden roasted semolina packed with whole almonds, cashews, pistachios, and green cardamom in pure desi ghee.',
      colorAccent: '#D99B26',
      nutritionHighlight:
        'Traditional golden semolina & whole dry fruits roasted in pure desi ghee',
    },
    {
      id: 'alsi',
      name: 'Alsi',
      sku: 'BJ-PAN-ALS',
      priceAdjustment: 150,
      stock: 24,
      badge: 'Winter & Joint Favourite',
      description:
        'Prepared with roasted golden flaxseeds, gond katira, and whole nuts in pure desi ghee.',
      colorAccent: '#8C5828',
      nutritionHighlight: 'Slow-roasted golden flaxseeds & traditional dry fruits',
    },
    {
      id: 'daal-moong',
      name: 'Daal Moong',
      sku: 'BJ-PAN-MNG',
      priceAdjustment: 200,
      stock: 18,
      badge: 'High-Protein Roast',
      description:
        'Slow-roasted yellow lentil flour with crushed almonds, makhana, and pure desi ghee.',
      colorAccent: '#B8860B',
      nutritionHighlight: 'Slow-roasted yellow moong lentil flour & whole nuts',
    },
  ],
  spicemix: [
    {
      id: 'all-in-one',
      name: 'All-in-One Cooking Paste',
      sku: 'BJ-SPX-STD',
      priceAdjustment: 0,
      stock: 42,
      badge: 'All-in-One Blend',
      description:
        'Fresh mountain garlic, stone-ground ginger, and whole roasted subcontinental spices in cold-pressed mustard oil (no onion).',
      colorAccent: '#C86D3B',
      nutritionHighlight: 'Zero onion, zero preservatives — cooks 8–12 family meals',
    },
  ],
  toothpowder: [
    {
      id: 'tooth-guardian',
      name: 'Tooth Guardian Formula',
      sku: 'BJ-TP-STD',
      priceAdjustment: 0,
      stock: 40,
      badge: 'Oral Care',
      description:
        'Traditional natural homemade tooth cleaning and gum care powder with alum, cloves, salts, and tree bark powders.',
      colorAccent: '#4A5D23',
      nutritionHighlight: '100% natural homemade tooth cleaning powder for oral care',
    },
  ],
};

const DEFAULT_PRODUCT_PACK_SIZES: Record<string, Product['packSizes']> = {
  panjeeri: [
    {
      id: '250g',
      label: '250 gm Jar',
      weightMultiplier: 0.56,
      priceMultiplier: 0.6,
      unitWeight: '250 gm',
    },
    {
      id: '450g',
      label: '450 gm Jar',
      weightMultiplier: 1,
      priceMultiplier: 1,
      unitWeight: '450 gm',
    },
    {
      id: '950g',
      label: '950 gm Jar',
      weightMultiplier: 2.11,
      priceMultiplier: 1.9,
      unitWeight: '950 gm',
    },
  ],
  spicemix: [
    {
      id: '250g',
      label: '250 gm Jar',
      weightMultiplier: 0.56,
      priceMultiplier: 0.6,
      unitWeight: '250 gm',
    },
    {
      id: '450g',
      label: '450 gm Jar',
      weightMultiplier: 1,
      priceMultiplier: 1,
      unitWeight: '450 gm',
    },
    {
      id: '950g',
      label: '950 gm Jar',
      weightMultiplier: 2.11,
      priceMultiplier: 1.9,
      unitWeight: '950 gm',
    },
  ],
  toothpowder: [
    {
      id: '40g',
      label: '40 gm Jar',
      weightMultiplier: 1,
      priceMultiplier: 1,
      unitWeight: '40 gm',
    },
    {
      id: '80g',
      label: '80 gm Jar',
      weightMultiplier: 2,
      priceMultiplier: 1.85,
      unitWeight: '80 gm',
    },
  ],
};

export function normalizeCatalogProduct(p: Product): Product {
  const rawFaqs = Array.isArray(p.faqs)
    ? p.faqs.map((f) => ({
        question: sanitizeBrand(f.question),
        answer: sanitizeBrand(f.answer),
      }))
    : [];

  const fallbackVariants = DEFAULT_PRODUCT_VARIANTS[p.id] || [];
  const rawVariants =
    p.id === 'spicemix' || p.id === 'toothpowder'
      ? fallbackVariants
      : Array.isArray(p.variants) && p.variants.length >= 2
      ? p.variants
      : fallbackVariants.length > 0
      ? fallbackVariants
      : Array.isArray(p.variants)
      ? p.variants
      : [];

  const normalizedVariants = rawVariants.map((v) => {
    const isSunji =
      v.id === 'sunji' ||
      v.id === 'suji' ||
      String(v.name || '').toLowerCase().includes('sunji') ||
      String(v.name || '').toLowerCase().includes('suji');
    const isAlsi =
      v.id === 'alsi' || String(v.name || '').toLowerCase().includes('alsi');
    const isMoong =
      v.id === 'daal-moong' || String(v.name || '').toLowerCase().includes('moong');
    const defaultMatch = fallbackVariants.find(
      (fv) => fv.id === (isSunji ? 'suji' : isAlsi ? 'alsi' : isMoong ? 'daal-moong' : v.id)
    );
    const rawAdj = Number(v.priceAdjustment ?? 0);
    return {
      ...v,
      id: isSunji ? 'suji' : v.id,
      name: isSunji
        ? 'Suji'
        : isAlsi
        ? 'Alsi'
        : isMoong
        ? 'Daal Moong'
        : sanitizeBrand(v.name),
      badge: v.badge ? sanitizeBrand(v.badge) : defaultMatch?.badge || 'Small-Batch',
      sku: isSunji
        ? 'BJ-PAN-SUJ'
        : String(v.sku || defaultMatch?.sku || 'BJ-SKU').replace(/^DT-/, 'BJ-'),
      priceAdjustment:
        rawAdj === 0 && defaultMatch && defaultMatch.priceAdjustment > 0
          ? defaultMatch.priceAdjustment
          : rawAdj,
      description: v.description
        ? sanitizeBrand(v.description)
        : defaultMatch?.description || '',
    };
  });

  const fallbackPacks = DEFAULT_PRODUCT_PACK_SIZES[p.id] || [];
  const isCanonicalProduct =
    p.id === 'panjeeri' || p.id === 'spicemix' || p.id === 'toothpowder';
  const hasLegacyOrInvalidPacks =
    !Array.isArray(p.packSizes) ||
    p.packSizes.length === 0 ||
    p.packSizes.some(
      (ps) =>
        !ps.label ||
        ps.label === 'N/A' ||
        !ps.unitWeight ||
        ps.unitWeight === 'N/A' ||
        /500g|1kg|75g|100g|120g|240g|900g|350g|700g/i.test(
          `${ps.id} ${ps.label} ${ps.unitWeight}`
        )
    ) ||
    ((p.id === 'panjeeri' || p.id === 'spicemix') && p.packSizes.length !== 3) ||
    (p.id === 'toothpowder' && p.packSizes.length !== 2);

  const normalizedPackSizes =
    isCanonicalProduct && hasLegacyOrInvalidPacks && fallbackPacks.length > 0
      ? fallbackPacks
      : (Array.isArray(p.packSizes) && p.packSizes.length > 0
          ? p.packSizes
          : fallbackPacks
        ).map((ps, idx) => ({
          ...ps,
          label:
            ps.label && ps.label !== 'N/A'
              ? sanitizeBrand(ps.label)
              : fallbackPacks[idx]?.label || `${ps.unitWeight || 'Standard'} Jar`,
          unitWeight:
            ps.unitWeight && ps.unitWeight !== 'N/A'
              ? sanitizeBrand(ps.unitWeight)
              : fallbackPacks[idx]?.unitWeight || 'Standard',
          weightMultiplier: Number(
            ps.weightMultiplier || fallbackPacks[idx]?.weightMultiplier || 1
          ),
          priceMultiplier: Number(
            ps.priceMultiplier || fallbackPacks[idx]?.priceMultiplier || 1
          ),
        }));

  const canonicalName =
    p.id === 'panjeeri'
      ? 'Panjeeri'
      : p.id === 'spicemix'
      ? 'SpiceMix'
      : p.id === 'toothpowder'
      ? 'Tooth Guardian'
      : sanitizeBrand(p.name);

  const defaultSpiceMixIngredients = [
    'Garlic',
    'Ginger',
    'Red Chilli',
    'Salt',
    'Turmeric',
    'Cumin Seeds',
    'Coriander Seeds',
    'Green Cardamom',
    'Black Cardamom',
    'Cinnamon',
    'Cloves',
    'Bay Leaves',
    'Mace',
    'Star Anise',
    'Black Pepper',
    'Fennel Seeds',
    'Carom Seeds',
  ];

  const defaultToothPowderIngredients = [
    'Alum (Phitkari)',
    'Cloves (Laung)',
    'Natural Salts',
    'Tree Bark Powders',
  ];

  const cleanedIngredients =
    p.id === 'spicemix' &&
    (!Array.isArray(p.ingredients) ||
      p.ingredients.length < 15 ||
      p.ingredients.some((ing) => /Mountain Garlic|Degi Mirch/i.test(ing)))
      ? defaultSpiceMixIngredients
      : p.id === 'toothpowder' &&
        (!Array.isArray(p.ingredients) ||
          p.ingredients.some((ing) => /Bentonite|Charcoal|Sodium Bicarbonate/i.test(ing)))
      ? defaultToothPowderIngredients
      : Array.isArray(p.ingredients)
      ? p.ingredients
          .filter((ing) => !/onion|tomato/i.test(ing))
          .map((ing) => sanitizeBrand(ing))
      : [];

  const normalizedCustomImageUrl =
    p.id === 'spicemix' &&
    (!p.customImageUrl ||
      p.customImageUrl === '/assets/aistudio/image_f0df8d35_7481a296.png')
      ? '/assets/aistudio/image_46d9bf55_06e518ca.jpg'
      : p.customImageUrl;

  const isLegacyToothPowderCopy = (text?: string) =>
    !text || /herbal|sls|fluoride|bentonite|charcoal/i.test(text);

  const normalizedCategory =
    p.id === 'toothpowder'
      ? 'Oral Care'
      : sanitizeBrand(p.category || '').replace(/Herbal Care/gi, 'Oral Care');

  const normalizedSubtitle =
    p.id === 'toothpowder' && isLegacyToothPowderCopy(p.subtitle)
      ? 'Natural homemade tooth cleaning powder made with alum, cloves, natural salts, and tree bark powders for everyday oral care.'
      : sanitizeBrand(p.subtitle);

  const normalizedTagline =
    p.id === 'toothpowder' && isLegacyToothPowderCopy(p.tagline)
      ? 'Natural homemade tooth cleaning powder by BAJOZ with alum, cloves, salts & tree bark powders for oral care'
      : sanitizeBrand(p.tagline);

  const normalizedStory =
    p.id === 'toothpowder' && isLegacyToothPowderCopy(p.story)
      ? 'Homemade tooth cleaning and care powder packed with natural and premium minerals so that you and your family keep your teeth and gums clean and healthy with our ancestral oral care routine product.'
      : sanitizeBrand(p.story);

  const normalizedDescription =
    p.id === 'toothpowder' && isLegacyToothPowderCopy(p.description)
      ? 'Homemade tooth cleaning and care powder packed with natural and premium minerals — Alum, Cloves, Salts, and Tree Bark Powders — so that you and your family keep your teeth and gums clean and healthy with our ancestral oral care routine product.'
      : sanitizeBrand(p.description);

  return {
    ...p,
    name: canonicalName,
    category: normalizedCategory,
    customImageUrl: normalizedCustomImageUrl,
    subtitle: normalizedSubtitle,
    tagline: normalizedTagline,
    packagingSpec: sanitizeBrand(p.packagingSpec).replace(/Size:\s*N\/A\s*·\s*/gi, ''),
    story: normalizedStory,
    description: normalizedDescription,
    ingredients: cleanedIngredients,
    usageInstructions: Array.isArray(p.usageInstructions)
      ? p.usageInstructions.map((u) => sanitizeBrand(u))
      : [],
    faqs: rawFaqs,
    variants: normalizedVariants,
    packSizes: normalizedPackSizes,
    isPublished: p.isPublished !== false,
  };
}

export function mapRowToProduct(row: Record<string, any>): Product {
  return normalizeCatalogProduct({
    id: row.id,
    name: row.name,
    subtitle: row.subtitle,
    tagline: row.tagline,
    category: row.category,
    imageType: row.image_type || row.imageType,
    customImageUrl: row.custom_image_url || row.customImageUrl || undefined,
    basePrice: Number(row.base_price ?? row.basePrice ?? 0),
    featured: row.featured !== false,
    isPublished: (row.is_published ?? row.isPublished) !== false,
    packagingSpec: row.packaging_spec || row.packagingSpec || '',
    story: row.story || '',
    description: row.description || '',
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    usageInstructions: Array.isArray(row.usage_instructions || row.usageInstructions)
      ? row.usage_instructions || row.usageInstructions
      : [],
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    variants: Array.isArray(row.variants) ? row.variants : [],
    packSizes: Array.isArray(row.pack_sizes || row.packSizes)
      ? row.pack_sizes || row.packSizes
      : [],
  });
}

export function mapRowToOrder(row: Record<string, any>): Order {
  const cust = row.customer || {};
  return {
    orderNumber: row.order_number || row.orderNumber,
    date: row.date,
    customer: cust,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee ?? row.deliveryFee ?? 0),
    total: Number(row.total || 0),
    paymentMethod: row.payment_method || row.paymentMethod || 'cod',
    paymentStatus: row.payment_status || row.paymentStatus || 'Pending',
    fulfillmentStatus:
      row.fulfillment_status || row.fulfillmentStatus || 'Order Placed',
    bankReference: row.bank_reference || row.bankReference || undefined,
    courierName: row.courier_name || row.courierName || undefined,
    trackingNumber: row.tracking_number || row.trackingNumber || undefined,
    scheduledDate: row.scheduled_date || row.scheduledDate || cust.scheduledDate || undefined,
    scheduledSlot: row.scheduled_slot || row.scheduledSlot || cust.scheduledSlot || undefined,
    giftMessage: row.gift_message || row.giftMessage || cust.giftMessage || undefined,
    orderNotes: row.order_notes || row.orderNotes || undefined,
    statusHistory: Array.isArray(row.status_history || row.statusHistory)
      ? row.status_history || row.statusHistory
      : [],
  };
}

export function mapRowToReview(row: Record<string, any>): CustomerReview {
  return {
    id: row.id,
    customerName: row.customer_name || row.customerName,
    city: row.city,
    rating: Number(row.rating || 5),
    productTag: sanitizeBrand(row.product_tag || row.productTag),
    date: row.date,
    title: sanitizeBrand(row.title),
    comment: sanitizeBrand(row.comment),
    verified: Boolean(row.verified),
    isApproved: Boolean(row.is_approved ?? row.isApproved ?? true),
    helpfulCount: Number(row.helpful_count ?? row.helpfulCount ?? 0),
  };
}

export function mapRowToProfile(row: Record<string, any>): CustomerUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    city: row.city || 'Lahore',
    savedAddresses: Array.isArray(row.saved_addresses || row.savedAddresses)
      ? row.saved_addresses || row.savedAddresses
      : [],
    provider: row.provider || 'email',
    createdAt: row.created_at || row.createdAt
      ? String(row.created_at || row.createdAt).split('T')[0]
      : new Date().toISOString().split('T')[0],
  };
}

export function sanitizeSettings(
  raw: StoreSettings,
  fallback: StoreSettings
): StoreSettings {
  const rawName = raw.businessName ? sanitizeBrand(raw.businessName) : '';
  const finalBusinessName =
    !rawName || rawName === 'DTCSS' || rawName === 'BAJOZ'
      ? 'BAJOZ — The House of Naturals'
      : rawName;
  return {
    ...fallback,
    ...raw,
    businessName: finalBusinessName,
    websiteUrl: raw.websiteUrl ? sanitizeBrand(raw.websiteUrl) : 'https://bajoz.pk',
    whatsappGreeting: sanitizeBrand(
      raw.whatsappGreeting || fallback.whatsappGreeting
    ),
    instagramUrl: sanitizeBrand(raw.instagramUrl || fallback.instagramUrl),
    facebookUrl: sanitizeBrand(raw.facebookUrl || fallback.facebookUrl),
    announcementText:
      raw.announcementText &&
      raw.announcementText !==
        'Traditional goodness, thoughtfully brought to your everyday life.'
        ? sanitizeBrand(raw.announcementText)
        : fallback.announcementText,
    bankDetails: {
      ...(fallback.bankDetails || {}),
      ...(raw.bankDetails || {}),
      accountTitle: raw.bankDetails?.accountTitle
        ? sanitizeBrand(raw.bankDetails.accountTitle)
        : 'BAJOZ HOUSE OF NATURALS',
    },
    siteCopy: {
      ...(fallback.siteCopy as any),
      ...(raw.siteCopy || {}),
    },
    customPages: Array.isArray(raw.customPages)
      ? raw.customPages
      : fallback.customPages || [],
  };
}

export async function syncAuthUserWithProfilesTable(
  authUser: any
): Promise<CustomerUser> {
  const profile: CustomerUser = {
    id: authUser?.id || `user_${Date.now()}`,
    name: authUser?.name || 'Valued Customer',
    email: (authUser?.email || '').toLowerCase(),
    phone: authUser?.phone || '03001234567',
    city: authUser?.city || 'Lahore',
    savedAddresses: Array.isArray(authUser?.savedAddresses)
      ? authUser.savedAddresses
      : [],
    provider: authUser?.provider || 'email',
    createdAt: new Date().toISOString().split('T')[0],
  };
  await persistProfileToSupabase(profile);
  return profile;
}

export async function fetchProfileByEmailFromSupabase(
  email: string
): Promise<CustomerUser | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;
  try {
    const res = await fetch(
      `/api/store/profiles/${encodeURIComponent(cleanEmail)}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.profile) {
        return mapRowToProfile(data.profile);
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function mergeCatalogProducts(
  remoteProducts: Product[],
  defaultProducts: Product[]
): Product[] {
  if (!Array.isArray(remoteProducts) || remoteProducts.length === 0) {
    return defaultProducts.map(normalizeCatalogProduct);
  }
  const byId = new Map<string, Product>();
  for (const item of remoteProducts) {
    if (item && item.id) {
      byId.set(
        item.id,
        normalizeCatalogProduct({
          ...item,
          isPublished: item.isPublished !== false,
        })
      );
    }
  }
  const merged: Product[] = [];
  for (const def of defaultProducts) {
    if (byId.has(def.id)) {
      merged.push(byId.get(def.id)!);
      byId.delete(def.id);
    } else {
      merged.push(normalizeCatalogProduct(def));
    }
  }
  for (const extra of byId.values()) {
    merged.push(normalizeCatalogProduct(extra));
  }
  return merged;
}

// ============================================================================
// Self-Hosted Custom Database REST Operations (/api/store/*)
// ============================================================================

export async function syncInitialDataWithSupabase(defaults: {
  products: Product[];
  orders: Order[];
  reviews: CustomerReview[];
  settings: StoreSettings;
  profiles?: CustomerUser[];
}): Promise<{
  products: Product[];
  orders: Order[];
  reviews: CustomerReview[];
  settings: StoreSettings;
  profiles: CustomerUser[];
  source: 'api';
}> {
  try {
    const res = await fetch('/api/store');
    if (res.ok) {
      const data = await res.json();
      const mergedProducts = mergeCatalogProducts(
        Array.isArray(data.products) ? data.products : [],
        defaults.products
      );

      if (!Array.isArray(data.products) || data.products.length === 0) {
        for (const p of mergedProducts) {
          void fetch('/api/store/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p),
          }).catch(() => {});
        }
      }

      const fakeIds = new Set(['rev-1', 'rev-2', 'rev-3', 'rev-4']);
      const fakeNames = new Set([
        'Farah Mehmood',
        'Zeeshan Haider',
        'Samina Tariq',
        'Bilal Chaudhry',
      ]);
      const validRemoteReviews: CustomerReview[] = Array.isArray(data.reviews)
        ? data.reviews
            .map(mapRowToReview)
            .filter(
              (r: CustomerReview) =>
                !fakeIds.has(r.id) && !fakeNames.has(r.customerName)
            )
        : [];
      const mergedReviews =
        validRemoteReviews.length > 0
          ? [
              ...defaults.reviews,
              ...validRemoteReviews.filter(
                (r: CustomerReview) =>
                  !defaults.reviews.some((d) => d.id === r.id)
              ),
            ]
          : defaults.reviews;

      return {
        products: mergedProducts,
        orders: data.orders?.length ? data.orders : defaults.orders,
        reviews: mergedReviews,
        settings: data.settings
          ? sanitizeSettings(data.settings, defaults.settings)
          : defaults.settings,
        profiles: data.profiles?.length ? data.profiles : defaults.profiles || [],
        source: 'api',
      };
    }
  } catch {
    // Ignore network error during initial boot
  }

  return {
    ...defaults,
    products: defaults.products.map(normalizeCatalogProduct),
    profiles: defaults.profiles || [],
    source: 'api',
  };
}

export async function persistProductToSupabase(product: Product): Promise<Product> {
  try {
    const res = await fetch('/api/store/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.product) {
        return data.product as Product;
      }
    }
  } catch {
    // ignore
  }
  return product;
}

export async function removeProductFromSupabase(productId: string) {
  try {
    await fetch(`/api/store/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });
  } catch {
    // ignore
  }
}

export async function persistOrderToSupabase(order: Order) {
  try {
    await fetch('/api/store/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch {
    // ignore
  }
}

export async function removeOrderFromSupabase(orderNumber: string) {
  try {
    await fetch(`/api/store/orders/${encodeURIComponent(orderNumber)}`, {
      method: 'DELETE',
    });
  } catch {
    // ignore
  }
}

export async function persistReviewToSupabase(review: CustomerReview) {
  try {
    await fetch('/api/store/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
  } catch {
    // ignore
  }
}

export async function removeReviewFromSupabase(reviewId: string) {
  try {
    await fetch(`/api/store/reviews/${encodeURIComponent(reviewId)}`, {
      method: 'DELETE',
    });
  } catch {
    // ignore
  }
}

export async function persistSettingsToSupabase(settings: StoreSettings) {
  try {
    await fetch('/api/store/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  } catch {
    // ignore
  }
}

export async function persistProfileToSupabase(profile: CustomerUser) {
  try {
    await fetch('/api/store/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  } catch {
    // ignore
  }
}

export async function removeProfileFromSupabase(idOrEmail: string) {
  try {
    await fetch(`/api/store/profiles/${encodeURIComponent(idOrEmail)}`, {
      method: 'DELETE',
    });
  } catch {
    // ignore
  }
}

// ============================================================================
// Self-Hosted Authentication & Media Storage Client APIs
// ============================================================================

const CUSTOMER_TOKEN_STORAGE_KEY = 'bajoz_customer_auth_token_v1';

export function getSavedCustomerAuthToken(): string | null {
  try {
    return localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setSavedCustomerAuthToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(CUSTOMER_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export async function registerCustomerOnServer(payload: {
  name: string;
  email: string;
  password?: string;
  phone: string;
  city: string;
  address: string;
}): Promise<{
  ok: boolean;
  user?: CustomerUser;
  token?: string;
  message?: string;
}> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data?.ok && data?.user) {
      if (data.token) setSavedCustomerAuthToken(data.token);
      return {
        ok: true,
        user: mapRowToProfile(data.user),
        token: data.token,
        message: data.message,
      };
    }
    return {
      ok: false,
      message: data?.message || 'Unable to register account.',
    };
  } catch {
    return { ok: false };
  }
}

export async function loginCustomerOnServer(
  email: string,
  password?: string
): Promise<{
  ok: boolean;
  user?: CustomerUser;
  token?: string;
  message?: string;
  networkFallback?: boolean;
}> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data?.ok && data?.user) {
      if (data.token) setSavedCustomerAuthToken(data.token);
      return {
        ok: true,
        user: mapRowToProfile(data.user),
        token: data.token,
        message: data.message,
      };
    }
    return {
      ok: false,
      message: data?.message || 'Incorrect email or password.',
    };
  } catch {
    return { ok: false, networkFallback: true };
  }
}

export async function verifyCustomerSessionOnServer(): Promise<CustomerUser | null> {
  const token = getSavedCustomerAuthToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.ok && data?.user) {
        return mapRowToProfile(data.user);
      }
    } else if (res.status === 401) {
      setSavedCustomerAuthToken(null);
    }
  } catch {
    // ignore
  }
  return null;
}

export async function logoutCustomerOnServer(): Promise<void> {
  const token = getSavedCustomerAuthToken();
  setSavedCustomerAuthToken(null);
  if (!token) return;
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
  } catch {
    // ignore
  }
}

export async function uploadMediaToServer(params: {
  dataUrl: string;
  filename?: string;
  category?: 'products' | 'pages' | 'brand' | 'general';
}): Promise<string | null> {
  try {
    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.ok && typeof data.url === 'string') {
        return data.url;
      }
    }
  } catch {
    // ignore
  }
  return null;
}


