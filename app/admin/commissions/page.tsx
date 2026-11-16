import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { commissionRules } from '@/data/admin';
import { formatPercent } from '@/lib/format';

type Rule = (typeof commissionRules)[number];

const columns: Column<Rule>[] = [
  { key: 'category', label: 'دسته‌بندی', render: (r) => <span className="font-medium text-ink-50">{r.category}</span> },
  { key: 'rate', label: 'نرخ کارمزد', render: (r) => <span className="tabular-nums">{formatPercent(r.rate)}</span> },
  { key: 'actions', label: 'اقدام', render: (r) => <DemoActionButton label="ویرایش نرخ" message={`تغییر نرخ ${r.category} در نسخه نمایشی فعال نیست.`} /> },
];

export default function AdminCommissionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="کارمزد" description="نرخ کارمزد پلتفرم برای هر دسته‌بندی." />
      <DemoNotice>نرخ‌های این صفحه نمونه‌اند و در محاسبه واقعی استفاده نمی‌شوند.</DemoNotice>
      <DataTable columns={columns} rows={commissionRules} rowKey={(r) => r.category} />
    </div>
  );
}
