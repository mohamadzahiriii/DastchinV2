-- 005_seed_categories
-- Seeds the categories table with 8 marketplace categories.
-- Uses fixed UUIDs so re-runs are idempotent.

INSERT INTO public.categories (id, slug, name, description, display_order, is_active)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'electronics', 'الکترونیک', 'گجت‌ها، موبایل و لوازم جانبی', 1, true),
  ('a0000000-0000-0000-0000-000000000002', 'fashion', 'مد و پوشاک', 'لباس، کفش و اکسسوری', 2, true),
  ('a0000000-0000-0000-0000-000000000003', 'home-garden', 'خانه و باغ', 'لوازم خانگی، دکوراسیون و باغبانی', 3, true),
  ('a0000000-0000-0000-0000-000000000004', 'beauty-health', 'زیبایی و سلامت', 'لوازم آرایشی، بهداشتی و سلامت', 4, true),
  ('a0000000-0000-0000-0000-000000000005', 'sports-outdoor', 'ورزش و فضای باز', 'تجهیزات ورزشی و کمپینگ', 5, true),
  ('a0000000-0000-0000-0000-000000000006', 'toys-hobbies', 'اسباب‌بازی و سرگرمی', 'بازی، سرگرمی و کلکسیون', 6, true),
  ('a0000000-0000-0000-0000-000000000007', 'books-media', 'کتاب و رسانه', 'کتاب، موسیقی و فیلم', 7, true),
  ('a0000000-0000-0000-0000-000000000008', 'automotive', 'خودرو و وسایل نقلیه', 'لوازم خودرو، موتور و قطعات', 8, true)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
