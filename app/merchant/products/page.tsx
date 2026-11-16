import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { StatusPill } from '@/features/dashboard/DashboardWidgets';
import { productsForStore } from '@/data/lookup';
import { merchantStore } from '@/data/merchant';
import { formatCollectionWindow, formatToman } from '@/lib/format';
import type { Product } from '@/types';

const columns: Column<Product>[] = [
  { key: 'name', label: 'محصول', render: (p) => <span className="font-medium text-ink-50">{p.name}</span> },
  { key: 'price', label: 'قیمت', render: (p) => <span className="tabular-nums">{formatToman(p.price)}</span> },
  { key: 'remaining', label: 'موجودی', render: (p) => <span className="tabular-nums">{p.remaining} بسته</span> },
  { key: 'collection', label: 'زمان تحویل', render: (p) => formatCollectionWindow(p.collection.startsAt, p.collection.endsAt) },
  {
    key: 'status',
    label: 'وضعیت',
    render: (p) => (p.remaining > 0 ? <StatusPill tone="success">منتشر شده</StatusPill> : <StatusPill tone="neutral">فروخته شد</StatusPill>),
  },
];

export default function MerchantProductsPage() {
  const products = productsForStore(merchantStore.storeId);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="محصولات"
        description="بسته‌های فعال و پیش‌نویس‌های فروشگاه خود را مدیریت کنید."
        actions={
          <Link href="/merchant/products/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-saffron-400 px-5 text-sm font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95">
            <Plus className="h-4 w-4" aria-hidden /> افزودن محصول
          </Link>
        }
      />
      <DataTable columns={columns} rows={products} rowKey={(p) => p.id} />
    </div>
  );
}
