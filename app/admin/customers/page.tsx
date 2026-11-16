import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { customers } from '@/data/admin';
import { formatNumber, formatPersianDate } from '@/lib/format';

type Customer = (typeof customers)[number];

const columns: Column<Customer>[] = [
  { key: 'name', label: 'نام', render: (c) => <span className="font-medium text-ink-50">{c.name}</span> },
  { key: 'phone', label: 'موبایل', render: (c) => <span className="tabular-nums">{c.phone}</span> },
  { key: 'orders', label: 'سفارش‌ها', render: (c) => <span className="tabular-nums">{formatNumber(c.orders)}</span> },
  { key: 'joined', label: 'تاریخ عضویت', render: (c) => formatPersianDate(c.joinedAt) },
  {
    key: 'status',
    label: 'وضعیت',
    render: (c) => (c.status === 'active' ? <StatusPill tone="success">فعال</StatusPill> : <StatusPill tone="danger">محدود</StatusPill>),
  },
  {
    key: 'actions',
    label: 'اقدام',
    render: (c) => <DemoActionButton label="مشاهده" message={`جزئیات ${c.name} در نسخه نمایشی فعال نیست.`} />,
  },
];

export default function AdminCustomersPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="مدیریت مشتریان" description="فهرست مشتریان، وضعیت حساب و سابقه سفارش." />
      <DemoNotice>مشتریان نمونه‌اند و به حساب‌های واقعی متصل نیستند.</DemoNotice>
      <DataTable columns={columns} rows={customers} rowKey={(c) => c.id} />
    </div>
  );
}
