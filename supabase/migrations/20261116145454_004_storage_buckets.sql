-- 004_storage_buckets
-- Creates four private storage buckets for user file uploads and their RLS policies.
-- Object paths follow convention: {user_id}/{filename}
-- (storage.foldername(name))[1] gets the first folder segment as text.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profile-avatars', 'profile-avatars', false, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('merchant-logos', 'merchant-logos', false, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('merchant-covers', 'merchant-covers', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('product-images', 'product-images', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- profile-avatars: owner-scoped CRUD
DROP POLICY IF EXISTS "read_own_avatars" ON storage.objects;
CREATE POLICY "read_own_avatars" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "insert_own_avatars" ON storage.objects;
CREATE POLICY "insert_own_avatars" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "update_own_avatars" ON storage.objects;
CREATE POLICY "update_own_avatars" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "delete_own_avatars" ON storage.objects;
CREATE POLICY "delete_own_avatars" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- merchant-logos: owner-scoped CRUD
DROP POLICY IF EXISTS "read_merchant_logos" ON storage.objects;
CREATE POLICY "read_merchant_logos" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'merchant-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "insert_merchant_logos" ON storage.objects;
CREATE POLICY "insert_merchant_logos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'merchant-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "update_merchant_logos" ON storage.objects;
CREATE POLICY "update_merchant_logos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'merchant-logos' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'merchant-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "delete_merchant_logos" ON storage.objects;
CREATE POLICY "delete_merchant_logos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'merchant-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- merchant-covers: owner-scoped CRUD
DROP POLICY IF EXISTS "read_merchant_covers" ON storage.objects;
CREATE POLICY "read_merchant_covers" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'merchant-covers' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "insert_merchant_covers" ON storage.objects;
CREATE POLICY "insert_merchant_covers" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'merchant-covers' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "update_merchant_covers" ON storage.objects;
CREATE POLICY "update_merchant_covers" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'merchant-covers' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'merchant-covers' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "delete_merchant_covers" ON storage.objects;
CREATE POLICY "delete_merchant_covers" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'merchant-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- product-images: owner-scoped CRUD
DROP POLICY IF EXISTS "read_product_images" ON storage.objects;
CREATE POLICY "read_product_images" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "insert_product_images" ON storage.objects;
CREATE POLICY "insert_product_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "update_product_images" ON storage.objects;
CREATE POLICY "update_product_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "delete_product_images" ON storage.objects;
CREATE POLICY "delete_product_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
