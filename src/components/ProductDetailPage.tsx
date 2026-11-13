/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop, calculateVariantPrice } from '../context/ShopContext';
import { Product } from '../types/shop';
import { ProductImage } from './ProductImage';
import { WaveDivider } from './WaveDivider';
import { updateProductPageSeo } from '../lib/seo';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Minus,
  Package,
  Play,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  ThumbsUp,
  Truck,
  X,
  Zap,
} from 'lucide-react';

interface PdpStoryReel {
  id: string;
  handle: string;
  customerName: string;
  city: string;
  duration: string;
  title: string;
  transcript: string;
}

const PANJEERI_FAQS = [
  {
    question: 'What is Homemade Panjeeri?',
    answer:
      'Panjeeri is a traditional South Asian food, enjoyed in many Pakistani households. Recipes vary, but they commonly use ingredients such as flour, pure desi ghee, nuts, seeds, or other additions. Check the BAJOZ product label for the exact ingredients in our Homemade Panjeeri.',
  },
  {
    question: 'What ingredients are used in BAJOZ Homemade Panjeeri?',
    answer:
      'The exact ingredients are listed in the product information above. Please check the full list and allergen details before ordering.',
  },
  {
    question: 'Does BAJOZ Homemade Panjeeri taste like traditional family recipes?',
    answer:
      'Panjeeri recipes differ from family to family. Taste also depends on the ingredients and preparation. We recommend reviewing the product details and genuine customer feedback to help decide whether it sounds right for your home.',
  },
  {
    question: 'How can I enjoy Homemade Panjeeri?',
    answer:
      "Homemade Panjeeri is generally enjoyed in small servings with warm milk or evening tea according to personal preference and the product's serving guidance. Follow any specific directions provided on the BAJOZ packaging.",
  },
  {
    question: 'How should I store BAJOZ Homemade Panjeeri?',
    answer:
      'Keep the airtight jar sealed in a cool, dry cupboard away from moisture and always use a clean, dry spoon.',
  },
  {
    question: 'Who can enjoy BAJOZ Homemade Panjeeri?',
    answer:
      'Suitability depends on the listed ingredients, nut or dairy allergies, and personal dietary preferences. Please review the full ingredient and allergen information before purchasing.',
  },
  {
    question: 'What is your return or refund policy?',
    answer:
      'All sales are final. Because BAJOZ products are freshly prepared, consumable food and personal-care items, we do not provide returns, exchanges, or refunds once an order is placed or delivered.',
  },
  {
    question: 'What pack sizes and prices are available?',
    answer:
      'Available pack sizes and current prices are displayed near the top of this product page. Choose the jar size that suits your household and budget.',
  },
];

const SPICEMIX_FAQS = [
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
];

const TOOTHPOWDER_FAQS = [
  {
    question: 'What is BAJOZ Tooth Powder?',
    answer:
      'BAJOZ Tooth Powder (Tooth Guardian) is a tooth-cleaning powder offered as part of the BAJOZ natural-care collection. Please review the product description and packaging for its exact formulation and intended use.',
  },
  {
    question: 'What ingredients are in BAJOZ Tooth Powder?',
    answer:
      'The complete ingredient list appears on this page and the product packaging: Alum (Phitkari), Cloves (Laung), Natural Salts, and Tree Bark Powders. If you have allergies or sensitivities, review every ingredient before use.',
  },
  {
    question: 'How do I use BAJOZ Tooth Powder?',
    answer:
      'Follow the verified directions provided with the product: lightly moisten your toothbrush bristles with clean water, use a clean dry spoon or wooden scoop to place a small pinch of powder onto the bristles, brush gently, and rinse thoroughly with water.',
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
];

const SPICEMIX_INGREDIENTS: string[] = [
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

const PANJEERI_INGREDIENTS: string[] = [
  '100% Pure Desi Ghee',
  'Almonds (Badam)',
  'Cashews (Kaju)',
  'Pistachios (Pista)',
  'Four Maghaz (Melon & Pumpkin Seeds)',
  'Four Gondain (Gond Katira)',
  'Kamar Kas',
  'Phool Makhana (Fox Nuts)',
  'Suji / Alsi / Daal Moong Base',
  'Organic Desi Shakkar',
  'Green Cardamom (Ilaichi)',
];

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    activeProductId,
    setActiveProductId,
    setActivePageSlug,
    addToCart,
    setIsCheckoutOpen,
    reviews,
    toggleHelpfulReview,
    setIsReviewModalOpen,
    settings,
    siteCopy,
    toggleFavorite,
    isFavorite,
    setIsVoiceConciergeOpen,
    setActiveSelectionContext,
  } = useShop();

  const product =
    products.find((p) => p.id === activeProductId) ||
    products.find((p) => p.isPublished) ||
    products[0];

  const isPanjeeri = product?.id === 'panjeeri';
  const isSpiceMix = product?.id === 'spicemix';
  const isToothPowder = product?.id === 'toothpowder';

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedPackId, setSelectedPackId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeInfoTab, setActiveInfoTab] = useState<
    'ingredients' | 'uses' | 'benefits'
  >('ingredients');
  const [activeReviewSlideIdx, setActiveReviewSlideIdx] = useState<number>(0);
  const [isReviewSlidePaused, setIsReviewSlidePaused] = useState<boolean>(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [justAdded, setJustAdded] = useState(false);
  const [relatedAdded, setRelatedAdded] = useState<Record<string, boolean>>({});
  const [activeReel, setActiveReel] = useState<PdpStoryReel | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      const defaultVar = product.variants?.[0]?.id || '';
      const defaultPack = product.packSizes?.[0]?.id || '';
      setSelectedVariantId(defaultVar);
      setSelectedPackId(defaultPack);
      setQuantity(1);
      setActiveInfoTab('ingredients');
      setActiveReviewSlideIdx(0);
      setOpenFaqIdx(0);
    }
  }, [product?.id]);

  const variantsList =
    !isSpiceMix && Array.isArray(product?.variants) ? product.variants : [];
  const hasFlavourVariants = !isSpiceMix && variantsList.length > 1;
  const packSizesList =
    Array.isArray(product?.packSizes) && product.packSizes.length > 0
      ? product.packSizes
      : isToothPowder
      ? [
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
        ]
      : [
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
        ];
  const ingredientsList = Array.isArray(product?.ingredients)
    ? product.ingredients
    : [];

  const activeVariant =
    variantsList.find((v) => v.id === selectedVariantId) || variantsList[0];
  const activePack =
    packSizesList.find((p) => p.id === selectedPackId) || packSizesList[0];

  const unitPrice = product
    ? calculateVariantPrice(
        product.basePrice,
        activeVariant ? activeVariant.priceAdjustment : 0,
        activePack ? activePack.priceMultiplier : 1
      )
    : 0;
  const totalPrice = unitPrice * quantity;
  const isOutOfStock = activeVariant ? activeVariant.stock <= 0 : false;

  useEffect(() => {
    if (!product) return;
    setActiveSelectionContext({
      productId: product.id,
      productName: product.name,
      variantId: activeVariant?.id || 'default',
      variantName: activeVariant?.name || 'Classic',
      packSizeId: activePack?.id || 'default',
      packSizeLabel: activePack?.label || 'Standard Jar',
      unitWeight: activePack?.unitWeight || activePack?.label || 'Standard',
      quantity,
      unitPrice,
      totalPrice,
    });
    return () => {
      setActiveSelectionContext(null);
    };
  }, [
    product?.id,
    product?.name,
    activeVariant?.id,
    activeVariant?.name,
    activePack?.id,
    activePack?.label,
    activePack?.unitWeight,
    quantity,
    unitPrice,
    totalPrice,
    setActiveSelectionContext,
  ]);

  if (!product) return null;

  // Match verified customer reviews for this product
  const approvedReviews = (Array.isArray(reviews) ? reviews : []).filter(
    (r) => r.isApproved
  );
  const productReviews = approvedReviews.filter((r) => {
    const tag = (r.productTag || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    if (product.id === 'panjeeri') return tag.includes('panjeeri');
    if (product.id === 'spicemix')
      return tag.includes('spicemix') || tag.includes('paste');
    if (product.id === 'toothpowder') return tag.includes('tooth');
    return tag.includes(name);
  });
  const displayedReviews =
    productReviews.length >= 3
      ? productReviews
      : [...productReviews, ...approvedReviews.filter((r) => !productReviews.includes(r))].slice(
          0,
          3
        );

  const avgRating =
    displayedReviews.length > 0
      ? (
          displayedReviews.reduce((acc, r) => acc + r.rating, 0) /
          displayedReviews.length
        ).toFixed(1)
      : '5.0';

  // Dynamically update meta description, Open Graph tags, Twitter Cards & Schema.org Product JSON-LD
  useEffect(() => {
    if (!product) return;
    return updateProductPageSeo(product, {
      unitPrice,
      variantName: activeVariant?.name,
      packLabel: activePack?.unitWeight || activePack?.label,
      ratingValue: avgRating,
      reviewCount: productReviews.length || displayedReviews.length || 120,
      inStock: !isOutOfStock,
      siteName: settings.businessName || 'BAJOZ — The House of Naturals',
    });
  }, [
    product,
    unitPrice,
    activeVariant?.name,
    activePack?.unitWeight,
    activePack?.label,
    avgRating,
    productReviews.length,
    displayedReviews.length,
    isOutOfStock,
    settings.businessName,
  ]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      product,
      activeVariant?.id || 'default',
      activePack?.id || 'default',
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyItNow = () => {
    if (isOutOfStock) return;
    addToCart(
      product,
      activeVariant?.id || 'default',
      activePack?.id || 'default',
      quantity
    );
    setIsCheckoutOpen(true);
  };

  const scrollToTopBuyBox = () => {
    document.getElementById('pdp-buy-box')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cleanWhatsapp = (settings.whatsappNumber || '923154388166').replace(/\D/g, '');
  const whatsappQuestionUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Assalam-o-Alaikum BAJOZ — The House of Naturals! I have a question before ordering ${product.name}.`
  )}`;

  // Product-aware copy with exact BAJOZ Panjeeri, BAJOZ SpiceMix, and BAJOZ Tooth Powder copy
  const heroSmallHeading = isPanjeeri
    ? 'A Traditional Favourite, Close to Home'
    : isSpiceMix
    ? 'One Blend. So Many Family Favourites.'
    : isToothPowder
    ? 'Traditional Care. A Thoughtful Choice.'
    : 'A Traditional Personal-Care Essential';

  const heroHeadline = isPanjeeri
    ? 'Panjeeri That Brings You Back to the Goodness of Home'
    : isSpiceMix
    ? 'All the Flavour You Love. One Homemade SpiceMix.'
    : isToothPowder
    ? 'A Familiar Approach to Everyday Oral Care'
    : 'Traditional Natural Care Made for Modern Routines';

  const heroParagraphs = isPanjeeri
    ? [
        'Slow-roasted in 100% pure grass-fed Desi Ghee with Californian almonds, cashews, pistachios, and organic Gond Katira. Zero white sugar, zero preservatives—just two warm spoonfuls for steady daily strength and comfort.',
      ]
    : isSpiceMix
    ? [
        'Cut 45 minutes of peeling and grinding down to 30 seconds. Slow-simmered mountain garlic, stone-ground ginger, and whole roasted spices—made with zero preservatives and no onion for effortless Karahi, Biryani, and Daal.',
      ]
    : isToothPowder
    ? [
        'Homemade tooth cleaning and care powder packed with natural, premium minerals — Alum, Cloves, Salts, and Tree Bark Powders — so you and your family keep your teeth and gums clean and fresh with our ancestral oral care routine.',
      ]
    : [
        'Handcrafted in small batches with 100% pure, kitchen-honest ingredients for your family’s daily routine.',
        product.description,
      ];

  const heroBullets = isPanjeeri
    ? [
        'Slow-roasted in 100% pure grass-fed Desi Ghee with premium nuts',
        'Sweetened naturally with organic desi shakkar — zero refined sugar',
        'Ready to enjoy with warm milk or evening chai straight from the jar',
      ]
    : isSpiceMix
    ? [
        '2 tablespoons replace 45 minutes of peeling garlic & grinding spices',
        'Made with subcontinental spices, ginger & garlic — no onion added',
        '100% homemade with zero chemical preservatives or artificial colors',
        'One jar cooks 8 full family meals from Karahi to Biryani & Daal',
      ]
    : isToothPowder
    ? [
        '100% natural homemade tooth cleaning powder for everyday oral care',
        'Made with Alum (Phitkari), Cloves (Laung), Natural Salts & Tree Bark Powders',
        'No synthetic chemicals, artificial colors, or preservatives',
      ]
    : [
        '100% homemade in small batches with zero chemical preservatives',
        "Every single ingredient clearly listed so you know what you're choosing",
        'Fast nationwide Cash on Delivery across Pakistan',
      ];

  const trustStripItems = isSpiceMix
    ? [
        {
          title: 'Homemade Goodness',
          desc: 'Made with care for your kitchen.',
        },
        {
          title: 'No Added Preservatives',
          desc: 'A blend made without preservatives.',
        },
        {
          title: 'No Onion Added',
          desc: 'Just the ingredients listed for this blend.',
        },
        {
          title: 'Made for Everyday Cooking',
          desc: 'One versatile mix for a variety of dishes.',
        },
      ]
    : isToothPowder
    ? [
        {
          title: 'Ingredient Transparency',
          desc: "Know what's in the product before you buy.",
        },
        {
          title: 'Clear Directions',
          desc: 'Understand how the product is intended to be used.',
        },
        {
          title: 'Traditional Inspiration',
          desc: 'A familiar format for those exploring traditional oral care.',
        },
        {
          title: 'Real Customer Experiences',
          desc: 'Read genuine feedback from BAJOZ customers.',
        },
      ]
    : [
        {
          title: 'A Taste of Tradition',
          desc: 'Inspired by a familiar favourite.',
        },
        {
          title: "Know What You're Buying",
          desc: 'Explore the ingredients and product details.',
        },
        {
          title: 'Made for Modern Homes',
          desc: 'A traditional food, conveniently available online.',
        },
        {
          title: 'Real Customer Experiences',
          desc: 'Hear what BAJOZ customers have to say.',
        },
      ];

  const transformationSteps = isPanjeeri
    ? [
        {
          step: 'Step 1',
          title: 'Choose Your Pack',
          desc: 'Explore the available size and product details to find the option that suits your home.',
        },
        {
          step: 'Step 2',
          title: 'Make It Part of Your Routine',
          desc: 'Enjoy panjeeri according to your preferences and the serving guidance provided.',
        },
        {
          step: 'Step 3',
          title: 'Savour a Little Familiar Goodness',
          desc: 'Share it with family or keep it on hand for the moments when you feel like something traditional.',
        },
      ]
    : isSpiceMix
    ? [
        {
          step: 'Step 1',
          title: 'Choose What you Want to Cook',
          desc: 'Pick the meal you’re in the mood for, fry onions and tomatoes.',
        },
        {
          step: 'Step 2',
          title: 'Add SpiceMix and What You’re Cooking',
          desc: 'Then add your meat/vegetable/lentil or just anything you’re cooking, add 1-2 tablespoon of SpiceMix- and you’re done. No need to do or add anything except water (if it requires).',
        },
        {
          step: 'Step 3',
          title: 'Bring Everyone to The Table',
          desc: 'Enjoy your tasty, aromatic desi food you made in half its prep time with your family.',
        },
      ]
    : isToothPowder
    ? [
        {
          step: 'Step 1',
          title: 'Explore the Ingredients',
          desc: 'Read the full ingredient list and check for anything you may be sensitive to.',
        },
        {
          step: 'Step 2',
          title: 'Understand How to Use It',
          desc: 'Follow the directions and precautions provided for BAJOZ Tooth Powder. If you have a dental concern, seek advice from a qualified dental professional.',
        },
        {
          step: 'Step 3',
          title: 'Make an Informed Choice',
          desc: 'Choose products based on their ingredients, intended use, and your individual oral-care needs.',
        },
      ]
    : [
        {
          step: 'Step 1',
          title: 'Choose Your Pack',
          desc: 'Explore the available jar size and product details to find the option that suits your household.',
        },
        {
          step: 'Step 2',
          title: 'Make It Part of Your Routine',
          desc: `Use ${product.name} according to your household preferences and the directions provided.`,
        },
        {
          step: 'Step 3',
          title: 'Savour Everyday Goodness',
          desc: 'Keep a familiar traditional essential close at hand for your daily routine.',
        },
      ];

  const benefitsItems = isPanjeeri
    ? [
        {
          title: '100% Pure Ingredients Without Hidden Fillers',
          bullets: [
            'Every whole nut, seed, and spice is clearly listed.',
            'Slow-roasted in 100% pure grass-fed Desi Ghee daily.',
            'Zero palm oil, synthetic preservatives, or artificial food colors.',
            'Sweetened gently with unrefined shakkar instead of white sugar.',
            'Handcrafted in small batches in Model Town, Lahore.',
          ],
        },
        {
          title: 'Effortless Postpartum Recovery Support for Moms',
          bullets: [
            'Ready-to-eat traditional Panjeeri lets exhausted new mothers rest.',
            'Rich in warming Gond Katira, Phool Makhana, and almonds.',
            'Rebuilds daily strength with pure grass-fed Desi Ghee nourishment.',
            'Enjoy two comforting spoonfuls with warm milk every morning.',
            'Zero hours spent standing over a hot kitchen stove.',
          ],
        },
        {
          title: 'Warming Daily Comfort for Tired Joints',
          bullets: [
            'Traditional Gond Katira and Phool Makhana comfort winter stiffness.',
            'Roasted golden Alsi flaxseeds provide natural plant omega nourishment.',
            'Daal Moong protein variant supports active muscles and recovery.',
            'Kamar Kas and char magaz seeds nourish physical vitality.',
            'Warm, grounding nutrition crafted for physically demanding workdays.',
          ],
        },
        {
          title: 'Authentic Homemade Tradition Without Weekend Exhaustion',
          bullets: [
            'No more spending weekends cleaning and roasting fifteen ingredients.',
            'Slow-cooked over gentle heat for authentic Dadi-style homemade aroma.',
            'Choose Suji Classic, Alsi Flaxseed, or Daal Moong Protein.',
            'Freshly packed in airtight jars for three-month pantry freshness.',
            'Savour beloved family food traditions straight from the spoon.',
          ],
        },
        {
          title: 'Wholesome Daily Energy for Every Generation',
          bullets: [
            'Replaces sugary processed snacks with crunchy almonds and pistachios.',
            'Fuels growing kids with natural protein and healthy fats.',
            'Supports university and hostel students during late-night study sessions.',
            'Gentle, easy-to-digest nourishment for grandparents and active adults.',
            'Delivers steady morning energy without mid-day refined sugar crashes.',
          ],
        },
        {
          title: 'Concentrated Nut-Rich Jars Built to Last',
          bullets: [
            'Every 250 gm, 450 gm, or 950 gm Panjeeri jar brims with whole roasted nuts.',
            'Zero cheap flour fillers mean every spoonful packs nutrition.',
            'Enjoy with evening chai, warm milk, or morning oats.',
            'Available in 250 gm, 450 gm, and 950 gm fresh-sealed jars.',
            'Free nationwide delivery on qualifying orders across Pakistan.',
          ],
        },
      ]
    : isSpiceMix
    ? [
        {
          title: 'One Paste, All Pakistani Dishes',
          bullets: [
            'One jar of SpiceMix makes all types of sub-continental dishes including qourma, karahi, lentils, vegetables, biryani, nihari, paya, drumsticks, fried fish, roast, and anything on the menu — with their unique taste and aroma!',
          ],
        },
        {
          title: 'The Right Proportion You Need',
          bullets: [
            'SpiceMix has the right amount of every ingredient that is needed to make any sub-continental dish with its unique taste and aroma. The amount of ginger, garlic, salt, basic spices and garam masala is tried and tested for several years at home, extended family and 500+ & growing happy customers of BAJOZ’ SpiceMix.',
          ],
        },
        {
          title: 'No More Peeling, & Grinding',
          bullets: [
            'No need to peel and grind garlic and ginger everyday to cook basic meals at home. Just start by frying your onions, tomatoes — add your meat/vegetable/daal/anything you’re cooking and then add 1-2 tablespoons of SpiceMix and your flavor parts done. Then cook the way you cook every day.',
          ],
        },
        {
          title: 'Ginger, Garlic, & Spices Brought Together',
          bullets: [
            'SpiceMix jar contains the right balance of Garlic, Ginger, Red Chilli, Salt, Turmeric, Cumin Seeds, Coriander Seeds, Green Cardamom, Black Cardamom, Cinnamon, Cloves, Bay Leaves, Mace, Star Anise, Black Pepper, Fennel Seeds, Carom Seeds.',
          ],
        },
        {
          title: 'Shortcut to Make Tasty, Aromatic Food Everyday',
          bullets: [
            'Make your routine meals with their unique taste and aroma with your one-stop solution to multitasking while cooking.',
          ],
        },
        {
          title: 'Tasty, Aromatic Food, Prep. Time Cut in Half',
          bullets: [
            'Whether you want to make qourma, paya, nihari, biryani, lentils, qeema, karahi — prepare it in half the time of its standard cooking time.',
          ],
        },
        {
          title: 'Desi Taste, Modern Lifestyle',
          bullets: [
            'Enjoy fresh, yummy and desi taste of all Pakistani dishes with your family and gel-in to routines, requirements of modern lifestyle.',
          ],
        },
        {
          title: 'One Paste, Many Dishes, Less Prep.',
          bullets: [
            'One SpiceMix jar contains the tried and tested balance of every spice, garlic, ginger, and salt for two decades to make different Pakistani dishes with their unique taste and aroma.',
          ],
        },
        {
          title: 'Two Decades, Lots of Happy Meals',
          bullets: [
            'I grew up in a family where grandmother and mother both used SpiceMix to make everyday meals and also prepare dainty food for guests in a few minutes — its formula is tried and tested for past two decades in our home, extended family, neighborhood, and thousands of happy customers across Pakistan.',
          ],
        },
        {
          title: 'Less Kitchen Mess, More Cooking',
          bullets: [
            'No need to peel or grind ginger and garlic, pull out 11 bottles/jars of different spices or buying different masala mixes for every dish — just add 1-2 tbsp. of SpiceMix and make anything you want!',
          ],
        },
      ]
    : isToothPowder
    ? [
        {
          title: 'Natural Homemade Tooth Cleaning Powder',
          bullets: [
            '100% homemade tooth cleaning powder crafted for everyday oral care.',
            'No synthetic chemicals, artificial colors, or preservatives.',
            'Prepared in small batches following our khandani recipe and proportion.',
            'Gentle enough for mindful morning and evening brushing routines.',
            'Made-to-order and delivered fresh across Pakistan.',
          ],
        },
        {
          title: 'Time-Tested Ancestral Oral Care Ingredients',
          bullets: [
            'Blended with Natural Alum (Phitkari) and Aromatic Cloves (Laung).',
            'Enriched with traditional Tree Bark Powders and Natural Salts.',
            'Supports everyday teeth cleaning and overall mouth freshness.',
            'Helps comfort gum swelling and bleeding as a traditional ancestral routine.',
            'Ideal for daily tea and coffee drinkers across Pakistan.',
          ],
        },
        {
          title: 'Overall Mouth Cleanliness & Lasting Freshness',
          bullets: [
            'Aromatic cloves and tree bark powders support traditional gum care.',
            'Natural salts help keep teeth and gums clean after meals.',
            'Leaves your mouth feeling naturally clean and refreshed.',
            'Simple, familiar format inspired by generations of household oral care.',
            'Suitable for everyday family oral care routines.',
          ],
        },
        {
          title: '100% Transparent Formula You Can Trust',
          bullets: [
            'Every ingredient—Alum, Cloves, Salts, and Tree Bark Powders—is disclosed upfront.',
            'Zero synthetic chemicals, artificial colors, or hidden preservatives.',
            'Rooted in time-tested subcontinental ancestral oral care traditions.',
            'Note: This is a remedial product used by our ancestors and not a medicated product.',
            'Elevates your daily routine with honest homemade oral care.',
          ],
        },
        {
          title: 'Effortless Two-Minute Daily Brushing Ritual',
          bullets: [
            'Use a clean, dry spoon or scoop for hygienic pinch application.',
            'Apply a small pinch onto damp soft toothbrush bristles.',
            'Brush gently in circular motions across teeth and gums.',
            'Rinses clean effortlessly with water.',
            'Travel-friendly dry powder jar never leaks inside your luggage.',
          ],
        },
        {
          title: 'Concentrated 40 gm & 80 gm Jars Built to Last',
          bullets: [
            'Zero water fillers mean weeks of daily morning and evening brushing.',
            'Fresh-sealed 40 gm and 80 gm airtight jars protect the powder from moisture.',
            '6-month shelf life when stored sealed in a cool, dry place.',
            'Compact 40 gm and 80 gm jars are easy to store and travel with.',
            'Free nationwide delivery on qualifying orders across Pakistan.',
          ],
        },
      ]
    : [
        {
          title: '100% Pure Ingredients Without Hidden Fillers',
          bullets: [
            'Every whole ingredient is clearly listed on each jar.',
            'Handcrafted in small batches with zero chemical preservatives.',
            'Inspired by time-tested Pakistani household nourishment traditions.',
            'Fresh-sealed in an airtight jar for everyday convenience.',
            'Delivered nationwide across Pakistan with Cash on Delivery.',
          ],
        },
        {
          title: 'Authentic Homemade Goodness Without Kitchen Exhaustion',
          bullets: [
            'Skip hours of sourcing, cleaning, and roasting from scratch.',
            'Ready to use straight from the jar every day.',
            'Prepared with care in our Model Town Lahore kitchen.',
            'Consistent small-batch quality your whole household can trust.',
            'Fits effortlessly into busy morning and evening routines.',
          ],
        },
        {
          title: 'Wholesome Daily Care for Every Generation',
          bullets: [
            'Crafted for busy moms, professionals, elders, and students.',
            'Replaces ultra-processed alternatives with honest natural ingredients.',
            'Clear usage directions and storage guidance on every page.',
            'Generous concentrated servings deliver real household value.',
            'Backed by responsive 24/7 WhatsApp customer support.',
          ],
        },
        {
          title: 'Transparent Quality You Can Verify Instantly',
          bullets: [
            'Check complete ingredient and allergen details before ordering.',
            'Choose the pack size that fits your family best.',
            'Free nationwide delivery on orders above PKR 2,500.',
            'Pay conveniently via Cash on Delivery or bank transfer.',
            'Cushioned protective packaging ensures safe doorstep arrival.',
          ],
        },
      ];


  const whatsIncludedRows = isSpiceMix
    ? [
        {
          label: 'Product',
          value: 'BAJOZ SpiceMix',
        },
        {
          label: 'Ingredients',
          value: `Subcontinental spices, ginger, and garlic. (${ingredientsList.join(', ')})`,
        },
        {
          label: 'Preservatives',
          value: 'Made without preservatives.',
        },
        {
          label: 'Onion',
          value: 'No onion added.',
        },
        {
          label: 'Net weight / Size',
          value: 'N/A',
        },
        {
          label: 'Price',
          value: 'N/A',
        },
        {
          label: 'Storage',
          value:
            'Keep the jar properly sealed in a cool, dry cupboard while sealed; refrigerate after opening and always use a clean, dry spoon.',
        },
        {
          label: 'Shelf life',
          value: '6 months sealed · 90 days refrigerated after opening',
        },
        {
          label: 'How to use',
          value:
            'Add according to your recipe and the directions on the product packaging. Adjust the quantity to suit your taste.',
        },
        {
          label: 'Allergen information',
          value:
            'Prepared in a kitchen that handles mustard oil, spices, nuts, and seeds. Please check the complete ingredient list before ordering.',
        },
        {
          label: 'Returns & refunds policy',
          value:
            siteCopy.returnsPolicyText ||
            'No returns or refunds — all sales are final. Please review ingredients and pack size carefully before ordering.',
        },
      ]
    : isToothPowder
    ? [
        {
          label: 'Product',
          value: `BAJOZ Tooth Powder (${product.name})`,
        },
        {
          label: 'Net weight / Size',
          value: 'N/A',
        },
        {
          label: 'Ingredients',
          value: ingredientsList.join(', '),
        },
        {
          label: 'Directions',
          value:
            Array.isArray(product.usageInstructions) && product.usageInstructions.length > 0
              ? product.usageInstructions.join(' ')
              : 'Lightly moisten toothbrush bristles with water, use the dry wooden scoop to apply a small pinch of powder, brush gently, and rinse thoroughly.',
        },
        {
          label: 'Precautions',
          value:
            'For external oral cleaning only; do not swallow. If you have sensitive teeth, gum problems, or existing dental conditions, consult your dentist before use.',
        },
        {
          label: 'Packaging',
          value: 'Size: N/A · Fresh-sealed jar with wooden scoop',
        },
        {
          label: 'Storage',
          value:
            'Keep the jar tightly sealed in a cool, dry place away from bathroom humidity and moisture. Always use a dry scoop.',
        },
        {
          label: 'Shelf life',
          value: 'Up to 12 months when stored sealed in a cool, dry place',
        },
        {
          label: 'Returns & refunds policy',
          value:
            siteCopy.returnsPolicyText ||
            'No returns or refunds — all sales are final. Please review the full ingredients and precautions before ordering.',
        },
        {
          label: 'Price',
          value: 'N/A',
        },
      ]
    : [
        {
          label: 'Product',
          value: product.name,
        },
        {
          label: 'Net weight / Size',
          value: 'N/A',
        },
        {
          label: 'Ingredients',
          value: ingredientsList.join(', '),
        },
        {
          label: 'Allergen information',
          value: isPanjeeri
            ? 'Contains tree nuts (almonds, cashews, pistachios), dairy (pure Desi Ghee), and wheat/semolina (in Suji variant). Prepared in a kitchen that handles nuts and seeds.'
            : 'Botanical and mineral oral-care formula. Please check the listed ingredients before use if you have specific sensitivities.',
        },
        {
          label: 'Storage instructions',
          value:
            'Keep sealed in the airtight jar in a cool, dry cupboard away from moisture and direct sunlight. Always use a clean, dry spoon.',
        },
        {
          label: 'Shelf life',
          value: 'Up to 6 months in a cool, dry cupboard',
        },
        {
          label: 'Packaging',
          value: 'Size: N/A · Airtight fresh-sealed jar',
        },
        {
          label: 'Returns & refunds policy',
          value:
            siteCopy.returnsPolicyText ||
            'No returns or refunds — all sales are final. Please review ingredients and pack size carefully before ordering.',
        },
        {
          label: 'Price',
          value: 'N/A',
        },
      ];

  const comparisonRows = [
    {
      criteria: 'Preparation',
      home: 'You source ingredients and prepare it yourself',
      bajoz:
        "Preparation is handled before the product reaches you, according to BAJOZ's actual process",
    },
    {
      criteria: 'Time',
      home: 'Requires planning and preparation',
      bajoz: 'Convenient to order online',
    },
    {
      criteria: 'Ingredients',
      home: 'You choose and control each ingredient',
      bajoz: 'Review the listed ingredients before buying',
    },
    {
      criteria: 'Quantity',
      home: 'You decide how much to make',
      bajoz: 'Choose from the available pack sizes',
    },
    {
      criteria: 'Personal preference',
      home: 'Adjust your recipe as you like',
      bajoz: 'Check the product details to see if it suits your taste and needs',
    },
  ];

  const spiceMixComparisonRows = [
    {
      criteria: 'Preparation',
      individual: 'Measure each spice for your recipe',
      multipleMixes: 'Choose the right mix for each dish',
      bajoz: 'One versatile blend for many dishes',
    },
    {
      criteria: 'Pantry organisation',
      individual: 'Several individual jars',
      multipleMixes: 'Multiple packs for different recipes',
      bajoz: 'One blend to keep within reach',
    },
    {
      criteria: 'Ingredients',
      individual: 'You choose each ingredient separately',
      multipleMixes: "Depends on each product's label",
      bajoz: 'Subcontinental spices, ginger, and garlic',
    },
    {
      criteria: 'Preservatives',
      individual: 'Depends on the ingredients used',
      multipleMixes: 'Depends on the individual product',
      bajoz: 'Made without preservatives',
    },
    {
      criteria: 'Onion',
      individual: 'Add separately if your recipe needs it',
      multipleMixes: 'Check the product label',
      bajoz: 'No onion added',
    },
    {
      criteria: 'Flexibility',
      individual: 'Full control over your own spice balance',
      multipleMixes: 'Often designed for particular dishes',
      bajoz: 'Adjust the amount to suit your recipe',
    },
  ];

  const toothPowderComparisonRows = [
    {
      criteria: 'Product format',
      conventional: 'Paste or gel',
      toothPowder: 'Powder',
    },
    {
      criteria: 'Ingredients',
      conventional: 'Vary by formulation',
      toothPowder: 'Vary by formulation',
    },
    {
      criteria: 'Fluoride',
      conventional: 'Check the product label',
      toothPowder: 'Check whether fluoride is present',
    },
    {
      criteria: 'Directions',
      conventional: 'Follow the product label',
      toothPowder: 'Follow the product label',
    },
    {
      criteria: 'Abrasiveness',
      conventional: 'Depends on the formulation',
      toothPowder: 'Depends on the formulation',
    },
    {
      criteria: 'Suitability',
      conventional: 'Depends on your needs and the product',
      toothPowder: 'Depends on your needs and the product',
    },
    {
      criteria: 'Dental-health evidence',
      conventional: 'Depends on ingredients and supporting evidence',
      toothPowder: 'Depends on ingredients and supporting evidence',
    },
  ];

  const faqsList = isPanjeeri
    ? PANJEERI_FAQS
    : isSpiceMix
    ? SPICEMIX_FAQS
    : isToothPowder
    ? TOOTHPOWDER_FAQS
    : Array.isArray(product.faqs) && product.faqs.length > 0
    ? product.faqs
    : PANJEERI_FAQS;

  const storyReels: PdpStoryReel[] = isSpiceMix
    ? [
        {
          id: 'sm-reel-1',
          handle: 'Verified Customer Note · Lahore',
          customerName: 'Zeeshan Haider',
          city: 'Gulberg III, Lahore',
          duration: '0:36',
          title: 'Rich aroma of roasted spices, ginger & garlic',
          transcript:
            '“Opening the BAJOZ SpiceMix jar fills the kitchen with the aroma of freshly ground subcontinental spices, ginger, and garlic. Knowing there are no preservatives and no onion makes it so easy to trust for our family table.”',
        },
        {
          id: 'sm-reel-2',
          handle: 'Verified Customer Note · Islamabad',
          customerName: 'Hina & Salman',
          city: 'F-8, Islamabad',
          duration: '0:42',
          title: 'Weeknight cooking without measuring ten jars',
          transcript:
            '“After a long workday, I used to dread pulling out a dozen different spice jars. Now we keep BAJOZ SpiceMix right by the stove and adjust the spoonfuls to our taste.”',
        },
        {
          id: 'sm-reel-3',
          handle: 'Verified Customer Note · Karachi',
          customerName: 'Sadia Rehman',
          city: 'DHA, Karachi',
          duration: '0:31',
          title: 'From weekday daal to Sunday chicken karahi',
          transcript:
            '“We have used the same jar for weeknight daal, Friday chicken karahi, and weekend biryani. Because there is no onion in the paste, I can add fresh onion only when my recipe needs it.”',
        },
        {
          id: 'sm-reel-4',
          handle: 'Verified Customer Note · Rawalpindi',
          customerName: 'Amna Tariq',
          city: 'Bahria Town',
          duration: '0:29',
          title: 'Homemade feel in a clean fresh-sealed jar',
          transcript:
            '“Everything is clearly listed on the page and the jar arrived securely packed. It feels like a homemade blend prepared with care.”',
        },
      ]
    : isToothPowder
    ? [
        {
          id: 'tp-reel-1',
          handle: 'Verified Customer Note · Karachi',
          customerName: 'Bilal Chaudhry',
          city: 'Clifton, Karachi',
          duration: '0:33',
          title: 'Clear ingredients and thoughtful jar packaging',
          transcript:
            '“Before trying a tooth powder, I wanted to read every single ingredient and understand how to use it. BAJOZ lists everything clearly, and the fresh-sealed jar with the wooden scoop is very convenient to keep dry.”',
        },
        {
          id: 'tp-reel-2',
          handle: 'Verified Customer Note · Lahore',
          customerName: 'Nadia & Usman',
          city: 'Model Town, Lahore',
          duration: '0:38',
          title: 'Refreshing peppermint and spearmint botanical feel',
          transcript:
            '“We appreciated that BAJOZ focuses on transparent ingredient information and practical instructions rather than exaggerated claims. The wooden scoop makes it easy to use just a small pinch.”',
        },
        {
          id: 'tp-reel-3',
          handle: 'Verified Customer Note · Islamabad',
          customerName: 'Dr. Kamran Siddiqui',
          city: 'F-10, Islamabad',
          duration: '0:29',
          title: 'A traditional format with clear directions',
          transcript:
            '“Having the full ingredient list, precautions, and usage steps right on the page made it easy to evaluate whether it suited our personal-care routine.”',
        },
        {
          id: 'tp-reel-4',
          handle: 'Verified Customer Note · Lahore',
          customerName: 'Mariam Sohail',
          city: 'DHA Phase 5, Lahore',
          duration: '0:31',
          title: 'Carefully packed and easy to store',
          transcript:
            '“The fresh-sealed jar arrived well cushioned with clear storage instructions. Using the dry wooden scoop keeps moisture out of the powder.”',
        },
      ]
    : [
        {
          id: 'reel-1',
          handle: 'Verified Customer Note · Lahore',
          customerName: 'Ayesha Malik',
          city: 'DHA, Lahore',
          duration: '0:34',
          title: 'A comforting taste of home for our family table',
          transcript:
            '“Ordering BAJOZ Panjeeri was so simple. Having the full ingredient list clearly displayed gave us confidence, and the airtight jar packaging keeps everything fresh on our dining table.”',
        },
        {
          id: 'reel-2',
          handle: 'Verified Customer Note · Islamabad',
          customerName: 'Zainab Qureshi',
          city: 'F-7, Islamabad',
          duration: '0:41',
          title: 'Convenient to keep at home for busy mornings',
          transcript:
            '“Between work and family routines, I rarely have time to roast panjeeri from scratch. Having BAJOZ delivered to our door brings that familiar homemade feeling without the hours of kitchen prep.”',
        },
        {
          id: 'reel-3',
          handle: 'Verified Customer Note · Karachi',
          customerName: 'Fatima & Hassan',
          city: 'Clifton, Karachi',
          duration: '0:29',
          title: 'Thoughtfully packed and clearly labelled',
          transcript:
            '“We loved being able to check the exact pack weight and ingredients before ordering. The jar arrived safely cushioned and has become a favourite in our household.”',
        },
        {
          id: 'reel-4',
          handle: 'Verified Customer Note · Rawalpindi',
          customerName: 'Maham Farooq',
          city: 'Bahria Town',
          duration: '0:37',
          title: 'Something traditional to share with the family',
          transcript:
            '“Every evening with tea or warm milk, our family reaches for the BAJOZ jar. It feels just like the traditional favourites we grew up with.”',
        },
      ];

  const publishedProducts = products.filter((p) => p.isPublished);

  const handleQuickAddRelated = (relProduct: Product, key: string) => {
    const defaultVar =
      relProduct.id !== 'spicemix' && relProduct.variants?.[0]?.id
        ? relProduct.variants[0].id
        : 'default';
    const defaultPack = relProduct.packSizes?.[0]?.id || 'default';
    addToCart(relProduct, defaultVar, defaultPack, 1);
    setRelatedAdded((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setRelatedAdded((prev) => ({ ...prev, [key]: false }));
    }, 1400);
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  // Use the real customer reviews for the hero autoplay review slideshow
  const heroSlideshowReviews = displayedReviews.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    city: r.city,
    rating: r.rating || 5,
    title: r.title,
    comment: r.comment,
  }));

  useEffect(() => {
    if (heroSlideshowReviews.length <= 1 || isReviewSlidePaused) return;
    const timer = window.setInterval(() => {
      setActiveReviewSlideIdx((prev) => (prev + 1) % heroSlideshowReviews.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [heroSlideshowReviews.length, isReviewSlidePaused, product?.id]);

  const currentHeroReview =
    heroSlideshowReviews[activeReviewSlideIdx % Math.max(1, heroSlideshowReviews.length)] ||
    heroSlideshowReviews[0];

  return (
    <div className="bg-[#F5EBC8] bajoz-grain-canvas min-h-screen text-[#5A4E38]">
      {/* =====================================================================
          1. TOP BREADCRUMB & QUICK TRUST BAR
          ===================================================================== */}
      <div className="pt-4 pb-2">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 flex flex-wrap items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-[#40563D] font-medium"
          >
            <button
              type="button"
              onClick={() => setActiveProductId(null)}
              className="hover:underline cursor-pointer font-semibold text-[#5A4E38]"
            >
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => {
                setActiveProductId(null);
                setActivePageSlug('shop');
              }}
              className="hover:underline cursor-pointer"
            >
              Shop All
            </button>
            <span>/</span>
            <span className="text-[#786C57]">{product.category}</span>
            <span>/</span>
            <span className="text-[#5A4E38] font-semibold">
              {isPanjeeri ? 'Homemade Panjeeri' : product.name}
            </span>
          </nav>

          <button
            type="button"
            onClick={() => {
              setActiveProductId(null);
              setActivePageSlug('shop');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A4E38] hover:text-[#40563D] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. HERO SECTION (2-Column: Left Media + 4 Thumbnails | Right Value Prop & Buy Box)
          ===================================================================== */}
      <section
        id="pdp-buy-box"
        className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 pt-4 lg:pt-8 pb-10 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT COLUMN: Single Straight Rounded Product Stage + Autoplay Review */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            <div className="relative flex flex-col items-center justify-center bajoz-fade-in py-1 sm:py-2 px-1 sm:px-4 group">
              {/* Single Straight Softly-Rounded Product Photo Card — 100% Unobstructed */}
              <div className="relative w-full max-w-[300px] xs:max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] aspect-square flex items-center justify-center">
                <div className="relative w-full h-full rounded-[1.75rem] sm:rounded-[2rem] bg-[#B4CBA2] overflow-hidden border-[1.5px] border-[#7A5C38]">
                  <ProductImage
                    type={product.imageType}
                    productId={product.id}
                    customImageUrl={product.customImageUrl}
                    fit="cover"
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    alt={product.name}
                  />

                  {/* Favorite Heart Button Inside Top-Right Corner of Product Stage */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    aria-label={
                      isFavorite(product.id)
                        ? `Remove ${product.name} from Favorites`
                        : `Save ${product.name} to Favorites`
                    }
                    aria-pressed={isFavorite(product.id)}
                    title={
                      isFavorite(product.id)
                        ? 'Saved in Favorites — click to remove'
                        : 'Save to Favorites'
                    }
                    className={`absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer border-[1.5px] border-[#7A5C38] ${
                      isFavorite(product.id)
                        ? 'bg-[#E9F399] text-[#9B6A73]'
                        : 'bg-[#F9F5E9]/95 hover:bg-[#E9F399] text-[#40563D]'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(product.id) ? 'fill-[#9B6A73] text-[#9B6A73]' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Autoplay Customer Review Slideshow Right Under the Product Image on the Left Side */}
            {currentHeroReview && (
              <div
                onMouseEnter={() => setIsReviewSlidePaused(true)}
                onMouseLeave={() => setIsReviewSlidePaused(false)}
                className="bg-[#F9F5E9] hover:bg-[#F1EBD9] transition-colors rounded-[1.5rem] p-5 sm:p-6 border-[1.5px] border-[#7A5C38] space-y-3"
              >
                <div
                  key={currentHeroReview.id}
                  className="flex items-start gap-3.5 bajoz-fade-in min-h-[76px]"
                >
                  <div className="w-11 h-11 rounded-full bg-[#40563D] text-[#F9F5E9] font-serif text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#7A5C38]">
                    {getInitials(currentHeroReview.customerName)}
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-[#C98A6A]">
                          {Array.from({ length: currentHeroReview.rating || 5 }).map(
                            (_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            )
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#5A4E38]">
                          {currentHeroReview.customerName} · {currentHeroReview.city}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById('pdp-social-proof')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="text-[11px] font-bold text-[#40563D] hover:underline cursor-pointer"
                      >
                        {avgRating} ({heroSlideshowReviews.length} Reviews)
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5A4E38] leading-relaxed line-clamp-3">
                      “{currentHeroReview.comment}”
                    </p>
                  </div>
                </div>

                {/* Slideshow Controls: Dots + Prev/Next Buttons */}
                {heroSlideshowReviews.length > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#7A5C38]/25">
                    <div className="flex items-center gap-1.5">
                      {heroSlideshowReviews.map((slide, sIdx) => {
                        const isActive =
                          sIdx ===
                          activeReviewSlideIdx % heroSlideshowReviews.length;
                        return (
                          <button
                            key={slide.id}
                            type="button"
                            onClick={() => setActiveReviewSlideIdx(sIdx)}
                            aria-label={`Show review ${sIdx + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              isActive
                                ? 'w-6 bg-[#40563D]'
                                : 'w-2 bg-[#7A5C38]/35 hover:bg-[#7A5C38]/70'
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReviewSlideIdx(
                            (prev) =>
                              (prev - 1 + heroSlideshowReviews.length) %
                              heroSlideshowReviews.length
                          )
                        }
                        aria-label="Previous customer review"
                        className="w-7 h-7 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] border-[1.5px] border-[#7A5C38] flex items-center justify-center text-[#40563D] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReviewSlideIdx(
                            (prev) => (prev + 1) % heroSlideshowReviews.length
                          )
                        }
                        aria-label="Next customer review"
                        className="w-7 h-7 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] border-[1.5px] border-[#7A5C38] flex items-center justify-center text-[#40563D] transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Big Round Credibility Badges Right Under the Customer Review Slider */}
            <div
              aria-label="BAJOZ Product Credibility Badges"
              className="grid grid-cols-3 gap-3 sm:gap-5 pt-1 place-items-center"
            >
              {[
                {
                  top: '100%',
                  label: 'HALAL',
                  sub: 'Certified Pure',
                  bgClass: 'bg-[#F9F5E9]',
                  ringClass: 'border-[#40563D]/35',
                },
                {
                  top: '100%',
                  label: 'HomeMade',
                  sub: 'Small Batch',
                  bgClass: 'bg-[#E9F399]',
                  ringClass: 'border-[#40563D]/45',
                },
                {
                  top: '100%',
                  label: 'Natural',
                  sub: 'Zero Chemicals',
                  bgClass: 'bg-[#F9F5E9]',
                  ringClass: 'border-[#40563D]/35',
                },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className={`w-26 h-26 xs:w-28 xs:h-28 sm:w-34 sm:h-34 lg:w-36 lg:h-36 rounded-full ${badge.bgClass} border-[1.5px] border-[#7A5C38] p-2 flex items-center justify-center text-center shadow-xs transition-transform duration-200 hover:scale-103`}
                >
                  <div
                    className={`w-full h-full rounded-full border-[1.5px] border-dashed ${badge.ringClass} flex flex-col items-center justify-center px-2`}
                  >
                    <span className="font-mono text-lg xs:text-xl sm:text-2xl lg:text-[1.65rem] font-extrabold text-[#40563D] leading-none tracking-tight">
                      {badge.top}
                    </span>
                    <span className="font-serif text-xs xs:text-sm sm:text-base lg:text-[1.05rem] font-extrabold text-[#4A2E1B] leading-tight mt-1">
                      {badge.label}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#40563D]/85">
                      <ShieldCheck className="w-3 h-3 text-[#40563D] shrink-0" />
                      <span>{badge.sub}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Minimal, Uncluttered Hero Content (Heading + Short Copy + 4 Badge Pills + Clean Selection & Buy Box) */}
          <div className="lg:col-span-6 space-y-6 lg:pt-2">
            {/* Two-Line Product Display Heading */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] text-[#40563D] leading-[1.08] tracking-tight">
              <span className="block font-extrabold">
                {isSpiceMix
                  ? 'BAJOZ SpiceMix'
                  : isPanjeeri
                  ? 'BAJOZ Homemade'
                  : isToothPowder
                  ? 'BAJOZ Tooth Guardian'
                  : product.name}
              </span>
              <span className="block font-normal text-[#40563D]/95 mt-1">
                {isSpiceMix
                  ? "Pakistan's 1st All-in-1 Cooking Paste"
                  : isPanjeeri
                  ? 'Khandani Panjeeri'
                  : isToothPowder
                  ? 'Natural Homemade Tooth Cleaning Powder'
                  : '100% Pure & Natural'}
              </span>
            </h1>

            {/* Clean, Minimal Hero Copy Paragraph */}
            <div className="space-y-3 text-base sm:text-lg text-[#40563D] leading-relaxed max-w-2xl">
              {heroParagraphs.map((para, idx) => (
                <p key={idx} className="font-medium">
                  {para}
                </p>
              ))}
            </div>

            {/* 6 Benefit Badge Pills Right Under Product Description Before Size & Quantity Selection Controls */}
            {(() => {
              const badgePills = isSpiceMix
                ? [
                    {
                      text: 'One Paste, All Pakistani Dishes',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'The Right Proportion You Need',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'No More Peeling, & Grinding',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'Prep. Time Cut in Half',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Desi Taste, Modern Lifestyle',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Less Kitchen Mess, More Cooking',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                  ]
                : isPanjeeri
                ? [
                    {
                      text: '100% Pure Desi Ghee',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Zero Refined White Sugar',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'Postpartum Recovery Support',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'Warming Daily Joint Comfort',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Wholesome Daily Energy',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Small-Batch Khandani Recipe',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                  ]
                : isToothPowder
                ? [
                    {
                      text: 'Natural Homemade Tooth Powder',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Alum, Cloves, Salts & Tree Barks',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'Everyday Oral Care Routine',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'Overall Mouth Cleanliness',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'No Synthetic Chemicals Or Colors',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: '40 gm & 80 gm Fresh-Sealed Jars',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                  ]
                : [
                    {
                      text: '100% Pure Natural Formula',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Zero Chemical Preservatives',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'Small-Batch Homemade Quality',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                    {
                      text: 'Traditional Family Recipe',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Everyday Wholesome Nutrition',
                      toneClass: 'bg-[#E9F399] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#E9F399]',
                    },
                    {
                      text: 'Fresh-Sealed Airtight Jar',
                      toneClass: 'bg-[#F9F5E9] text-[#40563D] border-[#7A5C38]',
                      dotClass: 'bg-[#40563D] text-[#F9F5E9]',
                    },
                  ];

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl">
                  {badgePills.slice(0, 6).map((pill, idx) => (
                    <div
                      key={`desc-pill-${idx}`}
                      className={`inline-flex items-center justify-start gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border-[1.5px] ${pill.toneClass}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${pill.dotClass}`}
                      >
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold tracking-tight truncate">
                        {pill.text}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Minimal Outlined Selection & Buy Box Container */}
            <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F5EBC8] p-4 sm:p-6 space-y-4">
              {/* Flavour Selector — Shown ONLY for Panjeeri / Multi-Flavour Products (Never on SpiceMix) */}
              {hasFlavourVariants && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#40563D] block">
                    Flavour
                  </span>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {variantsList.map((variant) => {
                      const isSelected = variant.id === activeVariant?.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-xl text-center font-serif text-sm sm:text-base font-extrabold transition-all cursor-pointer border-[1.5px] border-[#2C221E] ${
                            isSelected
                              ? 'bg-[#E9F399] text-[#40563D]'
                              : 'bg-[#F5EBC8] hover:bg-[#F9F5E9] text-[#40563D]'
                          }`}
                        >
                          {variant.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector — Price Shown as N/A Right in Front of Each Size */}
              <div className="space-y-3">
                {packSizesList.map((pack, idx) => {
                  const isSelected =
                    pack.id === activePack?.id || (idx === 0 && !activePack);

                  return (
                    <div key={pack.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl border-[1.5px] border-[#2C221E] transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#E9F399] text-[#40563D]'
                            : 'bg-[#F5EBC8] hover:bg-[#F9F5E9] text-[#40563D]'
                        }`}
                      >
                        <span className="font-serif text-lg sm:text-2xl font-extrabold tracking-tight">
                          {pack.label}
                        </span>
                        <span className="font-mono text-sm sm:text-lg font-extrabold text-[#40563D] tabular-nums">
                          Price: N/A
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Minimal Quantity Row with Price: N/A Right in Front */}
              <div className="py-2.5 px-4 sm:px-5 rounded-2xl border-[1.5px] border-[#2C221E] bg-[#F5EBC8] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#40563D]">
                    Quantity
                  </span>
                  <span className="font-mono text-sm sm:text-base font-extrabold text-[#40563D] tabular-nums">
                    · Price: N/A
                  </span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-full bg-[#F9F5E9] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#2C221E] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm sm:text-base font-extrabold text-[#40563D] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-full bg-[#F9F5E9] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#2C221E] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Centered Pill Buy Now Button + Circular Up-Right Arrow Button */}
              <div className="pt-1 flex justify-center">
                <div className="inline-flex items-center gap-1.5 w-full sm:w-auto justify-center">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleBuyItNow}
                    className="flex-1 sm:flex-initial px-7 sm:px-10 py-3 sm:py-3.5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-2xl font-extrabold tracking-tight transition-all duration-150 cursor-pointer disabled:opacity-50"
                  >
                    {isOutOfStock ? 'Sold Out' : 'Buy Now · Price: N/A'}
                  </button>
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleBuyItNow}
                    aria-label="Buy Now"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer disabled:opacity-50 hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-6 h-6 stroke-[2.25]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            INTERACTIVE TAB BAR: Ingredients | Uses | Benefits
            Placed right under the product hero section
            =================================================================== */}
        <div className="mt-10 sm:mt-14">
          {/* Tab Buttons Row */}
          <div
            role="tablist"
            aria-label="Product Information Tabs"
            className="flex flex-wrap items-center gap-2 sm:gap-5 mb-1.5"
          >
            {[
              { id: 'ingredients' as const, label: 'Ingredients' },
              { id: 'uses' as const, label: 'Uses' },
              { id: 'benefits' as const, label: 'Benefits' },
            ].map((tab) => {
              const isSelected = activeInfoTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveInfoTab(tab.id)}
                  className={`text-base sm:text-lg lg:text-xl font-semibold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'px-7 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38]'
                      : 'px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-transparent text-[#2C221E] hover:text-[#40563D] border-[1.5px] border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Rounded Outlined Tab Content Box */}
          <div
            role="tabpanel"
            className="w-full rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 sm:p-9 lg:p-11 text-left space-y-5 sm:space-y-6 bajoz-fade-in"
          >
            {activeInfoTab === 'ingredients' && (
              <>
                {isSpiceMix ? (
                  <div className="space-y-6">
                    <div className="space-y-2.5 max-w-3xl">
                      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                        17 Pure Homemade Ingredients in Every Jar
                      </h2>
                      <p className="text-base sm:text-lg font-medium text-[#2C221E] leading-relaxed">
                        Every jar of BAJOZ SpiceMix is slow-simmered in small batches from fresh
                        garlic, ginger, salt, and whole subcontinental spices — 100% pure, zero
                        chemical preservatives, and no onion added:
                      </p>
                    </div>

                    <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {SPICEMIX_INGREDIENTS.map((ingredientName) => (
                        <li
                          key={ingredientName}
                          className="rounded-[1.25rem] bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] px-4 py-3.5 flex items-center gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                          </span>
                          <span className="font-serif text-base sm:text-lg font-extrabold text-[#40563D] leading-snug">
                            {ingredientName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : isPanjeeri ? (
                  <div className="space-y-6">
                    <div className="space-y-2.5 max-w-3xl">
                      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                        100% Pure Homemade Ingredients in Every Jar
                      </h2>
                      <p className="text-base sm:text-lg font-medium text-[#2C221E] leading-relaxed">
                        Every jar of BAJOZ Homemade Panjeeri is slow-roasted in small batches in
                        100% pure grass-fed Desi Ghee with premium dry fruits, seeds, and organic
                        Gond Katira — zero white sugar and zero preservatives:
                      </p>
                    </div>

                    <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {PANJEERI_INGREDIENTS.map((ingredientName) => (
                        <li
                          key={ingredientName}
                          className="rounded-[1.25rem] bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] px-4 py-3.5 flex items-center gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                          </span>
                          <span className="font-serif text-base sm:text-lg font-extrabold text-[#40563D] leading-snug">
                            {ingredientName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <>
                    <p className="text-base sm:text-lg lg:text-xl font-medium text-[#2C221E] leading-relaxed">
                      Ingredients Picked for Pure Ancestral Oral Care.
                      <br />
                      BAJOZ Tooth Guardian Powder: Natural Alum (Phitkari)*, Aromatic Cloves
                      (Laung)*, Natural Salts*, and Traditional Tree Bark Powders*. *100%
                      Natural Homemade Tooth Cleaning Powder.
                    </p>

                    <p className="text-base sm:text-lg lg:text-xl font-medium text-[#2C221E] leading-relaxed">
                      At BAJOZ, we believe daily oral care should be simple, natural, and transparent. Every jar is handcrafted from time-tested ancestral oral care ingredients—with no synthetic chemicals, artificial colors, or preservatives. Just clean, natural mouth freshness.
                    </p>
                  </>
                )}
              </>
            )}

            {activeInfoTab === 'uses' && (
              <>
                {isSpiceMix ? (
                  <div className="space-y-6">
                    <div className="space-y-2.5 max-w-3xl">
                      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                        Uses
                      </h2>
                      <p className="text-base sm:text-lg font-medium text-[#2C221E] leading-relaxed">
                        Make any sub-continental food item with SpiceMix in half the standard
                        cooking time of that item without worry about uniqueness of its taste and
                        aroma. This all purpose cooking paste makes all dishes including:
                      </p>
                    </div>

                    <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {[
                        'Quorma',
                        'Karahi',
                        'Biryani',
                        'All Vegetables',
                        'All Lentils',
                        'Kalaiji',
                        'Gurday, Kapooray',
                        'Nihari',
                        'Payas',
                        'Roast',
                        'Fried Fish',
                        'Masala Rice',
                      ].map((dish) => (
                        <li
                          key={dish}
                          className="rounded-[1.25rem] bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] px-4 py-3.5 flex items-center gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                          </span>
                          <span className="font-serif text-base sm:text-lg font-extrabold text-[#40563D] leading-snug">
                            {dish}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : isPanjeeri ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                    {/* 1. Dosage */}
                    <div className="rounded-[1.25rem] bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] p-6 sm:p-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold tracking-tight">
                          Daily Serving
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                          Dosage:
                        </h3>
                        <p className="font-serif text-xl sm:text-2xl font-bold text-[#4A2E1B] pt-1">
                          2-3 Tablespoon Per Day
                        </p>
                      </div>
                    </div>

                    {/* 2. How To Enjoy Panjeeri? */}
                    <div className="rounded-[1.25rem] bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] p-6 sm:p-7 space-y-4">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold tracking-tight">
                        Serving Ways
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                        How To Enjoy Panjeeri?
                      </h3>
                      <ol className="space-y-2.5 pt-1">
                        {[
                          '1. Use with Warm Milk/Tea',
                          '2. Enjoy as Healthy Evening Snack',
                          '3. Take it with Oatmeal',
                        ].map((item) => (
                          <li
                            key={item}
                            className="rounded-xl bg-[#F9F5E9] border border-[#7A5C38]/40 px-4 py-2.5 font-serif text-base sm:text-lg font-extrabold text-[#4A2E1B]"
                          >
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* 3. Storage and Usage Instructions */}
                    <div className="rounded-[1.25rem] bg-[#FFFDF9] border-[1.5px] border-[#7A5C38] p-6 sm:p-7 space-y-4">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-xs sm:text-sm font-extrabold tracking-tight">
                        Freshness Care
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                        Storage and Usage Instructions:
                      </h3>
                      <ol className="space-y-2.5 pt-1">
                        {[
                          '1. Keep in Cool, Dry Place',
                          '2. Always Use Dry Spoon',
                          '3. Keep the Jar Closed.',
                        ].map((item) => (
                          <li
                            key={item}
                            className="rounded-xl bg-[#F9F5E9] border border-[#7A5C38]/40 px-4 py-2.5 font-serif text-base sm:text-lg font-extrabold text-[#4A2E1B]"
                          >
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-base sm:text-lg lg:text-xl font-medium text-[#2C221E] leading-relaxed">
                      Daily Morning &amp; Evening Ancestral Oral Care Routine.
                      <br />
                      Best for everyday teeth cleaning, comforting gum swelling and bleeding,
                      and maintaining overall mouth cleanliness and natural freshness for the
                      whole family.
                    </p>

                    <p className="text-base sm:text-lg lg:text-xl font-medium text-[#2C221E] leading-relaxed">
                      Use a small pinch on damp soft toothbrush bristles morning and evening. Note: This is a traditional remedial product used by our ancestors and not a medicated product.
                    </p>
                  </>
                )}
              </>
            )}

            {activeInfoTab === 'benefits' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#40563D]">
                    {isPanjeeri
                      ? 'Why BAJOZ Homemade Panjeeri Belongs in Your Home'
                      : isSpiceMix
                      ? 'Why BAJOZ SpiceMix Belongs in Every Pakistani Kitchen'
                      : isToothPowder
                      ? 'Why BAJOZ Tooth Guardian Belongs in Your Daily Routine'
                      : `Why ${product.name} Belongs in Your Home`}
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-[#5A4E38] max-w-3xl">
                    {isSpiceMix
                      ? 'Tried and tested for two decades — one pure homemade paste with the right proportion of garlic, ginger, and whole spices for every Pakistani dish.'
                      : isPanjeeri
                      ? 'Slow-roasted in 100% pure grass-fed Desi Ghee with whole almonds, cashews, pistachios, and Gond Katira for steady daily strength.'
                      : 'Natural homemade tooth cleaning powder made with alum, cloves, natural salts, and tree bark powders for your everyday oral care routine.'}
                  </p>
                </div>

                {/* Minimal Grid of Product Benefits Inside the Benefits Tab */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                  {benefitsItems.map((b) => (
                    <div
                      key={b.title}
                      className="rounded-[1.25rem] bg-[#FFFDF9] hover:bg-[#F5EBC8]/55 transition-colors duration-200 border-[1.5px] border-[#7A5C38] p-5 sm:p-6 space-y-2.5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#40563D] leading-snug">
                          {b.title}
                        </h3>
                      </div>

                      {b.bullets.length === 1 ? (
                        <p className="text-sm sm:text-base font-medium text-[#2C221E] leading-relaxed pl-9">
                          {b.bullets[0]}
                        </p>
                      ) : (
                        <ul className="space-y-2 pl-9">
                          {b.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#2C221E] leading-snug"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#40563D] shrink-0 mt-1.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {!isPanjeeri && (
        <>
          {/* Smooth Wave Transition from Product Showcase (#F5EBC8) into The Transformation (#F9F5E9) */}
          <WaveDivider fromColor="#F5EBC8" toColor="#F9F5E9" />

          {/* =====================================================================
              4. THE TRANSFORMATION (3-Step Customer Journey Cards + CTA)
              ===================================================================== */}
          <section className="py-20 sm:py-28 lg:py-36 bg-[#F9F5E9] bajoz-seamless-section">
            <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-10 sm:space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
                  The Transformation
                </p>
                <h2 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B]">
                  {isSpiceMix
                    ? 'From “What Should I Cook Today?” to “Dinner Is Sorted.”'
                    : isToothPowder
                    ? 'Feel More Confident About What You Choose for Your Routine'
                    : 'From a Familiar Tradition to an Everyday Favourite'}
                </h2>
                {isSpiceMix ? (
                  <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
                    Long day, hungry family, and a cabinet full of spice boxes? Skip the 45-minute prep—two spoonfuls of BAJOZ SpiceMix build a rich, homemade masala base in seconds.
                  </p>
                ) : isToothPowder ? (
                  <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
                    Oral care shouldn’t mean mystery chemicals. We list every mineral and botanical ingredient clearly so you can brush with confidence every morning and night.
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
                    {`Enjoy the comforting warmth of ${product.name} every single day—without spending hours preparing from scratch.`}
                  </p>
                )}
              </div>

              {/* 3-Step Outlined Rounded Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
                {transformationSteps.map((item, idx) => (
                  <div
                    key={item.step}
                    className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#FFFDF9] p-6 sm:p-8 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-mono text-xs font-bold uppercase tracking-[0.1em]">
                        0{idx + 1}. {item.step}
                      </span>

                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1B]">
                        {item.title}
                      </h3>

                      <p className="text-sm sm:text-base leading-relaxed text-[#2C221E]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={scrollToTopBuyBox}
                    className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors cursor-pointer"
                  >
                    {isSpiceMix
                      ? 'Make Everyday Cooking Easier'
                      : isToothPowder
                      ? 'Explore BAJOZ Tooth Powder'
                      : `Bring Home ${product.name}`}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToTopBuyBox}
                    aria-label="Scroll to Buy Box"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-all cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <WaveDivider fromColor="#F9F5E9" toColor="#F5EBC8" flip />
        </>
      )}

      {/* =====================================================================
          8. SOCIAL PROOF SECTION (3-Column Written Reviews + CTA)
          ===================================================================== */}
      <section
        id="pdp-social-proof"
        className="py-20 sm:py-28 lg:py-36 bg-[#F5EBC8] scroll-mt-20 bajoz-seamless-section"
      >
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
              Social Proof
            </p>
            <h2 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B]">
              {isSpiceMix
                ? 'Made for Real Kitchens and Real Family Meals'
                : isToothPowder
                ? 'Real Experiences. Honest Feedback.'
                : "Don't Just Take Our Word for It"}
            </h2>
            <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
              {isSpiceMix
                ? "Every kitchen has its own little tricks. Every family has dishes that bring everyone back for seconds. We're proud to be part of our customers' everyday cooking stories."
                : isToothPowder
                ? 'When customers share their experiences, it helps others understand what to expect from a product. Explore genuine feedback from people who have tried BAJOZ products.'
                : 'The best stories come from the people who have welcomed BAJOZ into their homes. Read genuine customer feedback about their experience with our products.'}
            </p>
          </div>

          {/* 3-Column Written Reviews with 5 Stars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {displayedReviews.slice(0, 3).map((rev) => (
              <article
                key={rev.id}
                className="bg-[#F9F5E9] rounded-[1.5rem] p-7 sm:p-8 border-[1.5px] border-[#7A5C38] flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[#C98A6A]">
                      {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="ml-1.5 text-xs font-bold text-[#2C221E] tabular-nums">
                        {rev.rating || 5}.0
                      </span>
                    </div>
                    {rev.productTag && (
                      <span className="px-3 py-1 rounded-full bg-[#E9F399] text-[#40563D] border border-[#7A5C38] font-serif text-xs font-extrabold">
                        {rev.productTag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A2E1B]">
                    “{rev.title}”
                  </h3>
                  <p className="text-sm sm:text-base text-[#2C221E] leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Social Proof Rating + Primary CTA + Write Review */}
          <div className="text-center space-y-4 pt-2">
            <div className="inline-flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-[#C98A6A]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#5A4E38]">
                Verified BAJOZ Household Feedback
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={scrollToTopBuyBox}
                  className="px-8 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors cursor-pointer"
                >
                  {isPanjeeri
                    ? 'Try BAJOZ Panjeeri'
                    : isSpiceMix
                    ? 'Give BAJOZ SpiceMix a Try'
                    : isToothPowder
                    ? 'Explore BAJOZ Natural Care'
                    : `Try ${product.name}`}
                </button>
                <button
                  type="button"
                  onClick={scrollToTopBuyBox}
                  aria-label="Try Product"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-all cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                >
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-6 py-3.5 sm:py-4 bg-[#F9F5E9] hover:bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-bold rounded-full transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#40563D]" />
                <span>Share Your Experience</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#F5EBC8" toColor="#FFFDF9" flip />

      {/* =====================================================================
          9. COMPARISON SECTION (Left: Single Straight Image Card & Copy | Right: Outlined Comparison Table)
          ===================================================================== */}
      <section className="py-20 sm:py-28 lg:py-36 bg-[#FFFDF9] bajoz-seamless-section">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
              Comparison
            </p>
            <h2 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B]">
              {isPanjeeri
                ? 'Homemade Panjeeri or Ready-to-Enjoy Panjeeri?'
                : isSpiceMix
                ? 'Another Masala on the Shelf — or a Simpler Way to Season?'
                : isToothPowder
                ? 'Choosing an Oral-Care Product? Start With the Facts.'
                : `Making It at Home or Choosing BAJOZ ${product.name}?`}
            </h2>
            <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
              {isSpiceMix
                ? "There are plenty of ways to bring flavour to a dish. You can measure each spice separately, use different ready-made blends, or keep a versatile homemade mix close at hand. Here's how BAJOZ SpiceMix fits into your kitchen."
                : isToothPowder
                ? 'Different oral-care products are designed for different purposes. What matters is understanding the formulation, intended use, and evidence behind the claims.'
                : "Every home has its own way of doing things. Here's a simple comparison to help you decide what works for you."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Single Straight Rounded Card + Closing Copy + CTA */}
            <div className="lg:col-span-4 space-y-5">
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 space-y-4">
                <div className="aspect-square rounded-[1.5rem] bg-[#B4CBA2] border-[1.5px] border-[#7A5C38] overflow-hidden flex items-center justify-center">
                  <ProductImage
                    type={product.imageType}
                    productId={product.id}
                    customImageUrl={product.customImageUrl}
                    fit="cover"
                    className="w-full h-full"
                    alt={product.name}
                  />
                </div>
                {isSpiceMix && (
                  <div className="text-xs font-bold uppercase tracking-wider text-[#40563D]">
                    The BAJOZ difference
                  </div>
                )}
                {isToothPowder && (
                  <div className="text-xs font-bold uppercase tracking-wider text-[#40563D]">
                    A thoughtful choice starts with understanding.
                  </div>
                )}
                <p className="text-xs sm:text-sm text-[#2C221E] leading-relaxed">
                  {isPanjeeri
                    ? "Love making your own family recipe? There's something special about that. Prefer the convenience of ordering? BAJOZ Panjeeri offers another way to enjoy a familiar traditional food."
                    : isSpiceMix
                    ? "You don't need to reinvent your cooking routine. Keep the spices and fresh ingredients your recipes call for, and let BAJOZ SpiceMix simplify one part of the process."
                    : isToothPowder
                    ? 'BAJOZ encourages customers to check the ingredients and intended use of any oral-care product before deciding what belongs in their routine.'
                    : `Love making your own family recipe? There's something special about that. Prefer the convenience of ordering? BAJOZ ${product.name} offers another way to enjoy familiar everyday goodness.`}
                </p>
                {isToothPowder && (
                  <p className="text-[11px] text-[#5A4E38] pt-2 border-t border-[#7A5C38]/25 leading-relaxed">
                    <strong>Important:</strong> Tooth powder should not be assumed to replace
                    fluoride toothpaste or other evidence-based dental care. Ask your
                    dentist which products are appropriate for your needs.
                  </p>
                )}
                <div className="pt-1 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={scrollToTopBuyBox}
                    className="flex-1 py-3.5 px-5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base font-extrabold tracking-tight transition-colors cursor-pointer"
                  >
                    {isPanjeeri
                      ? 'Explore BAJOZ Panjeeri'
                      : isSpiceMix
                      ? 'Try the Homemade Blend'
                      : isToothPowder
                      ? 'Explore Tooth Powder'
                      : `Explore ${product.name}`}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToTopBuyBox}
                    aria-label="Explore Product"
                    className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 transition-all cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Side-by-Side Outlined Comparison Table */}
            <div className="lg:col-span-8">
              <div className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] overflow-hidden overflow-x-auto">
                {isSpiceMix ? (
                  <div className="min-w-[540px]">
                    <div className="grid grid-cols-12 bg-[#40563D] text-[#F9F5E9] px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold border-b-[1.5px] border-[#7A5C38]">
                      <div className="col-span-3">What matters</div>
                      <div className="col-span-3 px-2">Measuring individual spices</div>
                      <div className="col-span-3 px-2">
                        Using multiple dish-specific mixes
                      </div>
                      <div className="col-span-3 px-2 text-[#E9F399]">BAJOZ SpiceMix</div>
                    </div>

                    <div className="divide-y divide-[#7A5C38]/25">
                      {spiceMixComparisonRows.map((row) => (
                        <div
                          key={row.criteria}
                          className="grid grid-cols-12 px-4 sm:px-6 py-4 text-xs sm:text-sm items-start gap-2"
                        >
                          <div className="col-span-3 font-serif text-base font-bold text-[#4A2E1B]">
                            {row.criteria}
                          </div>
                          <div className="col-span-3 px-2 text-[#5A4E38] leading-relaxed">
                            {row.individual}
                          </div>
                          <div className="col-span-3 px-2 text-[#5A4E38] leading-relaxed">
                            {row.multipleMixes}
                          </div>
                          <div className="col-span-3 px-2 text-[#2C221E] font-medium leading-relaxed flex items-start gap-1.5">
                            <Check className="w-4 h-4 text-[#40563D] shrink-0 mt-0.5" />
                            <span>{row.bajoz}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isToothPowder ? (
                  <div className="min-w-[480px]">
                    <div className="grid grid-cols-12 bg-[#40563D] text-[#F9F5E9] px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold border-b-[1.5px] border-[#7A5C38]">
                      <div className="col-span-4">What to consider</div>
                      <div className="col-span-4 px-2">Conventional toothpaste</div>
                      <div className="col-span-4 px-2 text-[#E9F399]">Tooth powder</div>
                    </div>

                    <div className="divide-y divide-[#7A5C38]/25">
                      {toothPowderComparisonRows.map((row) => (
                        <div
                          key={row.criteria}
                          className="grid grid-cols-12 px-4 sm:px-6 py-4 text-xs sm:text-sm items-start gap-2"
                        >
                          <div className="col-span-4 font-serif text-base sm:text-lg font-bold text-[#4A2E1B]">
                            {row.criteria}
                          </div>
                          <div className="col-span-4 px-2 text-[#5A4E38] leading-relaxed">
                            {row.conventional}
                          </div>
                          <div className="col-span-4 px-2 text-[#2C221E] font-medium leading-relaxed flex items-start gap-1.5">
                            <Check className="w-4 h-4 text-[#40563D] shrink-0 mt-0.5" />
                            <span>{row.toothPowder}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="min-w-[480px]">
                    <div className="grid grid-cols-12 bg-[#40563D] text-[#F9F5E9] px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold border-b-[1.5px] border-[#7A5C38]">
                      <div className="col-span-4">What matters</div>
                      <div className="col-span-4 px-2">Making it at home</div>
                      <div className="col-span-4 px-2 text-[#E9F399]">
                        {isPanjeeri
                          ? 'Buying BAJOZ Panjeeri'
                          : `Buying BAJOZ ${product.name}`}
                      </div>
                    </div>

                    <div className="divide-y divide-[#7A5C38]/25">
                      {comparisonRows.map((row) => (
                        <div
                          key={row.criteria}
                          className="grid grid-cols-12 px-4 sm:px-6 py-4 text-xs sm:text-sm items-start gap-2"
                        >
                          <div className="col-span-4 font-serif text-base sm:text-lg font-bold text-[#4A2E1B]">
                            {row.criteria}
                          </div>
                          <div className="col-span-4 px-2 text-[#5A4E38] leading-relaxed">
                            {row.home}
                          </div>
                          <div className="col-span-4 px-2 text-[#2C221E] font-medium leading-relaxed flex items-start gap-1.5">
                            <Check className="w-4 h-4 text-[#40563D] shrink-0 mt-0.5" />
                            <span>{row.bajoz}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#FFFDF9" toColor="#F9F5E9" />

      {/* =====================================================================
          10. FREQUENTLY ASKED QUESTIONS (2-Column Split with Outlined FAQ Cards)
          ===================================================================== */}
      <section className="py-20 sm:py-28 lg:py-36 bg-[#F9F5E9] bajoz-seamless-section">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: FAQ Heading + Contact CTA */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
                Frequently Asked Questions
              </p>
              <h2 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B] leading-tight">
                {isPanjeeri
                  ? 'Curious About Panjeeri?'
                  : isSpiceMix
                  ? 'Your SpiceMix Questions, Answered'
                  : isToothPowder
                  ? 'Your Tooth Powder Questions, Answered'
                  : `Curious About ${product.name}?`}
              </h2>
              <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
                {isToothPowder
                  ? 'Everything you need to know about ingredients, directions, precautions, storage, and ordering online in Pakistan.'
                  : 'Everything you need to know about ingredients, taste, serving guidance, storage, and ordering online in Pakistan.'}
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5">
                  <a
                    href={whatsappQuestionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-base sm:text-lg font-extrabold tracking-tight transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#40563D]" />
                    <span>
                      {isSpiceMix || isToothPowder
                        ? 'Ask BAJOZ on WhatsApp'
                        : 'Still Have Questions? Contact Us'}
                    </span>
                  </a>
                  <a
                    href={whatsappQuestionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact BAJOZ on WhatsApp"
                    className="w-12 h-12 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-all hover:translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Outlined Rounded FAQ Cards */}
            <div className="lg:col-span-7 space-y-3.5">
              {faqsList.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-[1.5rem] border-[1.5px] border-[#7A5C38] bg-[#FFFDF9] px-5 sm:px-6 py-4 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <span className="font-serif text-lg sm:text-xl font-bold text-[#4A2E1B]">
                        {faq.question}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-[#E9F399] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 font-mono text-sm font-bold">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-[#7A5C38]/25'
                          : 'grid-rows-[0fr] opacity-0 mt-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-[#2C221E] leading-relaxed pr-4">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#F9F5E9" toColor="#F5EBC8" flip />

      {/* =====================================================================
          11. EMOTIONAL CLOSING CTA ("Some Good Things Feel Like Home")
          ===================================================================== */}
      <section className="py-20 sm:py-28 lg:py-36 bg-[#F5EBC8] bajoz-seamless-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-8 sm:p-12 text-center space-y-6">
            <div className="space-y-1">
              <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
                BAJOZ — The House of Naturals
              </p>
              <h2 className="bajoz-poster-display text-3xl sm:text-5xl text-[#4A2E1B]">
                {isSpiceMix
                  ? 'Less Time Measuring. More Time Around the Table.'
                  : isToothPowder
                  ? 'Your Everyday Choices Deserve a Closer Look.'
                  : 'Some Good Things Feel Like Home'}
              </h2>
            </div>

            <div className="space-y-2 max-w-2xl mx-auto text-sm sm:text-base text-[#2C221E] leading-relaxed">
              {isSpiceMix ? (
                <p>
                  Keep BAJOZ SpiceMix by your stove for effortless Biryanis, Karahis, and Daals—100% homemade with zero preservatives and no onion.
                </p>
              ) : isToothPowder ? (
                <p>
                  Switch to a natural homemade tooth cleaning powder crafted for everyday oral care—made with alum, cloves, natural salts, and tree bark powders.
                </p>
              ) : (
                <p>
                  Bring home the comforting warmth of small-batch Desi Ghee nourishment with{' '}
                  {isPanjeeri ? 'BAJOZ Homemade Panjeeri' : product.name}.
                </p>
              )}
            </div>

            <div className="pt-1 flex justify-center">
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={isToothPowder ? scrollToTopBuyBox : handleAddToCart}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-all cursor-pointer"
                >
                  {isSpiceMix
                    ? 'Add SpiceMix to Cart'
                    : isToothPowder
                    ? 'Explore BAJOZ Tooth Powder'
                    : 'Add to Cart'}
                </button>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={isToothPowder ? scrollToTopBuyBox : handleAddToCart}
                  aria-label="Add to Cart"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-all cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                >
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
                </button>
              </div>
            </div>

            <div className="max-w-md mx-auto pt-1 flex items-center justify-center text-center">
              <p className="text-xs sm:text-sm text-[#786C57] leading-relaxed">
                {isSpiceMix
                  ? 'One homemade blend. So many meals to make your own.'
                  : isToothPowder
                  ? 'Clear details. Thoughtful choices. Care that starts with knowing.'
                  : 'Explore the ingredients and product details, choose your pack, and order online.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#F5EBC8" toColor="#FFFDF9" />

      {/* =====================================================================
          12. BESTSELLERS / RELATED PRODUCTS (Single Straight Image Cards & Outlined Containers)
          ===================================================================== */}
      <section className="py-20 sm:py-28 lg:py-36 bg-[#FFFDF9] bajoz-seamless-section">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 space-y-10 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <p className="bajoz-script-kicker text-2xl sm:text-3xl text-[#40563D]">
              {isSpiceMix || isToothPowder ? 'Related Products' : 'Our Best Sellers'}
            </p>
            <h2 className="bajoz-poster-display text-3xl sm:text-4xl lg:text-5xl text-[#4A2E1B]">
              {isSpiceMix
                ? 'More Goodness for Your Kitchen'
                : isToothPowder
                ? 'More Everyday Care to Explore'
                : 'More Goodness to Explore'}
            </h2>
            <p className="text-sm sm:text-base text-[#786C57] leading-relaxed">
              {isSpiceMix
                ? 'Make room for more everyday favourites from BAJOZ.'
                : isToothPowder
                ? 'Discover more from the BAJOZ collection.'
                : 'Enjoying traditional favourites? Discover more from the BAJOZ collection.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {publishedProducts.map((rel) => {
              const isRelAdded = relatedAdded[rel.id];

              return (
                <div
                  key={`related-${rel.id}`}
                  className="rounded-[1.75rem] border-[1.5px] border-[#7A5C38] bg-[#F9F5E9] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div
                      onClick={() => setActiveProductId(rel.id)}
                      className="relative aspect-square rounded-[1.5rem] bg-[#B4CBA2] border-[1.5px] border-[#7A5C38] flex items-center justify-center cursor-pointer overflow-hidden group mb-5"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(rel.id);
                        }}
                        aria-label={
                          isFavorite(rel.id)
                            ? `Remove ${rel.name} from Favorites`
                            : `Save ${rel.name} to Favorites`
                        }
                        aria-pressed={isFavorite(rel.id)}
                        title={
                          isFavorite(rel.id)
                            ? 'Saved in Favorites — click to remove'
                            : 'Save to Favorites'
                        }
                        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border-[1.5px] border-[#7A5C38] ${
                          isFavorite(rel.id)
                            ? 'bg-[#E9F399] text-[#9B6A73] scale-105'
                            : 'bg-[#F9F5E9]/95 hover:bg-[#E9F399] text-[#40563D]'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            isFavorite(rel.id)
                              ? 'fill-[#9B6A73] text-[#9B6A73]'
                              : ''
                          }`}
                        />
                      </button>

                      <ProductImage
                        type={rel.imageType}
                        productId={rel.id}
                        customImageUrl={rel.customImageUrl}
                        fit="cover"
                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                        alt={rel.name}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                      <div className="flex items-center gap-0.5 text-[#C98A6A]">
                        {Array.from({ length: 5 }).map((_, sIdx) => (
                          <Star key={sIdx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#40563D]">
                        {rel.category}
                      </span>
                    </div>

                    <h3
                      onClick={() => setActiveProductId(rel.id)}
                      className="font-serif text-2xl font-bold cursor-pointer leading-snug text-[#40563D] hover:underline"
                    >
                      {rel.name}
                    </h3>

                    <p className="text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed text-[#2C221E]">
                      {rel.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#7A5C38]/25 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickAddRelated(rel, rel.id)}
                      className="flex-1 py-3 px-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-sm sm:text-base font-extrabold tracking-tight transition-colors cursor-pointer"
                    >
                      {isRelAdded ? 'Added to Cart!' : 'Add to Cart'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveProductId(rel.id)}
                      aria-label={`View ${rel.name}`}
                      className="w-11 h-11 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center shrink-0 transition-all cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
                    >
                      <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveProductId(null);
                  setActivePageSlug('shop');
                }}
                className="px-8 py-3.5 sm:py-4 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] font-serif text-lg sm:text-xl font-extrabold tracking-tight transition-colors cursor-pointer"
              >
                Shop All Products
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveProductId(null);
                  setActivePageSlug('shop');
                }}
                aria-label="Shop All Products"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] flex items-center justify-center transition-all cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
              >
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Wave Transition into Pre-Footer Important Notice Section (#F5EBC8) */}
      <WaveDivider fromColor="#FFFDF9" toColor="#F5EBC8" flip />

      {/* Customer Voice Note / Story Modal */}
      {activeReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5A4E38]/60 backdrop-blur-2xs">
          <div className="relative w-full max-w-md bg-[#F9F5E9] rounded-[1.75rem] p-6 sm:p-8 border-[1.5px] border-[#7A5C38] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#7A5C38]/25 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#40563D] block">
                  {activeReel.handle}
                </span>
                <span className="text-xs text-[#786C57]">
                  {activeReel.customerName} · {activeReel.city}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveReel(null)}
                className="p-1.5 text-[#786C57] hover:text-[#5A4E38] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#B4CBA2] rounded-[1.5rem] aspect-square p-6 flex items-center justify-center border-[1.5px] border-[#7A5C38]">
              <ProductImage
                type={product.imageType}
                productId={product.id}
                customImageUrl={product.customImageUrl}
                className="w-full h-full max-h-[210px] object-contain"
                alt={activeReel.title}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1 text-[#C98A6A]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#5A4E38]">
                {activeReel.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#786C57] leading-relaxed">
                {activeReel.transcript}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveReel(null);
                  scrollToTopBuyBox();
                }}
                className="flex-1 py-3 bg-[#E9F399] hover:bg-[#dfeb82] text-[#40563D] border-[1.5px] border-[#7A5C38] text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
              >
                Order {product.name}
              </button>
              <button
                type="button"
                onClick={() => setActiveReel(null)}
                className="px-5 py-3 bg-[#FFFDF9] hover:bg-[#F1EBD9] text-[#5A4E38] border-[1.5px] border-[#7A5C38] text-xs font-semibold uppercase tracking-wider rounded-full cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

