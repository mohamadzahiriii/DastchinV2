'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Navigation, Bike, Store as StoreIcon, Clock } from 'lucide-react';
import { CategoryCard } from '@/components/shared/CategoryCard';
import { ProductCard } from '@/components/shared/ProductCard';
import { SectionHeading, EmptyState } from '@/components/shared/Feedback';
import { StoreCard } from '@/components/shared/StoreCard';
import { Rating } from '@/components/shared/Rating';
import { AvailabilityLabel } from '@/components/shared/Badges';
import { categories } from '@/data/categories';
import { isLimited, getCategory } from '@/data/lookup';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { discountPercent, formatNumber } from '@/lib/format';
import { useLocation } from '@/lib/location/location-context';
import { LocationSwitcher } from '@/features/location/LocationSwitcher';
import type { Store } from '@/types';

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-saffron-300 transition-colors hover:text-saffron-200">
      {label}
      <ArrowLeft className="h-4 w-4" aria-hidden />
    </Link>
  );
}

const byDiscount = [...products].sort(
  (a, b) => discountPercent(b.originalPrice, b.price) - discountPercent(a.originalPrice, a.price),
);
const byNewest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export function DailyOpportunities() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="فرصت‌های امروز"
        title="بهترین انتخاب‌های امروز"
        description="محصولاتی که بیشترین تخفیف را دارند و امروز از فروشگاه‌ها عرضه می‌شوند."
        action={<SeeAll href="/explore" label="همه محصولات" />}
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {byDiscount.slice(0, 3).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function PopularCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="دسته‌بندی‌ها"
        title="هر آنچه برای امروز می‌خواهید"
        action={<SeeAll href="/categories" label="همه دسته‌بندی‌ها" />}
      />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

export function NearbyStoresSection() {
  const { location, nearbyStores, distanceLabelForStore } = useLocation();
  const nearby = nearbyStores().slice(0, 8);

  if (!location) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="نزدیک شما"
          title="فروشگاه‌های اطراف"
          description="برای دیدن فروشگاه‌های نزدیک خود، محدوده خود را انتخاب کنید."
        />
        <div className="mt-10">
          <EmptyState
            title="محدوده خود را انتخاب کنید"
            description="برای نمایش فروشگاه‌های نزدیک شما، محله خود را انتخاب کنید."
            action={<LocationSwitcher />}
          />
        </div>
      </section>
    );
  }

  if (nearby.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="نزدیک شما"
          title={`فروشگاه‌های اطراف ${location.neighborhood}`}
          description="در محدوده انتخابی شما فروشگاهی پیدا نشد. می‌توانید محدوده دیگری انتخاب کنید."
        />
        <div className="mt-10">
          <EmptyState
            title="فروشگاهی در این محدوده نیست"
            description="در محدوده انتخابی شما فروشگاهی پیدا نشد. محدوده دیگری را امتحان کنید."
            action={<LocationSwitcher />}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="نزدیک شما"
        title={`فروشگاه‌های اطراف ${location.neighborhood}`}
        description="فروشگاه‌هایی که در محدوده شما قابل دسترس هستند."
        action={<SeeAll href="/stores" label="همه فروشگاه‌ها" />}
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {nearby.map((store) => (
          <StoreWithDistance key={store.id} store={store} distanceLabel={distanceLabelForStore(store)} />
        ))}
      </div>
    </section>
  );
}

function StoreWithDistance({ store, distanceLabel }: { store: Store; distanceLabel: string }) {
  const category = getCategory(store.categoryId);
  const available = products.filter((p) => p.storeId === store.id).length;
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
        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-md bg-saffron-400/90 px-2 py-1 text-[11px] font-medium text-ink-950 backdrop-blur">
          <Navigation className="h-3 w-3" aria-hidden />
          {distanceLabel}
        </span>
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
              <Bike className="h-3 w-3" aria-hidden /> ارسال
            </span>
          )}
          <span className="ms-auto text-ink-400">{formatNumber(available)} محصول فعال</span>
        </div>
      </div>
    </article>
  );
}

export function NearbyProductsSection() {
  const { location, nearbyProducts } = useLocation();
  const nearby = nearbyProducts().slice(0, 4);

  if (!location || nearby.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="پیشنهادهای نزدیک"
        title="محصولات قابل دریافت در محدوده شما"
        description={`محصولاتی که از فروشگاه‌های نزدیک ${location.neighborhood} عرضه می‌شوند.`}
        action={<SeeAll href="/explore" label="کاوش بیشتر" />}
      />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {nearby.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function AreaDiscountsSection() {
  const { location, areaDiscountProducts } = useLocation();
  const discounted = areaDiscountProducts().slice(0, 4);

  if (!location || discounted.length === 0) return null;

  return (
    <section className="border-y border-ink-800 bg-ink-900/40 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="تخفیف‌های محدوده شما"
          title="بهترین تخفیف‌های اطراف شما"
          description={`محصولاتی با بیشترین تخفیف در محدوده ${location.neighborhood}.`}
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {discounted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TodayPickupSection() {
  const { location, todayPickupProducts } = useLocation();
  const today = todayPickupProducts().slice(0, 4);

  if (!location || today.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="محصولات قابل دریافت امروز"
        title="امروز تحویل بگیرید"
        description="محصولاتی که امروز در فروشگاه‌های نزدیک شما قابل دریافت حضوری هستند."
      />
      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {today.map((product) => {
          const store = stores.find((s) => s.id === product.storeId);
          return (
            <li key={product.id} className="group relative flex items-center gap-4 rounded-2xl border border-ink-800 bg-ink-950 p-3 transition-colors hover:border-saffron-400/40">
              <img src={product.images[0]} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-col gap-1.5">
                <Link href={`/product/${product.id}`} className="truncate text-sm font-semibold text-ink-50 after:absolute after:inset-0 after:content-['']">
                  {product.name}
                </Link>
                <span className="truncate text-xs text-ink-400">{store?.name}</span>
                <div className="flex items-center gap-2">
                  <AvailabilityLabel remaining={product.remaining} />
                  <span className="inline-flex items-center gap-1 text-[11px] text-ink-400">
                    <StoreIcon className="h-3 w-3" aria-hidden />
                    تحویل حضوری
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function OutOfRangeStoresSection() {
  const { location, outOfRangeStores } = useLocation();
  const far = outOfRangeStores().slice(0, 4);

  if (!location || far.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="فروشگاه‌های خارج از محدوده شما"
        title="فروشگاه‌های دورتر"
        description="این فروشگاه‌ها خارج از محدوده قابل دریافت شما هستند. برخی ممکن است با ارسال در دسترس باشند."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 opacity-70">
        {far.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </section>
  );
}

export function LimitedAvailability() {
  const limited = products.filter(isLimited).slice(0, 4);
  return (
    <section className="border-y border-ink-800 bg-ink-900/40 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="موجودی محدود"
          title="تا پایان موجودی"
          description="این محصولات تعداد محدودی دارند. پیش از اتمام موجودی سفارش خود را ثبت کنید."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {limited.map((product) => {
            const store = stores.find((s) => s.id === product.storeId);
            return (
              <li key={product.id} className="group relative flex items-center gap-4 rounded-2xl border border-ink-800 bg-ink-950 p-3 transition-colors hover:border-coral-400/40">
                <img src={product.images[0]} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <Link href={`/product/${product.id}`} className="truncate text-sm font-semibold text-ink-50 after:absolute after:inset-0 after:content-['']">
                    {product.name}
                  </Link>
                  <span className="truncate text-xs text-ink-400">{store?.name}</span>
                  <AvailabilityLabel remaining={product.remaining} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function RecommendedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="پیشنهاد ویژه"
        title="انتخاب سرآشپز و شیرینی‌پز"
        description="محصولاتی که تیم گنجینه برای امروز انتخاب کرده است."
        action={<SeeAll href="/explore" label="کاوش بیشتر" />}
      />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {byNewest.slice(4, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function FeaturedMerchants() {
  const featured = stores.filter((s) => s.featured);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="فروشگاه‌های منتخب"
        title="با کیفیتی که می‌شناسید"
        description="فروشگاه‌های با امتیاز بالا و تعهد به شفافیت در معرفی محصولات."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {featured.map((store) => {
          const category = getCategory(store.categoryId);
          return (
            <article key={store.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
              <div className="relative aspect-[5/3] overflow-hidden">
                <img src={store.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" aria-hidden />
              </div>
              <div className="flex flex-col gap-2 p-5">
                <span className="text-xs text-saffron-300">{category?.name}</span>
                <h3 className="text-xl font-bold text-ink-50">
                  <Link href={`/stores/${store.id}`} className="after:absolute after:inset-0 after:content-['']">
                    {store.name}
                  </Link>
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-ink-300">{store.description}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-ink-400">
                  <Rating value={store.rating} />
                  <span>{formatNumber(store.ratingCount)} نظر</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function EditorialBanners() {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-4 md:grid-cols-2 md:px-8">
      {[
        {
          title: 'صبحانه‌ای که ارزشش را دارد',
          text: 'نان خمیرترش، بریوش و قهوه تخصصی؛ همه با قیمتی که از ساعت صبح عرضه می‌شود.',
          image: 'https://images.pexels.com/photos/13427852/pexels-photo-13427852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
          href: '/explore?category=bakery',
        },
        {
          title: 'شیرینی بعد از شام',
          text: 'جعبه‌های ترکیبی و کیک‌های فصلی از شیرینی‌سراهای برتر، برای پایان یک روز خوب.',
          image: 'https://images.pexels.com/photos/39240989/pexels-photo-39240989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
          href: '/explore?category=desserts',
        },
      ].map((banner) => (
        <Link key={banner.title} href={banner.href} className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl border border-ink-800">
          <img src={banner.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/10" aria-hidden />
          <div className="relative flex flex-col gap-3 p-8">
            <h3 className="text-2xl font-bold text-ink-50 md:text-3xl">{banner.title}</h3>
            <p className="max-w-md text-sm leading-relaxed text-ink-200">{banner.text}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}

export function NewArrivals() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading eyebrow="تازه اضافه شده‌ها" title="جدیدترین محصولات" action={<SeeAll href="/explore?sort=newest" label="مشاهده همه" />} />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {byNewest.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: '۱', title: 'کاوش کنید', text: 'محصولات امروز را بر اساس دسته، فاصله، قیمت یا زمان تحویل پیدا کنید.' },
    { n: '۲', title: 'رزرو کنید', text: 'جزئیات محصول، ترکیب بسته و اطلاعات نگهداری را پیش از سفارش ببینید.' },
    { n: '۳', title: 'دریافت کنید', text: 'در بازه زمانی اعلام‌شده به فروشگاه بروید یا بسته را به آدرس خود دریافت کنید.' },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading eyebrow="چطور کار می‌کند" title="سه گام تا یک خرید هوشمند" />
      <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n} className="flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900/60 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron-400 text-lg font-bold text-ink-950">{step.n}</span>
            <h3 className="text-lg font-semibold text-ink-50">{step.title}</h3>
            <p className="text-sm leading-[1.9] text-ink-300">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function MerchantCallout() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-800 bg-ink-900 p-8 md:flex-row md:items-center md:p-12">
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="text-2xl font-bold text-ink-50">فروشگاه دارید؟</h2>
          <p className="text-sm leading-[1.9] text-ink-300">
            محصولات پایان روز خود را با قیمت منصفانه عرضه کنید و مشتریان جدیدی پیدا کنید. ثبت محصول در کمتر از یک دقیقه.
          </p>
        </div>
        <Link href="/merchant" className="inline-flex h-11 items-center gap-2 rounded-full border border-saffron-400/60 px-6 text-sm font-semibold text-saffron-300 transition-colors hover:bg-saffron-400 hover:text-ink-950">
          ورود به پنل فروشگاه
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
