import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { settlements, type Settlement } from '@/data/merchant';
import { formatPersianDate, formatToman } from '@/lib/format';

const columns: Column<Settlement>[] = [
  { key: 'id', label: 'شناسه', render: (s) => <span className="tabular-nums text-ink-300">{s.id}</span> },
  { key: 'period', label: 'دوره', render: (s) => <span className="font-medium text-ink-50">{s.period}</span> },
  { key: 'net', label: 'مبلغ خالص', render: (s) => <span className="tabular-nums">{formatToman(s.net)}</span> },
  {
    key: 'status',
    label: 'وضعیت',
    render: (s) => (s.status === 'paid' ? <StatusPill tone="success">پرداخت شده</StatusPill> : <StatusPill tone="warning">در انتظار</StatusPill>),
  },
  { key: 'paid', label: 'تاریخ واریز', render: (s) => (s.paidAt ? formatPersianDate(s.paidAt) : '—') },
  { key: 'doc', label: 'صورت‌حساب', render: (s) => <DemoActionButton label="دریافت فایل" message="دریافت فایل صورت‌حساب در نسخه نمایشی فعال نیست." /> },
];

export default function MerchantSettlementsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="تسویه‌حساب‌ها" description="تاریخچه تسویه هفتگی و وضعیت واریزی‌ها." />
      <DemoNotice>تسویه‌ها نمایشی هستند و هیچ واریزی واقعی انجام نمی‌شود.</DemoNotice>
      <DataTable columns={columns} rows={settlements} rowKey={(s) => s.id} />
    </div>
  );
}
