export const merchantStore = {
  storeId: 'nan-o-zaferan',
  ownerName: 'مریم احمدی',
  status: 'active' as const,
};

export const merchantStats = [
  { label: 'فروش امروز', value: 1840000, kind: 'currency' as const, delta: 12 },
  { label: 'سفارش‌های فعال', value: 6, kind: 'number' as const, delta: 2 },
  { label: 'محصولات منتشرشده', value: 4, kind: 'number' as const, delta: 0 },
  { label: 'امتیاز فروشگاه', value: 4.8, kind: 'rating' as const, delta: 0.1 },
];

export const weeklySales = [
  { day: 'شنبه', amount: 1320000 },
  { day: 'یکشنبه', amount: 1540000 },
  { day: 'دوشنبه', amount: 1210000 },
  { day: 'سه‌شنبه', amount: 1690000 },
  { day: 'چهارشنبه', amount: 1480000 },
  { day: 'پنجشنبه', amount: 1950000 },
  { day: 'جمعه', amount: 1840000 },
];

export const settlements = [
  { id: 'set-301', period: 'هفته اول آبان', gross: 9860000, commission: 1479000, net: 8381000, status: 'paid' as const, paidAt: '2026-11-03' },
  { id: 'set-302', period: 'هفته دوم آبان', gross: 10420000, commission: 1563000, net: 8857000, status: 'paid' as const, paidAt: '2026-11-10' },
  { id: 'set-303', period: 'هفته سوم آبان', gross: 7910000, commission: 1186500, net: 6723500, status: 'pending' as const, paidAt: null },
];

export type Settlement = (typeof settlements)[number];

export const merchantSupportTickets = [
  { id: 'MT-220', subject: 'تغییر ساعت جمع‌آوری سفارش', status: 'open' as const, updatedAt: '2026-11-16' },
  { id: 'MT-217', subject: 'سوال درباره کارمزد هفتگی', status: 'resolved' as const, updatedAt: '2026-11-12' },
];
