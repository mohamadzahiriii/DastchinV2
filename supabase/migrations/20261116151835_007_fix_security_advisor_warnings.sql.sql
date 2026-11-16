-- Fix mutable search_path on set_updated_at
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;

-- Revoke EXECUTE on SECURITY DEFINER functions from anon and authenticated
-- handle_new_user should only be called by the auth trigger, not via REST
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- create_product_inventory should only be called via trigger, not via REST
REVOKE EXECUTE ON FUNCTION public.create_product_inventory() FROM anon, authenticated;
