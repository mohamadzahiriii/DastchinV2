'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { categories } from '@/data/categories';
import { inputClass, labelClass } from '@/features/dashboard/form-styles';
import { cn } from '@/lib/utils';

type FormErrors = Partial<Record<'name' | 'price' | 'originalPrice' | 'quantity' | 'pickup', string>>;

export function ListingForm() {
  const [fulfillment, setFulfillment] = useState({ pickup: true, delivery: false });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const price = Number(form.get('price'));
    const originalPrice = Number(form.get('originalPrice'));
    const quantity = Number(form.get('quantity'));

    const next: FormErrors = {};
    if (!name) next.name = 'نام محصول را وارد کنید.';
    if (!Number.isFinite(originalPrice) || originalPrice <= 0) next.originalPrice = 'قیمت اصلی باید بیشتر از صفر باشد.';
    if (!Number.isFinite(price) || price <= 0) next.price = 'قیمت فروش باید بیشتر از صفر باشد.';
    else if (originalPrice > 0 && price >= originalPrice) next.price = 'قیمت فروش باید کمتر از قیمت اصلی باشد.';
    if (!Number.isInteger(quantity) || quantity < 1) next.quantity = 'تعداد بسته‌ها باید عدد صحیح و حداقل ۱ باشد.';
    if (!fulfillment.pickup && !fulfillment.delivery) next.pickup = 'حداقل یک روش تحویل را انتخاب کنید.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error('لطفا خطاهای فرم را بررسی کنید.');
      return;
    }
    toast.success(`«${name}» به صورت نمایشی ثبت شد. هنوز به فروشگاه واقعی متصل نیست.`);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 rounded-2xl border border-ink-800 bg-ink-900 p-6 md:grid-cols-2">
      <label className={cn(labelClass, 'md:col-span-2')}>
        نام بسته یا محصول
        <input name="name" placeholder="مثلا: بسته غافلگیری شیرینی" className={inputClass} aria-invalid={!!errors.name} />
        {errors.name && <span className="text-xs font-normal text-rose-300">{errors.name}</span>}
      </label>

      <label className={labelClass}>
        دسته‌بندی
        <select name="category" defaultValue="bakery" className={inputClass}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        تعداد بسته‌های آماده
        <input name="quantity" inputMode="numeric" placeholder="مثلا ۵" className={inputClass} aria-invalid={!!errors.quantity} />
        {errors.quantity && <span className="text-xs font-normal text-rose-300">{errors.quantity}</span>}
      </label>

      <label className={labelClass}>
        قیمت اصلی (تومان)
        <input name="originalPrice" inputMode="numeric" placeholder="مثلا ۲۸۰۰۰۰" className={inputClass} aria-invalid={!!errors.originalPrice} />
        {errors.originalPrice && <span className="text-xs font-normal text-rose-300">{errors.originalPrice}</span>}
      </label>

      <label className={labelClass}>
        قیمت فروش (تومان)
        <input name="price" inputMode="numeric" placeholder="مثلا ۱۱۰۰۰۰" className={inputClass} aria-invalid={!!errors.price} />
        {errors.price && <span className="text-xs font-normal text-rose-300">{errors.price}</span>}
      </label>

      <label className={labelClass}>
        شروع زمان تحویل
        <input name="start" type="time" defaultValue="18:00" className={inputClass} />
      </label>

      <label className={labelClass}>
        پایان زمان تحویل
        <input name="end" type="time" defaultValue="20:00" className={inputClass} />
      </label>

      <fieldset className="flex flex-col gap-3 md:col-span-2">
        <legend className="mb-2 text-sm font-medium text-ink-200">روش تحویل</legend>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ['pickup', 'تحویل حضوری'],
              ['delivery', 'ارسال با پیک'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={fulfillment[key]}
              onClick={() => setFulfillment((prev) => ({ ...prev, [key]: !prev[key] }))}
              className={cn(
                'h-10 rounded-full border px-5 text-sm transition-all active:scale-95',
                fulfillment[key] ? 'border-saffron-400 bg-saffron-400/15 text-saffron-200' : 'border-ink-700 text-ink-300 hover:border-ink-500',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.pickup && <span className="text-xs text-rose-300">{errors.pickup}</span>}
      </fieldset>

      <label className={cn(labelClass, 'md:col-span-2')}>
        توضیحات و محتویات بسته
        <textarea name="description" rows={3} placeholder="مثلا: ترکیبی از شیرینی‌های امروز، بدون مغز آجیل" className="w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-400/30" />
      </label>

      <label className={cn(labelClass, 'md:col-span-2')}>
        آلرژن و نگهداری
        <input name="storage" placeholder="مثلا: حاوی گلوتن و لبنیات، در یخچال نگهداری شود" className={inputClass} />
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-ink-800 pt-6 sm:flex-row sm:justify-end md:col-span-2">
        <button type="reset" className="h-11 rounded-full border border-ink-600 px-6 text-sm text-ink-100 transition-colors hover:bg-ink-800">پاک کردن فرم</button>
        <button type="submit" className="h-11 rounded-full bg-saffron-400 px-8 text-sm font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95">ثبت محصول</button>
      </div>
    </form>
  );
}
