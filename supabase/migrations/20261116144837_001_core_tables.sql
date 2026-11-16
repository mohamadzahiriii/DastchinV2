/*
# Create Core Tables: profiles, user_roles, categories, merchant_profiles

## Overview
This migration creates the foundational tables for the Ganjineh marketplace platform.

## New Tables

### 1. profiles
Stores user profile information linked to Supabase Auth.
- id: UUID, references auth.users, primary key
- full_name: User's display name
- phone: Iranian phone number (optional)
- email: Email address (optional, synced from auth)
- avatar_url: Profile image URL
- account_status: active | suspended | restricted (default: active)
- created_at, updated_at: timestamps

### 2. user_roles
Stores authorization roles for users. A user can have multiple roles.
- id: UUID primary key
- user_id: references auth.users
- role: customer | merchant | admin (enum)
- created_at: timestamp
- Unique constraint on (user_id, role) to prevent duplicates
- NOTE: Roles must NEVER be inserted from the browser. Only admins or
  server-side functions may assign roles. RLS prevents users from
  modifying their own roles.

### 3. categories
Marketplace categories with parent/child support.
- id: UUID primary key
- name: Category display name
- slug: URL-safe identifier (unique)
- description: Category description
- image_url: Category image
- parent_id: Self-reference for child categories (nullable)
- is_active: Whether category is visible (default: true)
- display_order: Sort order (default: 0)
- created_at, updated_at: timestamps

### 4. merchant_profiles
Business information for merchants.
- id: UUID primary key
- owner_user_id: references auth.users
- business_name: Display name
- slug: URL-safe identifier (unique)
- description: Business description
- business_category_id: references categories
- logo_url, cover_image_url: Image URLs
- phone, email: Contact info
- address, city, district: Location
- latitude, longitude: Geo coordinates
- verification_status: pending | approved | rejected | suspended (default: pending)
- business_status: active | inactive (default: active)
- created_at, updated_at: timestamps

## Security (RLS + Grants)

### profiles
- RLS enabled
- GRANT SELECT, UPDATE to authenticated (no INSERT — created by trigger/server)
- Users can SELECT/UPDATE only their own profile

### user_roles
- RLS enabled
- GRANT SELECT to authenticated (users can see their own roles)
- No INSERT/UPDATE/DELETE for authenticated — roles assigned server-side only
- Users can SELECT only their own roles

### categories
- RLS enabled
- GRANT SELECT to anon, authenticated (public catalog)
- GRANT INSERT, UPDATE, DELETE to authenticated (admin-managed; RLS restricts to admins)
- Anyone can read active categories; only admins can modify

### merchant_profiles
- RLS enabled
- GRANT SELECT to anon, authenticated (public business directory)
- GRANT INSERT, UPDATE to authenticated (merchant self-service)
- Anyone can read approved merchants; merchant owners can read/update their own;
  unapproved merchant data is NOT publicly visible

## Important Notes
1. All UUIDs use gen_random_uuid()
2. updated_at columns auto-update via trigger
3. Foreign keys use ON DELETE CASCADE only where data is truly dependent
4. Merchant profiles use ON DELETE SET NULL for category reference (preserve merchant
   even if category is removed)
5. user_roles uses ON DELETE CASCADE (roles removed when user is deleted)
6. profiles uses ON DELETE CASCADE (profile removed when auth user is deleted)
*/

-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'merchant', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('active', 'suspended', 'restricted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE business_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TABLE: profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  avatar_url text,
  account_status account_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile"
ON public.profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile"
ON public.profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABLE: user_roles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles; cannot insert/update/delete (server-only)
GRANT SELECT ON public.user_roles TO authenticated;

DROP POLICY IF EXISTS "select_own_roles" ON public.user_roles;
CREATE POLICY "select_own_roles"
ON public.user_roles FOR SELECT
TO authenticated USING (auth.uid() = user_id);

-- Index for fast role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ============================================================
-- TABLE: categories
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories; only admins can modify (RLS restricts writes)
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;

-- Anyone can read active categories
DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
CREATE POLICY "public_read_categories"
ON public.categories FOR SELECT
TO anon, authenticated USING (is_active = true);

-- Only admins can write (is_admin check via user_roles)
DROP POLICY IF EXISTS "admin_insert_categories" ON public.categories;
CREATE POLICY "admin_insert_categories"
ON public.categories FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "admin_update_categories" ON public.categories;
CREATE POLICY "admin_update_categories"
ON public.categories FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "admin_delete_categories" ON public.categories;
CREATE POLICY "admin_delete_categories"
ON public.categories FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS categories_set_updated_at ON public.categories;
CREATE TRIGGER categories_set_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- ============================================================
-- TABLE: merchant_profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.merchant_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  business_category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  logo_url text,
  cover_image_url text,
  phone text,
  email text,
  address text,
  city text NOT NULL DEFAULT 'تهران',
  district text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  verification_status verification_status NOT NULL DEFAULT 'pending',
  business_status business_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.merchant_profiles ENABLE ROW LEVEL SECURITY;

-- Public can read approved merchants; authenticated can manage their own
GRANT SELECT ON public.merchant_profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.merchant_profiles TO authenticated;

-- Anyone can read APPROVED merchants (public business directory)
DROP POLICY IF EXISTS "public_read_approved_merchants" ON public.merchant_profiles;
CREATE POLICY "public_read_approved_merchants"
ON public.merchant_profiles FOR SELECT
TO anon, authenticated USING (verification_status = 'approved' AND business_status = 'active');

-- Owners can read their own merchant profile (regardless of status)
DROP POLICY IF EXISTS "owner_read_own_merchant" ON public.merchant_profiles;
CREATE POLICY "owner_read_own_merchant"
ON public.merchant_profiles FOR SELECT
TO authenticated USING (auth.uid() = owner_user_id);

-- Admins can read all merchant profiles
DROP POLICY IF EXISTS "admin_read_all_merchants" ON public.merchant_profiles;
CREATE POLICY "admin_read_all_merchants"
ON public.merchant_profiles FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Owners can insert their own merchant profile (starts as pending)
DROP POLICY IF EXISTS "owner_insert_merchant" ON public.merchant_profiles;
CREATE POLICY "owner_insert_merchant"
ON public.merchant_profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = owner_user_id);

-- Owners can update their own merchant profile (cannot change verification_status)
DROP POLICY IF EXISTS "owner_update_own_merchant" ON public.merchant_profiles;
CREATE POLICY "owner_update_own_merchant"
ON public.merchant_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = owner_user_id)
WITH CHECK (
  auth.uid() = owner_user_id AND
  verification_status = (SELECT verification_status FROM public.merchant_profiles WHERE id = merchant_profiles.id)
);

-- Admins can update any merchant profile (including verification_status)
DROP POLICY IF EXISTS "admin_update_any_merchant" ON public.merchant_profiles;
CREATE POLICY "admin_update_any_merchant"
ON public.merchant_profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS merchant_profiles_set_updated_at ON public.merchant_profiles;
CREATE TRIGGER merchant_profiles_set_updated_at
BEFORE UPDATE ON public.merchant_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_merchant_profiles_owner ON public.merchant_profiles(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_category ON public.merchant_profiles(business_category_id);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_verification ON public.merchant_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_city ON public.merchant_profiles(city);
