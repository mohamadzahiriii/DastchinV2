import Link from 'next/link';
import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill, StatCard, type Tone } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { formatMetric } from '@/features/dashboard/metrics';
import { adminStats, merchantApplications, productReviews, complaints } from '@/data/admin';
import { formatPersianDate } from '@/lib/format';

type Application = (typeof merchantApplications)[number];
type Review = (typeof productReviews)[number];
type Complaint = (typeof complaints)[number];

const documentTone: Record<string, Tone> = { 'کامل': 'success', 'نیاز به بررسی': 'warning' };
const reviewTone: Record<string, Tone> = { pending: 'warning', approved: 'success' };
const reviewLabel: Record<string, string> = { pending: 'در انتظار', approved: 'تایید شده' };
const priorityTone: Record<string, Tone> = { high: 'danger', normal: 'neutral' };
const priorityLabel: Record<string, string> = { high: 'فوری', normal: 'عادی' };
const complaintStatusLabel: Record<string, string> = { open: 'باز', in_review: 'در حال بررسی' };

const applicationColumns: Column<Application>[] = [
  { key: 'name', label: 'فروشگاه', render: (a) => <span className="font-medium text-ink-50">{a.name}</span> },
  { key: 'category', label: 'دسته', render: (a) => a.category },
  { key: 'submitted', label: 'ثبت درخواست', render: (a) => formatPersianDate(a.submittedAt) },
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

const reviewColumns: Column<Review>[] = [
  { key: 'product', label: 'محصول', render: (r) => <span className="font-medium text-ink-50">{r.product}</span> },
  { key: 'store', label: 'فروشگاه', render: (r) => r.store },
  { key: 'reason', label: 'دلیل بازبینی', render: (r) => r.reason },
  { key: 'status', label: 'وضعیت', render: (r) => <StatusPill tone={reviewTone[r.status]}>{reviewLabel[r.status]}</StatusPill> },
  {
    key: 'actions',
    label: 'اقدام',
    render: (r) =>
      r.status === 'pending' ? (
        <div className="flex gap-2">
          <DemoActionButton label="تایید" message="تایید محصول در نسخه نمایشی ثبت شد." variant="primary" />
          <DemoActionButton label="نیاز به اصلاح" message="ارسال بازخورد به فروشگاه در نسخه نمایشی فعال نیست." />
        </div>
      ) : (
        <span className="text-xs text-ink-400">بررسی شده</span>
      ),
  },
];

const complaintColumns: Column<Complaint>[] = [
  { key: 'id', label: 'شناسه', render: (c) => <span className="tabular-nums text-ink-300">{c.id}</span> },
  { key: 'subject', label: 'موضوع', render: (c) => <span className="font-medium text-ink-50">{c.subject}</span> },
  { key: 'party', label: 'طرف شکایت', render: (c) => c.party },
  { key: 'priority', label: 'اولویت', render: (c) => <StatusPill tone={priorityTone[c.priority]}>{priorityLabel[c.priority]}</StatusPill> },
  { key: 'status', label: 'وضعیت', render: (c) => complaintStatusLabel[c.status] },
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="نمای کلی پلتفرم" description="وضعیت کلی کاربران، فروشگاه‌ها، معاملات و صف‌های نیازمند بررسی." />
      <DemoNotice>همه اعداد این پنل نمایشی هستند و از داده واقعی محاسبه نشده‌اند.</DemoNotice>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {adminStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={formatMetric(s.value, s.kind)} />
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-50">درخواست‌های تایید فروشگاه</h2>
          <Link href="/admin/merchants/approvals" className="text-sm text-saffron-300 hover:underline">همه درخواست‌ها</Link>
        </div>
        <DataTable columns={applicationColumns} rows={merchantApplications} rowKey={(a) => a.id} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink-50">شکایات باز</h2>
        <DataTable columns={complaintColumns} rows={complaints} rowKey={(c) => c.id} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink-50">محصولات در انتظار بازبینی</h2>
        <DataTable columns={reviewColumns} rows={productReviews} rowKey={(r) => r.id} />
      </section>
    </div>
  );
}
