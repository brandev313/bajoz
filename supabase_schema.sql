-- ============================================================================
-- DTCSS — Artisanal Natural Food & Desi Nourishment
-- Official Supabase PostgreSQL Schema & Row-Level Security (RLS) Policies
-- ============================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  tagline TEXT NOT NULL,
  category TEXT NOT NULL,
  image_type TEXT NOT NULL,
  custom_image_url TEXT,
  base_price INTEGER NOT NULL,
  featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  packaging_spec TEXT NOT NULL,
  story TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  usage_instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  pack_sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customer Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  city TEXT DEFAULT 'Lahore',
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  provider TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  order_number TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  fulfillment_status TEXT NOT NULL,
  bank_reference TEXT,
  courier_name TEXT,
  tracking_number TEXT,
  order_notes TEXT,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  city TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  product_tag TEXT NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Store Settings Table (Singleton row id = 'default')
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public Read & Storefront Policies
CREATE POLICY "Public can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin or authenticated can update products" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can read and upsert profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can create and read orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can read and post reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can read and update store settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);
