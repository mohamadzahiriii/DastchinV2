import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { adminCategories } from '@/data/admin';
import { formatNumber } from '@/lib/format';

type Category = (typeof adminCategories)[number];

const columns: Column<Category>[] = [
  { key: 'name', label: 'دسته‌بندی', render: (c) => <span className="font-medium text-ink-50">{c.name}</span> },
  { key: 'stores', label: 'فروشگاه‌ها', render: (c) => <span className="tabular-nums">{formatNumber(c.stores)}</span> },
  { key: 'products', label: 'محصولات', render: (c) => <span className="tabular-nums">{formatNumber(c.products)}</span> },
  {
    key: 'status',
    label: 'وضعیت',
    render: (c) => (c.active ? <StatusPill tone="success">فعال</StatusPill> : <StatusPill tone="neutral">غیرفعال</StatusPill>),
  },
  { key: 'actions', label: 'اقدام', render: (c) => <DemoActionButton label="ویرایش" message={`ویرایش ${c.name} در نسخه نمایشی فعال نیست.`} /> },
];

export default function AdminCategoriesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="دسته‌بندی‌ها"
        description="دسته‌بندی‌های پلتفرم را مدیریت کنید. دسته‌های جدید بدون تغییر ساختار اصلی اضافه می‌شوند."
        actions={<DemoActionButton label="افزودن دسته" message="افزودن دسته‌بندی در نسخه نمایشی فعال نیست." variant="primary" />}
      />
      <DemoNotice>آمار دسته‌بندی‌ها نمونه‌اند.</DemoNotice>
      <DataTable columns={columns} rows={adminCategories} rowKey={(c) => c.name} />
    </div>
  );
}
