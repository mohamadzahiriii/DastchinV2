import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { getProduct } from '@/data/lookup';
import { merchantStore } from '@/data/merchant';
import { orders } from '@/data/orders';
import { formatCollectionWindow, formatPersianDate, formatToman, formatNumber } from '@/lib/format';
import type { Order } from '@/types';

const columns: Column<Order>[] = [
  { key: 'code', label: 'کد سفارش', render: (o) => <span className="font-medium tabular-nums text-ink-50">{o.code}</span> },
  { key: 'product', label: 'محصول', render: (o) => getProduct(o.productId)?.name ?? '—' },
  { key: 'qty', label: 'تعداد', render: (o) => <span className="tabular-nums">{formatNumber(o.quantity)}</span> },
  { key: 'total', label: 'مبلغ', render: (o) => <span className="tabular-nums">{formatToman(o.total)}</span> },
  { key: 'when', label: 'تحویل', render: (o) => formatCollectionWindow(o.collection.startsAt, o.collection.endsAt) },
  { key: 'placed', label: 'ثبت', render: (o) => formatPersianDate(o.placedAt) },
  { key: 'status', label: 'وضعیت', render: (o) => <OrderStatusBadge status={o.status} /> },
];

export default function MerchantOrdersPage() {
  const storeOrders = orders.filter((o) => o.storeId === merchantStore.storeId);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="سفارش‌ها" description="سفارش‌های ثبت‌شده برای فروشگاه شما و وضعیت تحویل آن‌ها." />
      <DemoNotice>سفارش‌های نمایش داده‌شده نمونه‌اند و به سفارش واقعی مشتریان متصل نیستند.</DemoNotice>
      <DataTable columns={columns} rows={storeOrders} rowKey={(o) => o.id} />
    </div>
  );
}
