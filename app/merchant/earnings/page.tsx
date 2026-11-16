import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { StatCard, StatusPill } from '@/features/dashboard/DashboardWidgets';
import { DataTable, type Column } from '@/features/dashboard/DataTable';
import { settlements, type Settlement } from '@/data/merchant';
import { formatPersianDate, formatToman } from '@/lib/format';

export default function MerchantEarningsPage() {
  const gross = settlements.reduce((s, x) => s + x.gross, 0);
  const commission = settlements.reduce((s, x) => s + x.commission, 0);
  const net = settlements.reduce((s, x) => s + x.net, 0);

  const columns: Column<Settlement>[] = [
    { key: 'period', label: 'دوره', render: (s) => <span className="font-medium text-ink-50">{s.period}</span> },
    { key: 'gross', label: 'فروش ناخالص', render: (s) => <span className="tabular-nums">{formatToman(s.gross)}</span> },
    { key: 'commission', label: 'کارمزد', render: (s) => <span className="tabular-nums">{formatToman(s.commission)}</span> },
    { key: 'net', label: 'خالص دریافتی', render: (s) => <span className="tabular-nums">{formatToman(s.net)}</span> },
    {
      key: 'status',
      label: 'وضعیت',
      render: (s) => (s.status === 'paid' ? <StatusPill tone="success">پرداخت شده</StatusPill> : <StatusPill tone="warning">در انتظار</StatusPill>),
    },
    { key: 'paid', label: 'تاریخ واریز', render: (s) => (s.paidAt ? formatPersianDate(s.paidAt) : '—') },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="درآمد" description="خلاصه فروش، کارمزد و مبلغ خالص قابل دریافت شما." />
      <DemoNotice>اعداد درآمد نمایشی هستند و به حساب بانکی واقعی متصل نیستند.</DemoNotice>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="فروش ناخالص" value={formatToman(gross)} />
        <StatCard label="کارمزد پلتفرم" value={formatToman(commission)} />
        <StatCard label="خالص دریافتی" value={formatToman(net)} />
      </div>

      <DataTable columns={columns} rows={settlements} rowKey={(s) => s.id} />
    </div>
  );
}
