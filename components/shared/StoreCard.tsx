'use client';

import Link from 'next/link';
import { MapPin, Bike, Store as StoreIcon, Navigation } from 'lucide-react';
import { Rating } from '@/components/shared/Rating';
import { getCategory, productsForStore } from '@/data/lookup';
import { formatNumber, formatToman } from '@/lib/format';
import { useLocation } from '@/lib/location/location-context';
import type { Store } from '@/types';

export function StoreCard({ store }: { store: Store }) {
  const category = getCategory(store.categoryId);
  const available = productsForStore(store.id).length;
  const { distanceLabelForStore } = useLocation();
  const distanceLabel = distanceLabelForStore(store);
  const hasDistance = distanceLabel !== 'نامشخص';

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 transition-all duration-300 hover:-translate-y-1 hover:border-ink-700">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={store.coverImage}
          alt={store.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" aria-hidden />
        <span className="absolute bottom-3 end-3 rounded-md bg-ink-950/80 px-2 py-1 text-[11px] text-ink-100 backdrop-blur">
          {category?.name}
        </span>
        {hasDistance && (
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-md bg-saffron-400/90 px-2 py-1 text-[11px] font-medium text-ink-950 backdrop-blur">
            <Navigation className="h-3 w-3" aria-hidden />
            {distanceLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink-50">
            <Link href={`/stores/${store.id}`} className="after:absolute after:inset-0 after:content-['']">
              {store.name}
            </Link>
          </h3>
          <Rating value={store.rating} />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-ink-300">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
          {store.neighborhood}، ساعت کاری {store.hours}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-ink-800 pt-3 text-xs text-ink-300">
          {store.pickupEnabled && (
            <span className="inline-flex items-center gap-1 rounded-md bg-ink-800 px-2 py-1">
              <StoreIcon className="h-3 w-3" aria-hidden /> تحویل حضوری
            </span>
          )}
          {store.deliveryEnabled && (
            <span className="inline-flex items-center gap-1 rounded-md bg-ink-800 px-2 py-1">
              <Bike className="h-3 w-3" aria-hidden /> ارسال از {formatToman(store.deliveryFee)}
            </span>
          )}
          <span className="ms-auto text-ink-400">{formatNumber(available)} محصول فعال</span>
        </div>
      </div>
    </article>
  );
}
