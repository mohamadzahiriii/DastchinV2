import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill, type Tone } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { merchantApplications } from '@/data/admin';
import { formatPersianDate } from '@/lib/format';

type Application = (typeof merchantApplications)[number];

const documentTone: Record<string, Tone> = { 'کامل': 'success', 'نیاز به بررسی': 'warning' };

const columns: Column<Application>[] = [
  { key: 'name', label: 'فروشگاه متقاضی', render: (a) => <span className="font-medium text-ink-50">{a.name}</span> },
  { key: 'category', label: 'دسته', render: (a) => a.category },
  { key: 'city', label: 'شهر', render: (a) => a.city },
  { key: 'submitted', label: 'تاریخ درخواست', render: (a) => formatPersianDate(a.submittedAt) },
  { key: 'docs', label: 'مدارک', render: (a) => <StatusPill tone={documentTone[a.documents] ?? 'neutral'}>{a.documents}</StatusPill> },
  {
    key: 'actions',
    label: 'اقدام',
    render: (a) => (
      <div className="flex gap-2">
        <DemoActionButton label="تایید" message={`تایید ${a.name} در نسخه نمایشی ثبت شد.`} variant="primary" />
        <DemoActionButton label="رد" message={`رد درخواست ${a.name} در نسخه نمایشی ثبت شد.`} variant="danger" />
      </div>
    ),
  },
];

export default function AdminApprovalsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="تایید فروشگاه" description="درخواست‌های فروشگاه‌های جدید را بررسی و تایید کنید." />
      <DemoNotice>درخواست‌ها نمونه‌اند. تایید یا رد آن‌ها تاثیری روی پلتفرم واقعی ندارد.</DemoNotice>
      <DataTable columns={columns} rows={merchantApplications} rowKey={(a) => a.id} />
    </div>
  );
}
