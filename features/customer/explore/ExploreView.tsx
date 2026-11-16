'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal, X, MapPin } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { EmptyState } from '@/components/shared/Feedback';
import { SearchBar } from '@/components/shared/SearchBar';
import { categories } from '@/data/categories';
import { stores } from '@/data/stores';
import {
  defaultFilters,
  filterProducts,
  type ExploreFilters,
  type SortKey,
  type DistanceFilter,
  type LocationFilterContext,
} from '@/features/customer/explore/filter-products';
import { useLocation } from '@/lib/location/location-context';
import { LocationSwitcher } from '@/features/location/LocationSwitcher';
import { getNeighborhoodsByCity } from '@/config/location';
import { formatNumber, formatToman } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CategoryId, Fulfillment } from '@/types';

const priceOptions = [0, 100000, 150000, 250000, 500000];
const discountOptions = [0, 20, 40, 60];
const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'پیشنهادی' },
  { value: 'distance', label: 'نزدیک‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
  { value: 'price-asc', label: 'کمترین قیمت' },
  { value: 'price-desc', label: 'بیشترین قیمت' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'remaining', label: 'کمترین موجودی' },
];

const distanceOptions: { value: DistanceFilter; label: string }[] = [
  { value: 'all', label: 'همه' },
  { value: 'nearby', label: 'نزدیک‌ترین' },
  { value: 'available', label: 'قابل دریافت' },
  { value: 'delivery-only', label: 'فقط ارسالی' },
  { value: 'out-of-range', label: 'خارج از محدوده' },
];

const neighborhoods = getNeighborhoodsByCity('tehran');

type ExploreViewProps = {
  initialQuery: string;
  initialCategory: CategoryId | 'all';
};

export function ExploreView({ initialQuery, initialCategory }: ExploreViewProps) {
  const { location, config } = useLocation();
  const [filters, setFilters] = useState<ExploreFilters>({
    ...defaultFilters,
    query: initialQuery,
    category: initialCategory,
  });

  const locContext: LocationFilterContext | undefined = useMemo(() => {
    if (!location) return undefined;
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      config: {
        nearbyThresholdKm: config.nearbyThresholdKm,
        pickupMaxDistanceKm: config.pickupMaxDistanceKm,
        deliveryMaxDistanceKm: config.deliveryMaxDistanceKm,
      },
    };
  }, [location, config]);

  const results = useMemo(() => filterProducts(filters, locContext), [filters, locContext]);
  const update = (patch: Partial<ExploreFilters>) => setFilters((prev) => ({ ...prev, ...patch }));
  const activeCount = [
    filters.category !== 'all',
    filters.fulfillment !== 'all',
    filters.maxPrice > 0,
    filters.minDiscount > 0,
    filters.storeId !== 'all',
    filters.neighborhoodSlug !== 'all',
    filters.distance !== 'all',
    filters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col gap-7 lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-50">
            <SlidersHorizontal className="h-4 w-4 text-saffron-300" aria-hidden />
            فیلترها
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...defaultFilters, query: prev.query, sort: prev.sort }))}
              className="inline-flex items-center gap-1 text-xs text-ink-300 transition-colors hover:text-saffron-300"
            >
              <X className="h-3 w-3" aria-hidden /> پاک کردن ({formatNumber(activeCount)})
            </button>
          )}
        </div>

        {!location && (
          <div className="rounded-xl border border-saffron-400/20 bg-saffron-400/5 px-4 py-3">
            <p className="mb-2 text-xs leading-relaxed text-ink-300">
              برای فیلتر بر اساس فاصله، محدوده خود را انتخاب کنید.
            </p>
            <LocationSwitcher />
          </div>
        )}

        {location && (
          <FilterGroup label="فاصله">
            {distanceOptions.map((opt) => (
              <ChipButton
                key={opt.value}
                active={filters.distance === opt.value}
                onClick={() => update({ distance: opt.value })}
              >
                {opt.label}
              </ChipButton>
            ))}
          </FilterGroup>
        )}

        <FilterGroup label="دسته‌بندی">
          <ChipButton active={filters.category === 'all'} onClick={() => update({ category: 'all' })}>همه</ChipButton>
          {categories.map((c) => (
            <ChipButton key={c.id} active={filters.category === c.id} onClick={() => update({ category: c.id })}>
              {c.name}
            </ChipButton>
          ))}
        </FilterGroup>

        <FilterGroup label="نحوه دریافت">
          {(
            [
              ['all', 'همه'],
              ['pickup', 'قابل دریافت حضوری'],
              ['delivery', 'قابل ارسال'],
            ] as [Fulfillment | 'all', string][]
          ).map(([value, label]) => (
            <ChipButton key={value} active={filters.fulfillment === value} onClick={() => update({ fulfillment: value })}>
              {label}
            </ChipButton>
          ))}
        </FilterGroup>

        <FilterGroup label="موجودی">
          <ChipButton active={!filters.inStock} onClick={() => update({ inStock: false })}>همه</ChipButton>
          <ChipButton active={filters.inStock} onClick={() => update({ inStock: true })}>موجود</ChipButton>
        </FilterGroup>

        <FilterGroup label="حداکثر قیمت">
          {priceOptions.map((p) => (
            <ChipButton key={p} active={filters.maxPrice === p} onClick={() => update({ maxPrice: p })}>
              {p === 0 ? 'بدون محدودیت' : `تا ${formatToman(p)}`}
            </ChipButton>
          ))}
        </FilterGroup>

        <FilterGroup label="حداقل تخفیف">
          {discountOptions.map((d) => (
            <ChipButton key={d} active={filters.minDiscount === d} onClick={() => update({ minDiscount: d })}>
              {d === 0 ? 'همه' : `${formatNumber(d)}٪ به بالا`}
            </ChipButton>
          ))}
        </FilterGroup>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-ink-300">محله</span>
          <select
            value={filters.neighborhoodSlug}
            onChange={(e) => update({ neighborhoodSlug: e.target.value })}
            className="h-10 rounded-xl border border-ink-700 bg-ink-900 px-3 text-sm text-ink-50 focus:border-saffron-400/60 focus:outline-none"
          >
            <option value="all">همه محله‌ها</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.neighborhoodSlug}>{n.neighborhood}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-ink-300">فروشگاه</span>
          <select
            value={filters.storeId}
            onChange={(e) => update({ storeId: e.target.value })}
            className="h-10 rounded-xl border border-ink-700 bg-ink-900 px-3 text-sm text-ink-50 focus:border-saffron-400/60 focus:outline-none"
          >
            <option value="all">همه فروشگاه‌ها</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </aside>

      <section className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            defaultValue={initialQuery}
            className="sm:max-w-md"
            onSearch={(query) => update({ query })}
          />
          <label className="flex items-center gap-2 text-sm text-ink-300">
            مرتب‌سازی
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="h-10 rounded-full border border-ink-700 bg-ink-900 px-4 text-sm text-ink-50 focus:border-saffron-400/60 focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-sm text-ink-400" aria-live="polite">
          {formatNumber(results.length)} محصول پیدا شد
          {location && ` در محدوده ${location.neighborhood}`}
        </p>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
            {results.map((item) => (
              <ProductCard key={item.product.id} product={item.product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="در محدوده انتخابی شما محصولی پیدا نشد"
            description="فیلترها را کم‌تر کنید یا محدوده دیگری را انتخاب کنید. محصولات جدید هر روز اضافه می‌شوند."
            action={
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFilters(defaultFilters)}
                  className="h-10 rounded-full bg-saffron-400 px-5 text-sm font-semibold text-ink-950 transition-colors hover:bg-saffron-300"
                >
                  پاک کردن همه فیلترها
                </button>
                <LocationSwitcher />
              </div>
            }
          />
        )}
      </section>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-xs font-medium text-ink-300">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function ChipButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs transition-all duration-200 active:scale-95',
        active
          ? 'border-saffron-400 bg-saffron-400 font-semibold text-ink-950'
          : 'border-ink-700 text-ink-200 hover:border-ink-500 hover:text-ink-50',
      )}
    >
      {children}
    </button>
  );
}
