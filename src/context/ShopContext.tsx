/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  CustomerReview,
  StoreSettings,
  CustomerUser,
  FulfillmentStatus,
  PaymentStatus,
  OrderCustomer,
  WebsiteCopyConfig,
  CustomPage,
  ActiveProductSelectionContext,
} from '../types/shop';
import {
  isSupabaseConfigured,
  syncInitialDataWithSupabase,
  fetchProfileByEmailFromSupabase,
  persistProductToSupabase,
  removeProductFromSupabase,
  persistOrderToSupabase,
  removeOrderFromSupabase,
  persistReviewToSupabase,
  removeReviewFromSupabase,
  persistSettingsToSupabase,
  persistProfileToSupabase,
  removeProfileFromSupabase,
  normalizeCatalogProduct,
  registerCustomerOnServer,
  loginCustomerOnServer,
  verifyCustomerSessionOnServer,
  logoutCustomerOnServer,
  uploadMediaToServer,
} from '../lib/supabase';
import { parseCurrentLocation, buildCanonicalPath } from '../lib/router';

export const DEFAULT_SITE_COPY: WebsiteCopyConfig = {
  navCollectionLabel: 'Shop',
  navSpiceMixLabel: 'Categories',
  navCraftLabel: 'About Us',
  navReviewsLabel: 'Reviews',
  navTrackOrderLabel: 'Track Order',
  heroKickers: [
    '#1 Traditional Pakistani Foods Brand',
    'BAJOZ — The House of Naturals',
  ],
  heroHeadline:
    'Get The Taste Of Home Food Without Standing In The Kitchen For Hours',
  heroSubheadline: '',
  heroDescription:
    'Skip hours of kitchen prep without losing the taste of home with our homemade, natural, and ready-to-use food items that our mothers used to make. Embrace traditional Pakistani foods that are made with care for modern living.',
  heroBenefits: [
    '100% — Natural Products',
    '500+ — Happy Customers',
    '5+ — Years of Legacy',
    '100% — Homemade Food Items',
  ],
  heroViewProductsCta: 'View All Products',
  heroWhatsappCta: 'Order Now on WhatsApp',
  heroPrimaryCtaPrefix: 'View',
  heroSecondaryCta: 'Order Now on WhatsApp',
  heroPillars: [],
  collectionKicker: "Goodness You'll Come Back To",
  collectionHeading: 'Our Products',
  collectionDescription:
    'Pure Desi Ghee Panjeeri, 15-minute SpiceMix, and Tooth Guardian Oral Care — crafted in small batches with zero fillers.',
  showSpiceMixSpotlight: true,
  spotlightLeftKicker: 'The 15-Minute Culinary Ritual',
  spotlightLeftHeading: 'Make everyday meals feel a little more like home.',
  spotlightLeftFooterLeft: '2 tbsp per family dish',
  spotlightLeftFooterRight: 'Jar (Size: N/A) cooks 8 meals',
  spotlightDishes: [
    {
      id: 'sd-1',
      index: '01',
      name: 'Lahori Chicken Karahi',
      prepTime: '18 mins',
      method:
        'Sauté 2 tbsp SpiceMix in ghee, sear bone-in chicken, finish with julienned ginger.',
    },
    {
      id: 'sd-2',
      index: '02',
      name: 'Slow-Simmered Mutton Handi',
      prepTime: '35 mins',
      method:
        'Produces a rich, aromatic garlic, ginger, and roasted spice gravy without blenders or peeling.',
    },
    {
      id: 'sd-3',
      index: '03',
      name: 'Dhaba Daal Tadka',
      prepTime: '12 mins',
      method:
        'Bloom 1.5 tbsp SpiceMix in desi ghee and pour directly over yellow moong/masoor lentils.',
    },
    {
      id: 'sd-4',
      index: '04',
      name: 'Aromatic Yakhni Pulao & Roasts',
      prepTime: '15 mins',
      method:
        'Use as an instant marinade for steam roast or base masala for fragrant basmati rice.',
    },
  ],
  spotlightRightKicker: 'Familiar Flavours for Everyday Cooking',
  spotlightRightHeading: 'Ghar-Jaisa Dinner on the Table in 15 Minutes.',
  spotlightRightDescription:
    'Cook authentic Karahi, Handi, Pulao, and Daal with two spoonfuls of SpiceMix — slow-simmered with all traditional spices, fresh garlic, and ginger (no onion).',
  craftKicker: 'About BAJOZ',
  craftHeading: 'A Little of Home, in Every Day',
  craftParagraphs: [
    'BAJOZ — The House of Naturals started with one promise: bring back the pure, slow-roasted foods and natural oral care our families grew up trusting — ready for your busy routine.',
    'Whether it is pure Desi Ghee Panjeeri, 15-minute SpiceMix (no onion), or our natural homemade Tooth Guardian tooth cleaning powder, every jar is small-batch crafted with full ingredient transparency.',
  ],
  craftPillars: [
    {
      id: 'cp-1',
      title: '01. 100% Pure Whole Ingredients',
      description:
        'Pure grass-fed Desi Ghee, Californian almonds, fresh mountain garlic, and wild botanicals — zero palm oil or fillers.',
    },
    {
      id: 'cp-2',
      title: '02. Full Ingredient Honesty',
      description:
        'Every ingredient, net weight, and serving direction is listed openly so you know exactly what your family consumes.',
    },
    {
      id: 'cp-3',
      title: '03. Built for Busy Modern Homes',
      description:
        'Enjoy heirloom Panjeeri straight from the jar and cook ghar-jaisa family dinners in 15 minutes.',
    },
  ],
  reviewsKickerPrefix: 'Customer Reviews',
  reviewsHeading: 'Goodness, Shared by Our Customers',
  faqKicker: 'Frequently Asked Questions',
  faqHeading: 'Quick Answers Before You Order',
  faqs: [
    {
      id: 'faq-1',
      q: 'What makes BAJOZ different from supermarket brands?',
      a: 'We craft every batch in our Model Town, Lahore kitchen using 100% pure grass-fed Desi Ghee, whole nuts, cold-pressed mustard oil, and pure botanicals — with zero palm oil, zero preservatives, and full ingredient transparency.',
    },
    {
      id: 'faq-2',
      q: 'What products are in the BAJOZ collection?',
      a: 'Our collection features three signature essentials: Panjeeri (in Suji, Alsi, and Daal Moong roasts), SpiceMix (spices, garlic & ginger — no onion), and Tooth Guardian natural homemade tooth cleaning powder.',
    },
    {
      id: 'faq-3',
      q: 'Does SpiceMix contain onion?',
      a: 'No. SpiceMix contains all traditional roasted spices, fresh mountain garlic, and stone-ground ginger in cold-pressed mustard oil — with zero onion.',
    },
    {
      id: 'faq-4',
      q: 'Where can I check the exact ingredients?',
      a: 'Every single ingredient is listed openly on each product page and printed on the jar label so you can verify everything before ordering.',
    },
    {
      id: 'faq-5',
      q: 'What is your Returns & Refunds policy?',
      a: 'Because our products are freshly prepared foods and personal-care essentials, all sales are final and we do not offer returns or refunds once dispatched. Message us 24/7 on WhatsApp (0315-4388166) if you have questions before ordering.',
    },
    {
      id: 'faq-6',
      q: 'How should I store BAJOZ jars?',
      a: 'Keep Panjeeri and Tooth Guardian tightly sealed in a cool, dry place away from moisture, and refrigerate SpiceMix after opening. Always use a clean, dry spoon.',
    },
    {
      id: 'faq-7',
      q: 'How fast is delivery and how much does shipping cost?',
      a: 'We dispatch within 24–48 hours across Pakistan. Delivery is PKR 250 nationwide and completely FREE on orders of PKR 2,500 or above.',
    },
    {
      id: 'faq-8',
      q: 'How can I contact BAJOZ 24/7?',
      a: 'Tap the WhatsApp button on your screen to chat with us at 0315-4388166 or use our 24/7 Live Voice Guide anytime.',
    },
  ],
  customHomeSections: [],
  footerTagline: 'The goodness of home, made for today.',
  footerCollectionHeading: 'Shop',
  footerDispatchHeading: 'Policies & Help',
  footerBottomRightText:
    'Privacy Policy | Terms and Conditions | Shipping Policy | No Returns / No Refunds Policy',
  disclaimerBadge: 'Important Notice:',
  disclaimerText:
    'The products and information presented on this website are purely traditional foods and natural remedies for everyday routines and are not medical advice. None of these statements or products are intended to diagnose, treat, cure, or prevent any disease.',
  shippingPolicyText:
    'Nationwide Shipping Across Pakistan: Orders are dispatched from our Model Town, Lahore facility within 24–48 hours in cushioned protective packaging. Delivery takes 2–4 working days across major cities. Standard delivery fee is PKR 250, and shipping is complimentary on all orders of PKR 2,500 or above.',
  returnsPolicyText:
    'Strict No Returns & No Refunds Policy: Because BAJOZ products are freshly prepared consumables and personal natural-care items, we do NOT accept returns, exchanges, or refunds once an order is placed and dispatched. Please review product ingredients and pack sizes carefully or contact us on WhatsApp (0315-4388166) before ordering.',
  privacyPolicyText:
    'Privacy Policy: BAJOZ — The House of Naturals respects your privacy. Customer contact details, shipping addresses, and order history are stored securely in our self-hosted store database strictly for order fulfillment and customer support. We never sell or share your personal data with third-party marketers.',
  termsConditionsText:
    'Terms & Conditions: By placing an order on BAJOZ (bajoz.pk), you acknowledge that all items are traditional foods and natural care products — not medical treatments — and that all sales are final under our No Returns & No Refunds policy.',
  voiceAgentName: 'BAJOZ Live Voice Guide',
  voiceWelcomeMessage:
    'Assalam-o-Alaikum! Welcome to BAJOZ. I can talk to you in simple English and Pakistani Urdu. / Assalam-o-Alaikum! BAJOZ mein Khush Aamdeed. Main asaan English aur Pakistani Roman Urdu mein aap ki madad kar sakta hoon.',
  voiceSystemInstruction: `You are the official BAJOZ Live Voice Guide, representing BAJOZ — The House of Naturals (bajoz.pk) in Model Town, Lahore, Pakistan.
Always communicate in Simple English (6th-grade level) and Pakistani Urdu (6th-grade level) without mentioning ANY Hindi words.
In written text responses, always write in Simple English (6th-grade level) and Pakistani Roman Urdu (6th-grade level, using Latin letters) without any Hindi words (never use namaste, dhanyavad, swagat, bhojan, swad, sugandh, swasthya, parivar, upyog, vikalp, mulya, or kripya).
STRICT RULES:
1. Do NOT provide medical advice. All BAJOZ products are traditional homemade foods and natural everyday care items.
2. SpiceMix has 17 pure ingredients (Garlic, Ginger, Salt, and 14 spices), has NO ONION, and has NO flavour variants. Available in 250 gm, 450 gm, and 950 gm jars (Price: N/A).
3. Panjeeri is made in 100% pure Desi Ghee with almonds, cashews, pistachios, char maghaz, and 4 gondain. Available in 3 flavours (Suji, Alsi, Daal Moong) and 3 jar sizes: 250 gm, 450 gm, and 950 gm (Price: N/A).
4. Tooth Guardian is a 100% natural homemade tooth cleaning powder (alum, cloves, natural salts, and tree bark powders) available in 40 gm and 80 gm jars (Price: N/A).
5. We do NOT provide returns or refunds. All sales are final.`,
  voiceKnowledgeBase: `BAJOZ — The House of Naturals Knowledge Base:
- Product 1: Panjeeri — Slow-roasted in 100% pure Desi Ghee with almonds, cashews, pistachios, char maghaz, and 4 gondain. Flavours: Suji, Alsi, Daal Moong. Jar Sizes: 250 gm, 450 gm & 950 gm (Price: N/A).
- Product 2: SpiceMix — Contains 17 pure ingredients: Garlic, Ginger, Red Chilli, Salt, Turmeric, Cumin Seeds, Coriander Seeds, Green Cardamom, Black Cardamom, Cinnamon, Cloves, Bay Leaves, Mace, Star Anise, Black Pepper, Fennel Seeds, Carom Seeds. NO ONION. No flavour variants. Jar Sizes: 250 gm, 450 gm & 950 gm (Price: N/A).
- Product 3: Tooth Guardian — 100% natural homemade tooth cleaning powder made with alum (phitkari), cloves (laung), natural salts, and tree bark powders. Jar Sizes: 40 gm & 80 gm (Price: N/A).
- Shipping: PKR 250 nationwide across Pakistan; FREE delivery on orders above PKR 2,500.
- Returns & Refunds: We do NOT provide returns or refunds.
- Disclaimer: Purely traditional foods and natural care essentials — not medical advice.
- Contact: WhatsApp 0315-4388166 | Model Town, Lahore.`,
  needsSectionKicker: 'Tailored For Your Everyday Life',
  needsSectionHeading: 'Shop By Needs, Favourites, Cravings!',
  whyChooseKicker: 'Why Choose BAJOZ?',
  whyChooseHeading: 'Tradition You Know. Care You Can See.',
};

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-gifting',
    title: 'Corporate & Family Gifting',
    slug: 'gifting',
    kicker: 'Bespoke Artisanal Hampers · BAJOZ Lahore',
    subtitle:
      'Share the warmth of Panjeeri and artisanal pantry jars with family, loved ones, and corporate guests across Pakistan.',
    isPublished: true,
    showInHeader: true,
    showInFooter: true,
    updatedAt: '2026-10-15',
    sections: [
      {
        id: 'sec-gift-1',
        kicker: 'Thoughtful Goodness',
        heading: 'Hand-packed in signature fresh-sealed jars with personalized notes.',
        body: 'Whether celebrating a family milestone, sending winter warmth to parents, or curating festive corporate hampers in Lahore, Karachi, or Islamabad, BAJOZ — The House of Naturals prepares bespoke gift boxes tailored to your occasion.',
        bulletPoints: [
          'Complimentary handwritten calligraphed gift cards included with every box',
          'Custom ribbon branding available for corporate orders of 15+ jars',
          'Mix and match Panjeeri, SpiceMix & Tooth Guardian',
          'Scheduled doorstep delivery across Pakistan on your exact chosen date',
        ],
        ctaText: 'Explore Collection & Add Gift Note',
        ctaLink: '#collection',
        theme: 'white',
      },
    ],
  },
  {
    id: 'page-purity',
    title: 'Purity & Roasting Standards',
    slug: 'purity',
    kicker: 'Zero Adulteration · Model Town Kitchen',
    subtitle:
      'Every jar of BAJOZ — The House of Naturals is slow-roasted in small 10kg batches using unadulterated ingredients sourced directly from trusted Pakistani farms and orchards.',
    isPublished: true,
    showInHeader: false,
    showInFooter: true,
    updatedAt: '2026-10-18',
    sections: [
      {
        id: 'sec-pur-1',
        kicker: 'Our 3-Step Kitchen Promise',
        heading: 'No vegetable oils, no liquid glucose, and zero synthetic fillers.',
        body: 'Commercial snacks and synthetic masalas cut corners with palm oil, artificial preservatives, and cheap fillers. At BAJOZ — The House of Naturals, we roast strictly over low flame in heavy brass vessels and seal every batch fresh.',
        bulletPoints: [
          '100% pure cultured grass-fed desi ghee tested for moisture-free clarity',
          'Whole Californian almonds, Iranian pistachios & organic gond katira in Panjeeri',
          'All spices, fresh garlic & ginger (zero onion) in SpiceMix',
          'Natural alum, cloves, salts & tree bark powders in Tooth Guardian Oral Care',
        ],
        ctaText: 'Shop Small-Batch Jars',
        ctaLink: '#collection',
        theme: 'sand',
      },
    ],
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  businessName: 'BAJOZ — The House of Naturals',
  websiteUrl: 'https://bajoz.pk',
  officialPhone: '0315-4388166',
  supportPhone: '0315-4388166',
  whatsappNumber: '923154388166',
  whatsappGreeting:
    'Hi BAJOZ — The House of Naturals! I would like to inquire about your products.',
  instagramUrl: 'https://www.instagram.com/bajoz.pk/',
  facebookUrl: 'https://www.facebook.com/bajoz.pk/',
  announcementText:
    'Panjeeri | SpiceMix | Tooth Guardian',
  freeDeliveryThreshold: 2500,
  standardDeliveryFee: 250,
  officeAddress: 'Model Town, Lahore, Punjab, Pakistan',
  bankDetails: {
    bankName: 'Meezan Bank Ltd (Islamic Banking)',
    accountTitle: 'BAJOZ HOUSE OF NATURALS',
    accountNumber: '02100109845678',
    iban: 'PK45MEZN0002100109845678',
    instructions:
      'Transfer the exact total to BAJOZ HOUSE OF NATURALS and include your 5-character Order ID in the transfer reference. Share your receipt on WhatsApp 0315-4388166 for priority dispatch.',
  },
  siteCopy: DEFAULT_SITE_COPY,
  customPages: DEFAULT_CUSTOM_PAGES,
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'panjeeri',
    name: 'Panjeeri',
    subtitle: 'Slow-roasted in 100% pure grass-fed Desi Ghee with whole almonds, cashews, pistachios & Gond Katira.',
    tagline:
      'Slow-roasted by BAJOZ in 100% pure grass-fed desi ghee with whole Californian almonds, cashews, pistachios & gond katira',
    category: 'Panjeeri',
    imageType: 'panjeeri',
    customImageUrl: '/assets/aistudio/image_fee0cd04_a0af1ff4.png',
    basePrice: 1950,
    featured: true,
    isPublished: true,
    packagingSpec:
      'Size: N/A · Airtight fresh-sealed jar with kraft botanical label',
    story:
      'Prepared in our Lahore kitchen using 100% pure grass-fed Desi Ghee, whole Californian almonds, cashews, pistachios, and organic Gond Katira. Slow-roasted over low flame with unrefined cane shakkar — giving your family real traditional nourishment with zero palm oil or refined sugar.',
    description:
      'Rich, crunchy, and slow-roasted in 100% pure grass-fed Desi Ghee. Packed with whole almonds, cashews, pistachios, char magaz, and Gond Katira — ready to enjoy straight from our airtight jar with morning chai or warm milk.',
    ingredients: [
      'Pure Grass-Fed Desi Ghee (Slow-Churned)',
      'Whole Californian Almonds (Badam)',
      'Roasted Whole Cashews (Kaju)',
      'Green Iranian Pistachios (Pista)',
      'Char Magaz & Pumpkin Seed Kernels',
      'Organic Gond Katira (Edible Gum Crystals)',
      'Kamarkas & Phool Makhana (Fox Nuts)',
      'Golden Semolina & Unrefined Cane Shakkar',
      'Crushed Green Cardamom Pods (Ilaichi)',
    ],
    usageInstructions: [
      'Enjoy 2 generous tablespoons every morning alongside warm milk, kahwa, or chai.',
      'Ideal as a comforting breakfast bowl topping or afternoon traditional snack.',
      'Keep tightly sealed in its airtight jar at cool room temperature. Never refrigerate.',
    ],
    faqs: [
      {
        question: 'What is the difference between Suji, Alsi, and Daal Moong Panjeeri?',
        answer:
          'Suji Classic Roast features golden-roasted semolina and whole dry fruits for classic everyday family enjoyment. Alsi Panjeeri incorporates roasted golden flaxseeds and traditional dry fruits. Daal Moong Panjeeri uses slow-roasted yellow lentil flour for a rich, nutty traditional blend.',
      },
      {
        question: 'How long does BAJOZ Panjeeri stay fresh?',
        answer:
          'Because we roast strictly in moisture-free pure desi ghee with zero water, your jar stays crisp and aromatic for up to 3 months at cool room temperature.',
      },
    ],
    variants: [
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
    packSizes: [
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
  },
  {
    id: 'spicemix',
    name: 'SpiceMix',
    subtitle: 'Cook ghar-jaisa Karahi, Handi, Pulao & Daal in 15 minutes with fresh garlic, ginger & roasted spices — no onion.',
    tagline:
      'Homemade · Aromatic · No Onion — One slow-simmered all-in-1 cooking paste with all spices, garlic & ginger for Karahi, Handi, Daal & Pulao',
    category: 'Cooking Paste',
    imageType: 'spicemix',
    customImageUrl: '/assets/aistudio/image_46d9bf55_06e518ca.jpg',
    basePrice: 950,
    featured: true,
    isPublished: true,
    packagingSpec:
      'Size: N/A · Wide-mouth fresh-sealed jar (cooks 8 family meals · No Onion)',
    story:
      'Skip 45 minutes of peeling mountain garlic, scraping ginger, and grinding spices after a long day. SpiceMix is slow-simmered with all traditional spices, fresh garlic, and stone-ground ginger in cold-pressed mustard oil (zero onion) — turning 10 prep steps into 2 spoonfuls.',
    description:
      'A rich, concentrated cooking paste crafted from fresh mountain garlic, stone-ground ginger, Kashmiri degi mirch, and whole roasted spices in cold-pressed mustard oil — zero preservatives, zero water fillers, and no onion.',
    ingredients: [
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
    ],
    usageInstructions: [
      'Warm 2 tablespoons of desi ghee or cooking oil in your pan or handi.',
      'Scoop 2 tablespoons of SpiceMix and sauté for 60 seconds until the aromatic spices, garlic, and ginger bloom.',
      'Add chicken, mutton, lentils, or seasonal vegetables and simmer until tender—no extra garlic, ginger, or spice packets required.',
    ],
    faqs: [
      {
        question: 'What is BAJOZ SpiceMix?',
        answer:
          'BAJOZ SpiceMix is a homemade blend of subcontinental spices, ginger, and garlic, made without preservatives and without onion. It is designed for use across a variety of Pakistani and Indian dishes.',
      },
      {
        question: 'Which dishes can I make with BAJOZ SpiceMix?',
        answer:
          'You can use it in dishes such as biryani, qourma, karahi, paya, kalaijee, tikka, roast, daal, fish fry, and many more. The quantity and cooking method will depend on the dish and your recipe.',
      },
      {
        question: 'Does BAJOZ SpiceMix contain onion?',
        answer:
          'No. BAJOZ SpiceMix has no onion added. If your recipe calls for onion, you can add it separately.',
      },
      {
        question: 'Does BAJOZ SpiceMix contain preservatives?',
        answer:
          "BAJOZ SpiceMix is homemade and made without preservatives. Please check the complete ingredient list and packaging for the product's full details.",
      },
      {
        question: 'Is this a ready-made biryani or karahi masala?',
        answer:
          'BAJOZ SpiceMix is a versatile seasoning blend rather than a claim that every dish needs exactly the same seasoning. Use it according to your recipe, and add any other ingredients or seasonings your dish requires.',
      },
      {
        question: 'Can I use the same SpiceMix for daal and meat dishes?',
        answer:
          'The blend can be used across a range of dishes, including daal and meat preparations. Start with the recommended quantity, follow your recipe, and adjust the seasoning to your taste.',
      },
      {
        question: 'How much SpiceMix should I use?',
        answer:
          "The right quantity depends on the recipe, portion size, and your preferred flavour intensity. Follow the product's recommended directions and adjust gradually.",
      },
      {
        question: 'Is BAJOZ SpiceMix suitable for vegetarians?',
        answer:
          'The listed blend ingredients are spices, ginger, and garlic, but please confirm the complete ingredient list, processing details, and any cross-contact information on the product packaging before making a dietary decision.',
      },
      {
        question: 'How should I store BAJOZ SpiceMix?',
        answer:
          'Follow the storage instructions printed on the packaging. Keep the product properly sealed and follow any stated guidance about moisture, temperature, and storage after opening.',
      },
      {
        question: 'Where can I buy SpiceMix online in Pakistan?',
        answer:
          'You can order BAJOZ SpiceMix through the BAJOZ online shop, subject to stock availability and delivery coverage. Check the current price, pack size, and delivery details before placing your order.',
      },
      {
        question: 'Will SpiceMix make every dish taste exactly the same?',
        answer:
          'Every dish has its own ingredients, cooking method, and flavour profile. BAJOZ SpiceMix is a versatile starting point, not a replacement for every ingredient in every recipe. Adjust the blend and your other seasonings to suit the dish.',
      },
    ],
    variants: [
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
    packSizes: [
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
  },
  {
    id: 'toothpowder',
    name: 'Tooth Guardian',
    subtitle: 'Natural homemade tooth cleaning powder made with alum, cloves, natural salts, and tree bark powders for everyday oral care.',
    tagline:
      'Natural homemade tooth cleaning powder by BAJOZ with alum, cloves, salts & tree bark powders for oral care',
    category: 'Oral Care',
    imageType: 'toothpowder',
    customImageUrl: '/assets/aistudio/image_2d948939_cf968239.png',
    basePrice: 850,
    featured: true,
    isPublished: true,
    packagingSpec:
      'Fresh-sealed 100 gm jar',
    story:
      'Homemade tooth cleaning and care powder packed with natural and premium minerals so that you and your family keep your teeth and gums clean and healthy with our ancestral oral care routine product.',
    description:
      'Homemade tooth cleaning and care powder packed with natural and premium minerals — Alum, Cloves, Salts, and Tree Bark Powders — so that you and your family keep your teeth and gums clean and healthy with our ancestral oral care routine product.',
    ingredients: [
      'Alum (Phitkari)',
      'Cloves (Laung)',
      'Natural Salts',
      'Tree Bark Powders',
    ],
    usageInstructions: [
      'Lightly moisten your toothbrush bristles with clean water.',
      'Use a clean, dry spoon or scoop to place a small pinch of Tooth Guardian onto the bristles.',
      'Brush gently in circular motions, then rinse thoroughly with clean water.',
    ],
    faqs: [
      {
        question: 'What is BAJOZ Tooth Powder?',
        answer:
          'BAJOZ Tooth Powder (Tooth Guardian) is a natural homemade tooth cleaning powder offered as part of the BAJOZ oral care collection. Please review the product description and packaging for its exact formulation and intended use.',
      },
      {
        question: 'What ingredients are in BAJOZ Tooth Powder?',
        answer:
          'The complete ingredient list appears on this page and the product packaging: Alum (Phitkari), Cloves (Laung), Natural Salts, and Tree Bark Powders. If you have allergies or sensitivities, review every ingredient before use.',
      },
      {
        question: 'How do I use BAJOZ Tooth Powder?',
        answer:
          'Follow the verified directions provided with the product: lightly moisten your toothbrush bristles with clean water, use a clean dry spoon to place a small pinch of powder onto the bristles, brush gently, and rinse thoroughly with water.',
      },
      {
        question: 'Can I use tooth powder every day?',
        answer:
          'That depends on the formulation, its abrasiveness, and your individual oral health. Ask your dentist whether this particular product is appropriate for regular use.',
      },
      {
        question: 'Does BAJOZ Tooth Powder whiten teeth?',
        answer:
          'Do not assume a whitening benefit unless it has been appropriately substantiated for this specific product. Tooth appearance can have different causes, and not every tooth-cleaning product is a whitening product.',
      },
      {
        question: 'Does tooth powder help with gum problems or cavities?',
        answer:
          'This page does not make a claim that BAJOZ Tooth Powder prevents cavities or treats gum disease. If you have bleeding gums, tooth pain, sensitivity, or other dental symptoms, consult a qualified dentist.',
      },
      {
        question: 'Is BAJOZ Tooth Powder a medicated product?',
        answer:
          'No. BAJOZ Tooth Guardian is a natural homemade tooth cleaning powder rooted in traditional ancestral oral care routines, not a medicated dental product.',
      },
      {
        question: 'Is tooth powder suitable for children?',
        answer:
          "Do not assume the product is suitable for children unless the manufacturer has provided clear, verified age guidance. Ask a dentist about appropriate oral-care products for your child's age and needs.",
      },
      {
        question: 'Can I use tooth powder if I have sensitive teeth?',
        answer:
          'Sensitivity can have several causes, and some products may not be appropriate for sensitive teeth. Consult your dentist before use if you experience sensitivity or have concerns about abrasiveness.',
      },
      {
        question: 'Where can I buy tooth powder online in Pakistan?',
        answer:
          'You can explore BAJOZ Tooth Powder through the BAJOZ online shop, subject to current stock and delivery coverage. Check the current price, net weight, ingredients, and delivery information before placing your order.',
      },
    ],
    variants: [
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
    packSizes: [
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
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'bajoz-rev-1',
    customerName: 'BAJOZ Customer',
    city: 'Pakistan',
    rating: 5,
    productTag: 'Panjeeri',
    date: 'Recent',
    title: 'Authentic Taste That Delivers Pure Joy Daily',
    comment: 'Panjeeri bht Mazayy ki hai\nZaberdast hai 👍🏼❤️',
    verified: true,
    isApproved: true,
    helpfulCount: 0,
  },
  {
    id: 'bajoz-rev-2',
    customerName: 'BAJOZ Customer',
    city: 'Pakistan',
    rating: 5,
    productTag: 'SpiceMix',
    date: 'Recent',
    title: 'Perfect Balance of Flavor for Special Meals',
    comment:
      'Today I received my parcel and cooked Palak Chicken in iftari . Amazing taste and perfect ratio of spices .\nThank you 😊💓',
    verified: true,
    isApproved: true,
    helpfulCount: 0,
  },
  {
    id: 'bajoz-rev-3',
    customerName: 'BAJOZ Customer',
    city: 'Pakistan',
    rating: 5,
    productTag: 'SpiceMix',
    date: 'Recent',
    title: 'Pure Magic In Every Single Homemade Dish',
    comment:
      'Ap ka spice magic ha Qorma banaya koi paste koi spice use nai kerna pera MASHALLAH taste Awesom ❤️ thnx so much',
    verified: true,
    isApproved: true,
    helpfulCount: 0,
  },
  {
    id: 'bajoz-rev-4',
    customerName: 'BAJOZ Customer',
    city: 'Pakistan',
    rating: 5,
    productTag: 'SpiceMix',
    date: 'Recent',
    title: 'Wholesome Flavor That Truly Earns Sincere Prayers',
    comment:
      'زبردست ۔۔۔ماشاءاللہ\nآج میں نے یہ چٹنی بنانی ھے ۔ املی منگوا رکھی ھے\nآج آلو پالک میں بھی یہ spicemix استعمال کیا ھے ۔ بہت دعائیں دیتی ھو آپکو',
    verified: true,
    isApproved: true,
    helpfulCount: 0,
  },
  {
    id: 'bajoz-rev-5',
    customerName: 'BAJOZ Customer',
    city: 'Pakistan',
    rating: 5,
    productTag: 'SpiceMix & Tooth Guardian',
    date: 'Recent',
    title: 'Trusted Kitchen Essentials and Proven Natural Care',
    comment:
      'Apka spicemix bhi bohat acha hai aur apka manjan bhi bohat acha hai',
    verified: true,
    isApproved: true,
    helpfulCount: 0,
  },
  {
    id: 'bajoz-rev-7',
    customerName: 'BAJOZ Customer',
    city: 'Pakistan',
    rating: 5,
    productTag: 'SpiceMix & Tooth Guardian',
    date: 'Recent',
    title: 'Effortless Cooking Magic and Unbeatable Natural Freshness',
    comment:
      'Salam gi mujhay Aap ka spice mix jar our teeth pouder mill gaya ha jar khulnay par woh hi khushbu maza agaya 😋 our teeth pouder ka to jawab nahi Aap nay hamary laye khana banana itna easy kar dya ha Allah Aap ko iss ka ajar day ❤️ our hamisha khush rahin thanks\nMa nay abhinahari banai ha us ki picture Aap ko send karoon gi',
    verified: true,
    isApproved: true,
    helpfulCount: 0,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    orderNumber: 'B7K2Q',
    date: new Date(Date.now() - 18000000).toISOString(),
    customer: {
      name: 'Ayesha Malik',
      email: 'ayesha.malik@gmail.com',
      phone: '03008459123',
      address: 'House 42-B, Street 7, Sector Y, DHA Phase 3',
      city: 'Lahore',
      deliveryNotes: 'Please ring bell twice, call before arrival.',
    },
    items: [
      {
        id: 'panjeeri-suji-500g',
        productId: 'panjeeri',
        variantId: 'suji',
        packSizeId: '500g',
        productName: 'Panjeeri',
        variantName: 'Suji Classic Roast',
        packSizeLabel: '500g Jar',
        unitPrice: 1950,
        quantity: 1,
        colorAccent: '#D99B26',
        sku: 'DT-PAN-SUJ',
      },
      {
        id: 'spicemix-default-350g',
        productId: 'spicemix',
        variantId: 'default',
        packSizeId: '350g',
        productName: 'SpiceMix',
        variantName: '',
        packSizeLabel: '350g Jar (8 Meals)',
        unitPrice: 950,
        quantity: 1,
        colorAccent: '#C86D3B',
        sku: 'DT-SPX-STD',
      },
    ],
    subtotal: 2900,
    deliveryFee: 0,
    total: 2900,
    paymentMethod: 'cod',
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Confirmed',
    courierName: 'Trax Logistics',
    trackingNumber: 'TRX-948210-LHR',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledSlot: 'Afternoon (2 PM – 6 PM)',
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        note: 'BAJOZ web storefront booking',
      },
      {
        status: 'Confirmed',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        note: 'Verified via WhatsApp confirmation',
      },
    ],
  },
  {
    orderNumber: 'M4P9X',
    date: new Date(Date.now() - 129600000).toISOString(),
    customer: {
      name: 'Tariq Mehmood',
      email: 'tariq.mehmood@outlook.com',
      phone: '03214567890',
      address: 'Apartment 402, Royal Residency, Gulberg II',
      city: 'Lahore',
    },
    items: [
      {
        id: 'panjeeri-alsi-1kg',
        productId: 'panjeeri',
        variantId: 'alsi',
        packSizeId: '1kg',
        productName: 'Panjeeri',
        variantName: 'Alsi (Flaxseed) Vitality',
        packSizeLabel: '1kg Twin Jars',
        unitPrice: 3705,
        quantity: 1,
        colorAccent: '#8C5828',
        sku: 'DT-PAN-ALS',
      },
    ],
    subtotal: 3705,
    deliveryFee: 0,
    total: 3705,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Dispatched',
    bankReference: 'MZN-749201-TF',
    courierName: 'TCS Express',
    trackingNumber: 'TCS-83920184',
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: new Date(Date.now() - 129600000).toISOString(),
      },
      {
        status: 'Paid',
        timestamp: new Date(Date.now() - 103680000).toISOString(),
        note: 'Meezan Bank transfer verified by BAJOZ',
      },
      {
        status: 'Dispatched',
        timestamp: new Date(Date.now() - 34560000).toISOString(),
        note: 'Dispatched with TCS Express',
      },
    ],
  },
];

const INITIAL_PROFILES: CustomerUser[] = [
  {
    id: 'user_ayesha',
    name: 'Ayesha Malik',
    email: 'ayesha.malik@gmail.com',
    phone: '03001234567',
    city: 'Lahore',
    savedAddresses: ['House 18, Block G, DHA Phase 5, Lahore'],
    provider: 'google',
    createdAt: '2026-09-15',
  },
  {
    id: 'user_tariq',
    name: 'Tariq Mehmood',
    email: 'tariq.mehmood@outlook.com',
    phone: '03219876543',
    city: 'Karachi',
    savedAddresses: ['Apartment 4B, Clifton Block 2, Karachi'],
    provider: 'outlook',
    createdAt: '2026-09-28',
  },
];

const ORDER_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function generateOrderCode(existingCodes: string[] = []): string {
  const set = new Set(existingCodes.map((c) => c.toUpperCase()));
  for (let i = 0; i < 1000; i++) {
    let code = '';
    for (let j = 0; j < 5; j++) {
      code += ORDER_CHARS[Math.floor(Math.random() * ORDER_CHARS.length)];
    }
    if (!set.has(code)) return code;
  }
  return Date.now().toString(36).toUpperCase().slice(-5).padStart(5, 'X');
}

export function calculateVariantPrice(
  basePrice: number,
  priceAdjustment = 0,
  priceMultiplier = 1
): number {
  return Math.round(Math.max(0, basePrice + priceAdjustment) * priceMultiplier);
}

export function calculateCartTotals(
  items: CartItem[],
  freeThreshold = 2500,
  standardFee = 250
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  if (items.length === 0) return { subtotal: 0, deliveryFee: 0, total: 0 };
  const deliveryFee = subtotal >= freeThreshold ? 0 : standardFee;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

interface ShopContextValue {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  reviews: CustomerReview[];
  settings: StoreSettings;
  siteCopy: WebsiteCopyConfig;
  customPages: CustomPage[];
  activePageSlug: string | null;
  setActivePageSlug: (slug: string | null) => void;
  activeProductId: string | null;
  setActiveProductId: (productId: string | null) => void;
  user: CustomerUser | null;
  isSupabaseReady: boolean;
  currentView: 'store' | 'admin';
  setCurrentView: (v: 'store' | 'admin') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  favorites: string[];
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderQuery: string;
  setTrackingOrderQuery: (q: string) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  accountModalMode: 'signin' | 'signup';
  openAccountModal: (mode?: 'signin' | 'signup') => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isVoiceConciergeOpen: boolean;
  setIsVoiceConciergeOpen: (open: boolean) => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (cat: string) => void;
  addToCart: (
    product: Product,
    variantId: string,
    packSizeId: string,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotals: { subtotal: number; deliveryFee: number; total: number };
  cartCount: number;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  placeOrder: (
    customer: OrderCustomer,
    paymentMethod: 'cod' | 'bank_transfer',
    bankReference?: string
  ) => Order;
  updateOrderStatus: (
    orderNumber: string,
    status: FulfillmentStatus,
    note?: string,
    actor?: string
  ) => void;
  updatePaymentStatus: (
    orderNumber: string,
    status: PaymentStatus,
    note?: string,
    actor?: string
  ) => void;
  updateOrderShipping: (
    orderNumber: string,
    courierName: string,
    trackingNumber: string,
    actor?: string
  ) => void;
  scheduleOrder: (
    orderNumber: string,
    scheduledDate: string,
    scheduledSlot: string,
    note?: string,
    actor?: string
  ) => void;
  updateOrderDetails: (
    orderNumber: string,
    updates: Partial<Order>,
    note?: string,
    actor?: string
  ) => void;
  deleteOrder: (orderNumber: string) => void;
  createManualAdminOrder: (partial: {
    customer: OrderCustomer;
    items: CartItem[];
    paymentMethod: 'cod' | 'bank_transfer';
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    courierName?: string;
    trackingNumber?: string;
    scheduledDate?: string;
    scheduledSlot?: string;
    bankReference?: string;
    orderNotes?: string;
    giftMessage?: string;
    actor?: string;
  }) => Order;
  addProduct: (newProduct: Product) => void;
  updateProduct: (updated: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductCustomImage: (productId: string, dataUrl: string | undefined) => void;
  updateVariantStock: (productId: string, variantId: string, stock: number) => void;
  addCustomerReview: (
    review: Omit<CustomerReview, 'id' | 'date' | 'isApproved' | 'helpfulCount'>
  ) => void;
  updateReview: (updated: CustomerReview) => void;
  toggleHelpfulReview: (reviewId: string) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
  updateSiteCopy: (copy: WebsiteCopyConfig) => void;
  upsertCustomPage: (page: CustomPage) => void;
  deleteCustomPage: (pageId: string) => void;
  registerWithEmail: (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    city: string;
    address: string;
  }) => Promise<{ success: boolean; message: string }>;
  loginWithEmail: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: (profile?: { email?: string; name?: string }) => Promise<void>;
  loginWithOutlook: (profile?: { email?: string; name?: string }) => Promise<void>;
  updateUserProfile: (updates: Partial<CustomerUser>) => void;
  logoutUser: () => Promise<void>;
  registeredUsers: CustomerUser[];
  adminCreateUser: (newUser: Omit<CustomerUser, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => CustomerUser;
  adminUpdateUser: (id: string, updates: Partial<CustomerUser>) => void;
  adminDeleteUser: (id: string) => void;
  activeSelectionContext: ActiveProductSelectionContext | null;
  setActiveSelectionContext: (ctx: ActiveProductSelectionContext | null) => void;
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'bajoz_products_v10',
  CART: 'bajoz_cart_v6',
  ORDERS: 'bajoz_orders_v4',
  REVIEWS: 'bajoz_reviews_v7',
  SETTINGS: 'bajoz_settings_v12',
  USER: 'bajoz_user_v1',
  REGISTERED_USERS: 'bajoz_registered_users_v1',
  ORDER_NOTES: 'bajoz_order_notes_v1',
  FAVORITES: 'bajoz_favorites_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map(
            parsed.map((p) => [
              p.id,
              normalizeCatalogProduct({ ...p, isPublished: p.isPublished !== false }),
            ])
          );
          const merged: Product[] = [];
          for (const def of INITIAL_PRODUCTS) {
            if (map.has(def.id)) {
              merged.push(map.get(def.id)!);
              map.delete(def.id);
            } else {
              merged.push(normalizeCatalogProduct(def));
            }
          }
          for (const extra of map.values()) {
            merged.push(normalizeCatalogProduct(extra));
          }
          return merged;
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          siteCopy: {
            ...DEFAULT_SITE_COPY,
            ...(parsed.siteCopy || {}),
          },
          customPages: Array.isArray(parsed.customPages)
            ? parsed.customPages
            : DEFAULT_CUSTOM_PAGES,
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PROFILES;
  });

  const isLocationAdminPortal = (): boolean => {
    return parseCurrentLocation().view === 'admin';
  };

  const getSlugFromLocation = (): string | null => {
    return parseCurrentLocation().pageSlug;
  };

  const getProductFromLocation = (): string | null => {
    return parseCurrentLocation().productId;
  };

  const [currentView, setCurrentViewState] = useState<'store' | 'admin'>(() =>
    isLocationAdminPortal() ? 'admin' : 'store'
  );
  const [activePageSlug, setActivePageSlugState] = useState<string | null>(() =>
    getSlugFromLocation()
  );
  const [activeProductId, setActiveProductIdState] = useState<string | null>(() =>
    getProductFromLocation()
  );

  const setActivePageSlug = (slug: string | null) => {
    setActivePageSlugState(slug);
    if (slug) {
      setActiveProductIdState(null);
    }
    try {
      if (slug) {
        const target = buildCanonicalPath({ view: 'store', pageSlug: slug });
        window.history.pushState(null, document.title, target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentView === 'store' && !activeProductId) {
        window.history.pushState(null, document.title, '/');
      }
    } catch {
      // ignore
    }
  };

  const setActiveProductId = (productId: string | null) => {
    setActiveProductIdState(productId);
    if (productId) {
      setActivePageSlugState(null);
    }
    try {
      if (productId) {
        const target = buildCanonicalPath({ view: 'store', productId });
        window.history.pushState(null, document.title, target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentView === 'store' && !activePageSlug) {
        window.history.pushState(null, document.title, '/');
      }
    } catch {
      // ignore
    }
  };

  const setCurrentView = (view: 'store' | 'admin') => {
    setCurrentViewState(view);
    if (view === 'admin') {
      setActivePageSlugState(null);
      setActiveProductIdState(null);
    }
    try {
      const target = buildCanonicalPath({ view });
      if (window.location.pathname !== target) {
        window.history.pushState(null, document.title, target);
      }
    } catch {
      // ignore
    }
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === 'string');
        }
      }
      return [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderQuery, setTrackingOrderQuery] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState<'signin' | 'signup'>('signin');
  const openAccountModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAccountModalMode(mode);
    setIsAccountOpen(true);
  };
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isVoiceConciergeOpen, setIsVoiceConciergeOpen] = useState(false);
  const [activeSelectionContext, setActiveSelectionContext] =
    useState<ActiveProductSelectionContext | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [orderNotes, setOrderNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ORDER_NOTES) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const syncViewFromUrl = () => {
      const parsed = parseCurrentLocation();
      setCurrentViewState(parsed.view);
      setActivePageSlugState(parsed.pageSlug);
      setActiveProductIdState(parsed.productId);

      if (parsed.modalIntent === 'track') {
        if (parsed.trackingCode) {
          setTrackingOrderQuery(parsed.trackingCode);
        }
        setIsTrackingOpen(true);
      } else if (parsed.modalIntent === 'signin') {
        setAccountModalMode('signin');
        setIsAccountOpen(true);
      } else if (parsed.modalIntent === 'signup') {
        setAccountModalMode('signup');
        setIsAccountOpen(true);
      } else if (parsed.modalIntent === 'checkout') {
        setIsCheckoutOpen(true);
      } else if (parsed.modalIntent === 'cart') {
        setIsCartOpen(true);
      }
    };
    syncViewFromUrl();
    window.addEventListener('popstate', syncViewFromUrl);
    window.addEventListener('hashchange', syncViewFromUrl);
    return () => {
      window.removeEventListener('popstate', syncViewFromUrl);
      window.removeEventListener('hashchange', syncViewFromUrl);
    };
  }, []);

  useEffect(() => {
    try {
      const activeProd = activeProductId
        ? products.find((p) => p.id === activeProductId)
        : null;
      document.title =
        currentView === 'admin'
          ? `${settings.businessName || 'BAJOZ — The House of Naturals'} — Authorized Admin Portal`
          : activeProd
          ? `${activeProd.name} — ${settings.businessName || 'BAJOZ — The House of Naturals'}`
          : `${settings.businessName || 'BAJOZ — The House of Naturals'} — Artisanal Natural Food & Desi Nourishment`;

      const parsed = parseCurrentLocation();
      if (!parsed.modalIntent) {
        const targetPath = buildCanonicalPath({
          view: currentView,
          pageSlug: activePageSlug,
          productId: activeProductId,
        });
        if (window.location.pathname !== targetPath) {
          window.history.replaceState(
            null,
            document.title,
            `${targetPath}${window.location.search}${window.location.hash}`
          );
        }
      }
    } catch {
      // ignore
    }
  }, [currentView, activePageSlug, activeProductId, products, settings.businessName]);

  const upsertLocalRegisteredUser = (profile: CustomerUser) => {
    setRegisteredUsers((prev) => {
      const exists = prev.some(
        (u) =>
          u.id === profile.id ||
          u.email.toLowerCase() === profile.email.toLowerCase()
      );
      if (exists) {
        return prev.map((u) =>
          u.id === profile.id ||
          u.email.toLowerCase() === profile.email.toLowerCase()
            ? { ...u, ...profile }
            : u
        );
      }
      return [profile, ...prev];
    });
  };

  useEffect(() => {
    let isMounted = true;

    syncInitialDataWithSupabase({
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      reviews: INITIAL_REVIEWS,
      settings: INITIAL_SETTINGS,
      profiles: INITIAL_PROFILES,
    }).then((synced) => {
      if (!isMounted) return;
      setProducts(synced.products);
      setOrders(synced.orders);
      setReviews(synced.reviews);
      setSettings({
        ...INITIAL_SETTINGS,
        ...synced.settings,
        siteCopy: {
          ...DEFAULT_SITE_COPY,
          ...(synced.settings.siteCopy || {}),
        },
        customPages: Array.isArray(synced.settings.customPages)
          ? synced.settings.customPages
          : DEFAULT_CUSTOM_PAGES,
      });
      if (synced.profiles.length > 0) {
        setRegisteredUsers(synced.profiles);
      }
    });

    verifyCustomerSessionOnServer().then((verifiedUser) => {
      if (!isMounted || !verifiedUser) return;
      setUser(verifiedUser);
      upsertLocalRegisteredUser(verifiedUser);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.REGISTERED_USERS,
        JSON.stringify(registeredUsers)
      );
    } catch {
      // ignore
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDER_NOTES, orderNotes);
    } catch {
      // ignore
    }
  }, [orderNotes]);

  const siteCopy: WebsiteCopyConfig = {
    ...DEFAULT_SITE_COPY,
    ...(settings.siteCopy || {}),
  };

  const customPages: CustomPage[] = Array.isArray(settings.customPages)
    ? settings.customPages
    : DEFAULT_CUSTOM_PAGES;

  const cartTotals = calculateCartTotals(
    cart,
    settings.freeDeliveryThreshold,
    settings.standardDeliveryFee
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (
    product: Product,
    variantId: string,
    packSizeId: string,
    quantity = 1
  ) => {
    const hasVariants =
      Array.isArray(product.variants) && product.variants.length > 0;
    const variant = hasVariants
      ? product.variants.find((v) => v.id === variantId) || product.variants[0]
      : undefined;
    const packSize =
      product.packSizes.find((p) => p.id === packSizeId) || product.packSizes[0];
    const unitPrice = calculateVariantPrice(
      product.basePrice,
      variant ? variant.priceAdjustment : 0,
      packSize ? packSize.priceMultiplier : 1
    );
    const id = `${product.id}-${variant ? variant.id : 'default'}-${
      packSize ? packSize.id : 'default'
    }`;

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id,
          productId: product.id,
          variantId: variant ? variant.id : 'default',
          packSizeId: packSize ? packSize.id : 'default',
          productName: product.name,
          variantName: variant ? variant.name : '',
          packSizeLabel: packSize ? packSize.label : '',
          unitPrice,
          quantity,
          colorAccent: variant?.colorAccent,
          sku:
            variant?.sku ||
            (product.id === 'spicemix'
              ? 'BJ-SPX-STD'
              : `${product.id.toUpperCase()}-SKU`),
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setCart([]);

  const placeOrder = (
    customer: OrderCustomer,
    paymentMethod: 'cod' | 'bank_transfer',
    bankReference?: string
  ): Order => {
    const orderNumber = generateOrderCode(orders.map((o) => o.orderNumber));
    const now = new Date().toISOString();
    const totals = calculateCartTotals(
      cart,
      settings.freeDeliveryThreshold,
      settings.standardDeliveryFee
    );
    const history = [
      {
        status: 'Order Placed',
        timestamp: now,
        note: `DTCSS online storefront order via ${
          paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'
        }`,
      },
    ];
    if (paymentMethod === 'bank_transfer' && bankReference) {
      history.push({
        status: 'Awaiting Verification',
        timestamp: now,
        note: `Customer submitted transfer reference: ${bankReference}`,
      });
    }

    const finalNotes =
      customer.orderNotes || customer.deliveryNotes || orderNotes || '';
    const newOrder: Order = {
      orderNumber,
      date: now,
      customer: {
        ...customer,
        deliveryNotes: finalNotes,
        orderNotes: finalNotes,
      },
      items: [...cart],
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      paymentMethod,
      paymentStatus:
        paymentMethod === 'bank_transfer' ? 'Awaiting Verification' : 'Pending',
      fulfillmentStatus: 'Order Placed',
      bankReference,
      orderNotes: finalNotes,
      giftMessage: customer.giftMessage,
      statusHistory: history,
    };

    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItems = cart.filter((c) => c.productId === prod.id);
        if (orderedItems.length === 0) return prod;
        const updatedProd = {
          ...prod,
          variants: prod.variants.map((v) => {
            const match = orderedItems.find((c) => c.variantId === v.id);
            if (!match) return v;
            return { ...v, stock: Math.max(0, v.stock - match.quantity) };
          }),
        };
        void persistProductToSupabase(updatedProd);
        return updatedProd;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    void persistOrderToSupabase(newOrder);
    clearCart();
    setOrderNotes('');
    return newOrder;
  };

  const updateOrderStatus = (
    orderNumber: string,
    status: FulfillmentStatus,
    note?: string,
    actor = 'DTCSS Admin'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNumber !== orderNumber) return o;
        const updated: Order = {
          ...o,
          fulfillmentStatus: status,
          statusHistory: [
            ...o.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Fulfillment updated to ${status}`,
              actor,
            },
          ],
        };
        void persistOrderToSupabase(updated);
        return updated;
      })
    );
  };

  const updatePaymentStatus = (
    orderNumber: string,
    status: PaymentStatus,
    note?: string,
    actor = 'DTCSS Admin'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNumber !== orderNumber) return o;
        const updated: Order = {
          ...o,
          paymentStatus: status,
          statusHistory: [
            ...o.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Payment marked as ${status}`,
              actor,
            },
          ],
        };
        void persistOrderToSupabase(updated);
        return updated;
      })
    );
  };

  const updateOrderShipping = (
    orderNumber: string,
    courierName: string,
    trackingNumber: string,
    actor = 'DTCSS Admin'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNumber !== orderNumber) return o;
        const updated: Order = {
          ...o,
          courierName,
          trackingNumber,
          fulfillmentStatus:
            o.fulfillmentStatus === 'Order Placed' ||
            o.fulfillmentStatus === 'Scheduled'
              ? 'Dispatched'
              : o.fulfillmentStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Dispatched',
              timestamp: new Date().toISOString(),
              note: `Dispatched via ${courierName} (Tracking #${trackingNumber})`,
              actor,
            },
          ],
        };
        void persistOrderToSupabase(updated);
        return updated;
      })
    );
  };

  const scheduleOrder = (
    orderNumber: string,
    scheduledDate: string,
    scheduledSlot: string,
    note?: string,
    actor = 'DTCSS Admin'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNumber !== orderNumber) return o;
        const nextStatus: FulfillmentStatus =
          o.fulfillmentStatus === 'Order Placed'
            ? 'Scheduled'
            : o.fulfillmentStatus;
        const updated: Order = {
          ...o,
          scheduledDate,
          scheduledSlot,
          fulfillmentStatus: nextStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Scheduled',
              timestamp: new Date().toISOString(),
              note:
                note ||
                `Scheduled dispatch for ${scheduledDate} (${scheduledSlot || 'Standard Window'})`,
              actor,
            },
          ],
        };
        void persistOrderToSupabase(updated);
        return updated;
      })
    );
  };

  const updateOrderDetails = (
    orderNumber: string,
    updates: Partial<Order>,
    note?: string,
    actor = 'DTCSS Admin'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNumber !== orderNumber) return o;
        const nextHistory = note
          ? [
              ...o.statusHistory,
              {
                status: updates.fulfillmentStatus || o.fulfillmentStatus,
                timestamp: new Date().toISOString(),
                note,
                actor,
              },
            ]
          : updates.statusHistory || o.statusHistory;
        const updated: Order = {
          ...o,
          ...updates,
          customer: updates.customer
            ? { ...o.customer, ...updates.customer }
            : o.customer,
          statusHistory: nextHistory,
        };
        void persistOrderToSupabase(updated);
        return updated;
      })
    );
  };

  const deleteOrder = (orderNumber: string) => {
    setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber));
    void removeOrderFromSupabase(orderNumber);
  };

  const createManualAdminOrder = (partial: {
    customer: OrderCustomer;
    items: CartItem[];
    paymentMethod: 'cod' | 'bank_transfer';
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    courierName?: string;
    trackingNumber?: string;
    scheduledDate?: string;
    scheduledSlot?: string;
    bankReference?: string;
    orderNotes?: string;
    giftMessage?: string;
    actor?: string;
  }): Order => {
    const orderNumber = generateOrderCode(orders.map((o) => o.orderNumber));
    const now = new Date().toISOString();
    const totals = calculateCartTotals(
      partial.items,
      settings.freeDeliveryThreshold,
      settings.standardDeliveryFee
    );
    const actorName = partial.actor || 'DTCSS Admin';
    const history: Order['statusHistory'] = [
      {
        status: partial.fulfillmentStatus,
        timestamp: now,
        note: `Manual order booked by ${actorName}${
          partial.scheduledDate
            ? ` · Scheduled for ${partial.scheduledDate} (${partial.scheduledSlot || 'Standard'})`
            : ''
        }`,
        actor: actorName,
      },
    ];
    if (partial.trackingNumber) {
      history.push({
        status: 'Dispatched',
        timestamp: now,
        note: `Assigned ${partial.courierName || 'Courier'} Tracking #${partial.trackingNumber}`,
        actor: actorName,
      });
    }

    const newOrder: Order = {
      orderNumber,
      date: now,
      customer: {
        ...partial.customer,
        deliveryNotes: partial.orderNotes || partial.customer.deliveryNotes,
        orderNotes: partial.orderNotes || partial.customer.orderNotes,
        giftMessage: partial.giftMessage || partial.customer.giftMessage,
      },
      items: partial.items,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      paymentMethod: partial.paymentMethod,
      paymentStatus: partial.paymentStatus,
      fulfillmentStatus: partial.fulfillmentStatus,
      courierName: partial.courierName,
      trackingNumber: partial.trackingNumber,
      scheduledDate: partial.scheduledDate,
      scheduledSlot: partial.scheduledSlot,
      bankReference: partial.bankReference,
      orderNotes: partial.orderNotes,
      giftMessage: partial.giftMessage,
      statusHistory: history,
    };

    // Deduct stock for booked items
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItems = partial.items.filter((c) => c.productId === prod.id);
        if (orderedItems.length === 0) return prod;
        const updatedProd = {
          ...prod,
          variants: prod.variants.map((v) => {
            const match = orderedItems.find((c) => c.variantId === v.id);
            if (!match) return v;
            return { ...v, stock: Math.max(0, v.stock - match.quantity) };
          }),
        };
        void persistProductToSupabase(updatedProd);
        return updatedProd;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    void persistOrderToSupabase(newOrder);
    return newOrder;
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === newProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === newProduct.id ? newProduct : p));
      }
      return [...prev, newProduct];
    });
    void persistProductToSupabase(newProduct);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (activeProductModal?.id === updated.id) {
      setActiveProductModal(updated);
    }
    void persistProductToSupabase(updated);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (activeProductModal?.id === productId) {
      setActiveProductModal(null);
    }
    void removeProductFromSupabase(productId);
  };

  const updateProductCustomImage = (
    productId: string,
    dataUrl: string | undefined
  ) => {
    if (dataUrl && dataUrl.startsWith('data:image/')) {
      void uploadMediaToServer({
        dataUrl,
        filename: `product-${productId}`,
        category: 'products',
      }).then((serverUrl) => {
        const finalUrl = serverUrl || dataUrl;
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== productId) return p;
            const updated = { ...p, customImageUrl: finalUrl };
            void persistProductToSupabase(updated);
            return updated;
          })
        );
      });
      return;
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updated = { ...p, customImageUrl: dataUrl };
        void persistProductToSupabase(updated);
        return updated;
      })
    );
  };

  const updateVariantStock = (
    productId: string,
    variantId: string,
    stock: number
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updated = {
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v
          ),
        };
        void persistProductToSupabase(updated);
        return updated;
      })
    );
  };

  const addCustomerReview = (
    review: Omit<CustomerReview, 'id' | 'date' | 'isApproved' | 'helpfulCount'>
  ) => {
    const newRev: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      isApproved: true,
      helpfulCount: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
    void persistReviewToSupabase(newRev);
  };

  const updateReview = (updated: CustomerReview) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    void persistReviewToSupabase(updated);
  };

  const toggleHelpfulReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const updated = { ...r, helpfulCount: r.helpfulCount + 1 };
        void persistReviewToSupabase(updated);
        return updated;
      })
    );
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const updated = { ...r, isApproved: !r.isApproved };
        void persistReviewToSupabase(updated);
        return updated;
      })
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    void removeReviewFromSupabase(reviewId);
  };

  const updateStoreSettings = (newSettings: StoreSettings) => {
    const merged: StoreSettings = {
      ...settings,
      ...newSettings,
      siteCopy: newSettings.siteCopy || settings.siteCopy || DEFAULT_SITE_COPY,
      customPages: newSettings.customPages || settings.customPages || DEFAULT_CUSTOM_PAGES,
    };
    setSettings(merged);
    void persistSettingsToSupabase(merged);
  };

  const updateSiteCopy = (copy: WebsiteCopyConfig) => {
    const nextSettings: StoreSettings = {
      ...settings,
      siteCopy: copy,
    };
    setSettings(nextSettings);
    void persistSettingsToSupabase(nextSettings);
  };

  const upsertCustomPage = (page: CustomPage) => {
    const currentPages = Array.isArray(settings.customPages)
      ? settings.customPages
      : DEFAULT_CUSTOM_PAGES;
    const exists = currentPages.some((p) => p.id === page.id);
    const updatedPages = exists
      ? currentPages.map((p) => (p.id === page.id ? page : p))
      : [...currentPages, page];
    const nextSettings: StoreSettings = {
      ...settings,
      customPages: updatedPages,
    };
    setSettings(nextSettings);
    void persistSettingsToSupabase(nextSettings);
  };

  const deleteCustomPage = (pageId: string) => {
    const currentPages = Array.isArray(settings.customPages)
      ? settings.customPages
      : DEFAULT_CUSTOM_PAGES;
    const pageToDelete = currentPages.find((p) => p.id === pageId);
    const updatedPages = currentPages.filter((p) => p.id !== pageId);
    if (pageToDelete && activePageSlug === pageToDelete.slug) {
      setActivePageSlug(null);
    }
    const nextSettings: StoreSettings = {
      ...settings,
      customPages: updatedPages,
    };
    setSettings(nextSettings);
    void persistSettingsToSupabase(nextSettings);
  };

  const registerWithEmail = async (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    city: string;
    address: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();

    const serverRes = await registerCustomerOnServer(data);
    if (serverRes.ok && serverRes.user) {
      upsertLocalRegisteredUser(serverRes.user);
      setUser(serverRes.user);
      return {
        success: true,
        message:
          serverRes.message ||
          `Welcome to BAJOZ — The House of Naturals, ${serverRes.user.name}!`,
      };
    }

    if (registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        message:
          serverRes.message ||
          'An account with this email already exists. Please sign in.',
      };
    }
    const newUser: CustomerUser = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      city: data.city.trim() || 'Lahore',
      savedAddresses: data.address.trim() ? [data.address.trim()] : [],
      provider: 'email',
      passwordHash: data.password || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    upsertLocalRegisteredUser(newUser);
    setUser(newUser);
    await persistProfileToSupabase(newUser);
    return {
      success: true,
      message: `Welcome to BAJOZ — The House of Naturals, ${newUser.name}!`,
    };
  };

  const loginWithEmail = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    const serverRes = await loginCustomerOnServer(cleanEmail, password);
    if (serverRes.ok && serverRes.user) {
      setUser(serverRes.user);
      upsertLocalRegisteredUser(serverRes.user);
      return {
        success: true,
        message:
          serverRes.message ||
          `Welcome back to BAJOZ — The House of Naturals, ${serverRes.user.name}!`,
      };
    }
    if (!serverRes.networkFallback && serverRes.message) {
      return {
        success: false,
        message: serverRes.message,
      };
    }

    const remoteProfile = await fetchProfileByEmailFromSupabase(cleanEmail);
    if (remoteProfile) {
      if (
        remoteProfile.passwordHash &&
        password &&
        remoteProfile.passwordHash !== password
      ) {
        return {
          success: false,
          message: 'Incorrect password. Please verify your credentials.',
        };
      }
      setUser(remoteProfile);
      upsertLocalRegisteredUser(remoteProfile);
      return {
        success: true,
        message: `Welcome back to BAJOZ — The House of Naturals, ${remoteProfile.name}!`,
      };
    }

    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      if (
        existing.passwordHash &&
        password &&
        existing.passwordHash !== password
      ) {
        return {
          success: false,
          message: 'Incorrect password. Please verify your credentials.',
        };
      }
      setUser(existing);
      await persistProfileToSupabase(existing);
      return {
        success: true,
        message: `Welcome back to BAJOZ — The House of Naturals, ${existing.name}!`,
      };
    }
    const fallbackUser: CustomerUser = {
      id: `usr_${Date.now()}`,
      name:
        cleanEmail
          .split('@')[0]
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Valued Customer',
      email: cleanEmail,
      phone: '03001234567',
      city: 'Lahore',
      savedAddresses: ['Lahore, Pakistan'],
      provider: 'email',
      passwordHash: password || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    upsertLocalRegisteredUser(fallbackUser);
    setUser(fallbackUser);
    await persistProfileToSupabase(fallbackUser);
    return {
      success: true,
      message: `Signed in to BAJOZ — The House of Naturals as ${fallbackUser.name}.`,
    };
  };

  const loginWithGoogle = async (profile?: { email?: string; name?: string }) => {
    const email = profile?.email?.trim().toLowerCase() || 'ayesha.malik@gmail.com';
    const name = profile?.name?.trim() || 'Ayesha Malik';

    const remoteProfile = await fetchProfileByEmailFromSupabase(email);
    if (remoteProfile) {
      setUser(remoteProfile);
      upsertLocalRegisteredUser(remoteProfile);
      return;
    }

    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      setUser(existing);
      await persistProfileToSupabase(existing);
    } else {
      const created: CustomerUser = {
        id: `google_${Date.now()}`,
        name,
        email,
        phone: '03001234567',
        city: 'Lahore',
        savedAddresses: ['House 18, Block G, DHA Phase 5, Lahore'],
        provider: 'google',
        createdAt: new Date().toISOString().split('T')[0],
      };
      upsertLocalRegisteredUser(created);
      setUser(created);
      await persistProfileToSupabase(created);
    }
  };

  const loginWithOutlook = async (profile?: {
    email?: string;
    name?: string;
  }) => {
    const email =
      profile?.email?.trim().toLowerCase() || 'tariq.mehmood@outlook.com';
    const name = profile?.name?.trim() || 'Tariq Mehmood';

    const remoteProfile = await fetchProfileByEmailFromSupabase(email);
    if (remoteProfile) {
      setUser(remoteProfile);
      upsertLocalRegisteredUser(remoteProfile);
      return;
    }

    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      setUser(existing);
      await persistProfileToSupabase(existing);
    } else {
      const created: CustomerUser = {
        id: `outlook_${Date.now()}`,
        name,
        email,
        phone: '03219876543',
        city: 'Karachi',
        savedAddresses: ['Apartment 4B, Clifton Block 2, Karachi'],
        provider: 'outlook',
        createdAt: new Date().toISOString().split('T')[0],
      };
      upsertLocalRegisteredUser(created);
      setUser(created);
      await persistProfileToSupabase(created);
    }
  };

  const updateUserProfile = (updates: Partial<CustomerUser>) => {
    if (!user) return;
    const updated: CustomerUser = { ...user, ...updates };
    setUser(updated);
    upsertLocalRegisteredUser(updated);
    void persistProfileToSupabase(updated);
  };

  const logoutUser = async () => {
    await logoutCustomerOnServer();
    setUser(null);
  };

  const adminCreateUser = (
    newUser: Omit<CustomerUser, 'id' | 'createdAt'> & {
      id?: string;
      createdAt?: string;
    }
  ): CustomerUser => {
    const created: CustomerUser = {
      id: newUser.id || `usr_${Date.now()}`,
      name: newUser.name.trim() || 'Valued Customer',
      email: newUser.email.trim().toLowerCase(),
      phone: newUser.phone.trim() || '03001234567',
      city: newUser.city.trim() || 'Lahore',
      savedAddresses: Array.isArray(newUser.savedAddresses)
        ? newUser.savedAddresses.filter((a) => a.trim().length > 0)
        : [],
      provider: newUser.provider || 'email',
      passwordHash: newUser.passwordHash || '',
      createdAt: newUser.createdAt || new Date().toISOString().split('T')[0],
    };
    upsertLocalRegisteredUser(created);
    void persistProfileToSupabase(created);
    return created;
  };

  const adminUpdateUser = (id: string, updates: Partial<CustomerUser>) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const updated: CustomerUser = {
          ...u,
          ...updates,
          email: updates.email ? updates.email.trim().toLowerCase() : u.email,
        };
        void persistProfileToSupabase(updated);
        if (user && (user.id === id || user.email.toLowerCase() === u.email.toLowerCase())) {
          setUser(updated);
        }
        return updated;
      })
    );
  };

  const adminDeleteUser = (id: string) => {
    const target = registeredUsers.find((u) => u.id === id);
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== id));
    if (target) {
      void removeProfileFromSupabase(target.id);
      if (target.email) {
        void removeProfileFromSupabase(target.email);
      }
      if (user && (user.id === target.id || user.email.toLowerCase() === target.email.toLowerCase())) {
        setUser(null);
      }
    } else {
      void removeProfileFromSupabase(id);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        reviews,
        settings,
        siteCopy,
        customPages,
        activePageSlug,
        setActivePageSlug,
        activeProductId,
        setActiveProductId,
        user,
        isSupabaseReady: isSupabaseConfigured,
        currentView,
        setCurrentView,
        isCartOpen,
        setIsCartOpen,
        favorites,
        isFavoritesOpen,
        setIsFavoritesOpen,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        activeProductModal,
        setActiveProductModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderQuery,
        setTrackingOrderQuery,
        isAccountOpen,
        setIsAccountOpen,
        accountModalMode,
        openAccountModal,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isVoiceConciergeOpen,
        setIsVoiceConciergeOpen,
        activeCategoryFilter,
        setActiveCategoryFilter,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotals,
        cartCount,
        orderNotes,
        setOrderNotes,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        updateOrderShipping,
        scheduleOrder,
        updateOrderDetails,
        deleteOrder,
        createManualAdminOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductCustomImage,
        updateVariantStock,
        addCustomerReview,
        updateReview,
        toggleHelpfulReview,
        approveReview,
        deleteReview,
        updateStoreSettings,
        updateSiteCopy,
        upsertCustomPage,
        deleteCustomPage,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
        loginWithOutlook,
        updateUserProfile,
        logoutUser,
        registeredUsers,
        adminCreateUser,
        adminUpdateUser,
        adminDeleteUser,
        activeSelectionContext,
        setActiveSelectionContext,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within a ShopProvider');
  return ctx;
};
