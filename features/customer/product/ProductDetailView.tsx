'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Bike, Clock, Minus, Plus, ShieldCheck, Store as StoreIcon } from 'lucide-react';
import { AvailabilityLabel, DiscountBadge } from '@/components/shared/Badges';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { DemoNotice } from '@/components/shared/PageHeader';
import { discountPercent, formatCollectionWindow, formatNumber, formatToman } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product, Store } from '@/types';

export function ProductDetailView({ product, store }: { product: Product; store: Store }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const percent = discountPercent(product.originalPrice, product.price);
  const maxQty = Math.min(product.maxPerOrder, product.remaining);
  const total = product.price * quantity;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-2 lg:gap-14">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-800 bg-ink-900">
          <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover transition-opacity duration-500" />
          <div className="absolute start-4 top-4">
            <DiscountBadge percent={percent} />
          </div>
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`نمایش تصویر ${i + 1}`}
                aria-pressed={activeImage === i}
                className={cn(
                  'aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all',
                  activeImage === i ? 'border-saffron-400' : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <Link href={`/stores/${store.id}`} className="w-fit text-sm font-medium text-saffron-300 hover:underline">
            {store.name}
          </Link>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold leading-tight text-ink-50">{product.name}</h1>
            <FavoriteButton id={product.id} label={product.name} className="shrink-0" />
          </div>
          {product.isSurprise && (
            <span className="w-fit rounded-md border border-teal-400/40 bg-teal-900/40 px-2.5 py-1 text-xs text-teal-300">
              انتخاب غافلگیرکننده. ترکیب دقیق بسته بر اساس موجودی همان روز تعیین می‌شود.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-ink-800 bg-ink-900 p-6">
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="lg" />
          <div className="flex flex-wrap items-center gap-3">
            <DiscountBadge percent={percent} />
            <span className="text-sm text-ink-300">قیمت اعلام‌شده توسط فروشگاه؛ قیمت‌های مرجع بازار نیستند.</span>
          </div>
          <AvailabilityLabel remaining={product.remaining} className="pt-1" />
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoItem icon={Clock} label="بازه جمع‌آوری" value={formatCollectionWindow(product.collection.startsAt, product.collection.endsAt)} />
          <InfoItem icon={StoreIcon} label="محتوای بسته" value={product.contents} />
          <InfoItem
            icon={Bike}
            label="نحوه دریافت"
            value={[
              product.fulfillment.includes('pickup') ? 'تحویل حضوری' : null,
              product.fulfillment.includes('delivery') ? `ارسال (${formatToman(store.deliveryFee)})` : null,
            ].filter(Boolean).join('، ')}
          />
          <InfoItem icon={ShieldCheck} label="حداکثر سفارش" value={`${formatNumber(product.maxPerOrder)} بسته در هر سفارش`} />
        </dl>

        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-ink-50">توضیحات محصول</h2>
          <p className="text-sm leading-[1.9] text-ink-300">{product.description}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-ink-800 bg-ink-900/60 p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-50">
            <ShieldCheck className="h-4 w-4 text-sage-300" aria-hidden /> نگهداری و آلرژن
          </h2>
          <p className="text-sm leading-relaxed text-ink-200">
            {product.storageNote ?? 'فروشگاه هنوز اطلاعات نگهداری این محصول را ارائه نکرده است.'}
          </p>
          {product.allergens ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-ink-400">مواد حساسیت‌زا اعلام‌شده توسط فروشگاه:</span>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((a) => (
                  <span key={a} className="rounded-md bg-ink-800 px-2.5 py-1 text-xs text-ink-100">{a}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="flex items-start gap-2 text-xs leading-relaxed text-ember-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              اطلاعات آلرژن برای این محصول تایید نشده است. پیش از خرید با فروشگاه هماهنگ کنید.
            </p>
          )}
        </div>

        <div className="sticky bottom-20 flex flex-col gap-4 rounded-2xl border border-saffron-400/30 bg-ink-900 p-5 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)] md:bottom-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 rounded-full border border-ink-700 p-1">
              <button
                type="button"
                aria-label="کاهش تعداد"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-100 transition-colors hover:bg-ink-800 disabled:opacity-30"
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums text-ink-50">{formatNumber(quantity)}</span>
              <button
                type="button"
                aria-label="افزایش تعداد"
                disabled={quantity >= maxQty}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-100 transition-colors hover:bg-ink-800 disabled:opacity-30"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-ink-400">جمع کل</span>
              <span className="text-lg font-bold text-ink-50 tabular-nums">{formatToman(total)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast('نمایشی: رزرو و پرداخت در مراحل بعدی فعال می‌شود.')}
            className="h-12 rounded-full bg-saffron-400 text-sm font-bold text-ink-950 transition-all hover:bg-saffron-300 active:scale-[0.98]"
          >
            رزرو محصول (نمایشی)
          </button>
          <DemoNotice>رزرو و پرداخت واقعی هنوز فعال نیست و این صفحه تنها نمایش تجربه کاربری است.</DemoNotice>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-800 bg-ink-900/60 p-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-saffron-300" aria-hidden />
      <div className="flex flex-col gap-1">
        <dt className="text-xs text-ink-400">{label}</dt>
        <dd className="text-sm font-medium leading-relaxed text-ink-50">{value}</dd>
      </div>
    </div>
  );
}
