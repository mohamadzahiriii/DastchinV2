import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { StatCard } from '@/features/dashboard/DashboardWidgets';
import { formatMetric } from '@/features/dashboard/metrics';
import { adminStats, coupons, customers, complaints } from '@/data/admin';
import { formatNumber } from '@/lib/format';

export default function AdminAnalyticsPage() {
  const activeCoupons = coupons.filter((c) => c.active).length;
  const restricted = customers.filter((c) => c.status === 'restricted').length;
  const openComplaints = complaints.length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="تحلیل و گزارش" description="شاخص‌های کلیدی عملکرد پلتفرم در یک نگاه." />
      <DemoNotice>همه شاخص‌ها نمایشی هستند و از داده واقعی محاسبه نشده‌اند.</DemoNotice>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {adminStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={formatMetric(s.value, s.kind)} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="کوپن‌های فعال" value={formatNumber(activeCoupons)} />
        <StatCard label="مشتریان محدود شده" value={formatNumber(restricted)} />
        <StatCard label="شکایات باز" value={formatNumber(openComplaints)} />
      </div>
    </div>
  );
}
