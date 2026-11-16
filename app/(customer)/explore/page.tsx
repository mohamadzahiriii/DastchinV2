import { ExploreView } from '@/features/customer/explore/ExploreView';
import { categories } from '@/data/categories';
import type { CategoryId } from '@/types';

type Props = {
  searchParams: { q?: string; category?: string };
};

export default function ExplorePage({ searchParams }: Props) {
  const category = categories.find((c) => c.id === searchParams.category)?.id as CategoryId | undefined;

  return (
    <>
      <div className="border-b border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <span className="text-xs font-medium text-saffron-300">کاوش</span>
          <h1 className="mt-2 text-3xl font-bold text-ink-50 md:text-4xl">فرصت‌های امروز در تهران</h1>
          <p className="mt-3 max-w-2xl text-sm leading-[1.9] text-ink-300">
            با فیلترهای دسته، قیمت، تخفیف و نحوه دریافت، محصول مناسب خود را پیدا کنید.
          </p>
        </div>
      </div>
      <ExploreView initialQuery={searchParams.q ?? ''} initialCategory={category ?? 'all'} />
    </>
  );
}
