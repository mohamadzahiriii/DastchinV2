import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { StatusPill, type Tone } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { refundRequests } from '@/data/admin';
import { formatToman } from '@/lib/format';

type Refund = (typeof refundRequests)[number];

const statusTone: Record<string, Tone> = { pending: 'warning', approved: 'success' };
const statusLabel: Record<string, string> = { pending: 'در انتظار', approved: 'تایید شده' };

const columns: Column<Refund>[] = [
  { key: 'id', label: 'شناسه', render: (r) => <span className="tabular-nums text-ink-300">{r.id}</span> },
  { key: 'order', label: 'سفارش', render: (r) => <span className="tabular-nums">{r.order}</span> },
  { key: 'customer', label: 'مشتری', render: (r) => r.customer },
  { key: 'amount', label: 'مبلغ', render: (r) => <span className="tabular-nums">{formatToman(r.amount)}</span> },
  { key: 'reason', label: 'دلیل', render: (r) => r.reason },
  { key: 'status', label: 'وضعیت', render: (r) => <StatusPill tone={statusTone[r.status]}>{statusLabel[r.status]}</StatusPill> },
  {
    key: 'actions',
    label: 'اقدام',
    render: (r) =>
      r.status === 'pending' ? (
        <div className="flex gap-2">
          <DemoActionButton label="تایید" message="تایید بازپرداخت در نسخه نمایشی ثبت شد." variant="primary" />
          <DemoActionButton label="رد" message="رد بازپرداخت در نسخه نمایشی ثبت شد." variant="danger" />
        </div>
      ) : (
        <span className="text-xs text-ink-400">پردازش شده</span>
      ),
  },
];

export default function AdminRefundsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="بازپرداخت‌ها" description="درخواست‌های بازپرداخت مشتریان و تصمیم‌گیری درباره آن‌ها." />
      <DemoNotice>هیچ بازپرداخت واقعی انجام نمی‌شود. این بخش فقط نمایشی است.</DemoNotice>
      <DataTable columns={columns} rows={refundRequests} rowKey={(r) => r.id} />
    </div>
  );
}
