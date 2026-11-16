import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Bike, Clock, Store as StoreIcon } from 'lucide-react';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { DemoNotice } from '@/components/shared/PageHeader';
import { getOrder, getProduct, getStore } from '@/data/lookup';
import { formatCollectionWindow, formatPersianDate, formatToman, formatNumber } from '@/lib/format';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  const product = order ? getProduct(order.productId) : undefined;
  const store = order ? getStore(order.storeId) : undefined;
  if (!order || !product || !store) notFound();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 md:px-8">
      <Link href="/orders" className="inline-flex w-fit items-center gap-2 text-sm text-ink-300 transition-colors hover:text-saffron-300">
        <ArrowRight className="h-4 w-4" aria-hidden /> بازگشت به سفارش‌ها
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <span className="text-xs text-ink-400">کد سفارش {order.code}</span>
        </div>
        <h1 className="text-2xl font-bold text-ink-50 md:text-3xl">{product.name}</h1>
        <p className="text-sm text-ink-300">ثبت‌شده در {formatPersianDate(order.placedAt)} از {store.name}</p>
      </header>

      <DemoNotice>این سفارش نمونه است. وضعیت و مبلغ آن به سیستم پرداخت یا فروشگاه واقعی متصل نیست.</DemoNotice>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-6">
          <h2 className="text-sm font-semibold text-ink-50">جزئیات تحویل</h2>
          <div className="flex items-start gap-3 text-sm text-ink-300">
            {order.fulfillment === 'pickup' ? <StoreIcon className="mt-0.5 h-4 w-4 text-saffron-300" aria-hidden /> : <Bike className="mt-0.5 h-4 w-4 text-saffron-300" aria-hidden />}
            <span>{order.fulfillment === 'pickup' ? 'تحویل حضوری از فروشگاه' : 'ارسال به آدرس ذخیره‌شده'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-ink-300">
            <Clock className="mt-0.5 h-4 w-4 text-saffron-300" aria-hidden />
            <span>{formatCollectionWindow(order.collection.startsAt, order.collection.endsAt)}</span>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-6">
          <h2 className="text-sm font-semibold text-ink-50">خلاصه پرداخت</h2>
          <div className="flex justify-between text-sm text-ink-300">
            <span>تعداد</span>
            <span className="tabular-nums">{formatNumber(order.quantity)} بسته</span>
          </div>
          <div className="flex justify-between border-t border-ink-800 pt-4 text-base font-bold text-ink-50">
            <span>مبلغ کل</span>
            <span className="tabular-nums">{formatToman(order.total)}</span>
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-ink-800 bg-ink-900/60 p-6">
        <h2 className="text-sm font-semibold text-ink-50">نگهداری و آلرژن</h2>
        <p className="text-sm leading-relaxed text-ink-300">
          {product.storageNote ?? 'فروشگاه هنوز اطلاعات نگهداری این محصول را ارائه نکرده است.'}
        </p>
        <Link href={`/product/${product.id}`} className="w-fit text-sm font-medium text-saffron-300 hover:underline">مشاهده صفحه محصول</Link>
      </section>
    </div>
  );
}
