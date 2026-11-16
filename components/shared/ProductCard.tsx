import Link from 'next/link';
import { Bike, Store as StoreIcon, Clock } from 'lucide-react';
import { AvailabilityLabel, DiscountBadge } from '@/components/shared/Badges';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { getStore } from '@/data/lookup';
import { discountPercent, formatPersianTime } from '@/lib/format';
import type { Product } from '@/types';

export function FulfillmentChips({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5 text-[11px] text-ink-300">
      {product.fulfillment.includes('pickup') && (
        <span className="inline-flex items-center gap-1 rounded-md border border-ink-700 px-2 py-0.5">
          <StoreIcon className="h-3 w-3" aria-hidden /> تحویل حضوری
        </span>
      )}
      {product.fulfillment.includes('delivery') && (
        <span className="inline-flex items-center gap-1 rounded-md border border-ink-700 px-2 py-0.5">
          <Bike className="h-3 w-3" aria-hidden /> ارسال
        </span>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const store = getStore(product.storeId);
  const percent = discountPercent(product.originalPrice, product.price);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 transition-all duration-300 hover:-translate-y-1 hover:border-ink-700 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-850">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute start-3 top-3">
          <DiscountBadge percent={percent} />
        </div>
        <div className="absolute end-3 top-3">
          <FavoriteButton id={product.id} label={product.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-ink-400">{store?.name}</span>
          <h3 className="text-base font-semibold text-ink-50">
            <Link href={`/product/${product.id}`} className="after:absolute after:inset-0 after:content-['']">
              {product.name}
            </Link>
          </h3>
        </div>

        <FulfillmentChips product={product} />

        <div className="mt-auto flex flex-col gap-2 border-t border-ink-800 pt-3">
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
          <div className="flex items-center justify-between gap-2">
            <AvailabilityLabel remaining={product.remaining} />
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-400">
              <Clock className="h-3 w-3" aria-hidden />
              تا {formatPersianTime(product.collection.endsAt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
