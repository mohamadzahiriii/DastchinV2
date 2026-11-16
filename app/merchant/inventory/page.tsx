import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { productsForStore } from '@/data/lookup';
import { merchantStore } from '@/data/merchant';
import { formatNumber } from '@/lib/format';
import type { Product } from '@/types';

const columns: Column<Product>[] = [
  { key: 'name', label: 'محصول', render: (p) => <span className="font-medium text-ink-50">{p.name}</span> },
  { key: 'remaining', label: 'موجودی فعلی', render: (p) => <span className="tabular-nums">{formatNumber(p.remaining)} بسته</span> },
  { key: 'max', label: 'حداکثر هر سفارش', render: (p) => <span className="tabular-nums">{formatNumber(p.maxPerOrder)} بسته</span> },
  {
    key: 'state',
    label: 'وضعیت',
    render: (p) =>
      p.remaining <= 2 ? <StatusPill tone="warning">رو به اتمام</StatusPill> : <StatusPill tone="success">کافی</StatusPill>,
  },
];

export default function MerchantInventoryPage() {
  const products = productsForStore(merchantStore.storeId);
  const total = products.reduce((sum, p) => sum + p.remaining, 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="موجودی" description={`مجموع ${formatNumber(total)} بسته آماده فروش در فروشگاه شما.`} />
      <DemoNotice>موجودی‌ها نمایشی هستند و با سفارش‌های واقعی به‌روز نمی‌شوند.</DemoNotice>
      <DataTable columns={columns} rows={products} rowKey={(p) => p.id} />
    </div>
  );
}
