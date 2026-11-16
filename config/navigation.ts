import type { LucideIcon } from 'lucide-react';
import {
  Compass,
  Heart,
  House,
  LayoutDashboard,
  Newspaper,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  User,
  Wallet,
  Package,
  Boxes,
  ChartColumn,
  Headset,
  BadgePercent,
  Truck,
  Users,
  ClipboardCheck,
  Landmark,
  RotateCcw,
  Tags,
  Grid2x2,
  CircleDollarSign,
  FileBadge,
  MapPin,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const customerNav: NavItem[] = [
  { href: '/', label: 'خانه', icon: House, exact: true },
  { href: '/explore', label: 'کاوش', icon: Compass },
  { href: '/categories', label: 'دسته‌بندی‌ها', icon: Grid2x2 },
  { href: '/stores', label: 'فروشگاه‌ها', icon: Store },
];

export const customerBottomNav: NavItem[] = [
  { href: '/', label: 'خانه', icon: House, exact: true },
  { href: '/explore', label: 'کاوش', icon: Compass },
  { href: '/stores', label: 'فروشگاه‌ها', icon: Store },
  { href: '/orders', label: 'سفارش‌ها', icon: ReceiptText },
  { href: '/profile', label: 'حساب من', icon: User },
];

export const customerUtilityNav: NavItem[] = [
  { href: '/favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  { href: '/profile', label: 'حساب کاربری', icon: User },
];

export const merchantNav: NavItem[] = [
  { href: '/merchant', label: 'نمای کلی', icon: LayoutDashboard, exact: true },
  { href: '/merchant/store', label: 'پروفایل فروشگاه', icon: Store },
  { href: '/merchant/products', label: 'محصولات', icon: Package },
  { href: '/merchant/inventory', label: 'موجودی', icon: Boxes },
  { href: '/merchant/orders', label: 'سفارش‌ها', icon: ReceiptText },
  { href: '/merchant/analytics', label: 'تحلیل فروش', icon: ChartColumn },
  { href: '/merchant/earnings', label: 'درآمد', icon: CircleDollarSign },
  { href: '/merchant/settlements', label: 'تسویه‌حساب‌ها', icon: Wallet },
  { href: '/merchant/settings', label: 'تنظیمات فروشگاه', icon: Settings },
  { href: '/merchant/support', label: 'پشتیبانی', icon: Headset },
];

export const adminNav: NavItem[] = [
  { href: '/admin', label: 'نمای کلی', icon: LayoutDashboard, exact: true },
  { href: '/admin/customers', label: 'مشتریان', icon: Users },
  { href: '/admin/merchants', label: 'فروشگاه‌ها', icon: Store, exact: true },
  { href: '/admin/merchants/approvals', label: 'تایید فروشگاه', icon: ClipboardCheck },
  { href: '/admin/products', label: 'بازبینی محصولات', icon: ShieldCheck },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Tags },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: ReceiptText },
  { href: '/admin/payments', label: 'پرداخت‌ها', icon: Wallet },
  { href: '/admin/refunds', label: 'بازپرداخت‌ها', icon: RotateCcw },
  { href: '/admin/commissions', label: 'کارمزد', icon: BadgePercent },
  { href: '/admin/delivery', label: 'ارسال', icon: Truck },
  { href: '/admin/coupons', label: 'کوپن‌ها', icon: FileBadge },
  { href: '/admin/complaints', label: 'شکایات و پشتیبانی', icon: Headset },
  { href: '/admin/locations', label: 'مکان و محله‌ها', icon: MapPin },
  { href: '/admin/analytics', label: 'تحلیل و گزارش', icon: Newspaper },
  { href: '/admin/settings', label: 'تنظیمات', icon: Settings },
];
