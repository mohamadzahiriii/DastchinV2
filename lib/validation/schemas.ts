import { z } from 'zod';

export const persianPhoneRegex = /^(\+98|0)?9\d{9}$/;

export const signUpSchema = z.object({
  full_name: z.string().min(2, 'نام و نام خانوادگی باید حداقل ۲ نویسه باشد.'),
  email: z.string().email('ایمیل معتبر نیست.').or(z.literal('')),
  phone: z.string().regex(persianPhoneRegex, 'شماره موبایل معتبر نیست. مثال: 09121234567').or(z.literal('')),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ نویسه باشد.'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست.'),
  password: z.string().min(1, 'رمز عبور را وارد کنید.'),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'نام باید حداقل ۲ نویسه باشد.').max(100, 'نام بیش از حد طولانی است.'),
  phone: z.string().regex(persianPhoneRegex, 'شماره موبایل معتبر نیست.').or(z.literal('')),
  email: z.string().email('ایمیل معتبر نیست.').or(z.literal('')),
  avatar_url: z.string().url('آدرس تصویر معتبر نیست.').or(z.literal('')).nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const addressSchema = z.object({
  title: z.string().min(1, 'عنوان نشانی را وارد کنید.').max(50, 'عنوان بیش از حد طولانی است.'),
  recipient_name: z.string().min(2, 'نام گیرنده را وارد کنید.').max(100, 'نام گیرنده بیش از حد طولانی است.'),
  phone: z.string().regex(persianPhoneRegex, 'شماره موبایل گیرنده معتبر نیست.'),
  province: z.string().min(1, 'استان را انتخاب کنید.'),
  city: z.string().min(1, 'شهر را وارد کنید.'),
  district: z.string().max(100, 'منطقه بیش از حد طولانی است.').optional().nullable(),
  address_line: z.string().min(5, 'نشانی کامل را وارد کنید.').max(500, 'نشانی بیش از حد طولانی است.'),
  postal_code: z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد.').or(z.literal('')).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  is_default: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const merchantRegistrationSchema = z.object({
  business_name: z.string().min(2, 'نام کسب‌وکار را وارد کنید.').max(200, 'نام کسب‌وکار بیش از حد طولانی است.'),
  description: z.string().max(2000, 'توضیحات بیش از حد طولانی است.').optional().nullable(),
  business_category_id: z.string().uuid('دسته‌بندی نامعتبر است.').optional().nullable(),
  phone: z.string().regex(persianPhoneRegex, 'شماره تلفن معتبر نیست.').or(z.literal('')).optional().nullable(),
  email: z.string().email('ایمیل معتبر نیست.').or(z.literal('')).optional().nullable(),
  address: z.string().max(500, 'نشانی بیش از حد طولانی است.').optional().nullable(),
  city: z.string().min(1, 'شهر را وارد کنید.').max(100, 'نام شهر بیش از حد طولانی است.'),
  district: z.string().max(100, 'منطقه بیش از حد طولانی است.').optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

export type MerchantRegistrationInput = z.infer<typeof merchantRegistrationSchema>;

export const productSchema = z.object({
  merchant_id: z.string().uuid('فروشگاه نامعتبر است.'),
  category_id: z.string().uuid('دسته‌بندی نامعتبر است.').optional().nullable(),
  name: z.string().min(2, 'نام محصول را وارد کنید.').max(200, 'نام محصول بیش از حد طولانی است.'),
  description: z.string().max(5000, 'توضیحات بیش از حد طولانی است.').optional().nullable(),
  original_price: z.number().int('قیمت اصلی باید عدد صحیح باشد.').positive('قیمت اصلی باید بیشتر از صفر باشد.'),
  discounted_price: z.number().int('قیمت فروش باید عدد صحیح باشد.').positive('قیمت فروش باید بیشتر از صفر باشد.'),
  currency: z.enum(['IRR', 'IRT']).default('IRT'),
  product_type: z.enum(['regular_offer', 'surprise_selection']).default('regular_offer'),
  image_urls: z.array(z.string().url('آدرس تصویر معتبر نیست.')).max(10, 'حداکثر ۱۰ تصویر مجاز است.').default([]),
  ingredients: z.string().max(2000).optional().nullable(),
  allergen_information: z.array(z.string().max(100)).max(20).optional().nullable(),
  storage_information: z.string().max(1000).optional().nullable(),
  is_active: z.boolean().default(true),
}).refine((data) => data.discounted_price <= data.original_price, {
  message: 'قیمت فروش نباید بیشتر از قیمت اصلی باشد.',
  path: ['discounted_price'],
});

export type ProductInput = z.infer<typeof productSchema>;

export const inventorySchema = z.object({
  product_id: z.string().uuid('شناسه محصول نامعتبر است.'),
  available_quantity: z.number().int('تعداد باید عدد صحیح باشد.').min(0, 'تعداد نمی‌تواند منفی باشد.').default(0),
  reserved_quantity: z.number().int().min(0).default(0),
  sold_quantity: z.number().int().min(0).default(0),
});

export type InventoryInput = z.infer<typeof inventorySchema>;

export const availabilitySchema = z.object({
  product_id: z.string().uuid('شناسه محصول نامعتبر است.'),
  availability_date: z.string().min(1, 'تاریخ را وارد کنید.'),
  pickup_start_time: z.string().min(1, 'زمان شروع را وارد کنید.'),
  pickup_end_time: z.string().min(1, 'زمان پایان را وارد کنید.'),
  pickup_enabled: z.boolean().default(true),
  delivery_enabled: z.boolean().default(false),
  is_available: z.boolean().default(true),
}).refine((data) => data.pickup_start_time < data.pickup_end_time, {
  message: 'زمان شروع باید قبل از زمان پایان باشد.',
  path: ['pickup_end_time'],
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;

export const supportTicketSchema = z.object({
  subject: z.string().min(3, 'موضوع را وارد کنید.').max(200, 'موضوع بیش از حد طولانی است.'),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ نویسه باشد.').max(5000, 'پیام بیش از حد طولانی است.'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

export type SupportTicketInput = z.infer<typeof supportTicketSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'نام دسته‌بندی را وارد کنید.').max(100, 'نام بیش از حد طولانی است.'),
  slug: z.string().min(1, 'نامک دسته‌بندی را وارد کنید.').regex(/^[a-z0-9-]+$/, 'نامک فقط شامل حروف کوچک، اعداد و خط تیره باشد.').max(100),
  description: z.string().max(500).optional().nullable(),
  image_url: z.string().url('آدرس تصویر معتبر نیست.').or(z.literal('')).optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
