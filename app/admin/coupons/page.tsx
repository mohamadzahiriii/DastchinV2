import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { coupons } from '@/data/admin';
import { formatNumber, formatPercent } from '@/lib/format';

type Coupon = (typeof coupons)[number];

const columns: Column<Coupon>[] = [
  { key: 'code', label: 'کد', render: (c) => <span className="font-semibold tracking-wide text-ink-50">{c.code}</span> },
  { key: 'description', label: 'توضیح', render: (c) => c.description },
  { key: 'discount', label: 'تخفیف', render: (c) => <span className="tabular-nums">{formatPercent(c.discount)}</span> },
  { key: 'uses', label: 'استفاده', render: (c) => <span className="tabular-nums">{formatNumber(c.uses)}</span> },
  {
    key: 'status',
    label: 'وضعیت',
    render: (c) => (c.active ? <StatusPill tone="success">فعال</StatusPill> : <StatusPill tone="neutral">غیرفعال</StatusPill>),
  },
  { key: 'actions', label: 'اقدام', render: (c) => <DemoActionButton label="ویرایش" message={`ویرایش کد ${c.code} در نسخه نمایشی فعال نیست.`} /> },
];

export default function AdminCouponsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="کوپن‌ها"
        description="کدهای تخفیف کمپین‌ها را مدیریت کنید."
        actions={<DemoActionButton label="ساخت کوپن" message="ساخت کوپن در نسخه نمایشی فعال نیست." variant="primary" />}
      />
      <DemoNotice>کدهای تخفیف نمونه‌اند و قابل استفاده نیستند.</DemoNotice>
      <DataTable columns={columns} rows={coupons} rowKey={(c) => c.code} />
    </div>
  );
}
