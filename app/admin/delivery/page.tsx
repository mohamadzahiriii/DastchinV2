import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { StatusPill, type Tone } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { deliveryRequests } from '@/data/admin';

type Delivery = (typeof deliveryRequests)[number];

const statusTone: Record<string, Tone> = { waiting: 'warning', on_way: 'info', delivered: 'success' };
const statusLabel: Record<string, string> = { waiting: 'در انتظار تخصیص', on_way: 'در مسیر', delivered: 'تحویل شده' };

const columns: Column<Delivery>[] = [
  { key: 'id', label: 'شناسه', render: (d) => <span className="tabular-nums text-ink-300">{d.id}</span> },
  { key: 'order', label: 'سفارش', render: (d) => <span className="tabular-nums">{d.order}</span> },
  { key: 'area', label: 'منطقه', render: (d) => d.area },
  { key: 'courier', label: 'پیک', render: (d) => d.courier },
  { key: 'status', label: 'وضعیت', render: (d) => <StatusPill tone={statusTone[d.status]}>{statusLabel[d.status]}</StatusPill> },
];

export default function AdminDeliveryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="مدیریت ارسال" description="درخواست‌های ارسال، مناطق پوشش و وضعیت پیک‌ها." />
      <DemoNotice>پیک‌ها و درخواست‌های ارسال نمونه‌اند.</DemoNotice>
      <DataTable columns={columns} rows={deliveryRequests} rowKey={(d) => d.id} />
    </div>
  );
}
