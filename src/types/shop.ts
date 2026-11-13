/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductImageType = 'panjeeri' | 'spicemix' | 'toothpowder';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceAdjustment: number;
  stock: number;
  badge: string;
  description: string;
  colorAccent: string;
  nutritionHighlight: string;
}

export interface ProductPackSize {
  id: string;
  label: string;
  weightMultiplier: number;
  priceMultiplier: number;
  unitWeight: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  category: string;
  imageType: ProductImageType;
  customImageUrl?: string;
  basePrice: number;
  featured: boolean;
  isPublished: boolean;
  story: string;
  description: string;
  packagingSpec: string;
  ingredients: string[];
  usageInstructions: string[];
  faqs: ProductFaq[];
  variants: ProductVariant[];
  packSizes: ProductPackSize[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  packSizeId: string;
  productName: string;
  variantName: string;
  packSizeLabel: string;
  unitPrice: number;
  quantity: number;
  colorAccent?: string;
  sku: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryNotes?: string;
  orderNotes?: string;
  giftMessage?: string;
}

export interface OrderStatusHistoryItem {
  status: string;
  timestamp: string;
  note?: string;
  actor?: string;
}

export type FulfillmentStatus =
  | 'Order Placed'
  | 'Scheduled'
  | 'Confirmed'
  | 'Processing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Pending'
  | 'Awaiting Verification'
  | 'Paid'
  | 'Refunded'
  | 'Failed';

export interface Order {
  orderNumber: string;
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'bank_transfer';
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  bankReference?: string;
  courierName?: string;
  trackingNumber?: string;
  scheduledDate?: string;
  scheduledSlot?: string;
  orderNotes?: string;
  giftMessage?: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface CustomerReview {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  productTag: string;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  isApproved: boolean;
  helpfulCount: number;
}

export interface HeroPillarItem {
  id: string;
  title: string;
  description: string;
}

export interface SpotlightDishItem {
  id: string;
  index: string;
  name: string;
  prepTime: string;
  method: string;
}

export interface CraftPillarItem {
  id: string;
  title: string;
  description: string;
}

export interface GlobalFaqItem {
  id: string;
  q: string;
  a: string;
}

export interface CustomPageSection {
  id: string;
  kicker?: string;
  heading: string;
  body: string;
  bulletPoints: string[];
  ctaText?: string;
  ctaLink?: string;
  theme: 'cream' | 'white' | 'sand' | 'espresso';
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  kicker: string;
  subtitle: string;
  isPublished: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  sections: CustomPageSection[];
  updatedAt: string;
}

export interface WebsiteCopyConfig {
  navCollectionLabel: string;
  navSpiceMixLabel: string;
  navCraftLabel: string;
  navReviewsLabel: string;
  navTrackOrderLabel: string;
  heroKickers: string[];
  heroHeadline: string;
  heroSubheadline?: string;
  heroDescription: string;
  heroBenefits?: string[];
  heroViewProductsCta?: string;
  heroWhatsappCta?: string;
  heroPrimaryCtaPrefix: string;
  heroSecondaryCta: string;
  heroPillars: HeroPillarItem[];
  collectionKicker: string;
  collectionHeading: string;
  collectionDescription: string;
  categoriesKicker?: string;
  categoriesHeading?: string;
  categoriesDescription?: string;
  needsSectionKicker?: string;
  needsSectionHeading?: string;
  whyChooseKicker?: string;
  whyChooseHeading?: string;
  whyChooseDescription?: string;
  storiesKicker?: string;
  storiesHeading?: string;
  storiesDescription?: string;
  finalCtaHeading?: string;
  finalCtaDescription?: string;
  finalCtaPrimaryLabel?: string;
  finalCtaSecondaryLabel?: string;
  showSpiceMixSpotlight: boolean;
  spotlightLeftKicker: string;
  spotlightLeftHeading: string;
  spotlightLeftFooterLeft: string;
  spotlightLeftFooterRight: string;
  spotlightDishes: SpotlightDishItem[];
  spotlightRightKicker: string;
  spotlightRightHeading: string;
  spotlightRightDescription: string;
  craftKicker: string;
  craftHeading: string;
  craftParagraphs: string[];
  craftPillars: CraftPillarItem[];
  reviewsKickerPrefix: string;
  reviewsHeading: string;
  reviewsDescription?: string;
  faqKicker: string;
  faqHeading: string;
  faqDescription?: string;
  faqs: GlobalFaqItem[];
  customHomeSections: CustomPageSection[];
  footerTagline: string;
  footerCollectionHeading: string;
  footerDispatchHeading: string;
  footerBottomRightText: string;
  // Pre-Footer Disclaimer & Store Policies (Editable in Admin Panel)
  disclaimerBadge?: string;
  disclaimerText?: string;
  shippingPolicyText?: string;
  returnsPolicyText?: string;
  privacyPolicyText?: string;
  termsConditionsText?: string;
  // Live Voice Guide Instructions & Knowledge Base (Editable in Admin Panel)
  voiceAgentName?: string;
  voiceWelcomeMessage?: string;
  voiceSystemInstruction?: string;
  voiceKnowledgeBase?: string;
}

export interface StoreSettings {
  businessName: string;
  websiteUrl?: string;
  officialPhone: string;
  supportPhone: string;
  whatsappNumber: string;
  whatsappGreeting: string;
  instagramUrl: string;
  facebookUrl: string;
  announcementText: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  officeAddress: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    instructions: string;
  };
  siteCopy?: WebsiteCopyConfig;
  customPages?: CustomPage[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  savedAddresses: string[];
  provider: 'email' | 'google' | 'outlook';
  passwordHash?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ActiveProductSelectionContext {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  packSizeId: string;
  packSizeLabel: string;
  unitWeight: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

