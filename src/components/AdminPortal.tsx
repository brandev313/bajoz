/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop, calculateVariantPrice, DEFAULT_SITE_COPY } from '../context/ShopContext';
import { ProductImage, OFFICIAL_PRODUCT_IMAGES } from './ProductImage';
import {
  FulfillmentStatus,
  PaymentStatus,
  Product,
  Order,
  CartItem,
  CustomerReview,
  CustomPage,
  CustomPageSection,
  WebsiteCopyConfig,
  CustomerUser,
} from '../types/shop';
import {
  ArrowLeft,
  Upload,
  RotateCcw,
  Check,
  ShieldCheck,
  Lock,
  LogOut,
  Copy,
  UserPlus,
  Trash2,
  KeyRound,
  Plus,
  Edit3,
  Calendar,
  Search,
  Eye,
  FileText,
  Sparkles,
  Package,
  Truck,
  X,
  ExternalLink,
} from 'lucide-react';

interface AuthorizedStaffProfile {
  email: string;
  name: string;
  role: 'Store Director' | 'Operations Manager' | 'Inventory Coordinator';
  addedAt?: string;
}

const ADMIN_SESSION_STORAGE_KEY = 'dtcss_authorized_admin_session_v1';

const FALLBACK_PERSONNEL: Array<AuthorizedStaffProfile & { passwordHash: string }> = [
  {
    email: 'admin@dtcss.pk',
    name: 'DTCSS Store Director',
    role: 'Store Director',
    passwordHash: 'DTCSS-Admin-2026',
    addedAt: '2026-09-01',
  },
  {
    email: 'ops@dtcss.pk',
    name: 'Lahore Fulfillment Lead',
    role: 'Operations Manager',
    passwordHash: 'DTCSS-Ops-2026',
    addedAt: '2026-09-10',
  },
];

const DELIVERY_SLOTS = [
  'Morning (9 AM – 1 PM)',
  'Afternoon (2 PM – 6 PM)',
  'Evening (6 PM – 10 PM)',
  'Priority Same-Day Lahore',
  'Standard Nationwide (2–4 Days)',
];

function createBlankProduct(): Product {
  const stamp = Date.now().toString(36).slice(-4);
  return {
    id: `product-${stamp}`,
    name: 'New BAJOZ Artisanal Creation',
    subtitle: 'Small-Batch · Pure Ingredients · Handcrafted',
    tagline: 'Slow-crafted in Model Town, Lahore with 100% pure natural ingredients.',
    category: 'Panjeeri',
    imageType: 'panjeeri',
    customImageUrl: '/assets/aistudio/image_fee0cd04_a0af1ff4.png',
    basePrice: 1450,
    featured: true,
    isPublished: true,
    packagingSpec: '500g airtight fresh-sealed jar',
    story:
      'Handcrafted in small batches at the BAJOZ Lahore kitchen using ancestral recipes and zero synthetic fillers.',
    description:
      'Prepared fresh in airtight jars for daily household nourishment.',
    ingredients: [
      'Pure Grass-Fed Desi Ghee',
      'Whole Californian Almonds',
      'Crushed Green Cardamom Pods',
    ],
    usageInstructions: [
      'Enjoy 2 tablespoons daily with warm milk or tea.',
      'Store in a cool, dry pantry away from direct moisture.',
    ],
    faqs: [
      {
        question: 'What is the shelf life of this jar?',
        answer:
          'Stays fresh for up to 3 months at room temperature in its airtight jar.',
      },
    ],
    variants: [
      {
        id: `var-${stamp}`,
        name: 'Signature Classic',
        sku: `BZ-${stamp.toUpperCase()}-01`,
        priceAdjustment: 0,
        stock: 30,
        badge: 'Small-Batch Release',
        description: 'Signature slow-roasted recipe.',
        colorAccent: '#D99B26',
        nutritionHighlight: '100% natural, preservative-free nourishment',
      },
    ],
    packSizes: [
      {
        id: 'standard-jar',
        label: '500g Jar',
        weightMultiplier: 1,
        priceMultiplier: 1,
        unitWeight: '500 grams',
      },
    ],
  };
}

function createBlankPage(): CustomPage {
  const stamp = Date.now().toString(36).slice(-4);
  return {
    id: `page-${stamp}`,
    title: 'New BAJOZ Page',
    slug: `new-page-${stamp}`,
    kicker: 'BAJOZ- The House of Naturals · Model Town, Lahore',
    subtitle: 'Enter a compelling introduction for this page.',
    isPublished: true,
    showInHeader: true,
    showInFooter: true,
    updatedAt: new Date().toISOString().split('T')[0],
    sections: [
      {
        id: `sec-${stamp}-1`,
        kicker: 'Artisanal Heritage',
        heading: 'Crafted with uncompromising purity.',
        body: 'Write your full story, wholesale details, or seasonal announcement here. You can add multiple sections, bullet points, and call-to-action buttons below.',
        bulletPoints: [
          '100% pure grass-fed desi ghee & whole dry fruits',
          'Packed in fresh-sealed airtight jars',
        ],
        ctaText: 'Explore BAJOZ Collection',
        ctaLink: '#collection',
        theme: 'white',
      },
    ],
  };
}

export const AdminPortal: React.FC = () => {
  const {
    products,
    orders,
    reviews,
    settings,
    siteCopy,
    customPages,
    user,
    setCurrentView,
    setActivePageSlug,
    setIsTrackingOpen,
    setTrackingOrderQuery,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock,
    updateProductCustomImage,
    createManualAdminOrder,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrderShipping,
    scheduleOrder,
    updateOrderDetails,
    deleteOrder,
    addCustomerReview,
    updateReview,
    approveReview,
    deleteReview,
    updateStoreSettings,
    updateSiteCopy,
    upsertCustomPage,
    deleteCustomPage,
    registeredUsers,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
  } = useShop();

  // Authentication State for Authorized Personnel Only
  const [adminStaff, setAdminStaff] = useState<AuthorizedStaffProfile | null>(null);
  const [adminToken, setAdminToken] = useState<string>('');
  const [personnelList, setPersonnelList] = useState<AuthorizedStaffProfile[]>(
    FALLBACK_PERSONNEL.map(({ passwordHash: _p, ...rest }) => rest)
  );
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Main Console Tabs
  const [activeTab, setActiveTab] = useState<
    'orders' | 'products' | 'pages' | 'cms' | 'users' | 'reviews' | 'settings' | 'security'
  >('orders');

  // ============================================================================
  // CUSTOMER USER ACCOUNTS TAB STATE (Full CRUD)
  // ============================================================================
  const [userSearch, setUserSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);
  const [isNewCustomerMode, setIsNewCustomerMode] = useState(false);
  const [newCustomerAddressDraft, setNewCustomerAddressDraft] = useState('');

  // Toast / Feedback Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // ============================================================================
  // ORDERS TAB STATE (Search, Filter, Manual Booking, Scheduling, Tracking, Edit)
  // ============================================================================
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(
    null
  );
  const [newMilestoneNote, setNewMilestoneNote] = useState('');
  const [schedulingOrderNum, setSchedulingOrderNum] = useState<string | null>(null);
  const [scheduleDateDraft, setScheduleDateDraft] = useState('');
  const [scheduleSlotDraft, setScheduleSlotDraft] = useState(DELIVERY_SLOTS[0]);
  const [courierDraftOrder, setCourierDraftOrder] = useState<string | null>(null);
  const [courierName, setCourierName] = useState('Trax Logistics');
  const [trackingNo, setTrackingNo] = useState('');

  // Manual Order Booking Form State
  const [manualCustName, setManualCustName] = useState('');
  const [manualCustPhone, setManualCustPhone] = useState('');
  const [manualCustEmail, setManualCustEmail] = useState('');
  const [manualCustCity, setManualCustCity] = useState('Lahore');
  const [manualCustAddress, setManualCustAddress] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualGiftMsg, setManualGiftMsg] = useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<
    'cod' | 'bank_transfer'
  >('cod');
  const [manualPaymentStatus, setManualPaymentStatus] =
    useState<PaymentStatus>('Pending');
  const [manualFulfillmentStatus, setManualFulfillmentStatus] =
    useState<FulfillmentStatus>('Confirmed');
  const [manualScheduledDate, setManualScheduledDate] = useState('');
  const [manualScheduledSlot, setManualScheduledSlot] = useState(DELIVERY_SLOTS[0]);
  const [manualCourier, setManualCourier] = useState('');
  const [manualTracking, setManualTracking] = useState('');
  const [manualItems, setManualItems] = useState<CartItem[]>([]);
  const [pickerProductId, setPickerProductId] = useState(products[0]?.id || 'panjeeri');
  const [pickerVariantId, setPickerVariantId] = useState(
    products[0]?.variants[0]?.id || ''
  );
  const [pickerPackId, setPickerPackId] = useState(
    products[0]?.packSizes[0]?.id || ''
  );
  const [pickerQty, setPickerQty] = useState(1);

  // ============================================================================
  // PRODUCTS TAB STATE (Quick Edit + Full Product Editor Modal + Create + Delete)
  // ============================================================================
  const [editingStockKey, setEditingStockKey] = useState<string | null>(null);
  const [stockDraft, setStockDraft] = useState(0);
  const [editingPriceProductId, setEditingPriceProductId] = useState<string | null>(
    null
  );
  const [priceDraft, setPriceDraft] = useState(0);
  const [productEditorDraft, setProductEditorDraft] = useState<Product | null>(null);
  const [isNewProductMode, setIsNewProductMode] = useState(false);

  // ============================================================================
  // WEBSITE PAGES TAB STATE (Create, Edit, Delete Custom Pages & Sections)
  // ============================================================================
  const [editingPageDraft, setEditingPageDraft] = useState<CustomPage | null>(null);

  // ============================================================================
  // WEBSITE CONTENT / COPY CMS TAB STATE
  // ============================================================================
  const [copyDraft, setCopyDraft] = useState<WebsiteCopyConfig>(siteCopy);
  const [cmsSubTab, setCmsSubTab] = useState<
    'hero' | 'collection_spicemix' | 'craft_home' | 'faqs_footer' | 'policies_voice'
  >('hero');

  // ============================================================================
  // REVIEWS TAB STATE (Create, Edit, Delete Reviews)
  // ============================================================================
  const [editingReviewDraft, setEditingReviewDraft] =
    useState<CustomerReview | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRevName, setNewRevName] = useState('');
  const [newRevCity, setNewRevCity] = useState('Lahore');
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevProductTag, setNewRevProductTag] = useState('Ghar Ki Panjeeri');
  const [newRevTitle, setNewRevTitle] = useState('');
  const [newRevComment, setNewRevComment] = useState('');

  // ============================================================================
  // SETTINGS & SECURITY STATE
  // ============================================================================
  const [settingsDraft, setSettingsDraft] = useState(settings);
  const [copiedUrlBanner, setCopiedUrlBanner] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<
    'Store Director' | 'Operations Manager' | 'Inventory Coordinator'
  >('Operations Manager');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [securityFeedback, setSecurityFeedback] = useState<string | null>(null);

  const dedicatedAdminUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/admin`
      : 'https://bajoz.pk/admin';

  // Verify existing admin session or authorized Supabase session on mount
  useEffect(() => {
    let mounted = true;
    const verifyAccess = async () => {
      try {
        const savedRaw = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
        const saved = savedRaw ? JSON.parse(savedRaw) : null;

        const res = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: saved?.token || '',
            supabaseEmail: user?.email || '',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (mounted && data.ok && data.staff) {
            setAdminStaff(data.staff);
            const activeTok = data.token || saved?.token || '';
            setAdminToken(activeTok);
            if (Array.isArray(data.personnel)) {
              setPersonnelList(data.personnel);
            }
            sessionStorage.setItem(
              ADMIN_SESSION_STORAGE_KEY,
              JSON.stringify({ token: activeTok, staff: data.staff })
            );
            setIsVerifyingSession(false);
            return;
          }
        } else if (saved?.staff && saved?.token?.startsWith('local_adm_')) {
          if (mounted) {
            setAdminStaff(saved.staff);
            setAdminToken(saved.token);
            setIsVerifyingSession(false);
            return;
          }
        }
      } catch {
        const savedRaw = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
        if (savedRaw) {
          try {
            const saved = JSON.parse(savedRaw);
            if (saved?.staff && mounted) {
              setAdminStaff(saved.staff);
              setAdminToken(saved.token || '');
            }
          } catch {
            // ignore
          }
        }
      }
      if (mounted) {
        setIsVerifyingSession(false);
      }
    };

    void verifyAccess();
    return () => {
      mounted = false;
    };
  }, [user?.email]);

  useEffect(() => {
    setSettingsDraft(settings);
  }, [settings]);

  useEffect(() => {
    setCopyDraft(siteCopy);
  }, [siteCopy]);

  // Keep selectedOrderForDetail synced with latest orders state
  useEffect(() => {
    if (selectedOrderForDetail) {
      const updated = orders.find(
        (o) => o.orderNumber === selectedOrderForDetail.orderNumber
      );
      if (updated) {
        setSelectedOrderForDetail(updated);
      } else {
        setSelectedOrderForDetail(null);
      }
    }
  }, [orders]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json();
      if (res.ok && data.ok && data.staff) {
        setAdminStaff(data.staff);
        setAdminToken(data.token);
        if (Array.isArray(data.personnel)) {
          setPersonnelList(data.personnel);
        }
        sessionStorage.setItem(
          ADMIN_SESSION_STORAGE_KEY,
          JSON.stringify({ token: data.token, staff: data.staff })
        );
        setLoginPassword('');
        return;
      }

      setLoginError(
        data.message ||
          'Unauthorized credentials. Only designated DTCSS personnel may sign in.'
      );
    } catch {
      const fallbackMatch = FALLBACK_PERSONNEL.find(
        (p) =>
          p.email.toLowerCase() === cleanEmail && p.passwordHash === cleanPassword
      );
      if (fallbackMatch) {
        const staffProfile: AuthorizedStaffProfile = {
          email: fallbackMatch.email,
          name: fallbackMatch.name,
          role: fallbackMatch.role,
          addedAt: fallbackMatch.addedAt,
        };
        const tok = `local_adm_${Date.now()}`;
        setAdminStaff(staffProfile);
        setAdminToken(tok);
        sessionStorage.setItem(
          ADMIN_SESSION_STORAGE_KEY,
          JSON.stringify({ token: tok, staff: staffProfile })
        );
        setLoginPassword('');
      } else {
        setLoginError(
          'Access denied. Invalid staff email or security key. Only authorized DTCSS personnel can sign in.'
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    setAdminStaff(null);
    setAdminToken('');
    setLoginEmail('');
    setLoginPassword('');
    setLoginError(null);
  };

  const handleCopyAdminUrl = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(dedicatedAdminUrl);
      setCopiedUrlBanner(true);
      setTimeout(() => setCopiedUrlBanner(false), 2500);
    }
  };

  const handleAddOrUpdatePersonnel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail.trim() || !newStaffPassword.trim()) return;
    try {
      const res = await fetch('/api/admin/personnel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          action: 'upsert',
          staffMember: {
            email: newStaffEmail.trim().toLowerCase(),
            name: newStaffName.trim() || 'DTCSS Authorized Staff',
            role: newStaffRole,
            passwordHash: newStaffPassword.trim(),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.personnel)) {
          setPersonnelList(data.personnel);
        }
        setSecurityFeedback(
          `Authorized credentials updated for ${newStaffEmail.trim().toLowerCase()}.`
        );
        setNewStaffEmail('');
        setNewStaffName('');
        setNewStaffPassword('');
        setTimeout(() => setSecurityFeedback(null), 3500);
      }
    } catch {
      setSecurityFeedback('Could not update personnel list right now.');
    }
  };

  const handleRemovePersonnel = async (emailToRemove: string) => {
    if (personnelList.length <= 1) {
      setSecurityFeedback('At least one authorized director must remain active.');
      return;
    }
    try {
      const res = await fetch('/api/admin/personnel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          action: 'remove',
          emailToRemove,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.personnel)) {
          setPersonnelList(data.personnel);
        }
        setSecurityFeedback(`Revoked portal access for ${emailToRemove}.`);
        setTimeout(() => setSecurityFeedback(null), 3000);
      }
    } catch {
      // ignore
    }
  };

  const totalRevenue = orders
    .filter((o) => o.fulfillmentStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const handleImageFileUpload = (productId: string, file: File | undefined) => {
    if (!file || !adminStaff) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProductCustomImage(productId, reader.result);
        showToast('Updated product photograph.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDraftImageFileUpload = (file: File | undefined) => {
    if (!file || !productEditorDraft) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductEditorDraft({
          ...productEditorDraft,
          customImageUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Manual Order Line Item Helper
  const handleAddLineItemToManualOrder = () => {
    const prod = products.find((p) => p.id === pickerProductId) || products[0];
    if (!prod) return;
    const variant =
      prod.variants.find((v) => v.id === pickerVariantId) || prod.variants[0];
    const pack =
      prod.packSizes.find((pk) => pk.id === pickerPackId) || prod.packSizes[0];
    const unitPrice = calculateVariantPrice(
      prod.basePrice,
      variant?.priceAdjustment || 0,
      pack?.priceMultiplier || 1
    );
    const itemId = `${prod.id}-${variant?.id || 'default'}-${pack?.id || 'default'}`;

    setManualItems((prev) => {
      const existing = prev.findIndex((i) => i.id === itemId);
      if (existing > -1) {
        const next = [...prev];
        next[existing] = {
          ...next[existing],
          quantity: next[existing].quantity + Math.max(1, pickerQty),
        };
        return next;
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: prod.id,
          variantId: variant?.id || 'default',
          packSizeId: pack?.id || 'default',
          productName: prod.name,
          variantName: variant?.name || prod.name,
          packSizeLabel: pack?.label || '',
          unitPrice,
          quantity: Math.max(1, pickerQty),
          colorAccent: variant?.colorAccent,
          sku: variant?.sku || 'DT-SKU',
        },
      ];
    });
  };

  const handleSubmitManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustName.trim() || !manualCustPhone.trim() || manualItems.length === 0) {
      return;
    }
    const created = createManualAdminOrder({
      customer: {
        name: manualCustName.trim(),
        phone: manualCustPhone.trim(),
        email: manualCustEmail.trim() || 'walkin@dtcss.pk',
        city: manualCustCity.trim() || 'Lahore',
        address: manualCustAddress.trim() || 'Lahore Doorstep Delivery',
        deliveryNotes: manualNotes.trim(),
        orderNotes: manualNotes.trim(),
        giftMessage: manualGiftMsg.trim(),
      },
      items: manualItems,
      paymentMethod: manualPaymentMethod,
      paymentStatus: manualPaymentStatus,
      fulfillmentStatus: manualScheduledDate
        ? 'Scheduled'
        : manualFulfillmentStatus,
      scheduledDate: manualScheduledDate || undefined,
      scheduledSlot: manualScheduledDate ? manualScheduledSlot : undefined,
      courierName: manualCourier.trim() || undefined,
      trackingNumber: manualTracking.trim() || undefined,
      orderNotes: manualNotes.trim() || undefined,
      giftMessage: manualGiftMsg.trim() || undefined,
      actor: `${adminStaff?.name} (${adminStaff?.role})`,
    });

    setIsBookingModalOpen(false);
    setManualCustName('');
    setManualCustPhone('');
    setManualCustEmail('');
    setManualCustAddress('');
    setManualNotes('');
    setManualGiftMsg('');
    setManualScheduledDate('');
    setManualCourier('');
    setManualTracking('');
    setManualItems([]);
    showToast(`Booked Order #${created.orderNumber} successfully.`);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'All' && o.fulfillmentStatus !== orderStatusFilter) {
      return false;
    }
    if (!orderSearch.trim()) return true;
    const q = orderSearch.trim().toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.city.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  });

  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-[#F6EBC8] text-[#2C221E] flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <p className="font-serif text-2xl tracking-wider uppercase text-[#4A5D23] font-bold">
            BAJOZ — The House of Naturals · Authorized Portal
          </p>
          <p className="text-xs text-[#655549] font-mono">
            Verifying security credentials...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RESTRICTED GATE: Only Authorized Personnel Can Log In and Make Changes
  // ============================================================================
  if (!adminStaff) {
    return (
      <div className="min-h-screen bg-[#F6EBC8] text-[#2C221E] flex flex-col justify-between">
        <header className="w-full bg-[#F6EBC8] border-b border-[#2C221E]/8 py-4 px-4 sm:px-8">
          <div className="max-w-5xl w-full mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.14em] text-[#4A5D23]">
                {settings.businessName || 'BAJOZ- The House of Naturals'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#DCE6C8] text-[#4A5D23] border border-[#4A5D23]/25">
                Restricted Admin URL · /admin
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('store')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Storefront</span>
            </button>
          </div>
        </header>

        <main className="max-w-md w-[calc(100%-2rem)] sm:w-full mx-auto my-6 sm:my-8 bg-[#F6EBC8] text-[#2C221E] rounded-3xl p-5 sm:p-8 shadow-xl border border-[#4A5D23]/20 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#4A5D23] text-[#F5EFDC] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#4A5D23] font-semibold">
              Authorized Personnel Only
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#2C221E]">
              BAJOZ Management Portal
            </h1>
            <p className="text-xs text-[#655549] leading-relaxed">
              This portal is unlinked from the public BAJOZ storefront and accessible
              only via its dedicated URL (
              <span className="font-mono text-[#2C221E]">/admin</span>). Sign in with
              your Director or Manager credentials to manage products, orders, pages,
              and site-wide copy.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-[#FEE2E2] border border-[#991B1B]/20 text-[#991B1B] rounded-xl text-xs font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] mb-1">
                Authorized Staff Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@dtcss.pk"
                className="w-full px-3.5 py-2.5 bg-white border border-[#2C221E]/20 rounded-xl text-xs focus:outline-none focus:border-[#4A5D23]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C221E] mb-1">
                Security Key / Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-[#2C221E]/20 rounded-xl text-xs font-mono focus:outline-none focus:border-[#4A5D23]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn
                ? 'Verifying Authorization...'
                : 'Authenticate & Unlock Console'}
            </button>
          </form>

          {/* Store Owner Quick-Fill Helper for Authorised Credentials */}
          <div className="pt-4 border-t border-[#2C221E]/10 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2C221E] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#4A5D23]" />
                <span>Authorized Personnel Credentials</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@dtcss.pk');
                    setLoginPassword('DTCSS-Admin-2026');
                    setLoginError(null);
                  }}
                  className="text-[11px] font-semibold text-[#4A5D23] hover:underline cursor-pointer"
                >
                  Fill Director
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('ops@dtcss.pk');
                    setLoginPassword('DTCSS-Ops-2026');
                    setLoginError(null);
                  }}
                  className="text-[11px] font-semibold text-[#4A5D23] hover:underline cursor-pointer"
                >
                  Fill Manager
                </button>
              </div>
            </div>
            <div className="p-3 bg-[#DCE6C8]/65 rounded-xl font-mono text-[11px] text-[#655549] space-y-1">
              <div>
                <span className="text-[#2C221E] font-semibold">Director:</span>{' '}
                admin@dtcss.pk / DTCSS-Admin-2026
              </div>
              <div>
                <span className="text-[#2C221E] font-semibold">Manager:</span>{' '}
                ops@dtcss.pk / DTCSS-Ops-2026
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full bg-[#F6EBC8] border-t border-[#2C221E]/8 py-5 px-4 text-center text-[11px] text-[#655549] font-mono">
          BAJOZ — The House of Naturals · Internal Management Endpoint (/admin)
        </footer>
      </div>
    );
  }

  // ============================================================================
  // AUTHENTICATED CONSOLE: Directors & Managers Full Control
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#F6EBC8] text-[#2C221E] flex flex-col">
      {/* Admin Top Bar matching #F5EFDC Nav Bar */}
      <header className="bg-[#F6EBC8] text-[#2C221E] border-b border-[#2C221E]/8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('store')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] text-xs font-semibold rounded-full cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Storefront</span>
            </button>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#4A5D23]">
              BAJOZ — Executive Admin
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#DCE6C8] text-[#2C221E] border border-[#4A5D23]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4A5D23]" />
              <span>
                {adminStaff.name} ({adminStaff.role})
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={handleCopyAdminUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DCE6C8] hover:bg-[#E9F490] text-[#2C221E] rounded-lg font-mono text-[11px] cursor-pointer transition-colors border border-[#4A5D23]/15"
              title="Copy dedicated Admin Portal URL"
            >
              <Copy className="w-3.5 h-3.5 text-[#4A5D23]" />
              <span>
                {copiedUrlBanner ? 'Copied /admin!' : 'URL: /admin'}
              </span>
            </button>

            <span className="hidden md:inline text-[#655549] font-mono font-semibold">
              PKR {totalRevenue.toLocaleString()} · {orders.length} Orders ·{' '}
              {products.length} Products
            </span>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 z-50 bg-[#2C221E] text-[#F5EFDC] border border-[#D99B26] px-4 sm:px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold">
          <Check className="w-4 h-4 text-[#D99B26] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-[#DCE6C8]/75 border-b border-[#4A5D23]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-5 text-xs font-semibold text-[#655549] overflow-x-auto">
          {[
            { id: 'orders', label: `Orders, Schedule & Dispatch (${orders.length})` },
            { id: 'products', label: `Products Catalog (${products.length})` },
            { id: 'pages', label: `Website Pages (${customPages.length})` },
            { id: 'cms', label: 'Website Copy & Content CMS' },
            { id: 'users', label: `User Accounts (${registeredUsers.length})` },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
            { id: 'settings', label: 'Store & Bank Settings' },
            {
              id: 'security',
              label: `Staff & Portal URL (${personnelList.length})`,
            },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'border-[#4A5D23] text-[#2C221E]'
                  : 'border-transparent hover:text-[#2C221E]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl w-full flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===================================================================
            TAB 1: ORDERS — BOOK, TRACK, SCHEDULE, UPDATE & DELETE
            =================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[220px] max-w-md">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order ID, customer, phone, city, tracking..."
                    className="w-full pl-9 pr-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-[#655549] absolute left-3 top-2.5" />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl text-xs font-semibold"
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPickerProductId(products[0]?.id || '');
                    setPickerVariantId(products[0]?.variants[0]?.id || '');
                    setPickerPackId(products[0]?.packSizes[0]?.id || '');
                    setIsBookingModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Manual Order</span>
                </button>
              </div>
            </div>

            {/* Orders Table & Mobile Cards */}
            <div className="bg-white rounded-2xl border border-[#2C221E]/8 overflow-hidden">
              {/* Mobile Order Cards (< md) */}
              <div className="md:hidden divide-y divide-[#2C221E]/10">
                {filteredOrders.map((o) => (
                  <div key={o.orderNumber} className="p-4 space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#2C221E] block">
                          #{o.orderNumber}
                        </span>
                        <span className="text-[11px] text-[#655549]">
                          {new Date(o.date).toLocaleDateString()} · {o.customer.name} ({o.customer.city})
                        </span>
                        <span className="text-[11px] text-[#655549] block font-mono">
                          {o.customer.phone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#2C221E] block tabular-nums">
                          PKR {o.total.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#4A5D23]">
                          {o.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F6EBC8]/70 space-y-1">
                      {o.items.map((i) => (
                        <div key={i.id} className="text-[11px] text-[#2C221E]">
                          • {i.productName} ({i.variantName}) ×{i.quantity}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#655549] mb-1">
                          Payment
                        </label>
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => {
                            updatePaymentStatus(
                              o.orderNumber,
                              e.target.value as PaymentStatus,
                              undefined,
                              adminStaff.name
                            );
                            showToast(
                              `Order #${o.orderNumber} payment marked ${e.target.value}.`
                            );
                          }}
                          className="w-full px-2.5 py-1.5 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-lg text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Awaiting Verification">Awaiting Proof</option>
                          <option value="Paid">Paid</option>
                          <option value="Refunded">Refunded</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#655549] mb-1">
                          Fulfillment
                        </label>
                        <select
                          value={o.fulfillmentStatus}
                          onChange={(e) => {
                            updateOrderStatus(
                              o.orderNumber,
                              e.target.value as FulfillmentStatus,
                              undefined,
                              adminStaff.name
                            );
                            showToast(
                              `Order #${o.orderNumber} status updated to ${e.target.value}.`
                            );
                          }}
                          className="w-full px-2.5 py-1.5 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-lg text-xs font-semibold"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="text-[11px] text-[#655549]">
                        {o.trackingNumber ? (
                          <span>
                            Courier: <strong className="text-[#2C221E]">{o.courierName}</strong> ({o.trackingNumber})
                          </span>
                        ) : o.scheduledDate ? (
                          <span>
                            Scheduled: <strong className="text-[#4A5D23]">{o.scheduledDate}</strong>
                          </span>
                        ) : (
                          <span>No courier assigned yet</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForDetail(o)}
                          className="px-3 py-1.5 bg-[#F2ECE1] hover:bg-[#E6ECD8] text-[#2C221E] rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Manage / Track
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteOrder(o.orderNumber);
                            showToast(`Deleted Order #${o.orderNumber}.`);
                          }}
                          className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2ECE1] text-[#655549] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer & Address</th>
                      <th className="py-3.5 px-4">Items & Total</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Fulfillment</th>
                      <th className="py-3.5 px-4">Schedule Dispatch</th>
                      <th className="py-3.5 px-4">Courier Tracking</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C221E]/8">
                    {filteredOrders.map((o) => (
                      <tr key={o.orderNumber} className="hover:bg-[#F6EBC8]/60 align-top">
                        <td className="py-4 px-4 font-mono">
                          <span className="font-bold text-sm text-[#2C221E] block">
                            #{o.orderNumber}
                          </span>
                          <span className="text-[10px] text-[#655549]">
                            {new Date(o.date).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-4 px-4 max-w-[200px]">
                          <span className="font-semibold block text-[#2C221E]">
                            {o.customer.name}
                          </span>
                          <span className="text-[#655549] block">
                            {o.customer.city} · {o.customer.phone}
                          </span>
                          <span className="text-[11px] text-[#655549] line-clamp-1">
                            {o.customer.address}
                          </span>
                        </td>

                        <td className="py-4 px-4 max-w-xs">
                          <div className="space-y-0.5">
                            {o.items.map((i) => (
                              <div key={i.id} className="text-[11px]">
                                {i.productName} ({i.variantName}) ×{i.quantity}
                              </div>
                            ))}
                          </div>
                          <div className="font-mono font-bold text-[#2C221E] mt-1 tabular-nums">
                            PKR {o.total.toLocaleString()} ({o.paymentMethod.toUpperCase()})
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => {
                              updatePaymentStatus(
                                o.orderNumber,
                                e.target.value as PaymentStatus,
                                undefined,
                                adminStaff.name
                              );
                              showToast(
                                `Order #${o.orderNumber} payment marked ${e.target.value}.`
                              );
                            }}
                            className="px-2.5 py-1.5 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-lg text-xs"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Awaiting Verification">Awaiting Proof</option>
                            <option value="Paid">Paid</option>
                            <option value="Refunded">Refunded</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={o.fulfillmentStatus}
                            onChange={(e) => {
                              updateOrderStatus(
                                o.orderNumber,
                                e.target.value as FulfillmentStatus,
                                undefined,
                                adminStaff.name
                              );
                              showToast(
                                `Order #${o.orderNumber} status updated to ${e.target.value}.`
                              );
                            }}
                            className="px-2.5 py-1.5 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-lg text-xs font-semibold"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Schedule Order Column */}
                        <td className="py-4 px-4">
                          {schedulingOrderNum === o.orderNumber ? (
                            <div className="space-y-1.5 min-w-[165px]">
                              <input
                                type="date"
                                value={scheduleDateDraft}
                                onChange={(e) => setScheduleDateDraft(e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-[#2C221E]/20 rounded text-[11px] font-mono"
                              />
                              <select
                                value={scheduleSlotDraft}
                                onChange={(e) => setScheduleSlotDraft(e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-[#2C221E]/20 rounded text-[11px]"
                              >
                                {DELIVERY_SLOTS.map((sl) => (
                                  <option key={sl} value={sl}>
                                    {sl}
                                  </option>
                                ))}
                              </select>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (scheduleDateDraft) {
                                      scheduleOrder(
                                        o.orderNumber,
                                        scheduleDateDraft,
                                        scheduleSlotDraft,
                                        undefined,
                                        adminStaff.name
                                      );
                                      showToast(
                                        `Order #${o.orderNumber} scheduled for ${scheduleDateDraft}.`
                                      );
                                    }
                                    setSchedulingOrderNum(null);
                                  }}
                                  className="px-2 py-1 bg-[#4A5D23] text-white rounded text-[10px] font-semibold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSchedulingOrderNum(null)}
                                  className="px-2 py-1 bg-[#F2ECE1] text-[#2C221E] rounded text-[10px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : o.scheduledDate ? (
                            <div className="space-y-0.5">
                              <span className="font-mono font-semibold text-[#4A5D23] block text-[11px]">
                                {o.scheduledDate}
                              </span>
                              <span className="text-[10px] text-[#655549] block">
                                {o.scheduledSlot}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSchedulingOrderNum(o.orderNumber);
                                  setScheduleDateDraft(o.scheduledDate || '');
                                  setScheduleSlotDraft(
                                    o.scheduledSlot || DELIVERY_SLOTS[0]
                                  );
                                }}
                                className="text-[10px] text-[#4A5D23] underline cursor-pointer"
                              >
                                Reschedule
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSchedulingOrderNum(o.orderNumber);
                                setScheduleDateDraft(
                                  new Date(Date.now() + 86400000)
                                    .toISOString()
                                    .split('T')[0]
                                );
                                setScheduleSlotDraft(DELIVERY_SLOTS[0]);
                              }}
                              className="inline-flex items-center gap-1 text-[#4A5D23] font-semibold hover:underline cursor-pointer text-[11px]"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>+ Schedule</span>
                            </button>
                          )}
                        </td>

                        {/* Courier & Tracking Column */}
                        <td className="py-4 px-4">
                          {courierDraftOrder === o.orderNumber ? (
                            <div className="space-y-1.5 min-w-[150px]">
                              <input
                                type="text"
                                value={courierName}
                                onChange={(e) => setCourierName(e.target.value)}
                                placeholder="Courier Name"
                                className="w-full px-2 py-1 bg-white border border-[#2C221E]/20 rounded text-[11px]"
                              />
                              <input
                                type="text"
                                value={trackingNo}
                                onChange={(e) => setTrackingNo(e.target.value)}
                                placeholder="Tracking #"
                                className="w-full px-2 py-1 bg-white border border-[#2C221E]/20 rounded text-[11px] font-mono"
                              />
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (trackingNo.trim()) {
                                      updateOrderShipping(
                                        o.orderNumber,
                                        courierName.trim() || 'Trax Logistics',
                                        trackingNo.trim(),
                                        adminStaff.name
                                      );
                                      showToast(
                                        `Assigned tracking #${trackingNo.trim()} to #${o.orderNumber}.`
                                      );
                                    }
                                    setCourierDraftOrder(null);
                                    setTrackingNo('');
                                  }}
                                  className="px-2 py-1 bg-[#4A5D23] text-white rounded text-[10px] font-semibold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCourierDraftOrder(null)}
                                  className="px-2 py-1 bg-[#F2ECE1] text-[#2C221E] rounded text-[10px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : o.trackingNumber ? (
                            <div>
                              <span className="font-semibold block">{o.courierName}</span>
                              <span className="font-mono text-[#655549] block text-[11px]">
                                {o.trackingNumber}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setCourierDraftOrder(o.orderNumber);
                                  setCourierName(o.courierName || 'Trax Logistics');
                                  setTrackingNo(o.trackingNumber || '');
                                }}
                                className="text-[10px] text-[#4A5D23] underline cursor-pointer"
                              >
                                Edit Tracking
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setCourierDraftOrder(o.orderNumber);
                                setCourierName('Trax Logistics');
                                setTrackingNo('');
                              }}
                              className="inline-flex items-center gap-1 text-[#4A5D23] font-semibold hover:underline cursor-pointer text-[11px]"
                            >
                              <Truck className="w-3 h-3" />
                              <span>+ Assign Courier</span>
                            </button>
                          )}
                        </td>

                        {/* Actions Column: Track/Inspect + Delete */}
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForDetail(o)}
                              className="px-2.5 py-1.5 bg-[#F2ECE1] hover:bg-[#E6ECD8] text-[#2C221E] rounded-lg text-[11px] font-semibold cursor-pointer"
                              title="Inspect, Track & Edit Order Details"
                            >
                              Manage / Track
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deleteOrder(o.orderNumber);
                                showToast(`Deleted Order #${o.orderNumber}.`);
                              }}
                              className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: PRODUCTS — ADD NEW, EDIT EVERY DETAIL & DELETE ANY PRODUCT
            =================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
                  DTCSS Product Catalog ({products.length} Products)
                </h2>
                <p className="text-xs text-[#655549]">
                  Add new products, edit every detail (variants, pack sizes, ingredients,
                  ritual steps, FAQs, photos, story), or remove any product.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsNewProductMode(true);
                  setProductEditorDraft(createBlankProduct());
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {products.map((prod) => {
              const defaultOfficialUrl =
                OFFICIAL_PRODUCT_IMAGES[prod.imageType]?.src ||
                OFFICIAL_PRODUCT_IMAGES.panjeeri.src;
              const isEditingPrice = editingPriceProductId === prod.id;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl p-6 border border-[#2C221E]/8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                >
                  <div className="lg:col-span-3 flex flex-col items-center gap-3">
                    <div className="w-40 h-40 bg-[#F6EBC8] rounded-2xl p-3 flex items-center justify-center border border-[#2C221E]/8">
                      <ProductImage
                        type={prod.imageType}
                        productId={prod.id}
                        customImageUrl={prod.customImageUrl}
                        className="w-full h-full"
                        alt={prod.name}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2ECE1] hover:bg-[#E6ECD8] text-[#2C221E] rounded-lg text-[11px] font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageFileUpload(prod.id, e.target.files?.[0])
                          }
                          className="hidden"
                        />
                      </label>
                      {prod.customImageUrl &&
                        prod.customImageUrl !== defaultOfficialUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              updateProductCustomImage(prod.id, defaultOfficialUrl)
                            }
                            className="p-1.5 text-[#655549] hover:text-[#2C221E] cursor-pointer"
                            title="Restore official product photo"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                    </div>
                  </div>

                  <div className="lg:col-span-9 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#2C221E]/8 pb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-2xl font-semibold">
                            {prod.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F2ECE1] text-[#655549]">
                            {prod.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              updateProduct({
                                ...prod,
                                isPublished: !prod.isPublished,
                              });
                              showToast(
                                `${prod.name} is now ${
                                  !prod.isPublished ? 'Published' : 'Hidden'
                                }.`
                              );
                            }}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                              prod.isPublished
                                ? 'bg-[#E6ECD8] text-[#4A5D23]'
                                : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}
                          >
                            {prod.isPublished ? 'Published (Live)' : 'Hidden Draft'}
                          </button>
                        </div>
                        <p className="text-xs text-[#655549] mt-0.5">
                          {prod.subtitle} · {prod.packagingSpec}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono">PKR</span>
                            <input
                              type="number"
                              min="50"
                              value={priceDraft}
                              onChange={(e) =>
                                setPriceDraft(parseInt(e.target.value) || 0)
                              }
                              className="w-24 px-2.5 py-1 bg-[#F6EBC8] border border-[#2C221E]/20 rounded-lg text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (priceDraft > 0) {
                                  updateProduct({
                                    ...prod,
                                    basePrice: priceDraft,
                                  });
                                  showToast(`Updated base price for ${prod.name}.`);
                                }
                                setEditingPriceProductId(null);
                              }}
                              className="px-2.5 py-1 bg-[#4A5D23] text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPriceProductId(prod.id);
                              setPriceDraft(prod.basePrice);
                            }}
                            className="font-serif text-lg font-bold tabular-nums hover:text-[#4A5D23] cursor-pointer mr-2"
                          >
                            Base: PKR {prod.basePrice.toLocaleString()}{' '}
                            <span className="text-xs font-sans font-semibold text-[#4A5D23] underline">
                              (Quick Price)
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsNewProductMode(false);
                            setProductEditorDraft(JSON.parse(JSON.stringify(prod)));
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2C221E] hover:bg-[#3E312B] text-[#F5EFDC] rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#D99B26]" />
                          <span>Edit Every Detail</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            deleteProduct(prod.id);
                            showToast(`Deleted product "${prod.name}".`);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] rounded-xl text-xs font-semibold cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {prod.variants.map((v) => {
                        const key = `${prod.id}-${v.id}`;
                        const isEditing = editingStockKey === key;
                        return (
                          <div
                            key={v.id}
                            className="p-3.5 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/8 space-y-1.5 text-xs"
                          >
                            <div className="font-semibold text-[#2C221E] flex justify-between">
                              <span>{v.name}</span>
                              {v.priceAdjustment > 0 && (
                                <span className="font-mono text-[10px] text-[#4A5D23]">
                                  +PKR {v.priceAdjustment}
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[11px] text-[#655549]">
                              SKU: {v.sku}
                            </div>
                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-[#655549]">Stock:</span>
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    value={stockDraft}
                                    onChange={(e) =>
                                      setStockDraft(parseInt(e.target.value) || 0)
                                    }
                                    className="w-16 px-2 py-1 bg-white border border-[#2C221E]/20 rounded text-xs font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateVariantStock(
                                        prod.id,
                                        v.id,
                                        stockDraft
                                      );
                                      setEditingStockKey(null);
                                      showToast(`Stock updated for ${v.name}.`);
                                    }}
                                    className="p-1 bg-[#4A5D23] text-white rounded cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingStockKey(key);
                                    setStockDraft(v.stock);
                                  }}
                                  className="font-mono font-bold text-[#4A5D23] hover:underline cursor-pointer"
                                >
                                  {v.stock} jars (Edit)
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================
            TAB 3: WEBSITE PAGES — CREATE, UPDATE & DELETE CUSTOM PAGES
            =================================================================== */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
                  Website Pages Manager ({customPages.length} Pages)
                </h2>
                <p className="text-xs text-[#655549]">
                  Create new standalone pages for DTCSS (e.g., Corporate Gifting, Wholesale,
                  Lab Purity, Winter Campaigns), link them in the Header or Footer, and
                  customize their content sections.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPageDraft(createBlankPage())}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Page</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customPages.map((pg) => (
                <div
                  key={pg.id}
                  className="bg-white rounded-2xl p-6 border border-[#2C221E]/8 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-[#4A5D23] bg-[#E6ECD8] px-2.5 py-0.5 rounded-full">
                        /page/{pg.slug}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            pg.isPublished
                              ? 'bg-[#E6ECD8] text-[#4A5D23]'
                              : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}
                        >
                          {pg.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {pg.showInHeader && (
                          <span className="px-2 py-0.5 rounded bg-[#F2ECE1] text-[#2C221E]">
                            In Header
                          </span>
                        )}
                        {pg.showInFooter && (
                          <span className="px-2 py-0.5 rounded bg-[#F2ECE1] text-[#2C221E]">
                            In Footer
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[#2C221E]">
                      {pg.title}
                    </h3>
                    <p className="text-xs text-[#655549] line-clamp-2">{pg.subtitle}</p>
                    <p className="text-[11px] font-mono text-[#655549]">
                      {pg.sections.length} content section(s) · Updated {pg.updatedAt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#2C221E]/8 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('store');
                        setActivePageSlug(pg.slug);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A5D23] hover:underline cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live Page</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPageDraft(JSON.parse(JSON.stringify(pg)))
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2C221E] text-[#F5EFDC] rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#D99B26]" />
                        <span>Edit Page & Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteCustomPage(pg.id);
                          showToast(`Deleted page "${pg.title}".`);
                        }}
                        className="p-2 bg-[#FEE2E2] text-[#991B1B] rounded-xl cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: WEBSITE CONTENT & COPY CMS (CREATE, UPDATE, DELETE ALL COPY)
            =================================================================== */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
                  Site-Wide Content & Copy CMS
                </h2>
                <p className="text-xs text-[#655549]">
                  Create, update, or delete headlines, paragraphs, purity pillars,
                  culinary recipes, custom homepage banners, FAQs, and footer copy across
                  the entire website.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setCopyDraft(DEFAULT_SITE_COPY);
                    updateSiteCopy(DEFAULT_SITE_COPY);
                    showToast('Restored default DTCSS website copy.');
                  }}
                  className="px-4 py-2 bg-[#F2ECE1] hover:bg-[#E6ECD8] text-[#2C221E] rounded-full text-xs font-semibold cursor-pointer"
                >
                  Reset to Default Copy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateSiteCopy(copyDraft);
                    showToast('Published all website copy changes live!');
                  }}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Publish All Copy</span>
                </button>
              </div>
            </div>

            {/* CMS Section Sub-Navigation */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'hero', label: '1. Header, Hero & Purity Strip' },
                {
                  id: 'collection_spicemix',
                  label: '2. Collection & SpiceMix Spotlight Dishes',
                },
                {
                  id: 'craft_home',
                  label: '3. Our Craft Story & Custom Homepage Sections',
                },
                { id: 'faqs_footer', label: '4. Reviews Copy, Global FAQs & Footer' },
                {
                  id: 'policies_voice',
                  label: '5. Disclaimers, Policies & Live Voice Guide',
                },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setCmsSubTab(st.id as typeof cmsSubTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    cmsSubTab === st.id
                      ? 'bg-[#2C221E] text-[#F5EFDC]'
                      : 'bg-white text-[#655549] hover:text-[#2C221E]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* SUB-TAB 1: HEADER & HERO */}
            {cmsSubTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                    Header Navigation Link Labels
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Collection Link</label>
                      <input
                        type="text"
                        value={copyDraft.navCollectionLabel}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            navCollectionLabel: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">SpiceMix Link</label>
                      <input
                        type="text"
                        value={copyDraft.navSpiceMixLabel}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            navSpiceMixLabel: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Our Craft Link</label>
                      <input
                        type="text"
                        value={copyDraft.navCraftLabel}
                        onChange={(e) =>
                          setCopyDraft({ ...copyDraft, navCraftLabel: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Reviews Link</label>
                      <input
                        type="text"
                        value={copyDraft.navReviewsLabel}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            navReviewsLabel: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Track Order Link</label>
                      <input
                        type="text"
                        value={copyDraft.navTrackOrderLabel}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            navTrackOrderLabel: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                    Hero Section — Pre-Header, Headline, Subheadline, Description, 5 Benefit Bullets & CTAs
                  </h3>

                  <div>
                    <label className="block font-semibold mb-1">Hero Main Headline</label>
                    <input
                      type="text"
                      value={copyDraft.heroHeadline}
                      onChange={(e) =>
                        setCopyDraft({ ...copyDraft, heroHeadline: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-serif text-base"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Hero Subheadline</label>
                    <input
                      type="text"
                      value={copyDraft.heroSubheadline ?? DEFAULT_SITE_COPY.heroSubheadline ?? ''}
                      onChange={(e) =>
                        setCopyDraft({ ...copyDraft, heroSubheadline: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Hero Description Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={copyDraft.heroDescription}
                      onChange={(e) =>
                        setCopyDraft({ ...copyDraft, heroDescription: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>

                  {/* 5 Benefit-Oriented Bullet Points */}
                  <div className="pt-2 border-t border-[#2C221E]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold">
                        5 Benefit-Oriented Bullet Points of Our Products
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const current =
                            copyDraft.heroBenefits ||
                            DEFAULT_SITE_COPY.heroBenefits ||
                            [];
                          setCopyDraft({
                            ...copyDraft,
                            heroBenefits: [
                              ...current,
                              'New benefit-oriented product highlight',
                            ],
                          });
                        }}
                        className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                      >
                        + Add Benefit Bullet
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(
                        copyDraft.heroBenefits ||
                        DEFAULT_SITE_COPY.heroBenefits ||
                        []
                      ).map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#4A5D23] w-5 shrink-0">
                            0{idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => {
                              const next = [
                                ...(copyDraft.heroBenefits ||
                                  DEFAULT_SITE_COPY.heroBenefits ||
                                  []),
                              ];
                              next[idx] = e.target.value;
                              setCopyDraft({ ...copyDraft, heroBenefits: next });
                            }}
                            className="flex-1 px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current =
                                copyDraft.heroBenefits ||
                                DEFAULT_SITE_COPY.heroBenefits ||
                                [];
                              setCopyDraft({
                                ...copyDraft,
                                heroBenefits: current.filter((_, i) => i !== idx),
                              });
                            }}
                            className="p-2 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2C221E]/10">
                    <div>
                      <label className="block font-semibold mb-1">
                        Primary CTA Button Label ("View Products")
                      </label>
                      <input
                        type="text"
                        value={
                          copyDraft.heroViewProductsCta ??
                          DEFAULT_SITE_COPY.heroViewProductsCta ??
                          'View Products'
                        }
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            heroViewProductsCta: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Secondary CTA Button Label ("WhatsApp Chat")
                      </label>
                      <input
                        type="text"
                        value={
                          copyDraft.heroWhatsappCta ??
                          DEFAULT_SITE_COPY.heroWhatsappCta ??
                          'WhatsApp Chat'
                        }
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            heroWhatsappCta: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Hero Kickers CRUD */}
                  <div className="pt-2 border-t border-[#2C221E]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold">
                        Hero Pre-Header Kicker Tags (Create, Update, Delete)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setCopyDraft({
                            ...copyDraft,
                            heroKickers: [...copyDraft.heroKickers, 'New Tag'],
                          })
                        }
                        className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                      >
                        + Add Kicker Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {copyDraft.heroKickers.map((k, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 bg-[#F6EBC8] px-2.5 py-1 rounded-lg border border-[#2C221E]/15"
                        >
                          <input
                            type="text"
                            value={k}
                            onChange={(e) => {
                              const next = [...copyDraft.heroKickers];
                              next[idx] = e.target.value;
                              setCopyDraft({ ...copyDraft, heroKickers: next });
                            }}
                            className="bg-transparent text-xs focus:outline-none w-36"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCopyDraft({
                                ...copyDraft,
                                heroKickers: copyDraft.heroKickers.filter(
                                  (_, i) => i !== idx
                                ),
                              })
                            }
                            className="text-[#991B1B] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hero Purity Strip Pillars CRUD */}
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                      Hero Purity & Proof Pillars ({copyDraft.heroPillars.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setCopyDraft({
                          ...copyDraft,
                          heroPillars: [
                            ...copyDraft.heroPillars,
                            {
                              id: `hp-${Date.now()}`,
                              title: `0${copyDraft.heroPillars.length + 1}. New Purity Pillar`,
                              description: 'Describe this quality standard or promise.',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4A5D23] text-[#F5EFDC] rounded-lg font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Pillar</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {copyDraft.heroPillars.map((pillar, idx) => (
                      <div
                        key={pillar.id}
                        className="p-4 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/10 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => {
                              const next = [...copyDraft.heroPillars];
                              next[idx] = { ...pillar, title: e.target.value };
                              setCopyDraft({ ...copyDraft, heroPillars: next });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg font-serif text-sm font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCopyDraft({
                                ...copyDraft,
                                heroPillars: copyDraft.heroPillars.filter(
                                  (p) => p.id !== pillar.id
                                ),
                              })
                            }
                            className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const next = [...copyDraft.heroPillars];
                            next[idx] = { ...pillar, description: e.target.value };
                            setCopyDraft({ ...copyDraft, heroPillars: next });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: COLLECTION & SPICEMIX SPOTLIGHT */}
            {cmsSubTab === 'collection_spicemix' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                    Product Collection Section Copy
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Section Kicker</label>
                      <input
                        type="text"
                        value={copyDraft.collectionKicker}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            collectionKicker: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Section Heading</label>
                      <input
                        type="text"
                        value={copyDraft.collectionHeading}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            collectionHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Section Description
                    </label>
                    <textarea
                      rows={2}
                      value={copyDraft.collectionDescription}
                      onChange={(e) =>
                        setCopyDraft({
                          ...copyDraft,
                          collectionDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                      SpiceMix Culinary Spotlight Section & Dishes
                    </h3>
                    <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={copyDraft.showSpiceMixSpotlight !== false}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            showSpiceMixSpotlight: e.target.checked,
                          })
                        }
                      />
                      <span>Show SpiceMix Spotlight Section on Storefront</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Left Card Kicker</label>
                      <input
                        type="text"
                        value={copyDraft.spotlightLeftKicker}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            spotlightLeftKicker: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Left Card Heading</label>
                      <input
                        type="text"
                        value={copyDraft.spotlightLeftHeading}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            spotlightLeftHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Right Card Kicker
                      </label>
                      <input
                        type="text"
                        value={copyDraft.spotlightRightKicker}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            spotlightRightKicker: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Right Card Headline
                      </label>
                      <input
                        type="text"
                        value={copyDraft.spotlightRightHeading}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            spotlightRightHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Right Card Description
                    </label>
                    <textarea
                      rows={2}
                      value={copyDraft.spotlightRightDescription}
                      onChange={(e) =>
                        setCopyDraft({
                          ...copyDraft,
                          spotlightRightDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>

                  {/* Culinary Dishes CRUD */}
                  <div className="pt-3 border-t border-[#2C221E]/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        Culinary Dishes ({copyDraft.spotlightDishes.length})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCopyDraft({
                            ...copyDraft,
                            spotlightDishes: [
                              ...copyDraft.spotlightDishes,
                              {
                                id: `sd-${Date.now()}`,
                                index: `0${copyDraft.spotlightDishes.length + 1}`,
                                name: 'New Subcontinental Dish',
                                prepTime: '20 mins',
                                method: 'Sauté 2 tbsp DTCSS SpiceMix in pure desi ghee.',
                              },
                            ],
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4A5D23] text-[#F5EFDC] rounded-lg font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Dish</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {copyDraft.spotlightDishes.map((dish, idx) => (
                        <div
                          key={dish.id}
                          className="p-3.5 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/10 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={dish.index}
                              onChange={(e) => {
                                const next = [...copyDraft.spotlightDishes];
                                next[idx] = { ...dish, index: e.target.value };
                                setCopyDraft({ ...copyDraft, spotlightDishes: next });
                              }}
                              className="w-12 px-2 py-1 bg-white border border-[#2C221E]/15 rounded font-mono"
                            />
                            <input
                              type="text"
                              value={dish.name}
                              onChange={(e) => {
                                const next = [...copyDraft.spotlightDishes];
                                next[idx] = { ...dish, name: e.target.value };
                                setCopyDraft({ ...copyDraft, spotlightDishes: next });
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-[#2C221E]/15 rounded font-semibold"
                            />
                            <input
                              type="text"
                              value={dish.prepTime}
                              onChange={(e) => {
                                const next = [...copyDraft.spotlightDishes];
                                next[idx] = { ...dish, prepTime: e.target.value };
                                setCopyDraft({ ...copyDraft, spotlightDishes: next });
                              }}
                              className="w-20 px-2 py-1 bg-white border border-[#2C221E]/15 rounded font-mono"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setCopyDraft({
                                  ...copyDraft,
                                  spotlightDishes: copyDraft.spotlightDishes.filter(
                                    (d) => d.id !== dish.id
                                  ),
                                })
                              }
                              className="p-1 text-[#991B1B] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={dish.method}
                            onChange={(e) => {
                              const next = [...copyDraft.spotlightDishes];
                              next[idx] = { ...dish, method: e.target.value };
                              setCopyDraft({ ...copyDraft, spotlightDishes: next });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-[#2C221E]/15 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: OUR CRAFT STORY & CUSTOM HOMEPAGE SECTIONS */}
            {cmsSubTab === 'craft_home' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                    Our Craft / Brand Story Section Copy
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Craft Kicker</label>
                      <input
                        type="text"
                        value={copyDraft.craftKicker}
                        onChange={(e) =>
                          setCopyDraft({ ...copyDraft, craftKicker: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Craft Headline</label>
                      <input
                        type="text"
                        value={copyDraft.craftHeading}
                        onChange={(e) =>
                          setCopyDraft({ ...copyDraft, craftHeading: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Story Paragraphs CRUD */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold">
                        Story Narrative Paragraphs ({copyDraft.craftParagraphs.length})
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setCopyDraft({
                            ...copyDraft,
                            craftParagraphs: [
                              ...copyDraft.craftParagraphs,
                              'Add another paragraph about DTCSS heritage and kitchen standards.',
                            ],
                          })
                        }
                        className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                      >
                        + Add Paragraph
                      </button>
                    </div>
                    {copyDraft.craftParagraphs.map((para, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={para}
                          onChange={(e) => {
                            const next = [...copyDraft.craftParagraphs];
                            next[idx] = e.target.value;
                            setCopyDraft({ ...copyDraft, craftParagraphs: next });
                          }}
                          className="flex-1 px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCopyDraft({
                              ...copyDraft,
                              craftParagraphs: copyDraft.craftParagraphs.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="p-2 text-[#991B1B] hover:bg-[#FEE2E2] rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Craft Pillars CRUD */}
                  <div className="pt-3 border-t border-[#2C221E]/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        Craftsmanship Pillars ({copyDraft.craftPillars.length})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCopyDraft({
                            ...copyDraft,
                            craftPillars: [
                              ...copyDraft.craftPillars,
                              {
                                id: `cp-${Date.now()}`,
                                title: `0${copyDraft.craftPillars.length + 1}. New Craft Pillar`,
                                description: 'Details about this craft pillar.',
                              },
                            ],
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4A5D23] text-[#F5EFDC] rounded-lg font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Craft Pillar</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {copyDraft.craftPillars.map((cp, idx) => (
                        <div
                          key={cp.id}
                          className="p-3.5 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/10 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={cp.title}
                              onChange={(e) => {
                                const next = [...copyDraft.craftPillars];
                                next[idx] = { ...cp, title: e.target.value };
                                setCopyDraft({ ...copyDraft, craftPillars: next });
                              }}
                              className="w-full px-2 py-1 bg-white border border-[#2C221E]/15 rounded font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setCopyDraft({
                                  ...copyDraft,
                                  craftPillars: copyDraft.craftPillars.filter(
                                    (item) => item.id !== cp.id
                                  ),
                                })
                              }
                              className="p-1 text-[#991B1B] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={cp.description}
                            onChange={(e) => {
                              const next = [...copyDraft.craftPillars];
                              next[idx] = { ...cp, description: e.target.value };
                              setCopyDraft({ ...copyDraft, craftPillars: next });
                            }}
                            className="w-full px-2 py-1 bg-white border border-[#2C221E]/15 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Homepage Sections Builder */}
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                        Custom Homepage Content Blocks (
                        {(copyDraft.customHomeSections || []).length})
                      </h3>
                      <p className="text-[#655549]">
                        Add custom promotional or editorial sections directly onto the main
                        DTCSS homepage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCopyDraft({
                          ...copyDraft,
                          customHomeSections: [
                            ...(copyDraft.customHomeSections || []),
                            {
                              id: `home-sec-${Date.now()}`,
                              kicker: 'Seasonal Small-Batch Release',
                              heading: 'Freshly Roasted in Model Town, Lahore',
                              body: 'Enter custom campaign copy, nutritional notes, or seasonal gifting details here.',
                              bulletPoints: [
                                '100% pure grass-fed Desi Ghee',
                                'Complimentary nationwide delivery above PKR 2,500',
                              ],
                              ctaText: 'Order Fresh Batch',
                              ctaLink: '#collection',
                              theme: 'sand',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A5D23] text-[#F5EFDC] rounded-xl font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Homepage Section</span>
                    </button>
                  </div>

                  {(copyDraft.customHomeSections || []).map((sec, sIdx) => (
                    <div
                      key={sec.id}
                      className="p-4 bg-[#F6EBC8] rounded-2xl border border-[#2C221E]/12 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#4A5D23]">
                          Homepage Block #{sIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCopyDraft({
                              ...copyDraft,
                              customHomeSections: copyDraft.customHomeSections.filter(
                                (item) => item.id !== sec.id
                              ),
                            })
                          }
                          className="inline-flex items-center gap-1 text-[#991B1B] font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Block</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Kicker</label>
                          <input
                            type="text"
                            value={sec.kicker || ''}
                            onChange={(e) => {
                              const next = [...copyDraft.customHomeSections];
                              next[sIdx] = { ...sec, kicker: e.target.value };
                              setCopyDraft({ ...copyDraft, customHomeSections: next });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Heading</label>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => {
                              const next = [...copyDraft.customHomeSections];
                              next[sIdx] = { ...sec, heading: e.target.value };
                              setCopyDraft({ ...copyDraft, customHomeSections: next });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Theme</label>
                          <select
                            value={sec.theme}
                            onChange={(e) => {
                              const next = [...copyDraft.customHomeSections];
                              next[sIdx] = {
                                ...sec,
                                theme: e.target.value as CustomPageSection['theme'],
                              };
                              setCopyDraft({ ...copyDraft, customHomeSections: next });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg"
                          >
                            <option value="cream">Desi Ghee Cream (#F5EFDC)</option>
                            <option value="white">Crisp Studio White</option>
                            <option value="sand">Warm Sand (#F2ECE1)</option>
                            <option value="espresso">Roasted Espresso Dark</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Body Copy</label>
                        <textarea
                          rows={2}
                          value={sec.body}
                          onChange={(e) => {
                            const next = [...copyDraft.customHomeSections];
                            next[sIdx] = { ...sec, body: e.target.value };
                            setCopyDraft({ ...copyDraft, customHomeSections: next });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: REVIEWS HEADINGS, GLOBAL FAQS & FOOTER COPY */}
            {cmsSubTab === 'faqs_footer' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                        Storefront Frequently Asked Questions ({copyDraft.faqs.length})
                      </h3>
                      <p className="text-[#655549]">
                        Create new FAQs, update answers, or delete outdated questions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCopyDraft({
                          ...copyDraft,
                          faqs: [
                            ...copyDraft.faqs,
                            {
                              id: `faq-${Date.now()}`,
                              q: 'New Frequently Asked Question?',
                              a: 'Write the clear, helpful answer for DTCSS customers here.',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#4A5D23] text-[#F5EFDC] rounded-xl font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">FAQ Kicker</label>
                      <input
                        type="text"
                        value={copyDraft.faqKicker}
                        onChange={(e) =>
                          setCopyDraft({ ...copyDraft, faqKicker: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">FAQ Heading</label>
                      <input
                        type="text"
                        value={copyDraft.faqHeading}
                        onChange={(e) =>
                          setCopyDraft({ ...copyDraft, faqHeading: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {copyDraft.faqs.map((faq, idx) => (
                      <div
                        key={faq.id}
                        className="p-4 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/10 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={faq.q}
                            onChange={(e) => {
                              const next = [...copyDraft.faqs];
                              next[idx] = { ...faq, q: e.target.value };
                              setCopyDraft({ ...copyDraft, faqs: next });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCopyDraft({
                                ...copyDraft,
                                faqs: copyDraft.faqs.filter((f) => f.id !== faq.id),
                              })
                            }
                            className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) => {
                            const next = [...copyDraft.faqs];
                            next[idx] = { ...faq, a: e.target.value };
                            setCopyDraft({ ...copyDraft, faqs: next });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/15 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer & Reviews Copy */}
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                    Reviews Header & Footer Copy
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Reviews Section Kicker Prefix
                      </label>
                      <input
                        type="text"
                        value={copyDraft.reviewsKickerPrefix}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            reviewsKickerPrefix: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Reviews Section Heading
                      </label>
                      <input
                        type="text"
                        value={copyDraft.reviewsHeading}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            reviewsHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Footer Collection Column Heading
                      </label>
                      <input
                        type="text"
                        value={copyDraft.footerCollectionHeading}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            footerCollectionHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Footer Kitchen & Dispatch Heading
                      </label>
                      <input
                        type="text"
                        value={copyDraft.footerDispatchHeading}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            footerDispatchHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Footer Brand Description Blurb
                    </label>
                    <textarea
                      rows={2}
                      value={copyDraft.footerTagline}
                      onChange={(e) =>
                        setCopyDraft({ ...copyDraft, footerTagline: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Footer Bottom Verification Tagline
                    </label>
                    <input
                      type="text"
                      value={copyDraft.footerBottomRightText}
                      onChange={(e) =>
                        setCopyDraft({
                          ...copyDraft,
                          footerBottomRightText: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: DISCLAIMERS, POLICIES, SHIPPING INFO & LIVE VOICE GUIDE */}
            {cmsSubTab === 'policies_voice' && (
              <div className="space-y-6">
                {/* Pre-Footer Disclaimer & Section Headings */}
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                    Pre-Footer Natural Remedies Disclaimer & Homepage Section Headings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Disclaimer Badge Label
                      </label>
                      <input
                        type="text"
                        value={copyDraft.disclaimerBadge || 'Disclaimer'}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            disclaimerBadge: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Shop By Needs Section Kicker
                      </label>
                      <input
                        type="text"
                        value={
                          copyDraft.needsSectionKicker ||
                          'Shop By Needs, Favourites, Cravings!'
                        }
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            needsSectionKicker: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Shop By Needs Section Heading
                      </label>
                      <input
                        type="text"
                        value={
                          copyDraft.needsSectionHeading ||
                          'Find Your Everyday Goodness'
                        }
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            needsSectionHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Pre-Footer Disclaimer Copy (Shown on All Pages)
                    </label>
                    <textarea
                      rows={3}
                      value={copyDraft.disclaimerText || ''}
                      onChange={(e) =>
                        setCopyDraft({
                          ...copyDraft,
                          disclaimerText: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>

                {/* Store Policies & Shipping Info */}
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                    Shipping Information, No Returns/Refunds Policy & Store Terms
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">
                        Shipping Information & Delivery Policy
                      </label>
                      <textarea
                        rows={4}
                        value={copyDraft.shippingPolicyText || ''}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            shippingPolicyText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Returns & Refunds Policy (Strict No Returns / No Refunds)
                      </label>
                      <textarea
                        rows={4}
                        value={copyDraft.returnsPolicyText || ''}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            returnsPolicyText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Privacy Policy</label>
                      <textarea
                        rows={3}
                        value={copyDraft.privacyPolicyText || ''}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            privacyPolicyText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Terms & Conditions
                      </label>
                      <textarea
                        rows={3}
                        value={copyDraft.termsConditionsText || ''}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            termsConditionsText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Voice Guide Instructions & Knowledge Base */}
                <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2C221E]">
                      Live Voice Guide — Instructions & Knowledge Base
                    </h3>
                    <p className="text-[#655549] mt-0.5">
                      Customize the real-time voice guide agent name, opening greeting,
                      system instructions, and product/policy knowledge base. Changes take
                      effect immediately on new voice calls.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Voice Guide Display Name
                      </label>
                      <input
                        type="text"
                        value={copyDraft.voiceAgentName || 'BAJOZ Live Voice Guide'}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            voiceAgentName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Opening Transcript Greeting
                      </label>
                      <input
                        type="text"
                        value={copyDraft.voiceWelcomeMessage || ''}
                        onChange={(e) =>
                          setCopyDraft({
                            ...copyDraft,
                            voiceWelcomeMessage: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Live Voice Guide System Instructions (Tone, Rules, No Medical Advice, No Returns)
                    </label>
                    <textarea
                      rows={5}
                      value={copyDraft.voiceSystemInstruction || ''}
                      onChange={(e) =>
                        setCopyDraft({
                          ...copyDraft,
                          voiceSystemInstruction: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Live Voice Guide Knowledge Base (Products, Prices, Ingredients — SpiceMix No Onion, Policies)
                    </label>
                    <textarea
                      rows={6}
                      value={copyDraft.voiceKnowledgeBase || ''}
                      onChange={(e) =>
                        setCopyDraft({
                          ...copyDraft,
                          voiceKnowledgeBase: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 5: REVIEWS — CREATE, EDIT, APPROVE & DELETE REVIEWS
            =================================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
                  Customer Reviews & Testimonials ({reviews.length})
                </h2>
                <p className="text-xs text-[#655549]">
                  Add verified household reviews, edit existing testimonials, toggle
                  visibility, or delete reviews.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#4A5D23] text-[#F5EFDC] rounded-full text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Testimonial</span>
              </button>
            </div>

            {isAddingReview && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newRevName.trim() || !newRevTitle.trim()) return;
                  addCustomerReview({
                    customerName: newRevName.trim(),
                    city: newRevCity.trim() || 'Lahore',
                    rating: newRevRating,
                    productTag: newRevProductTag,
                    title: newRevTitle.trim(),
                    comment: newRevComment.trim(),
                    verified: true,
                  });
                  setNewRevName('');
                  setNewRevTitle('');
                  setNewRevComment('');
                  setIsAddingReview(false);
                  showToast('Added new verified customer review.');
                }}
                className="bg-white p-6 rounded-2xl border border-[#4A5D23]/30 space-y-4 text-xs"
              >
                <h3 className="font-serif text-xl font-bold">
                  Create Verified Customer Review
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Customer Name"
                    value={newRevName}
                    onChange={(e) => setNewRevName(e.target.value)}
                    className="px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="City (e.g. DHA Lahore)"
                    value={newRevCity}
                    onChange={(e) => setNewRevCity(e.target.value)}
                    className="px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                  <select
                    value={newRevProductTag}
                    onChange={(e) => setNewRevProductTag(e.target.value)}
                    className="px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newRevRating}
                    onChange={(e) => setNewRevRating(Number(e.target.value))}
                    className="px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Review Headline"
                  value={newRevTitle}
                  onChange={(e) => setNewRevTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Full customer review comment..."
                  value={newRevComment}
                  onChange={(e) => setNewRevComment(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#4A5D23] text-[#F5EFDC] rounded-full font-semibold cursor-pointer"
                  >
                    Publish Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingReview(false)}
                    className="px-4 py-2 bg-[#F2ECE1] text-[#2C221E] rounded-full cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => {
                const isEditing = editingReviewDraft?.id === r.id;
                if (isEditing && editingReviewDraft) {
                  return (
                    <div
                      key={r.id}
                      className="bg-white p-5 rounded-2xl border border-[#4A5D23] space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editingReviewDraft.customerName}
                          onChange={(e) =>
                            setEditingReviewDraft({
                              ...editingReviewDraft,
                              customerName: e.target.value,
                            })
                          }
                          className="px-2.5 py-1.5 bg-[#F6EBC8] rounded-lg"
                        />
                        <input
                          type="text"
                          value={editingReviewDraft.city}
                          onChange={(e) =>
                            setEditingReviewDraft({
                              ...editingReviewDraft,
                              city: e.target.value,
                            })
                          }
                          className="px-2.5 py-1.5 bg-[#F6EBC8] rounded-lg"
                        />
                      </div>
                      <input
                        type="text"
                        value={editingReviewDraft.title}
                        onChange={(e) =>
                          setEditingReviewDraft({
                            ...editingReviewDraft,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-[#F6EBC8] rounded-lg font-semibold"
                      />
                      <textarea
                        rows={3}
                        value={editingReviewDraft.comment}
                        onChange={(e) =>
                          setEditingReviewDraft({
                            ...editingReviewDraft,
                            comment: e.target.value,
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-[#F6EBC8] rounded-lg"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingReviewDraft(null)}
                          className="px-3 py-1.5 bg-[#F2ECE1] rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateReview(editingReviewDraft);
                            setEditingReviewDraft(null);
                            showToast('Review updated.');
                          }}
                          className="px-3.5 py-1.5 bg-[#4A5D23] text-white rounded-lg font-semibold cursor-pointer"
                        >
                          Save Review
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={r.id}
                    className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-semibold text-[#2C221E]">
                            {r.customerName} ({r.city})
                          </span>
                          <span className="block text-[11px] text-[#655549]">
                            {r.productTag} · {r.rating}★ · {r.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => approveReview(r.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                              r.isApproved
                                ? 'bg-[#E6ECD8] text-[#4A5D23]'
                                : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}
                          >
                            {r.isApproved ? 'Visible' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReviewDraft(r)}
                            className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteReview(r.id);
                              showToast('Review deleted.');
                            }}
                            className="text-[#991B1B] hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="font-serif text-base font-semibold">“{r.title}”</p>
                      <p className="text-[#655549]">{r.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: STORE, DELIVERY & BANK SETTINGS
            =================================================================== */}
        {activeTab === 'settings' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateStoreSettings(settingsDraft);
              showToast('Store, contact, delivery, and bank settings saved.');
            }}
            className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 max-w-4xl space-y-6 text-xs"
          >
            <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
              Global Store, Contact & Bank Transfer Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Brand / Store Name</label>
                <input
                  type="text"
                  value={settingsDraft.businessName}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      businessName: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Official Website URL</label>
                <input
                  type="url"
                  value={settingsDraft.websiteUrl || 'https://dtcss.pk'}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      websiteUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Official Phone Line</label>
                <input
                  type="text"
                  value={settingsDraft.officialPhone}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      officialPhone: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  WhatsApp Number (Intl Format)
                </label>
                <input
                  type="text"
                  value={settingsDraft.whatsappNumber}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      whatsappNumber: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Free Delivery Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={settingsDraft.freeDeliveryThreshold}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      freeDeliveryThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Standard Courier Fee (PKR)
                </label>
                <input
                  type="number"
                  value={settingsDraft.standardDeliveryFee}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      standardDeliveryFee: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Top Announcement Bar Copy
              </label>
              <input
                type="text"
                value={settingsDraft.announcementText}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    announcementText: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Kitchen / Office Address</label>
                <input
                  type="text"
                  value={settingsDraft.officeAddress}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      officeAddress: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={settingsDraft.instagramUrl}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      instagramUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={settingsDraft.facebookUrl}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      facebookUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#2C221E]/10 space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#2C221E]">
                Direct Bank Transfer Details (Checkout Display)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={settingsDraft.bankDetails.bankName}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        bankDetails: {
                          ...settingsDraft.bankDetails,
                          bankName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Account Title</label>
                  <input
                    type="text"
                    value={settingsDraft.bankDetails.accountTitle}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        bankDetails: {
                          ...settingsDraft.bankDetails,
                          accountTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={settingsDraft.bankDetails.accountNumber}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        bankDetails: {
                          ...settingsDraft.bankDetails,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">IBAN</label>
                  <input
                    type="text"
                    value={settingsDraft.bankDetails.iban}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        bankDetails: {
                          ...settingsDraft.bankDetails,
                          iban: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Customer Transfer Instructions
                </label>
                <textarea
                  rows={2}
                  value={settingsDraft.bankDetails.instructions}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      bankDetails: {
                        ...settingsDraft.bankDetails,
                        instructions: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E9F490] hover:bg-[#dfec78] text-[#2C221E] border border-[#4A5D23]/25 font-bold uppercase tracking-wider rounded-full cursor-pointer"
            >
              Save Store & Bank Settings
            </button>

            {/* Custom Self-Hosted Database Backup & Restore (Namecheap Hosting Ready) */}
            <div className="pt-6 border-t border-[#2C221E]/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#4A5D23] font-bold block">
                    Self-Hosted Custom Database Engine · Zero External Cloud Dependencies
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#2C221E]">
                    Namecheap Hosting Database Backup & Restore (.json)
                  </h3>
                  <p className="text-xs text-[#655549]">
                    All products, orders, customer accounts, reviews, policies, and voice
                    guide settings are stored directly on your hosting server in{' '}
                    <code className="font-mono text-[#2C221E]">.dtcss-store-db.json</code>.
                    Download a snapshot or restore from a backup file anytime.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="/api/admin/db-backup"
                    download={`bajoz-database-backup-${new Date().toISOString().slice(0, 10)}.json`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A5D23] hover:bg-[#3A4A1B] text-[#F5EFDC] rounded-full text-xs font-semibold cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download Full DB Backup</span>
                  </a>

                  <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#DCE6C8] hover:bg-[#E9F490] text-[#2C221E] border border-[#4A5D23]/20 rounded-full text-xs font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#4A5D23]" />
                    <span>Restore DB From Backup</span>
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const text = await file.text();
                          const parsed = JSON.parse(text);
                          const res = await fetch('/api/admin/db-restore', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(parsed),
                          });
                          if (res.ok) {
                            showToast(
                              'Custom database restored! Reloading storefront state...'
                            );
                            setTimeout(() => window.location.reload(), 900);
                          } else {
                            showToast('Could not restore database file.');
                          }
                        } catch {
                          showToast('Invalid JSON backup file.');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ===================================================================
            TAB 7: AUTHORIZED PERSONNEL & PORTAL URL
            =================================================================== */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#4A5D23] font-semibold">
                      Unlisted Admin Endpoint
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2C221E]">
                      Dedicated Admin Portal URLs
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAdminUrl}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#4A5D23] text-[#F5EFDC] rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUrlBanner ? 'Copied!' : 'Copy Portal Link'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#655549] leading-relaxed">
                  All Admin buttons are hidden from the public DTCSS storefront.
                  Directors and Managers can access this console directly by visiting:
                </p>
                <div className="p-3.5 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/10 font-mono text-xs space-y-1.5">
                  <div>
                    <span className="text-[#655549]">Primary URL: </span>
                    <span className="font-bold text-[#2C221E]">
                      {dedicatedAdminUrl}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#655549]">Legacy Alias: </span>
                    <span className="font-bold text-[#2C221E]">
                      {typeof window !== 'undefined'
                        ? `${window.location.origin}/dtcss/admin`
                        : 'https://bajoz.pk/dtcss/admin'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2C221E]">
                  Authorized DTCSS Personnel ({personnelList.length})
                </h3>
                {securityFeedback && (
                  <div className="p-3 bg-[#E6ECD8] text-[#2C221E] rounded-xl text-xs font-semibold">
                    {securityFeedback}
                  </div>
                )}
                <div className="divide-y divide-[#2C221E]/8">
                  {personnelList.map((staff) => (
                    <div
                      key={staff.email}
                      className="py-3.5 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#2C221E] block">
                          {staff.name}
                        </span>
                        <span className="font-mono text-[#655549]">{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-[#F6EBC8] rounded-full font-mono text-[11px]">
                          {staff.role}
                        </span>
                        {personnelList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePersonnel(staff.email)}
                            className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddOrUpdatePersonnel}
                className="bg-white p-6 rounded-2xl border border-[#2C221E]/8 space-y-4 text-xs"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#4A5D23]" />
                  <h3 className="font-serif text-2xl font-bold text-[#2C221E]">
                    Authorize Staff or Update Key
                  </h3>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Staff Email</label>
                  <input
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="manager@dtcss.pk"
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. Usman Tariq"
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Designated Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) =>
                      setNewStaffRole(
                        e.target.value as AuthorizedStaffProfile['role']
                      )
                    }
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  >
                    <option value="Store Director">Store Director</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Inventory Coordinator">
                      Inventory Coordinator
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Portal Security Key / Password
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    placeholder="Set secret access key"
                    className="w-full px-3.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] font-semibold uppercase tracking-wider rounded-full cursor-pointer"
                >
                  Save Staff Authorization
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB: USER ACCOUNT MANAGEMENT (FULL CRUD FOR CUSTOMER ACCOUNTS)
            =================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
                  Customer Account Management ({registeredUsers.length})
                </h2>
                <p className="text-xs text-[#655549] mt-0.5">
                  Create, search, update, or remove customer accounts, saved delivery addresses, and account credentials.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px]">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, email, phone, city..."
                    className="w-full pl-9 pr-4 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-full text-xs text-[#2C221E] focus:outline-none focus:border-[#4A5D23]"
                  />
                  <Search className="w-4 h-4 text-[#655549] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCustomerMode(true);
                    setNewCustomerAddressDraft('');
                    setEditingCustomer({
                      id: `usr_${Date.now().toString().slice(-6)}`,
                      name: '',
                      email: '',
                      phone: '',
                      city: 'Lahore',
                      provider: 'email',
                      createdAt: new Date().toISOString(),
                      savedAddresses: [],
                      passwordHash: '',
                    });
                  }}
                  className="px-4 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> + Create Customer Account
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {registeredUsers
                .filter((u) => {
                  if (!userSearch.trim()) return true;
                  const q = userSearch.toLowerCase();
                  return (
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) ||
                    u.phone.toLowerCase().includes(q) ||
                    u.city.toLowerCase().includes(q)
                  );
                })
                .map((cust) => {
                  const custOrders = orders.filter(
                    (o) =>
                      (o.customer.email &&
                        o.customer.email.toLowerCase() === cust.email.toLowerCase()) ||
                      (cust.phone && o.customer.phone === cust.phone)
                  );
                  const totalSpent = custOrders.reduce((acc, o) => acc + o.total, 0);

                  return (
                    <div
                      key={cust.id}
                      className="bg-white p-5 rounded-2xl border border-[#2C221E]/10 flex flex-col justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4A5D23] font-bold">
                              {cust.provider === 'google' ? 'Google Auth' : 'Email Account'} · ID #{cust.id.slice(-6)}
                            </span>
                            <h3 className="font-serif text-lg font-bold text-[#2C221E]">
                              {cust.name || 'Unnamed Customer'}
                            </h3>
                            <p className="text-xs text-[#655549] font-mono break-all">
                              {cust.email}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-[#F6EBC8] text-[#2C221E] font-mono text-[11px] font-bold shrink-0">
                            {custOrders.length} {custOrders.length === 1 ? 'Order' : 'Orders'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F6EBC8]/60 text-xs">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#655549] block">
                              Phone
                            </span>
                            <span className="font-mono font-semibold text-[#2C221E]">
                              {cust.phone || 'Not set'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#655549] block">
                              City
                            </span>
                            <span className="font-semibold text-[#2C221E]">
                              {cust.city || 'Not set'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#655549] block">
                              Lifetime Spend
                            </span>
                            <span className="font-mono font-bold text-[#4A5D23]">
                              PKR {totalSpent.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#655549] block">
                              Joined
                            </span>
                            <span className="font-mono text-[11px] text-[#2C221E]">
                              {new Date(cust.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {cust.savedAddresses && cust.savedAddresses.length > 0 && (
                          <div className="text-xs">
                            <span className="text-[10px] uppercase tracking-wider text-[#655549] font-semibold block mb-1">
                              Saved Delivery Addresses ({cust.savedAddresses.length})
                            </span>
                            <p className="text-[#2C221E] bg-[#F6EBC8]/40 px-2.5 py-1.5 rounded-lg line-clamp-2">
                              {cust.savedAddresses[0]}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#2C221E]/8">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewCustomerMode(false);
                            setNewCustomerAddressDraft('');
                            setEditingCustomer({ ...cust });
                          }}
                          className="flex-1 py-2 px-3 bg-[#F6EBC8] hover:bg-[#DCE6C8] text-[#2C221E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Account
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setManualCustName(cust.name);
                            setManualCustPhone(cust.phone || '');
                            setManualCustCity(cust.city || 'Lahore');
                            setManualCustEmail(cust.email);
                            setManualCustAddress(cust.savedAddresses?.[0] || '');
                            setIsBookingModalOpen(true);
                          }}
                          className="py-2 px-3 bg-[#4A5D23]/12 hover:bg-[#4A5D23] hover:text-white text-[#4A5D23] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                          title="Book Order for Customer"
                        >
                          + Book Order
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            adminDeleteUser(cust.id);
                            showToast(`Deleted customer account "${cust.name || cust.email}".`);
                          }}
                          className="p-2 text-[#991B1B] hover:bg-[#FEE2E2] rounded-xl cursor-pointer transition-colors"
                          title="Delete Customer Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          MODAL 1: MANUAL ORDER BOOKING MODAL
          ===================================================================== */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2C221E]/65 backdrop-blur-2xs">
          <div className="bg-[#F6EBC8] text-[#2C221E] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#2C221E]/15 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#2C221E]/10 flex items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  Book Manual Order (Phone / WhatsApp / Walk-In)
                </h2>
                <p className="text-xs text-[#655549]">
                  Logged by {adminStaff.name} ({adminStaff.role})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 text-[#655549] hover:text-[#2C221E] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitManualOrder}
              className="overflow-y-auto p-4 sm:p-6 space-y-6 text-xs"
            >
              {/* Customer Details */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <h3 className="font-serif text-lg font-bold">1. Customer & Delivery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={manualCustName}
                      onChange={(e) => setManualCustName(e.target.value)}
                      placeholder="e.g. Mrs. Kamran"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={manualCustPhone}
                      onChange={(e) => setManualCustPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={manualCustCity}
                      onChange={(e) => setManualCustCity(e.target.value)}
                      placeholder="Lahore"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={manualCustAddress}
                      onChange={(e) => setManualCustAddress(e.target.value)}
                      placeholder="House #, Street, Sector, Area"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={manualCustEmail}
                      onChange={(e) => setManualCustEmail(e.target.value)}
                      placeholder="customer@email.com"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <h3 className="font-serif text-lg font-bold">2. Select Products & Jars</h3>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-4">
                    <label className="block font-semibold mb-1">Product</label>
                    <select
                      value={pickerProductId}
                      onChange={(e) => {
                        const nextProd = products.find((p) => p.id === e.target.value);
                        setPickerProductId(e.target.value);
                        if (nextProd) {
                          setPickerVariantId(nextProd.variants[0]?.id || '');
                          setPickerPackId(nextProd.packSizes[0]?.id || '');
                        }
                      }}
                      className="w-full px-2.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-semibold mb-1">Variant</label>
                    <select
                      value={pickerVariantId}
                      onChange={(e) => setPickerVariantId(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      {(
                        products.find((p) => p.id === pickerProductId)?.variants || []
                      ).map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-semibold mb-1">Jar Size</label>
                    <select
                      value={pickerPackId}
                      onChange={(e) => setPickerPackId(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      {(
                        products.find((p) => p.id === pickerProductId)?.packSizes || []
                      ).map((pk) => (
                        <option key={pk.id} value={pk.id}>
                          {pk.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={pickerQty}
                      onChange={(e) => setPickerQty(parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl text-center font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddLineItemToManualOrder}
                      className="flex-1 py-2 bg-[#4A5D23] text-white rounded-xl font-semibold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {manualItems.length > 0 ? (
                  <div className="divide-y divide-[#2C221E]/8 pt-2">
                    {manualItems.map((item) => (
                      <div
                        key={item.id}
                        className="py-2 flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-semibold">{item.productName}</span> ·{' '}
                          <span>{item.variantName}</span> ({item.packSizeLabel}) ×{' '}
                          <span className="font-mono font-bold">{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold">
                            PKR {(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setManualItems((prev) =>
                                prev.filter((i) => i.id !== item.id)
                              )
                            }
                            className="text-[#991B1B] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#991B1B] font-medium">
                    Please click "+ Add" to include at least one jar in this order.
                  </p>
                )}
              </div>

              {/* Scheduling, Payment & Courier */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <h3 className="font-serif text-lg font-bold">
                  3. Schedule, Payment & Courier Assignment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Payment Method</label>
                    <select
                      value={manualPaymentMethod}
                      onChange={(e) =>
                        setManualPaymentMethod(
                          e.target.value as 'cod' | 'bank_transfer'
                        )
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      <option value="cod">Cash on Delivery (COD)</option>
                      <option value="bank_transfer">Meezan Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Payment Status</label>
                    <select
                      value={manualPaymentStatus}
                      onChange={(e) =>
                        setManualPaymentStatus(e.target.value as PaymentStatus)
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Awaiting Verification">Awaiting Verification</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Initial Fulfillment
                    </label>
                    <select
                      value={manualFulfillmentStatus}
                      onChange={(e) =>
                        setManualFulfillmentStatus(e.target.value as FulfillmentStatus)
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">
                      Scheduled Dispatch Date
                    </label>
                    <input
                      type="date"
                      value={manualScheduledDate}
                      onChange={(e) => setManualScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Delivery Window</label>
                    <select
                      value={manualScheduledSlot}
                      onChange={(e) => setManualScheduledSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      {DELIVERY_SLOTS.map((sl) => (
                        <option key={sl} value={sl}>
                          {sl}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Courier (Optional)
                    </label>
                    <input
                      type="text"
                      value={manualCourier}
                      onChange={(e) => setManualCourier(e.target.value)}
                      placeholder="Trax / TCS"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Tracking # (Optional)
                    </label>
                    <input
                      type="text"
                      value={manualTracking}
                      onChange={(e) => setManualTracking(e.target.value)}
                      placeholder="TRX-..."
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">
                      Dispatch / Delivery Notes
                    </label>
                    <input
                      type="text"
                      value={manualNotes}
                      onChange={(e) => setManualNotes(e.target.value)}
                      placeholder="Special instructions..."
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Gift Card Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={manualGiftMsg}
                      onChange={(e) => setManualGiftMsg(e.target.value)}
                      placeholder="Handwritten gift message..."
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-5 py-2.5 bg-white text-[#2C221E] rounded-full font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualItems.length === 0}
                  className="px-6 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-full font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  Confirm & Book Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: ORDER DETAIL, TIMELINE TRACKER & CUSTOMER EDITOR
          ===================================================================== */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2C221E]/65 backdrop-blur-2xs">
          <div className="bg-[#F6EBC8] text-[#2C221E] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#2C221E]/15 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#2C221E]/10 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs text-[#4A5D23] font-bold">
                  ORDER #{selectedOrderForDetail.orderNumber}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  Manage, Edit & Track Parcel
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const code = selectedOrderForDetail.orderNumber;
                    setSelectedOrderForDetail(null);
                    setCurrentView('store');
                    setTrackingOrderQuery(code);
                    setIsTrackingOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#F2ECE1] hover:bg-[#E6ECD8] text-[#2C221E] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Customer Tracker View
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDetail(null)}
                  className="p-1.5 text-[#655549] hover:text-[#2C221E] rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
              {/* Editable Customer & Address Info */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <h3 className="font-serif text-lg font-bold">
                  Customer & Shipping Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={selectedOrderForDetail.customer.name}
                    onChange={(e) =>
                      updateOrderDetails(selectedOrderForDetail.orderNumber, {
                        customer: {
                          ...selectedOrderForDetail.customer,
                          name: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-1.5 bg-[#F6EBC8] rounded-lg"
                  />
                  <input
                    type="text"
                    value={selectedOrderForDetail.customer.phone}
                    onChange={(e) =>
                      updateOrderDetails(selectedOrderForDetail.orderNumber, {
                        customer: {
                          ...selectedOrderForDetail.customer,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-1.5 bg-[#F6EBC8] rounded-lg font-mono"
                  />
                  <input
                    type="text"
                    value={selectedOrderForDetail.customer.city}
                    onChange={(e) =>
                      updateOrderDetails(selectedOrderForDetail.orderNumber, {
                        customer: {
                          ...selectedOrderForDetail.customer,
                          city: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-1.5 bg-[#F6EBC8] rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  value={selectedOrderForDetail.customer.address}
                  onChange={(e) =>
                    updateOrderDetails(selectedOrderForDetail.orderNumber, {
                      customer: {
                        ...selectedOrderForDetail.customer,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#F6EBC8] rounded-lg"
                />
              </div>

              {/* Editable Courier & Live Order Tracking Details */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold">
                    Courier & Live Tracking Assignment
                  </h3>
                  {(selectedOrderForDetail.courierName ||
                    selectedOrderForDetail.trackingNumber) && (
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderDetails(
                          selectedOrderForDetail.orderNumber,
                          {
                            courierName: undefined,
                            trackingNumber: undefined,
                          },
                          'Cleared courier tracking assignment',
                          adminStaff.name
                        );
                        showToast('Cleared courier & tracking number.');
                      }}
                      className="text-[11px] text-[#991B1B] hover:underline font-semibold cursor-pointer"
                    >
                      Clear Tracking
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#655549] font-semibold mb-1">
                      Courier Partner (TCS / Leopards / Rider)
                    </label>
                    <input
                      type="text"
                      value={selectedOrderForDetail.courierName || ''}
                      placeholder="e.g. TCS Express / Leopards"
                      onChange={(e) =>
                        updateOrderDetails(selectedOrderForDetail.orderNumber, {
                          courierName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#F6EBC8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#655549] font-semibold mb-1">
                      Tracking Number / Consignment ID
                    </label>
                    <input
                      type="text"
                      value={selectedOrderForDetail.trackingNumber || ''}
                      placeholder="e.g. LHE-9928172"
                      onChange={(e) =>
                        updateOrderDetails(selectedOrderForDetail.orderNumber, {
                          trackingNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#F6EBC8] rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Order Items & Quantities */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">
                    Booked Line Items ({selectedOrderForDetail.items.length})
                  </h3>
                  <span className="font-mono font-bold text-[#4A5D23]">
                    Total: PKR {selectedOrderForDetail.total.toLocaleString()}
                  </span>
                </div>
                <div className="divide-y divide-[#2C221E]/8">
                  {selectedOrderForDetail.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="py-2 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-semibold text-[#2C221E]">
                          {item.productName}
                        </span>{' '}
                        · <span className="text-[#655549]">{item.variantName}</span> (
                        {item.packSizeLabel})
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const nextQty = Math.max(1, parseInt(e.target.value) || 1);
                            const nextItems = selectedOrderForDetail.items.map(
                              (it, i) => (i === idx ? { ...it, quantity: nextQty } : it)
                            );
                            const nextSubtotal = nextItems.reduce(
                              (acc, it) => acc + it.unitPrice * it.quantity,
                              0
                            );
                            const nextDelivery =
                              nextSubtotal >= settings.freeDeliveryThreshold
                                ? 0
                                : settings.standardDeliveryFee;
                            updateOrderDetails(selectedOrderForDetail.orderNumber, {
                              items: nextItems,
                              subtotal: nextSubtotal,
                              deliveryFee: nextDelivery,
                              total: nextSubtotal + nextDelivery,
                            });
                          }}
                          className="w-14 px-2 py-1 bg-[#F6EBC8] rounded-lg text-center font-mono"
                        />
                        <span className="font-mono font-semibold w-24 text-right">
                          PKR {(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                        {selectedOrderForDetail.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextItems = selectedOrderForDetail.items.filter(
                                (_, i) => i !== idx
                              );
                              const nextSubtotal = nextItems.reduce(
                                (acc, it) => acc + it.unitPrice * it.quantity,
                                0
                              );
                              const nextDelivery =
                                nextSubtotal >= settings.freeDeliveryThreshold
                                  ? 0
                                  : settings.standardDeliveryFee;
                              updateOrderDetails(selectedOrderForDetail.orderNumber, {
                                items: nextItems,
                                subtotal: nextSubtotal,
                                deliveryFee: nextDelivery,
                                total: nextSubtotal + nextDelivery,
                              });
                            }}
                            className="p-1 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add, Edit & Delete Live Tracking Milestones */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <h3 className="font-serif text-lg font-bold">
                  Dispatch Timeline & Milestones (
                  {selectedOrderForDetail.statusHistory.length})
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMilestoneNote}
                    onChange={(e) => setNewMilestoneNote(e.target.value)}
                    placeholder="Add custom tracking note (e.g. Handed to Lahore rider)..."
                    className="flex-1 px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMilestoneNote.trim()) return;
                      updateOrderDetails(
                        selectedOrderForDetail.orderNumber,
                        {},
                        newMilestoneNote.trim(),
                        adminStaff.name
                      );
                      setNewMilestoneNote('');
                      showToast('Added tracking milestone to order history.');
                    }}
                    className="px-4 py-2 bg-[#4A5D23] text-white rounded-xl font-semibold cursor-pointer"
                  >
                    + Log Event
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {selectedOrderForDetail.statusHistory.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F6EBC8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex-1 space-y-1">
                        <span className="font-semibold text-[#2C221E] block">
                          {h.status}{' '}
                          {h.actor && (
                            <span className="font-mono text-[10px] text-[#4A5D23]">
                              by {h.actor}
                            </span>
                          )}
                        </span>
                        <input
                          type="text"
                          value={h.note || ''}
                          onChange={(e) => {
                            const updatedHistory =
                              selectedOrderForDetail.statusHistory.map((item, i) =>
                                i === idx ? { ...item, note: e.target.value } : item
                              );
                            updateOrderDetails(selectedOrderForDetail.orderNumber, {
                              statusHistory: updatedHistory,
                            });
                          }}
                          className="w-full px-2.5 py-1 bg-white/80 border border-[#2C221E]/10 rounded-lg text-[#2C221E] text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[10px] text-[#655549]">
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                        {selectedOrderForDetail.statusHistory.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedHistory =
                                selectedOrderForDetail.statusHistory.filter(
                                  (_, i) => i !== idx
                                );
                              updateOrderDetails(selectedOrderForDetail.orderNumber, {
                                statusHistory: updatedHistory,
                              });
                              showToast('Removed tracking milestone.');
                            }}
                            className="p-1 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                            title="Delete Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE / EDIT CUSTOMER USER ACCOUNT (FULL CRUD)
          ===================================================================== */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2C221E]/65 backdrop-blur-2xs">
          <div className="bg-[#F6EBC8] text-[#2C221E] w-full max-w-xl rounded-3xl shadow-2xl border border-[#2C221E]/15 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#2C221E]/10 flex items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#4A5D23] font-bold">
                  {isNewCustomerMode
                    ? 'New Customer Profile'
                    : `Editing Account ID #${editingCustomer.id.slice(-6)}`}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {isNewCustomerMode
                    ? 'Create Customer Account'
                    : editingCustomer.name || editingCustomer.email}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="p-1.5 text-[#655549] hover:text-[#2C221E] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isNewCustomerMode) {
                  adminCreateUser({
                    name: editingCustomer.name.trim(),
                    email: editingCustomer.email.trim(),
                    phone: editingCustomer.phone.trim(),
                    city: editingCustomer.city.trim() || 'Lahore',
                    provider: editingCustomer.provider,
                    savedAddresses: editingCustomer.savedAddresses,
                    passwordHash: editingCustomer.passwordHash || 'bajoz123',
                  });
                  showToast(`Created customer account for ${editingCustomer.name}!`);
                } else {
                  adminUpdateUser(editingCustomer.id, {
                    name: editingCustomer.name.trim(),
                    email: editingCustomer.email.trim(),
                    phone: editingCustomer.phone.trim(),
                    city: editingCustomer.city.trim(),
                    provider: editingCustomer.provider,
                    savedAddresses: editingCustomer.savedAddresses,
                    ...(editingCustomer.passwordHash
                      ? { passwordHash: editingCustomer.passwordHash }
                      : {}),
                  });
                  showToast(`Updated customer account for ${editingCustomer.name}.`);
                }
                setEditingCustomer(null);
              }}
              className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs"
            >
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingCustomer.name}
                      onChange={(e) =>
                        setEditingCustomer({ ...editingCustomer, name: e.target.value })
                      }
                      placeholder="e.g. Ayesha Tariq"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editingCustomer.email}
                      onChange={(e) =>
                        setEditingCustomer({ ...editingCustomer, email: e.target.value })
                      }
                      placeholder="customer@example.com"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={editingCustomer.phone}
                      onChange={(e) =>
                        setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                      }
                      placeholder="0300-1234567"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={editingCustomer.city}
                      onChange={(e) =>
                        setEditingCustomer({ ...editingCustomer, city: e.target.value })
                      }
                      placeholder="Lahore"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Auth Provider</label>
                    <select
                      value={editingCustomer.provider}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          provider: e.target.value as 'email' | 'google',
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    >
                      <option value="email">Email & Password</option>
                      <option value="google">Google Workspace / OAuth</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      {isNewCustomerMode ? 'Set Password' : 'Reset Password (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={editingCustomer.passwordHash || ''}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          passwordHash: e.target.value,
                        })
                      }
                      placeholder={
                        isNewCustomerMode ? 'Default: bajoz123' : 'Leave blank to keep'
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Saved Addresses CRUD */}
              <div className="bg-white p-4 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <h3 className="font-serif text-base font-bold">
                  Saved Delivery Addresses ({editingCustomer.savedAddresses.length})
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCustomerAddressDraft}
                    onChange={(e) => setNewCustomerAddressDraft(e.target.value)}
                    placeholder="Add delivery address (House #, Street, Area)..."
                    className="flex-1 px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCustomerAddressDraft.trim()) return;
                      setEditingCustomer({
                        ...editingCustomer,
                        savedAddresses: [
                          newCustomerAddressDraft.trim(),
                          ...editingCustomer.savedAddresses,
                        ],
                      });
                      setNewCustomerAddressDraft('');
                    }}
                    className="px-4 py-2 bg-[#4A5D23] text-white rounded-xl font-semibold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {editingCustomer.savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    {editingCustomer.savedAddresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-[#F6EBC8] px-3 py-2 rounded-xl"
                      >
                        <input
                          type="text"
                          value={addr}
                          onChange={(e) => {
                            const updated = editingCustomer.savedAddresses.map((a, i) =>
                              i === idx ? e.target.value : a
                            );
                            setEditingCustomer({
                              ...editingCustomer,
                              savedAddresses: updated,
                            });
                          }}
                          className="flex-1 bg-transparent text-[#2C221E] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingCustomer({
                              ...editingCustomer,
                              savedAddresses: editingCustomer.savedAddresses.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="text-[#991B1B] p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2.5 rounded-full bg-white border border-[#2C221E]/15 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] font-semibold cursor-pointer"
                >
                  {isNewCustomerMode ? 'Create Customer Account' : 'Save Account Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: FULL PRODUCT EDITOR (EDIT EVERY DETAIL OR CREATE NEW PRODUCT)
          ===================================================================== */}
      {productEditorDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2C221E]/70 backdrop-blur-2xs">
          <div className="bg-[#F6EBC8] text-[#2C221E] w-full max-w-5xl rounded-3xl shadow-2xl border border-[#2C221E]/15 max-h-[94vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#2C221E]/10 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#4A5D23] font-semibold">
                  {isNewProductMode
                    ? 'Creating New Product'
                    : `Editing Product ID: ${productEditorDraft.id}`}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {productEditorDraft.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProductEditorDraft(null)}
                className="p-1.5 text-[#655549] hover:text-[#2C221E] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isNewProductMode) {
                  addProduct(productEditorDraft);
                  showToast(`Added new product "${productEditorDraft.name}"!`);
                } else {
                  updateProduct(productEditorDraft);
                  showToast(`Saved all changes to "${productEditorDraft.name}".`);
                }
                setProductEditorDraft(null);
              }}
              className="overflow-y-auto p-6 space-y-6 text-xs"
            >
              {/* 1. Core Identity, Pricing & Photo */}
              <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-4">
                <h3 className="font-serif text-xl font-bold">
                  1. Core Product Identity, Pricing & Photograph
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productEditorDraft.name}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={productEditorDraft.category}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          category: e.target.value,
                        })
                      }
                      placeholder="Panjeeri / Cooking Paste / Oral Care"
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Base Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={productEditorDraft.basePrice}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          basePrice: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-5">
                    <label className="inline-flex items-center gap-1.5 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productEditorDraft.isPublished}
                        onChange={(e) =>
                          setProductEditorDraft({
                            ...productEditorDraft,
                            isPublished: e.target.checked,
                          })
                        }
                      />
                      <span>Published</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productEditorDraft.featured}
                        onChange={(e) =>
                          setProductEditorDraft({
                            ...productEditorDraft,
                            featured: e.target.checked,
                          })
                        }
                      />
                      <span>Featured</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={productEditorDraft.subtitle}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Jar & Packaging Specification
                    </label>
                    <input
                      type="text"
                      value={productEditorDraft.packagingSpec}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          packagingSpec: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Short Tagline</label>
                  <input
                    type="text"
                    value={productEditorDraft.tagline}
                    onChange={(e) =>
                      setProductEditorDraft({
                        ...productEditorDraft,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={productEditorDraft.description}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Kitchen Craft & Heritage Story
                    </label>
                    <textarea
                      rows={3}
                      value={productEditorDraft.story}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          story: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
                  <div className="sm:col-span-8">
                    <label className="block font-semibold mb-1">
                      Custom Image URL or Upload File
                    </label>
                    <input
                      type="text"
                      value={productEditorDraft.customImageUrl || ''}
                      onChange={(e) =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          customImageUrl: e.target.value,
                        })
                      }
                      placeholder="/assets/... or https://..."
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                  <div className="sm:col-span-4 pt-4">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2ECE1] hover:bg-[#E6ECD8] text-[#2C221E] rounded-xl font-semibold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Upload Image From Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleDraftImageFileUpload(e.target.files?.[0])
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. Variants Manager (Create, Update, Delete Variants) */}
              <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold">
                    2. Recipe Variants, SKUs & Stock ({productEditorDraft.variants.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setProductEditorDraft({
                        ...productEditorDraft,
                        variants: [
                          ...productEditorDraft.variants,
                          {
                            id: `var-${Date.now().toString(36).slice(-4)}`,
                            name: 'New Recipe Variant',
                            sku: `DT-SKU-${productEditorDraft.variants.length + 1}`,
                            priceAdjustment: 0,
                            stock: 25,
                            badge: 'Small-Batch',
                            description: 'Variant flavor and ingredient notes.',
                            colorAccent: '#D99B26',
                            nutritionHighlight: 'Rich in natural nutrients',
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4A5D23] text-white rounded-lg font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variant</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {productEditorDraft.variants.map((v, vIdx) => (
                    <div
                      key={v.id}
                      className="p-4 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/10 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                        <div>
                          <label className="block text-[10px] uppercase font-semibold mb-0.5">
                            Variant Name
                          </label>
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => {
                              const next = [...productEditorDraft.variants];
                              next[vIdx] = { ...v, name: e.target.value };
                              setProductEditorDraft({
                                ...productEditorDraft,
                                variants: next,
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white rounded-lg font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-semibold mb-0.5">
                            SKU Code
                          </label>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => {
                              const next = [...productEditorDraft.variants];
                              next[vIdx] = { ...v, sku: e.target.value };
                              setProductEditorDraft({
                                ...productEditorDraft,
                                variants: next,
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-semibold mb-0.5">
                            Price Add-On (+PKR)
                          </label>
                          <input
                            type="number"
                            value={v.priceAdjustment}
                            onChange={(e) => {
                              const next = [...productEditorDraft.variants];
                              next[vIdx] = {
                                ...v,
                                priceAdjustment: parseInt(e.target.value) || 0,
                              };
                              setProductEditorDraft({
                                ...productEditorDraft,
                                variants: next,
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-semibold mb-0.5">
                            Stock (Jars)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) => {
                              const next = [...productEditorDraft.variants];
                              next[vIdx] = {
                                ...v,
                                stock: Math.max(0, parseInt(e.target.value) || 0),
                              };
                              setProductEditorDraft({
                                ...productEditorDraft,
                                variants: next,
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white rounded-lg font-mono"
                          />
                        </div>
                        <div className="flex items-end justify-between gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] uppercase font-semibold mb-0.5">
                              Badge
                            </label>
                            <input
                              type="text"
                              value={v.badge}
                              onChange={(e) => {
                                const next = [...productEditorDraft.variants];
                                next[vIdx] = { ...v, badge: e.target.value };
                                setProductEditorDraft({
                                  ...productEditorDraft,
                                  variants: next,
                                });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white rounded-lg"
                            />
                          </div>
                          {productEditorDraft.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setProductEditorDraft({
                                  ...productEditorDraft,
                                  variants: productEditorDraft.variants.filter(
                                    (item) => item.id !== v.id
                                  ),
                                })
                              }
                              className="p-2 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={v.description}
                        onChange={(e) => {
                          const next = [...productEditorDraft.variants];
                          next[vIdx] = { ...v, description: e.target.value };
                          setProductEditorDraft({
                            ...productEditorDraft,
                            variants: next,
                          });
                        }}
                        placeholder="Variant description..."
                        className="w-full px-2.5 py-1.5 bg-white rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Pack Sizes Manager */}
              <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold">
                    3. Jar / Pack Sizes ({productEditorDraft.packSizes.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setProductEditorDraft({
                        ...productEditorDraft,
                        packSizes: [
                          ...productEditorDraft.packSizes,
                          {
                            id: `pack-${Date.now().toString(36).slice(-3)}`,
                            label: '1kg Value Pack',
                            unitWeight: '1000 grams',
                            weightMultiplier: 2,
                            priceMultiplier: 1.9,
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4A5D23] text-white rounded-lg font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Jar Size</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {productEditorDraft.packSizes.map((pk, pIdx) => (
                    <div
                      key={pk.id}
                      className="p-3.5 bg-[#F6EBC8] rounded-xl border border-[#2C221E]/10 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={pk.label}
                        onChange={(e) => {
                          const next = [...productEditorDraft.packSizes];
                          next[pIdx] = { ...pk, label: e.target.value };
                          setProductEditorDraft({
                            ...productEditorDraft,
                            packSizes: next,
                          });
                        }}
                        placeholder="Label (e.g. 500g Jar)"
                        className="sm:col-span-5 px-2.5 py-1.5 bg-white rounded-lg font-semibold"
                      />
                      <input
                        type="text"
                        value={pk.unitWeight}
                        onChange={(e) => {
                          const next = [...productEditorDraft.packSizes];
                          next[pIdx] = { ...pk, unitWeight: e.target.value };
                          setProductEditorDraft({
                            ...productEditorDraft,
                            packSizes: next,
                          });
                        }}
                        placeholder="Unit Weight"
                        className="sm:col-span-4 px-2.5 py-1.5 bg-white rounded-lg"
                      />
                      <input
                        type="number"
                        step="0.05"
                        value={pk.priceMultiplier}
                        onChange={(e) => {
                          const next = [...productEditorDraft.packSizes];
                          next[pIdx] = {
                            ...pk,
                            priceMultiplier: parseFloat(e.target.value) || 1,
                          };
                          setProductEditorDraft({
                            ...productEditorDraft,
                            packSizes: next,
                          });
                        }}
                        title="Price Multiplier"
                        className="sm:col-span-2 px-2 py-1.5 bg-white rounded-lg font-mono"
                      />
                      {productEditorDraft.packSizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setProductEditorDraft({
                              ...productEditorDraft,
                              packSizes: productEditorDraft.packSizes.filter(
                                (item) => item.id !== pk.id
                              ),
                            })
                          }
                          className="sm:col-span-1 text-[#991B1B] cursor-pointer justify-self-end sm:justify-self-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Ingredients & Usage Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold">
                      4. Ingredients ({productEditorDraft.ingredients.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          ingredients: [
                            ...productEditorDraft.ingredients,
                            'New Pure Ingredient',
                          ],
                        })
                      }
                      className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                    >
                      + Add Ingredient
                    </button>
                  </div>
                  <div className="space-y-2">
                    {productEditorDraft.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ing}
                          onChange={(e) => {
                            const next = [...productEditorDraft.ingredients];
                            next[idx] = e.target.value;
                            setProductEditorDraft({
                              ...productEditorDraft,
                              ingredients: next,
                            });
                          }}
                          className="flex-1 px-2.5 py-1.5 bg-[#F6EBC8] rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProductEditorDraft({
                              ...productEditorDraft,
                              ingredients: productEditorDraft.ingredients.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="text-[#991B1B] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold">
                      5. Daily Ritual / Usage Steps (
                      {productEditorDraft.usageInstructions.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setProductEditorDraft({
                          ...productEditorDraft,
                          usageInstructions: [
                            ...productEditorDraft.usageInstructions,
                            'New preparation or storage instruction.',
                          ],
                        })
                      }
                      className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                    >
                      + Add Step
                    </button>
                  </div>
                  <div className="space-y-2">
                    {productEditorDraft.usageInstructions.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => {
                            const next = [...productEditorDraft.usageInstructions];
                            next[idx] = e.target.value;
                            setProductEditorDraft({
                              ...productEditorDraft,
                              usageInstructions: next,
                            });
                          }}
                          className="flex-1 px-2.5 py-1.5 bg-[#F6EBC8] rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProductEditorDraft({
                              ...productEditorDraft,
                              usageInstructions:
                                productEditorDraft.usageInstructions.filter(
                                  (_, i) => i !== idx
                                ),
                            })
                          }
                          className="text-[#991B1B] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. Product FAQs */}
              <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">
                    6. Product-Specific FAQs ({productEditorDraft.faqs.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setProductEditorDraft({
                        ...productEditorDraft,
                        faqs: [
                          ...productEditorDraft.faqs,
                          {
                            question: 'New Product Question?',
                            answer: 'Detailed answer for customers.',
                          },
                        ],
                      })
                    }
                    className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                  >
                    + Add Product FAQ
                  </button>
                </div>
                <div className="space-y-2.5">
                  {productEditorDraft.faqs.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F6EBC8] rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={f.question}
                          onChange={(e) => {
                            const next = [...productEditorDraft.faqs];
                            next[idx] = { ...f, question: e.target.value };
                            setProductEditorDraft({
                              ...productEditorDraft,
                              faqs: next,
                            });
                          }}
                          className="flex-1 px-2.5 py-1 bg-white rounded font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProductEditorDraft({
                              ...productEditorDraft,
                              faqs: productEditorDraft.faqs.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="text-[#991B1B] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={f.answer}
                        onChange={(e) => {
                          const next = [...productEditorDraft.faqs];
                          next[idx] = { ...f, answer: e.target.value };
                          setProductEditorDraft({
                            ...productEditorDraft,
                            faqs: next,
                          });
                        }}
                        className="w-full px-2.5 py-1 bg-white rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductEditorDraft(null)}
                  className="px-5 py-2.5 bg-white text-[#2C221E] rounded-full font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-full font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {isNewProductMode
                    ? 'Create & Publish Product'
                    : 'Save All Product Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: WEBSITE PAGE & SECTIONS EDITOR MODAL
          ===================================================================== */}
      {editingPageDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2C221E]/70 backdrop-blur-2xs">
          <div className="bg-[#F6EBC8] text-[#2C221E] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#2C221E]/15 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#2C221E]/10 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#4A5D23] font-semibold">
                  Website Page Builder · /page/{editingPageDraft.slug}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {editingPageDraft.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingPageDraft(null)}
                className="p-1.5 text-[#655549] hover:text-[#2C221E] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const cleanSlug = editingPageDraft.slug
                  .toLowerCase()
                  .replace(/[^a-z0-9-_]/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');
                upsertCustomPage({
                  ...editingPageDraft,
                  slug: cleanSlug || `page-${Date.now()}`,
                  updatedAt: new Date().toISOString().split('T')[0],
                });
                setEditingPageDraft(null);
                showToast(`Saved website page "${editingPageDraft.title}".`);
              }}
              className="overflow-y-auto p-4 sm:p-6 space-y-6 text-xs"
            >
              <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Page Title *</label>
                    <input
                      type="text"
                      required
                      value={editingPageDraft.title}
                      onChange={(e) =>
                        setEditingPageDraft({
                          ...editingPageDraft,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      URL Slug (/page/...) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPageDraft.slug}
                      onChange={(e) =>
                        setEditingPageDraft({
                          ...editingPageDraft,
                          slug: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Hero Kicker</label>
                    <input
                      type="text"
                      value={editingPageDraft.kicker}
                      onChange={(e) =>
                        setEditingPageDraft({
                          ...editingPageDraft,
                          kicker: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Page Hero Subtitle / Lead Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={editingPageDraft.subtitle}
                    onChange={(e) =>
                      setEditingPageDraft({
                        ...editingPageDraft,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F6EBC8] border border-[#2C221E]/15 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPageDraft.isPublished}
                      onChange={(e) =>
                        setEditingPageDraft({
                          ...editingPageDraft,
                          isPublished: e.target.checked,
                        })
                      }
                    />
                    <span>Published (Live)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPageDraft.showInHeader}
                      onChange={(e) =>
                        setEditingPageDraft({
                          ...editingPageDraft,
                          showInHeader: e.target.checked,
                        })
                      }
                    />
                    <span>Show Link in Top Header Navigation</span>
                  </label>
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPageDraft.showInFooter}
                      onChange={(e) =>
                        setEditingPageDraft({
                          ...editingPageDraft,
                          showInFooter: e.target.checked,
                        })
                      }
                    />
                    <span>Show Link in Footer</span>
                  </label>
                </div>
              </div>

              {/* Page Sections Builder */}
              <div className="bg-white p-5 rounded-2xl border border-[#2C221E]/8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold">
                    Page Content Sections ({editingPageDraft.sections.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPageDraft({
                        ...editingPageDraft,
                        sections: [
                          ...editingPageDraft.sections,
                          {
                            id: `sec-${Date.now()}`,
                            kicker: 'Section Kicker',
                            heading: 'New Content Section Heading',
                            body: 'Add paragraphs and details for this section.',
                            bulletPoints: ['Key highlight 1', 'Key highlight 2'],
                            ctaText: 'Explore Collection',
                            ctaLink: '#collection',
                            theme: 'white',
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#4A5D23] text-white rounded-xl font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Content Section</span>
                  </button>
                </div>

                {editingPageDraft.sections.map((sec, sIdx) => (
                  <div
                    key={sec.id}
                    className="p-4 bg-[#F6EBC8] rounded-2xl border border-[#2C221E]/12 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#4A5D23]">
                        Section #{sIdx + 1}
                      </span>
                      {editingPageDraft.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingPageDraft({
                              ...editingPageDraft,
                              sections: editingPageDraft.sections.filter(
                                (item) => item.id !== sec.id
                              ),
                            })
                          }
                          className="text-[#991B1B] font-semibold cursor-pointer"
                        >
                          Remove Section
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={sec.kicker || ''}
                        onChange={(e) => {
                          const next = [...editingPageDraft.sections];
                          next[sIdx] = { ...sec, kicker: e.target.value };
                          setEditingPageDraft({
                            ...editingPageDraft,
                            sections: next,
                          });
                        }}
                        placeholder="Section Kicker"
                        className="px-3 py-1.5 bg-white rounded-lg"
                      />
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => {
                          const next = [...editingPageDraft.sections];
                          next[sIdx] = { ...sec, heading: e.target.value };
                          setEditingPageDraft({
                            ...editingPageDraft,
                            sections: next,
                          });
                        }}
                        placeholder="Section Heading"
                        className="px-3 py-1.5 bg-white rounded-lg font-semibold"
                      />
                      <select
                        value={sec.theme}
                        onChange={(e) => {
                          const next = [...editingPageDraft.sections];
                          next[sIdx] = {
                            ...sec,
                            theme: e.target.value as CustomPageSection['theme'],
                          };
                          setEditingPageDraft({
                            ...editingPageDraft,
                            sections: next,
                          });
                        }}
                        className="px-3 py-1.5 bg-white rounded-lg"
                      >
                        <option value="white">Studio White</option>
                        <option value="cream">Desi Ghee Cream</option>
                        <option value="sand">Warm Sand</option>
                        <option value="espresso">Roasted Espresso</option>
                      </select>
                    </div>

                    <textarea
                      rows={3}
                      value={sec.body}
                      onChange={(e) => {
                        const next = [...editingPageDraft.sections];
                        next[sIdx] = { ...sec, body: e.target.value };
                        setEditingPageDraft({
                          ...editingPageDraft,
                          sections: next,
                        });
                      }}
                      placeholder="Section body paragraphs..."
                      className="w-full px-3 py-1.5 bg-white rounded-lg"
                    />

                    {/* Bullet points */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[11px]">
                          Bullet Points ({sec.bulletPoints.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...editingPageDraft.sections];
                            next[sIdx] = {
                              ...sec,
                              bulletPoints: [...sec.bulletPoints, 'New highlight'],
                            };
                            setEditingPageDraft({
                              ...editingPageDraft,
                              sections: next,
                            });
                          }}
                          className="text-[#4A5D23] font-semibold hover:underline cursor-pointer"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bp}
                            onChange={(e) => {
                              const nextBullets = [...sec.bulletPoints];
                              nextBullets[bIdx] = e.target.value;
                              const nextSecs = [...editingPageDraft.sections];
                              nextSecs[sIdx] = { ...sec, bulletPoints: nextBullets };
                              setEditingPageDraft({
                                ...editingPageDraft,
                                sections: nextSecs,
                              });
                            }}
                            className="flex-1 px-2.5 py-1 bg-white rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nextBullets = sec.bulletPoints.filter(
                                (_, i) => i !== bIdx
                              );
                              const nextSecs = [...editingPageDraft.sections];
                              nextSecs[sIdx] = { ...sec, bulletPoints: nextBullets };
                              setEditingPageDraft({
                                ...editingPageDraft,
                                sections: nextSecs,
                              });
                            }}
                            className="text-[#991B1B] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPageDraft(null)}
                  className="px-5 py-2.5 bg-white text-[#2C221E] rounded-full font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#4A5D23] hover:bg-[#3B4B1B] text-[#F5EFDC] rounded-full font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save & Publish Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Portal Footer matching #F5EFDC Nav Bar */}
      <footer className="bg-[#F6EBC8] border-t border-[#2C221E]/8 py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#655549]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif text-base font-bold text-[#4A5D23]">
            BAJOZ — The House of Naturals · Executive Admin Console
          </span>
          <span>
            Model Town, Lahore · 100% Pure Artisanal Nourishment
          </span>
        </div>
      </footer>
    </div>
  );
};
