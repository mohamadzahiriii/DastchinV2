import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { StatusPill, type Tone } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { paymentsLog } from '@/data/admin';
import { formatToman } from '@/lib/format';

type Payment = (typeof paymentsLog)[number];

const statusTone: Record<string, Tone> = { successful: 'success', failed: 'danger' };
const statusLabel: Record<string, string> = { successful: 'موفق', failed: 'ناموفق' };

const columns: Column<Payment>[] = [
  { key: 'id', label: 'شناسه پرداخت', render: (p) => <span className="tabular-nums text-ink-300">{p.id}</span> },
  { key: 'order', label: 'سفارش', render: (p) => <span className="tabular-nums">{p.order}</span> },
  { key: 'amount', label: 'مبلغ', render: (p) => <span className="tabular-nums">{formatToman(p.amount)}</span> },
  { key: 'method', label: 'روش', render: (p) => p.method },
  { key: 'at', label: 'زمان', render: (p) => <span className="tabular-nums">{p.at}</span> },
  { key: 'status', label: 'وضعیت', render: (p) => <StatusPill tone={statusTone[p.status]}>{statusLabel[p.status]}</StatusPill> },
];

export default function AdminPaymentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="پرداخت‌ها" description="گزارش تراکنش‌های پرداخت و وضعیت هر یک." />
      <DemoNotice>هیچ پرداخت واقعی انجام نشده است. این فهرست فقط نمونه نمایشی است.</DemoNotice>
      <DataTable columns={columns} rows={paymentsLog} rowKey={(p) => p.id} />
    </div>
  );
}
