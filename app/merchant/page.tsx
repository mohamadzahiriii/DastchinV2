import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { getProduct, productsForStore } from '@/data/lookup';
import { merchantStats, merchantStore, weeklySales } from '@/data/merchant';
import { orders } from '@/data/orders';
import { StatCard } from '@/features/dashboard/DashboardWidgets';
import { formatMetric } from '@/features/dashboard/metrics';
import { formatCollectionWindow, formatPersianDate, formatToman } from '@/lib/format';

export default function MerchantOverviewPage() {
  const storeOrders = orders.filter((o) => o.storeId === merchantStore.storeId);
  const storeProducts = productsForStore(merchantStore.storeId);
  const maxDay = Math.max(...weeklySales.map((d) => d.amount));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="نمای کلی فروشگاه"
        description="وضعیت فروش، سفارش‌ها و محصولات امروز فروشگاه خود را یک‌جا ببینید."
        actions={
          <Link href="/merchant/products/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-saffron-400 px-5 text-sm font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95">
            <Plus className="h-4 w-4" aria-hidden /> ثبت محصول جدید
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {merchantStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={formatMetric(s.value, s.kind)} hint={s.delta ? `${s.delta > 0 ? '+' : ''}${s.delta} نسبت به هفته قبل` : 'بدون تغییر'} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="flex flex-col gap-6 rounded-2xl border border-ink-800 bg-ink-900 p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-50">فروش هفته</h2>
            <span className="text-xs text-ink-400">نمایشی</span>
          </div>
          <div className="flex h-52 items-end gap-3">
            {weeklySales.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-saffron-500/60 to-saffron-300 transition-opacity hover:opacity-80"
                  style={{ height: `${Math.round((d.amount / maxDay) * 100)}%` }}
                  title={formatToman(d.amount)}
                />
                <span className="text-center text-[11px] text-ink-400">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-6">
          <h2 className="text-base font-semibold text-ink-50">محصولات فعال</h2>
          <ul className="flex flex-col gap-3">
            {storeProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink-100">{p.name}</span>
                <span className="text-xs text-ink-400 tabular-nums">{p.remaining} بسته</span>
              </li>
            ))}
          </ul>
          <Link href="/merchant/products" className="text-sm font-medium text-saffron-300 hover:underline">مدیریت محصولات</Link>
        </section>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink-50">سفارش‌های اخیر</h2>
        <ul className="flex flex-col divide-y divide-ink-800 rounded-2xl border border-ink-800 bg-ink-900">
          {storeOrders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-ink-50">{getProduct(o.productId)?.name}</span>
                <span className="text-xs text-ink-400">{o.code} · {formatPersianDate(o.placedAt)} · {formatCollectionWindow(o.collection.startsAt, o.collection.endsAt)}</span>
              </div>
              <OrderStatusBadge status={o.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
