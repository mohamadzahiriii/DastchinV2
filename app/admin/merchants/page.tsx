import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { stores } from '@/data/stores';
import { getCategory } from '@/data/lookup';
import { formatRating } from '@/lib/format';
import type { Store } from '@/types';

const columns: Column<Store>[] = [
  { key: 'name', label: 'فروشگاه', render: (s) => <span className="font-medium text-ink-50">{s.name}</span> },
  { key: 'category', label: 'دسته', render: (s) => getCategory(s.categoryId)?.name ?? '—' },
  { key: 'area', label: 'منطقه', render: (s) => s.neighborhood },
  { key: 'rating', label: 'امتیاز', render: (s) => formatRating(s.rating) },
  { key: 'status', label: 'وضعیت', render: () => <StatusPill tone="success">فعال</StatusPill> },
  { key: 'actions', label: 'اقدام', render: (s) => <DemoActionButton label="مشاهده" message={`پروفایل ${s.name} در پنل مدیریت نمایشی است.`} /> },
];

export default function AdminMerchantsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="مدیریت فروشگاه‌ها" description="فروشگاه‌های فعال پلتفرم و وضعیت هر یک." />
      <DemoNotice>فروشگاه‌ها نمونه‌اند و شرکای واقعی پلتفرم محسوب نمی‌شوند.</DemoNotice>
      <DataTable columns={columns} rows={stores} rowKey={(s) => s.id} />
    </div>
  );
}
