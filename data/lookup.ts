import { categories } from '@/data/categories';
import { orders } from '@/data/orders';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import type { Category, CategoryId, Order, Product, Store } from '@/types';

export function getStore(id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategory(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function productsForStore(storeId: string): Product[] {
  return products.filter((p) => p.storeId === storeId);
}

export function productsForCategory(categoryId: CategoryId): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function storesForCategory(categoryId: CategoryId): Store[] {
  return stores.filter((s) => s.categoryId === categoryId);
}

export function isLimited(product: Product): boolean {
  return product.remaining <= 3;
}
