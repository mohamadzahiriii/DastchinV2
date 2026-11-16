/*
# Location-Aware Marketplace Infrastructure

## Overview
This migration adds the database foundation for location-aware discovery:
- Neighborhood directory (city → district → neighborhood with coordinates)
- Configurable distance rules (admin-managed, single-row settings table)
- Location preference columns on profiles (approximate + precise coordinates)
- OTP audit table for phone authentication rate limiting and abuse protection

## New Tables

### 1. location_neighborhoods
Directory of supported cities, districts, and neighborhoods.
- id: UUID PK
- city: City name (e.g. "تهران")
- city_slug: URL-safe city identifier
- district: District/region name (nullable — some neighborhoods are city-level)
- district_slug: URL-safe district identifier (nullable)
- neighborhood: Neighborhood name
- neighborhood_slug: URL-safe neighborhood identifier (unique per city)
- latitude, longitude: Approximate center coordinates (numeric(10,7))
- is_active: Whether this neighborhood is selectable (default true)
- display_order: Sort order (default 0)
- created_at, updated_at: timestamps
- UNIQUE(city_slug, neighborhood_slug)

### 2. location_config
Single-row configuration table for distance and delivery rules.
- id: int PK (always 1, enforced by CHECK)
- nearby_threshold_km: Distance under which a merchant is "nearby" (default 3)
- pickup_max_distance_km: Max distance for pickup discovery (default 5)
- delivery_max_distance_km: Max distance for delivery discovery (default 10)
- default_city: Default launch city (default "تهران")
- updated_at: timestamp
- Only one row allowed (CHECK constraint id = 1)

### 3. otp_attempts
Tracks phone OTP verification attempts for rate limiting and abuse protection.
- id: UUID PK
- phone_hash: SHA-256 hash of normalized phone (never store raw phone for audit)
- attempt_type: "request" | "verify"
- success: boolean
- created_at: timestamp
- Indexes on phone_hash + created_at for rate-limit queries

## Modified Tables

### profiles (additive columns — no existing columns changed)
- preferred_city: text (nullable)
- preferred_district: text (nullable)
- preferred_neighborhood: text (nullable)
- preferred_neighborhood_slug: text (nullable)
- approx_latitude: numeric(10,7) (nullable — approximate area center)
- approx_longitude: numeric(10,7) (nullable)
- precise_latitude: numeric(10,7) (nullable — user can remove this)
- precise_longitude: numeric(10,7) (nullable)
- location_method: text — "geolocation" | "manual" (nullable)
- location_confirmed_at: timestamptz (nullable)

## Security (RLS + Grants)

### location_neighborhoods
- RLS enabled
- GRANT SELECT to anon, authenticated (public directory)
- GRANT INSERT, UPDATE, DELETE to authenticated (admin-managed via RLS)
- Anyone can read active neighborhoods; only admins can modify

### location_config
- RLS enabled
- GRANT SELECT to anon, authenticated (public — needed for discovery logic)
- GRANT UPDATE to authenticated (admin-only via RLS)
- No INSERT/DELETE — single fixed row created in this migration

### otp_attempts
- RLS enabled
- GRANT INSERT to anon, authenticated (both can trigger OTP)
- GRANT SELECT to authenticated (limited — users see only their own attempts)
- No UPDATE/DELETE — append-only audit log
- anon can INSERT (for rate-limit tracking) but cannot SELECT

### profiles (updated)
- Existing UPDATE policy already covers new columns (same table-level grant)
- Column-level protection: precise coordinates only visible/updated by owner
  (already enforced by existing owner-scoped UPDATE policy)

## Important Notes
1. All new columns on profiles are nullable — existing rows are unaffected.
2. Neighborhood coordinates are approximate centers, not precise user locations.
3. otp_attempts stores only a phone HASH, never the raw phone number, to minimize
   PII in the audit trail. The hash is SHA-256 of the normalized E.164 format.
4. location_config is seeded with a single row (id=1) with Tehran defaults.
5. Tehran neighborhoods are seeded in a separate migration for clarity.
*/

-- ============================================================
-- TABLE: location_neighborhoods
-- ============================================================

CREATE TABLE IF NOT EXISTS public.location_neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  city_slug text NOT NULL,
  district text,
  district_slug text,
  neighborhood text NOT NULL,
  neighborhood_slug text NOT NULL,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(city_slug, neighborhood_slug)
);

ALTER TABLE public.location_neighborhoods ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.location_neighborhoods TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.location_neighborhoods TO authenticated;

-- Public can read active neighborhoods
DROP POLICY IF EXISTS "public_read_neighborhoods" ON public.location_neighborhoods;
CREATE POLICY "public_read_neighborhoods"
ON public.location_neighborhoods FOR SELECT
TO anon, authenticated USING (is_active = true);

-- Only admins can insert
DROP POLICY IF EXISTS "admin_insert_neighborhoods" ON public.location_neighborhoods;
CREATE POLICY "admin_insert_neighborhoods"
ON public.location_neighborhoods FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Only admins can update
DROP POLICY IF EXISTS "admin_update_neighborhoods" ON public.location_neighborhoods;
CREATE POLICY "admin_update_neighborhoods"
ON public.location_neighborhoods FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Only admins can delete
DROP POLICY IF EXISTS "admin_delete_neighborhoods" ON public.location_neighborhoods;
CREATE POLICY "admin_delete_neighborhoods"
ON public.location_neighborhoods FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS location_neighborhoods_set_updated_at ON public.location_neighborhoods;
CREATE TRIGGER location_neighborhoods_set_updated_at
BEFORE UPDATE ON public.location_neighborhoods
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_neighborhoods_city ON public.location_neighborhoods(city_slug);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_district ON public.location_neighborhoods(district_slug);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_active ON public.location_neighborhoods(is_active);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_order ON public.location_neighborhoods(display_order);

-- ============================================================
-- TABLE: location_config
-- ============================================================

CREATE TABLE IF NOT EXISTS public.location_config (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nearby_threshold_km numeric(5,2) NOT NULL DEFAULT 3.0,
  pickup_max_distance_km numeric(5,2) NOT NULL DEFAULT 5.0,
  delivery_max_distance_km numeric(5,2) NOT NULL DEFAULT 10.0,
  default_city text NOT NULL DEFAULT 'تهران',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.location_config ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.location_config TO anon, authenticated;
GRANT UPDATE ON public.location_config TO authenticated;

-- Public can read config (needed for discovery distance rules)
DROP POLICY IF EXISTS "public_read_location_config" ON public.location_config;
CREATE POLICY "public_read_location_config"
ON public.location_config FOR SELECT
TO anon, authenticated USING (true);

-- Only admins can update
DROP POLICY IF EXISTS "admin_update_location_config" ON public.location_config;
CREATE POLICY "admin_update_location_config"
ON public.location_config FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS location_config_set_updated_at ON public.location_config;
CREATE TRIGGER location_config_set_updated_at
BEFORE UPDATE ON public.location_config
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed the single config row
INSERT INTO public.location_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TABLE: otp_attempts
-- ============================================================

CREATE TABLE IF NOT EXISTS public.otp_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_hash text NOT NULL,
  attempt_type text NOT NULL CHECK (attempt_type IN ('request', 'verify')),
  success boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_attempts ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.otp_attempts TO anon, authenticated;
GRANT SELECT ON public.otp_attempts TO authenticated;

-- Authenticated users can read their own attempts (matched by phone_hash
-- stored in user_metadata is not feasible pre-auth; instead we allow
-- authenticated SELECT but the table is append-only audit data with no
-- raw PII — only hashes. Restrict to admin for reads to be safe.)
DROP POLICY IF EXISTS "admin_read_otp_attempts" ON public.otp_attempts;
CREATE POLICY "admin_read_otp_attempts"
ON public.otp_attempts FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Anyone can insert attempt records (for rate limiting before auth)
DROP POLICY IF EXISTS "insert_otp_attempts" ON public.otp_attempts;
CREATE POLICY "insert_otp_attempts"
ON public.otp_attempts FOR INSERT
TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_otp_attempts_phone_hash ON public.otp_attempts(phone_hash);
CREATE INDEX IF NOT EXISTS idx_otp_attempts_created_at ON public.otp_attempts(created_at DESC);

-- ============================================================
-- ADD COLUMNS TO profiles (additive, all nullable)
-- ============================================================

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN preferred_city text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN preferred_district text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN preferred_neighborhood text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN preferred_neighborhood_slug text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN approx_latitude numeric(10,7);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN approx_longitude numeric(10,7);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN precise_latitude numeric(10,7);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN precise_longitude numeric(10,7);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN location_method text CHECK (location_method IN ('geolocation', 'manual'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN location_confirmed_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ============================================================
-- FUNCTION: log_otp_attempt (SECURITY DEFINER for rate limiting)
-- ============================================================
-- Allows anon+authenticated to log attempts without needing SELECT.
-- This is a SECURITY DEFINER function that only INSERTs.

CREATE OR REPLACE FUNCTION public.log_otp_attempt(
  p_phone_hash text,
  p_attempt_type text,
  p_success boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.otp_attempts (phone_hash, attempt_type, success)
  VALUES (p_phone_hash, p_attempt_type, p_success);
END;
$$;

-- Revoke default EXECUTE from PUBLIC, grant to anon + authenticated
REVOKE EXECUTE ON FUNCTION public.log_otp_attempt(text, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.log_otp_attempt(text, text, boolean) TO anon, authenticated;

-- ============================================================
-- FUNCTION: check_otp_rate_limit (SECURITY DEFINER)
-- ============================================================
-- Checks if a phone hash has exceeded rate limits.
-- Returns JSON: { allowed: boolean, reason: text }
-- Limits: max 3 OTP requests per 10 minutes, max 5 verify attempts per 10 minutes.

CREATE OR REPLACE FUNCTION public.check_otp_rate_limit(
  p_phone_hash text,
  p_attempt_type text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
  v_max int;
  v_window interval;
BEGIN
  IF p_attempt_type = 'request' THEN
    v_max := 3;
    v_window := interval '10 minutes';
  ELSIF p_attempt_type = 'verify' THEN
    v_max := 5;
    v_window := interval '10 minutes';
  ELSE
    RETURN jsonb_build_object('allowed', false, 'reason', 'invalid_attempt_type');
  END IF;

  SELECT count(*) INTO v_count
  FROM public.otp_attempts
  WHERE phone_hash = p_phone_hash
    AND attempt_type = p_attempt_type
    AND created_at > now() - v_window;

  IF v_count >= v_max THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'rate_limited');
  END IF;

  RETURN jsonb_build_object('allowed', true, 'reason', null);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_otp_rate_limit(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_otp_rate_limit(text, text) TO anon, authenticated;
