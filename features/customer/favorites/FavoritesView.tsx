'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useFavoritesSupabase } from '@/hooks/use-favorites-supabase';
import { ProductCard } from '@/components/shared/ProductCard';
import { StoreCard } from '@/components/shared/StoreCard';
import { ButtonLink } from '@/components/shared/ButtonLink';
import { EmptyState } from '@/components/shared/Feedback';
import { DemoNotice, PageHeader } from '@/components/shared/PageHeader';
import { products } from '@/data/products';
import { stores } from '@/data/stores';

export function FavoritesView() {
  const { isAuthenticated } = useAuth();
  const localFavs = useFavorites();
  const supabaseFavs = useFavoritesSupabase();

  const ids = isAuthenticated ? supabaseFavs.ids : localFavs.ids;
  const savedProducts = products.filter((p) => ids.includes(p.id));
  const savedStores = stores.filter((s) => ids.includes(s.id));
  const empty = savedProducts.length === 0 && savedStores.length === 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:px-8">
      <PageHeader title="علاقه‌مندی‌ها" description="محصولات و فروشگاه‌هایی که ذخیره کرده‌اید." />
      {!isAuthenticated && (
        <DemoNotice>
          علاقه‌مندی‌ها فعلاً فقط در همین مرورگر ذخیره می‌شوند.{' '}
          <Link href="/login" className="font-medium text-teal-200 hover:underline">وارد شوید</Link>
          {' '}تا ذخیره شوند.
        </DemoNotice>
      )}

      {empty ? (
        <EmptyState
          title="هنوز چیزی ذخیره نکرده‌اید"
          description="با زدن نماد قلب روی محصولات و فروشگاه‌ها، آنها را برای بعد نگه دارید."
          action={<ButtonLink href="/explore">کاوش محصولات</ButtonLink>}
        />
      ) : (
        <>
          {savedProducts.length > 0 && (
            <section className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-ink-50">محصولات</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {savedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
          {savedStores.length > 0 && (
            <section className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-ink-50">فروشگاه‌ها</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {savedStores.map((s) => <StoreCard key={s.id} store={s} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
