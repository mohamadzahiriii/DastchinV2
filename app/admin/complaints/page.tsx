import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill, type Tone } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { complaints } from '@/data/admin';

type Complaint = (typeof complaints)[number];

const priorityTone: Record<string, Tone> = { high: 'danger', normal: 'neutral' };
const priorityLabel: Record<string, string> = { high: 'فوری', normal: 'عادی' };
const statusLabel: Record<string, string> = { open: 'باز', in_review: 'در حال بررسی' };
const partyLabel: Record<string, string> = { مشتری: 'مشتری', فروشگاه: 'فروشگاه' };

const columns: Column<Complaint>[] = [
  { key: 'id', label: 'شناسه', render: (c) => <span className="tabular-nums text-ink-300">{c.id}</span> },
  { key: 'subject', label: 'موضوع', render: (c) => <span className="font-medium text-ink-50">{c.subject}</span> },
  { key: 'party', label: 'طرف شکایت', render: (c) => partyLabel[c.party] },
  { key: 'priority', label: 'اولویت', render: (c) => <StatusPill tone={priorityTone[c.priority]}>{priorityLabel[c.priority]}</StatusPill> },
  { key: 'status', label: 'وضعیت', render: (c) => statusLabel[c.status] },
  { key: 'actions', label: 'اقدام', render: (c) => <DemoActionButton label="بررسی" message={`بررسی ${c.id} در نسخه نمایشی فعال نیست.`} /> },
];

export default function AdminComplaintsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="شکایات و پشتیبانی" description="شکایات مشتریان و فروشگاه‌ها را با اولویت پیگیری کنید." />
      <DemoNotice>شکایات نمونه‌اند و به تیم پشتیبانی واقعی متصل نیستند.</DemoNotice>
      <DataTable columns={columns} rows={complaints} rowKey={(c) => c.id} />
    </div>
  );
}
