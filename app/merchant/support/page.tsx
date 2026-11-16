import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { merchantSupportTickets } from '@/data/merchant';
import { formatPersianDate } from '@/lib/format';

type SupportTicket = (typeof merchantSupportTickets)[number];

const columns: Column<SupportTicket>[] = [
  { key: 'id', label: 'شناسه', render: (t) => <span className="tabular-nums text-ink-300">{t.id}</span> },
  { key: 'subject', label: 'موضوع', render: (t) => <span className="font-medium text-ink-50">{t.subject}</span> },
  { key: 'updated', label: 'آخرین به‌روزرسانی', render: (t) => formatPersianDate(t.updatedAt) },
  {
    key: 'status',
    label: 'وضعیت',
    render: (t) => (t.status === 'open' ? <StatusPill tone="info">باز</StatusPill> : <StatusPill tone="neutral">حل شده</StatusPill>),
  },
];

export default function MerchantSupportPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="پشتیبانی"
        description="درخواست‌های فروشگاه خود را پیگیری کنید."
        actions={<DemoActionButton label="ثبت درخواست جدید" message="ثبت درخواست در نسخه نمایشی فعال نیست." variant="primary" />}
      />
      <DemoNotice>تیکت‌ها نمونه‌اند و به تیم پشتیبانی واقعی متصل نیستند.</DemoNotice>
      <DataTable columns={columns} rows={merchantSupportTickets} rowKey={(t) => t.id} />
    </div>
  );
}
