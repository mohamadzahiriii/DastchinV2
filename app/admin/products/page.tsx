import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill, type Tone } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { productReviews } from '@/data/admin';

type Review = (typeof productReviews)[number];

const reviewTone: Record<string, Tone> = { pending: 'warning', approved: 'success' };
const reviewLabel: Record<string, string> = { pending: 'در انتظار', approved: 'تایید شده' };

const columns: Column<Review>[] = [
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

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="بازبینی محصولات" description="محصولات منتشرشده را از نظر ایمنی، قیمت و اطلاعات نگهداری بررسی کنید." />
      <DemoNotice>محصولات نمایش داده‌شده نمونه‌اند. هیچ محصول واقعی منتشر یا رد نمی‌شود.</DemoNotice>
      <DataTable columns={columns} rows={productReviews} rowKey={(r) => r.id} />
    </div>
  );
}
