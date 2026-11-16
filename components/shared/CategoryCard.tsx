import Link from 'next/link';
import {
  ArrowLeft,
  CakeSlice,
  Coffee,
  GlassWater,
  Gem,
  Sandwich,
  ShoppingBag,
  ShoppingBasket,
  Utensils,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { productsForCategory, storesForCategory } from '@/data/lookup';
import { formatNumber } from '@/lib/format';
import type { Category } from '@/types';

const icons: Record<string, LucideIcon> = {
  wheat: Wheat,
  coffee: Coffee,
  cake: CakeSlice,
  utensils: Utensils,
  sandwich: Sandwich,
  'shopping-basket': ShoppingBasket,
  'glass-water': GlassWater,
  'shopping-bag': ShoppingBag,
};

export function CategoryIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  const Icon = icons[iconKey] ?? Gem;
  return <Icon className={className} aria-hidden />;
}

export function CategoryCard({ category }: { category: Category }) {
  const storeCount = storesForCategory(category.id).length;
  const productCount = productsForCategory(category.id).length;

  return (
    <Link
      href={`/explore?category=${category.id}`}
      className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-5 transition-all duration-300 hover:border-saffron-400/40"
    >
      <img
        src={category.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" aria-hidden />
      <div className="relative flex flex-col gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-saffron-400/15 text-saffron-300 ring-1 ring-saffron-400/30">
          <CategoryIcon iconKey={category.iconKey} className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-semibold text-ink-50">{category.name}</h3>
        <p className="text-sm text-ink-200">{category.description}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-ink-300">
          <span>
            {formatNumber(storeCount)} فروشگاه · {formatNumber(productCount)} محصول
          </span>
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 text-saffron-300" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
