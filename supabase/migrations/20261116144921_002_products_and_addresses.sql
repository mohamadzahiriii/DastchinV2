/*
# Create Product & Address Tables: addresses, products, product_inventory, product_availability

## Overview
This migration creates the product catalog, inventory, availability, and customer address tables.

## New Tables

### 1. addresses
Stores customer delivery addresses.
- id: UUID primary key
- user_id: references auth.users (CASCADE)
- title: Label (e.g. "Home", "Work")
- recipient_name, phone: Delivery contact
- province, city, district, address_line, postal_code: Location fields
- latitude, longitude: Geo coordinates (numeric(10,7) for precision)
- is_default: Boolean (only one default per user enforced by partial unique index)
- created_at, updated_at: timestamps

### 2. products
Product catalog with precise monetary storage.
- id: UUID primary key
- merchant_id: references merchant_profiles (CASCADE)
- category_id: references categories (SET NULL)
- name, slug, description: Product details
- original_price, discounted_price: bigint (Toman — Iranian currency has no subunits,
  so bigint prevents floating-point errors and stores exact values)
- currency: IRR (Rial) | IRT (Toman) — defaults to IRT
- product_type: regular_offer | surprise_selection
- image_urls: text[] array
- ingredients, allergen_information (text[]), storage_information
- is_active: Whether product is visible
- created_at, updated_at: timestamps
- Unique constraint on (merchant_id, slug)

### 3. product_inventory
Separate inventory tracking per product.
- id: UUID primary key
- product_id: references products (CASCADE)
- available_quantity, reserved_quantity, sold_quantity: int (non-negative)
- updated_at: timestamp
- One-to-one with products (unique on product_id)

### 4. product_availability
Daily availability and collection windows.
- id: UUID primary key
- product_id: references products (CASCADE)
- availability_date: date
- pickup_start_time, pickup_end_time: time
- pickup_enabled, delivery_enabled, is_available: booleans
- created_at, updated_at: timestamps
- Unique constraint on (product_id, availability_date)

## Security (RLS + Grants)

### addresses
- RLS enabled, GRANT CRUD to authenticated
- Users can only manage their own addresses

### products
- RLS enabled
- GRANT SELECT to anon, authenticated (public catalog)
- GRANT INSERT, UPDATE, DELETE to authenticated (merchant-managed; RLS restricts)
- Public reads only active products from approved merchants
- Merchants can CRUD only their own products
- Admins can access all products

### product_inventory
- RLS enabled
- GRANT SELECT to authenticated
- GRANT INSERT, UPDATE to authenticated
- No DELETE — inventory is permanent record (soft management)
- Public SELECT not needed (inventory is merchant/admin concern)
- Merchants manage their own product inventory via parent ownership check
- Admins can read all inventory

### product_availability
- RLS enabled
- GRANT SELECT to anon, authenticated (public — customers need to see pickup windows)
- GRANT INSERT, UPDATE, DELETE to authenticated
- Public can read availability for active products from approved merchants
- Merchants manage their own product availability

## Important Notes
1. Prices stored as bigint — Toman (Iranian currency) has no subunits,
   so integer storage avoids all floating-point rounding errors.
2. No ON DELETE CASCADE on product_inventory/availability — they cascade
   from products which cascade from merchant_profiles.
3. The addresses table has a partial unique index on (user_id, is_default)
   to enforce only one default address per user.
4. allergen_information is a text array for flexible allergen tagging.
*/

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE product_type AS ENUM ('regular_offer', 'surprise_selection');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE currency_code AS ENUM ('IRR', 'IRT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLE: addresses
-- ============================================================

CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  recipient_name text NOT NULL,
  phone text NOT NULL,
  province text NOT NULL,
  city text NOT NULL,
  district text,
  address_line text NOT NULL,
  postal_code text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;

DROP POLICY IF EXISTS "select_own_addresses" ON public.addresses;
CREATE POLICY "select_own_addresses"
ON public.addresses FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON public.addresses;
CREATE POLICY "insert_own_addresses"
ON public.addresses FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON public.addresses;
CREATE POLICY "update_own_addresses"
ON public.addresses FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON public.addresses;
CREATE POLICY "delete_own_addresses"
ON public.addresses FOR DELETE
TO authenticated USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS addresses_set_updated_at ON public.addresses;
CREATE TRIGGER addresses_set_updated_at
BEFORE UPDATE ON public.addresses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enforce only one default address per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_addresses_default_per_user
ON public.addresses(user_id) WHERE is_default = true;

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- ============================================================
-- TABLE: products
-- ============================================================

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchant_profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  original_price bigint NOT NULL CHECK (original_price > 0),
  discounted_price bigint NOT NULL CHECK (discounted_price > 0),
  currency currency_code NOT NULL DEFAULT 'IRT',
  product_type product_type NOT NULL DEFAULT 'regular_offer',
  image_urls text[] NOT NULL DEFAULT '{}',
  ingredients text,
  allergen_information text[],
  storage_information text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (discounted_price <= original_price),
  UNIQUE(merchant_id, slug)
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

-- Public can read active products from APPROVED merchants only
DROP POLICY IF EXISTS "public_read_active_products" ON public.products;
CREATE POLICY "public_read_active_products"
ON public.products FOR SELECT
TO anon, authenticated USING (
  is_active = true AND
  EXISTS (
    SELECT 1 FROM public.merchant_profiles mp
    WHERE mp.id = products.merchant_id
    AND mp.verification_status = 'approved'
    AND mp.business_status = 'active'
  )
);

-- Merchants can read their own products (regardless of active status)
DROP POLICY IF EXISTS "merchant_read_own_products" ON public.products;
CREATE POLICY "merchant_read_own_products"
ON public.products FOR SELECT
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.merchant_profiles mp
    WHERE mp.id = products.merchant_id AND mp.owner_user_id = auth.uid()
  )
);

-- Admins can read all products
DROP POLICY IF EXISTS "admin_read_all_products" ON public.products;
CREATE POLICY "admin_read_all_products"
ON public.products FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Merchants can INSERT only their own products
DROP POLICY IF EXISTS "merchant_insert_own_products" ON public.products;
CREATE POLICY "merchant_insert_own_products"
ON public.products FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.merchant_profiles mp
    WHERE mp.id = products.merchant_id AND mp.owner_user_id = auth.uid()
  )
);

-- Merchants can UPDATE only their own products
DROP POLICY IF EXISTS "merchant_update_own_products" ON public.products;
CREATE POLICY "merchant_update_own_products"
ON public.products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.merchant_profiles mp
    WHERE mp.id = products.merchant_id AND mp.owner_user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.merchant_profiles mp
    WHERE mp.id = products.merchant_id AND mp.owner_user_id = auth.uid()
  )
);

-- Merchants can DELETE only their own products
DROP POLICY IF EXISTS "merchant_delete_own_products" ON public.products;
CREATE POLICY "merchant_delete_own_products"
ON public.products FOR DELETE
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.merchant_profiles mp
    WHERE mp.id = products.merchant_id AND mp.owner_user_id = auth.uid()
  )
);

-- Admins can UPDATE any product (e.g. deactivate for review)
DROP POLICY IF EXISTS "admin_update_any_product" ON public.products;
CREATE POLICY "admin_update_any_product"
ON public.products FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;
CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_merchant_id ON public.products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ============================================================
-- TABLE: product_inventory
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  available_quantity int NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
  reserved_quantity int NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  sold_quantity int NOT NULL DEFAULT 0 CHECK (sold_quantity >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.product_inventory TO authenticated;

-- Merchants can read their own product inventory
DROP POLICY IF EXISTS "merchant_read_own_inventory" ON public.product_inventory;
CREATE POLICY "merchant_read_own_inventory"
ON public.product_inventory FOR SELECT
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_inventory.product_id AND mp.owner_user_id = auth.uid()
  )
);

-- Admins can read all inventory
DROP POLICY IF EXISTS "admin_read_all_inventory" ON public.product_inventory;
CREATE POLICY "admin_read_all_inventory"
ON public.product_inventory FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Merchants can INSERT inventory for their own products
DROP POLICY IF EXISTS "merchant_insert_own_inventory" ON public.product_inventory;
CREATE POLICY "merchant_insert_own_inventory"
ON public.product_inventory FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_inventory.product_id AND mp.owner_user_id = auth.uid()
  )
);

-- Merchants can UPDATE inventory for their own products
DROP POLICY IF EXISTS "merchant_update_own_inventory" ON public.product_inventory;
CREATE POLICY "merchant_update_own_inventory"
ON public.product_inventory FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_inventory.product_id AND mp.owner_user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_inventory.product_id AND mp.owner_user_id = auth.uid()
  )
);

DROP TRIGGER IF EXISTS product_inventory_set_updated_at ON public.product_inventory;
CREATE TRIGGER product_inventory_set_updated_at
BEFORE UPDATE ON public.product_inventory
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create inventory row when a product is inserted
CREATE OR REPLACE FUNCTION public.create_product_inventory()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.product_inventory (product_id, available_quantity)
  VALUES (NEW.id, 0)
  ON CONFLICT (product_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_create_inventory ON public.products;
CREATE TRIGGER products_create_inventory
AFTER INSERT ON public.products
FOR EACH ROW EXECUTE FUNCTION public.create_product_inventory();

-- ============================================================
-- TABLE: product_availability
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  availability_date date NOT NULL,
  pickup_start_time time NOT NULL,
  pickup_end_time time NOT NULL,
  pickup_enabled boolean NOT NULL DEFAULT true,
  delivery_enabled boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (pickup_end_time > pickup_start_time),
  UNIQUE(product_id, availability_date)
);

ALTER TABLE public.product_availability ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.product_availability TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_availability TO authenticated;

-- Public can read availability for active products from approved merchants
DROP POLICY IF EXISTS "public_read_availability" ON public.product_availability;
CREATE POLICY "public_read_availability"
ON public.product_availability FOR SELECT
TO anon, authenticated USING (
  is_available = true AND
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_availability.product_id
    AND p.is_active = true
    AND mp.verification_status = 'approved'
    AND mp.business_status = 'active'
  )
);

-- Merchants can read their own product availability
DROP POLICY IF EXISTS "merchant_read_own_availability" ON public.product_availability;
CREATE POLICY "merchant_read_own_availability"
ON public.product_availability FOR SELECT
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_availability.product_id AND mp.owner_user_id = auth.uid()
  )
);

-- Admins can read all availability
DROP POLICY IF EXISTS "admin_read_all_availability" ON public.product_availability;
CREATE POLICY "admin_read_all_availability"
ON public.product_availability FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Merchants can INSERT availability for their own products
DROP POLICY IF EXISTS "merchant_insert_own_availability" ON public.product_availability;
CREATE POLICY "merchant_insert_own_availability"
ON public.product_availability FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_availability.product_id AND mp.owner_user_id = auth.uid()
  )
);

-- Merchants can UPDATE availability for their own products
DROP POLICY IF EXISTS "merchant_update_own_availability" ON public.product_availability;
CREATE POLICY "merchant_update_own_availability"
ON public.product_availability FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_availability.product_id AND mp.owner_user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_availability.product_id AND mp.owner_user_id = auth.uid()
  )
);

-- Merchants can DELETE availability for their own products
DROP POLICY IF EXISTS "merchant_delete_own_availability" ON public.product_availability;
CREATE POLICY "merchant_delete_own_availability"
ON public.product_availability FOR DELETE
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchant_profiles mp ON mp.id = p.merchant_id
    WHERE p.id = product_availability.product_id AND mp.owner_user_id = auth.uid()
  )
);

DROP TRIGGER IF EXISTS product_availability_set_updated_at ON public.product_availability;
CREATE TRIGGER product_availability_set_updated_at
BEFORE UPDATE ON public.product_availability
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_product_availability_product_id ON public.product_availability(product_id);
CREATE INDEX IF NOT EXISTS idx_product_availability_date ON public.product_availability(availability_date);
