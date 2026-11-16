import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { getProduct, getStore } from '@/data/lookup';
import { orders } from '@/data/orders';
import { formatPersianDate, formatToman } from '@/lib/format';
import type { Order } from '@/types';

const columns: Column<Order>[] = [
  { key: 'code', label: 'کد سفارش', render: (o) => <span className="font-medium tabular-nums text-ink-50">{o.code}</span> },
  { key: 'product', label: 'محصول', render: (o) => getProduct(o.productId)?.name ?? '—' },
  { key: 'store', label: 'فروشگاه', render: (o) => getStore(o.storeId)?.name ?? '—' },
  { key: 'total', label: 'مبلغ', render: (o) => <span className="tabular-nums">{formatToman(o.total)}</span> },
  { key: 'fulfillment', label: 'تحویل', render: (o) => (o.fulfillment === 'pickup' ? 'حضوری' : 'ارسال') },
  { key: 'placed', label: 'ثبت', render: (o) => formatPersianDate(o.placedAt) },
  { key: 'status', label: 'وضعیت', render: (o) => <OrderStatusBadge status={o.status} /> },
];

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="مدیریت سفارش‌ها" description="همه سفارش‌های پلتفرم، وضعیت تحویل و مبلغ هر سفارش." />
      <DemoNotice>سفارش‌های این فهرست نمونه‌اند.</DemoNotice>
      <DataTable columns={columns} rows={orders} rowKey={(o) => o.id} />
    </div>
  );
}
