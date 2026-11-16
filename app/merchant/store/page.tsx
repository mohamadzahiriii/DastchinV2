import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { getStore } from '@/data/lookup';
import { merchantStore } from '@/data/merchant';
import { formatNumber, formatRating, formatToman } from '@/lib/format';

export default function MerchantStorePage() {
  const store = getStore(merchantStore.storeId);
  if (!store) return null;

  const rows: [string, string][] = [
    ['نشانی', store.address],
    ['ساعت کاری', store.hours],
    ['دریافت حضوری', store.pickupEnabled ? store.pickupInstructions : 'غیرفعال'],
    ['ارسال', store.deliveryEnabled ? `فعال · هزینه ${formatToman(store.deliveryFee)}` : 'غیرفعال'],
    ['مناطق ارسال', store.deliveryAreas.join('، ')],
    ['امتیاز', `${formatRating(store.rating)} از ${formatNumber(store.ratingCount)} نظر`],
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="پروفایل فروشگاه" description="اطلاعاتی که مشتریان در صفحه فروشگاه شما می‌بینند." />
      <DemoNotice>برای تغییر اطلاعات، از بخش تنظیمات فروشگاه استفاده کنید. این صفحه فقط نمایش می‌دهد.</DemoNotice>

      <section className="grid gap-6 rounded-2xl border border-ink-800 bg-ink-900 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="flex flex-col gap-3">
          <span className="text-xs text-ink-400">نام فروشگاه</span>
          <h2 className="text-xl font-bold text-ink-50">{store.name}</h2>
          <p className="text-sm leading-relaxed text-ink-300">{store.description}</p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-xs text-ink-400">{label}</dt>
              <dd className="text-sm leading-relaxed text-ink-100">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
