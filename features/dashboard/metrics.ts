import { formatNumber, formatRating, formatToman } from '@/lib/format';

export type MetricKind = 'currency' | 'number' | 'rating';

export function formatMetric(value: number, kind: MetricKind): string {
  if (kind === 'currency') return formatToman(value);
  if (kind === 'rating') return formatRating(value);
  return formatNumber(value);
}
