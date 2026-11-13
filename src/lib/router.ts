/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BAJOZ Custom-Domain Routing System (https://bajoz.pk)
 * Supports clean international URLs on Hostinger custom domain hosting:
 *  - /                       -> Homepage
 *  - /shop                   -> Shop All Products Page
 *  - /product/:productId     -> Product Detail Page (spicemix, panjeeri, toothpowder)
 *  - /page/:slug             -> Custom CMS Page
 *  - /track                  -> Opens Live Order Tracking Modal
 *  - /track/:orderNumber     -> Opens Live Order Tracking Modal with pre-filled code
 *  - /account | /login       -> Opens Customer Account Portal (Sign In)
 *  - /register | /signup     -> Opens Customer Account Portal (Register)
 *  - /checkout               -> Opens Order Booking Form Modal
 *  - /cart                   -> Opens Shopping Bag Drawer
 *  - /admin                  -> Authorized BAJOZ Staff Admin Portal
 * Also maintains full backward compatibility with legacy /dtcss/* routes.
 */

export interface ParsedRouteState {
  view: 'store' | 'admin';
  pageSlug: string | null;
  productId: string | null;
  modalIntent:
    | 'track'
    | 'signin'
    | 'signup'
    | 'checkout'
    | 'cart'
    | 'favorites'
    | null;
  trackingCode: string | null;
}

const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  spicemix: 'spicemix',
  'spice-mix': 'spicemix',
  panjeeri: 'panjeeri',
  'homemade-panjeeri': 'panjeeri',
  toothpowder: 'toothpowder',
  'tooth-powder': 'toothpowder',
  'tooth-guardian': 'toothpowder',
  toothguardian: 'toothpowder',
};

export function normalizeProductSlug(rawSlug: string | null | undefined): string | null {
  if (!rawSlug) return null;
  const clean = rawSlug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!clean) return null;
  return PRODUCT_SLUG_ALIASES[clean] || clean;
}

export function parseCurrentLocation(): ParsedRouteState {
  const fallback: ParsedRouteState = {
    view: 'store',
    pageSlug: null,
    productId: null,
    modalIntent: null,
    trackingCode: null,
  };

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const rawPath = window.location.pathname || '/';
    const path = rawPath
      .toLowerCase()
      .replace(/^\/dtcss(?=\/|$)/i, '')
      .replace(/\/+$/, '') || '/';
    const hash = (window.location.hash || '').toLowerCase();
    const params = new URLSearchParams(window.location.search);

    // 1. Admin Portal Check
    if (
      path === '/admin' ||
      path.startsWith('/admin/') ||
      rawPath.toLowerCase().endsWith('/admin') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      hash === '#/dtcss/admin' ||
      params.get('portal') === 'admin' ||
      params.get('admin') === '1'
    ) {
      return {
        ...fallback,
        view: 'admin',
      };
    }

    // 2. Direct Product URLs: /product/:id or /products/:id or direct alias (/spicemix, /panjeeri, /tooth-guardian)
    const productMatch = path.match(/^\/products?\/([a-z0-9-_]+)$/i);
    if (productMatch && productMatch[1]) {
      return {
        ...fallback,
        productId: normalizeProductSlug(productMatch[1]),
      };
    }
    if (path === '/spicemix' || path === '/panjeeri' || path === '/tooth-guardian' || path === '/toothpowder') {
      return {
        ...fallback,
        productId: normalizeProductSlug(path.slice(1)),
      };
    }
    if (params.get('product')) {
      return {
        ...fallback,
        productId: normalizeProductSlug(params.get('product')),
      };
    }

    // 3. Interactive Recipe & Usage Guide Page (/guide, /recipe-guide, /kitchen-guide, /page/guide)
    if (
      path === '/guide' ||
      path === '/recipe-guide' ||
      path === '/kitchen-guide' ||
      path === '/page/guide' ||
      hash === '#guide' ||
      hash === '#/guide' ||
      params.get('page') === 'guide' ||
      params.get('guide') === '1'
    ) {
      return {
        ...fallback,
        pageSlug: 'guide',
      };
    }

    // 4. Shop All Page: /shop or /page/shop
    if (path === '/shop' || path === '/page/shop' || params.get('page') === 'shop') {
      return {
        ...fallback,
        pageSlug: 'shop',
      };
    }

    // 5. Custom CMS Pages: /page/:slug
    const pageMatch = path.match(/^\/page\/([a-z0-9-_]+)$/i);
    if (pageMatch && pageMatch[1]) {
      return {
        ...fallback,
        pageSlug: pageMatch[1],
      };
    }
    if (params.get('page')) {
      return {
        ...fallback,
        pageSlug: params.get('page'),
      };
    }

    // 5. Deep-linked Interactive Modals (/track, /track/:code, /account, /login, /register, /checkout, /cart)
    const trackMatch = path.match(/^\/track(?:\/([a-z0-9-]+))?$/i);
    if (trackMatch || params.get('track')) {
      const code = (trackMatch?.[1] || params.get('track') || '').toUpperCase() || null;
      return {
        ...fallback,
        modalIntent: 'track',
        trackingCode: code,
      };
    }

    if (path === '/account' || path === '/login' || path === '/signin') {
      return {
        ...fallback,
        modalIntent: 'signin',
      };
    }

    if (path === '/register' || path === '/signup') {
      return {
        ...fallback,
        modalIntent: 'signup',
      };
    }

    if (path === '/checkout' || path === '/book-order') {
      return {
        ...fallback,
        modalIntent: 'checkout',
      };
    }

    if (path === '/cart' || path === '/bag') {
      return {
        ...fallback,
        modalIntent: 'cart',
      };
    }
  } catch {
    // ignore URL parse errors
  }

  return fallback;
}

export function buildCanonicalPath(state: {
  view: 'store' | 'admin';
  pageSlug?: string | null;
  productId?: string | null;
}): string {
  if (state.view === 'admin') {
    return '/admin';
  }
  if (state.productId) {
    return `/product/${encodeURIComponent(state.productId)}`;
  }
  if (state.pageSlug === 'guide') {
    return '/guide';
  }
  if (state.pageSlug === 'shop') {
    return '/shop';
  }
  if (state.pageSlug) {
    return `/page/${encodeURIComponent(state.pageSlug)}`;
  }
  return '/';
}
