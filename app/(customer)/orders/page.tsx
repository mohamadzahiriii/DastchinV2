import Link from 'next/link';
import { ArrowLeft, Bike, Store as StoreIcon } from 'lucide-react';
import { EmptyState } from '@/components/shared/Feedback';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { DemoNotice, PageHeader } from '@/components/shared/PageHeader';
import { getProduct, getStore } from '@/data/lookup';
import { orders } from '@/data/orders';
import { formatPersianDate, formatToman } from '@/lib/format';

export default function OrdersPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 md:px-8">
      <PageHeader title="سفارش‌های من" description="تاریخچه سفارش‌ها و وضعیت هر بسته را اینجا ببینید." />
      <DemoNotice>سفارش‌های این صفحه نمونه هستند و هیچ سفارش واقعی ثبت نشده است.</DemoNotice>

      {orders.length === 0 ? (
        <EmptyState title="هنوز سفارشی ندارید" />
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => {
            const product = getProduct(order.productId);
            const store = getStore(order.storeId);
            return (
              <li key={order.id} className="group relative flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-5 transition-colors hover:border-ink-600 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-xs text-ink-400">کد سفارش {order.code}</span>
                  </div>
                  <h2 className="text-base font-semibold text-ink-50">
                    <Link href={`/orders/${order.id}`} className="after:absolute after:inset-0 after:content-['']">{product?.name}</Link>
                  </h2>
                  <p className="flex flex-wrap items-center gap-3 text-xs text-ink-300">
                    <span>{store?.name}</span>
                    <span className="inline-flex items-center gap-1">
                      {order.fulfillment === 'pickup' ? <StoreIcon className="h-3 w-3" aria-hidden /> : <Bike className="h-3 w-3" aria-hidden />}
                      {order.fulfillment === 'pickup' ? 'تحویل حضوری' : 'ارسال'}
                    </span>
                    <span>{formatPersianDate(order.placedAt)}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-6 md:flex-col md:items-end">
                  <span className="text-sm font-bold text-ink-50 tabular-nums">{formatToman(order.total)}</span>
                  <ArrowLeft className="h-4 w-4 text-saffron-300 transition-transform group-hover:-translate-x-1" aria-hidden />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
