import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bike, Clock, MapPin, Store as StoreIcon } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { Rating } from '@/components/shared/Rating';
import { DemoNotice } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/Feedback';
import { getCategory, getStore, productsForStore } from '@/data/lookup';
import { formatNumber, formatToman } from '@/lib/format';

export default function StoreDetailPage({ params }: { params: { id: string } }) {
  const store = getStore(params.id);
  if (!store) notFound();

  const category = getCategory(store.categoryId);
  const storeProducts = productsForStore(store.id);

  return (
    <>
      <section className="relative h-64 overflow-hidden md:h-80">
        <img src={store.coverImage} alt={store.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" aria-hidden />
      </section>

      <div className="mx-auto -mt-20 flex max-w-7xl flex-col gap-10 px-4 pb-16 md:px-8">
        <div className="relative flex flex-col gap-6 rounded-3xl border border-ink-800 bg-ink-900 p-6 md:flex-row md:items-end md:p-8">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-ink-900 bg-saffron-400 text-3xl font-bold text-ink-950">
            {store.name.charAt(0)}
          </span>
          <div className="flex flex-1 flex-col gap-3">
            <span className="text-xs font-medium text-saffron-300">{category?.name}</span>
            <h1 className="text-3xl font-bold text-ink-50">{store.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-300">
              <Rating value={store.rating} count={store.ratingCount} />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-ink-400" aria-hidden /> {store.neighborhood}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-ink-400" aria-hidden /> ساعت کاری {store.hours}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-ink-50">درباره فروشگاه</h2>
              <p className="text-sm leading-[1.9] text-ink-300">{store.description}</p>
            </div>

            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-ink-50">محصولات امروز</h2>
              {storeProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {storeProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState title="محصول فعالی وجود ندارد" description="فروشگاه امروز محصولی برای عرضه ندارد. بعداً دوباره سر بزنید." />
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-6">
              <h3 className="text-sm font-semibold text-ink-50">تحویل و ارسال</h3>
              <div className="flex items-start gap-3 text-sm text-ink-300">
                <StoreIcon className="mt-0.5 h-4 w-4 shrink-0 text-saffron-300" aria-hidden />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-ink-100">{store.pickupEnabled ? 'تحویل حضوری' : 'تحویل حضوری ندارد'}</span>
                  {store.pickupEnabled && <span className="text-xs leading-relaxed">{store.pickupInstructions}</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-ink-300">
                <Bike className="mt-0.5 h-4 w-4 shrink-0 text-saffron-300" aria-hidden />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-ink-100">{store.deliveryEnabled ? `ارسال با هزینه ${formatToman(store.deliveryFee)}` : 'ارسال ندارد'}</span>
                  {store.deliveryEnabled && (
                    <span className="text-xs leading-relaxed">مناطق: {store.deliveryAreas.join('، ')}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-ink-800 bg-ink-900 p-6 text-sm text-ink-300">
              <h3 className="font-semibold text-ink-50">نشانی</h3>
              <p className="leading-relaxed">{store.address}</p>
              <p className="pt-2 text-xs text-ink-400">{formatNumber(storeProducts.length)} محصول فعال · <Link href="/explore" className="text-saffron-300 hover:underline">کاوش همه محصولات</Link></p>
            </div>
            <DemoNotice>این فروشگاه نمونه است و با شریک واقعی پلتفرم ارتباطی ندارد.</DemoNotice>
          </aside>
        </div>
      </div>
    </>
  );
}
