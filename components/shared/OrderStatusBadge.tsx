import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const orderStatusLabels: Record<OrderStatus, { label: string; className: string }> = {
  upcoming: { label: 'در انتظار جمع‌آوری', className: 'bg-saffron-400/15 text-saffron-200' },
  ready: { label: 'آماده تحویل', className: 'bg-sage-400/15 text-sage-300' },
  completed: { label: 'تحویل شده', className: 'bg-ink-700 text-ink-100' },
  cancelled: { label: 'لغو شده', className: 'bg-rose-500/15 text-rose-300' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = orderStatusLabels[status];
  return <span className={cn('rounded-md px-2.5 py-1 text-xs font-medium', s.className)}>{s.label}</span>;
}
