import type { Order } from '@/types';

const at = (time: string, dayOffset = 0) => {
  const d = new Date(`2026-11-16T${time}:00+03:30`);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString();
};

export const orders: Order[] = [
  {
    id: 'ord-1001',
    code: 'GZ-7421',
    productId: 'brioche-shokolat',
    storeId: 'nan-o-zaferan',
    quantity: 1,
    total: 110000,
    status: 'upcoming',
    fulfillment: 'pickup',
    placedAt: at('10:15'),
    collection: { startsAt: at('18:30'), endsAt: at('20:30') },
  },
  {
    id: 'ord-1002',
    code: 'GZ-6988',
    productId: 'cafe-latte-cake',
    storeId: 'kafe-patogh',
    quantity: 2,
    total: 170000,
    status: 'ready',
    fulfillment: 'pickup',
    placedAt: at('09:40', -1),
    collection: { startsAt: at('20:00'), endsAt: at('21:30') },
  },
  {
    id: 'ord-1003',
    code: 'GZ-6512',
    productId: 'saffron-rice-meal',
    storeId: 'restoran-karam',
    quantity: 1,
    total: 139000,
    status: 'completed',
    fulfillment: 'delivery',
    placedAt: at('18:05', -6),
    collection: { startsAt: at('21:00', -6), endsAt: at('22:30', -6) },
  },
  {
    id: 'ord-1004',
    code: 'GZ-6120',
    productId: 'burger-fries-night',
    storeId: 'burgerkhane-kuche',
    quantity: 1,
    total: 89000,
    status: 'cancelled',
    fulfillment: 'pickup',
    placedAt: at('21:20', -9),
    collection: { startsAt: at('22:00', -9), endsAt: at('23:30', -9) },
  },
];
