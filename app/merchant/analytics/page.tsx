import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { StatCard } from '@/features/dashboard/DashboardWidgets';
import { weeklySales, merchantStats } from '@/data/merchant';
import { formatMetric } from '@/features/dashboard/metrics';
import { formatToman } from '@/lib/format';

export default function MerchantAnalyticsPage() {
  const total = weeklySales.reduce((sum, d) => sum + d.amount, 0);
  const best = weeklySales.reduce((a, b) => (b.amount > a.amount ? b : a));
  const max = Math.max(...weeklySales.map((d) => d.amount));
  const avg = Math.round(total / weeklySales.length);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="تحلیل فروش" description="روند فروش هفتگی و عملکرد کلی فروشگاه." />
      <DemoNotice>اعداد این صفحه نمایشی هستند و بر پایه فروش واقعی محاسبه نشده‌اند.</DemoNotice>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="مجموع فروش هفته" value={formatToman(total)} />
        <StatCard label="میانگین روزانه" value={formatToman(avg)} />
        <StatCard label="پرفروش‌ترین روز" value={best.day} hint={formatToman(best.amount)} />
        <StatCard label="امتیاز فروشگاه" value={formatMetric(merchantStats[3].value, merchantStats[3].kind)} />
      </div>

      <section className="flex flex-col gap-6 rounded-2xl border border-ink-800 bg-ink-900 p-6">
        <h2 className="text-base font-semibold text-ink-50">فروش روزانه</h2>
        <ul className="flex flex-col gap-4">
          {weeklySales.map((d) => (
            <li key={d.day} className="grid grid-cols-[4.5rem_1fr_6.5rem] items-center gap-4 text-sm">
              <span className="text-ink-300">{d.day}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-ink-800">
                <div className="h-full rounded-full bg-saffron-400" style={{ width: `${Math.round((d.amount / max) * 100)}%` }} />
              </div>
              <span className="text-end tabular-nums text-ink-100">{formatToman(d.amount)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
