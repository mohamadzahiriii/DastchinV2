import Link from 'next/link';
import { ArrowLeft, Search, Sparkles, ShieldCheck, Clock, BadgePercent } from 'lucide-react';
import { SearchBar } from '@/components/shared/SearchBar';
import { brand } from '@/config/brand';

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="https://images.pexels.com/photos/14731635/pexels-photo-14731635.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/30 via-ink-950/75 to-ink-950" aria-hidden />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-16 md:px-8 md:pb-24 md:pt-28">
        <div className="animate-fade-up flex max-w-3xl flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-saffron-400/30 bg-ink-950/60 px-3.5 py-1.5 text-xs font-medium text-saffron-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            فرصت‌های روزانه در {brand.city}
          </span>
          <h1 className="text-4xl font-bold leading-[1.25] text-ink-50 md:text-6xl">
            بیشتر کشف کنید.
            <br />
            <span className="text-saffron-300">کمتر هدر دهید.</span>
          </h1>
          <p className="max-w-xl text-base leading-[1.9] text-ink-200 md:text-lg">
            محصولات امروز نانوایی‌ها، کافه‌ها و فروشگاه‌های منتخب تهران را با قیمت ویژه پیدا کنید. هر فرصت با زمان تحویل، موجودی و اطلاعات شفاف عرضه می‌شود.
          </p>
        </div>

        <div className="animate-fade-up flex max-w-2xl flex-col gap-4 [animation-delay:120ms]">
          <SearchBar size="lg" />
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/explore"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-saffron-400 px-6 text-sm font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95"
            >
              <Search className="h-4 w-4" aria-hidden />
              کاوش فرصت‌های امروز
            </Link>
            <Link
              href="/stores"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-600 px-6 text-sm font-medium text-ink-50 transition-colors hover:border-ink-400 hover:bg-ink-900"
            >
              مشاهده فروشگاه‌ها
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <dl className="animate-fade-up grid max-w-3xl grid-cols-1 gap-4 border-t border-ink-800/80 pt-8 sm:grid-cols-3 [animation-delay:240ms]">
          {[
            { icon: BadgePercent, title: 'قیمت منصفانه', text: 'تخفیف‌ها بر پایه قیمت اعلام‌شده فروشگاه' },
            { icon: Clock, title: 'زمان مشخص', text: 'بازه تحویل را پیش از سفارش ببینید' },
            { icon: ShieldCheck, title: 'اطلاعات شفاف', text: 'نگهداری و آلرژن با تایید فروشگاه' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-saffron-300" aria-hidden />
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-semibold text-ink-50">{item.title}</dt>
                <dd className="text-xs leading-relaxed text-ink-300">{item.text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
