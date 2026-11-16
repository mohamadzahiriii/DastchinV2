import { products } from '@/data/products';
import { getStore } from '@/data/lookup';
import { stores } from '@/data/stores';
import { discountPercent } from '@/lib/format';
import { haversineKm } from '@/lib/geo';
import { findNeighborhoodBySlug, getNeighborhoodsByCity } from '@/config/location';
import type { CategoryId, Fulfillment, Product } from '@/types';

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'discount' | 'newest' | 'remaining' | 'distance';

export type DistanceFilter = 'all' | 'nearby' | 'available' | 'delivery-only' | 'out-of-range';

export type ExploreFilters = {
  query: string;
  category: CategoryId | 'all';
  fulfillment: Fulfillment | 'all';
  maxPrice: number;
  minDiscount: number;
  storeId: string | 'all';
  neighborhoodSlug: string | 'all';
  distance: DistanceFilter;
  inStock: boolean;
  sort: SortKey;
};

export const defaultFilters: ExploreFilters = {
  query: '',
  category: 'all',
  fulfillment: 'all',
  maxPrice: 0,
  minDiscount: 0,
  storeId: 'all',
  neighborhoodSlug: 'all',
  distance: 'all',
  inStock: false,
  sort: 'recommended',
};

export type LocationFilterContext = {
  latitude: number | null;
  longitude: number | null;
  config: { nearbyThresholdKm: number; pickupMaxDistanceKm: number; deliveryMaxDistanceKm: number };
};

export function getStoreDistance(
  product: Product,
  loc: LocationFilterContext,
): number | null {
  const store = getStore(product.storeId);
  if (!store || store.latitude == null || store.longitude == null) return null;
  if (loc.latitude == null || loc.longitude == null) return null;
  return haversineKm(loc.latitude, loc.longitude, store.latitude, store.longitude);
}

export function isProductAvailable(
  product: Product,
  loc: LocationFilterContext,
): { available: boolean; distance: number | null } {
  const store = getStore(product.storeId);
  if (!store) return { available: false, distance: null };
  const distance = getStoreDistance(product, loc);

  if (loc.latitude == null || loc.longitude == null) {
    return { available: true, distance: null };
  }
  if (distance == null) return { available: false, distance: null };

  const { nearbyThresholdKm, pickupMaxDistanceKm, deliveryMaxDistanceKm } = loc.config;

  if (distance <= nearbyThresholdKm) return { available: true, distance };
  if (distance <= pickupMaxDistanceKm) {
    if (store.pickupEnabled) return { available: true, distance };
    if (store.deliveryEnabled && distance <= store.deliveryMaxDistanceKm) return { available: true, distance };
    return { available: false, distance };
  }
  if (distance <= deliveryMaxDistanceKm) {
    if (store.deliveryEnabled && distance <= store.deliveryMaxDistanceKm) return { available: true, distance };
    return { available: false, distance };
  }
  return { available: false, distance };
}

export function filterProducts(
  filters: ExploreFilters,
  loc?: LocationFilterContext,
): { product: Product; distance: number | null; available: boolean }[] {
  const q = filters.query.trim().toLowerCase();
  const neighborhoods = getNeighborhoodsByCity('tehran');

  const matched = products.filter((product) => {
    if (filters.category !== 'all' && product.categoryId !== filters.category) return false;
    if (filters.storeId !== 'all' && product.storeId !== filters.storeId) return false;
    if (filters.fulfillment !== 'all' && !product.fulfillment.includes(filters.fulfillment)) return false;
    if (filters.maxPrice > 0 && product.price > filters.maxPrice) return false;
    if (filters.minDiscount > 0 && discountPercent(product.originalPrice, product.price) < filters.minDiscount) return false;
    if (filters.inStock && product.remaining <= 0) return false;
    if (q) {
      const store = getStore(product.storeId);
      const haystack = `${product.name} ${product.description} ${store?.name ?? ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    // Neighborhood filter
    if (filters.neighborhoodSlug !== 'all') {
      const store = getStore(product.storeId);
      if (!store || store.neighborhoodSlug !== filters.neighborhoodSlug) return false;
    }

    return true;
  });

  const withDistance = matched.map((product) => {
    const dist = loc ? getStoreDistance(product, loc) : null;
    const avail = loc ? isProductAvailable(product, loc) : { available: true, distance: dist };
    return { product, distance: avail.distance, available: avail.available };
  });

  // Distance filter
  let filtered = withDistance;
  if (filters.distance !== 'all' && loc) {
    if (filters.distance === 'nearby') {
      filtered = withDistance.filter((item) => item.distance != null && item.distance <= loc.config.nearbyThresholdKm);
    } else if (filters.distance === 'available') {
      filtered = withDistance.filter((item) => item.available && item.distance != null && item.distance <= loc.config.pickupMaxDistanceKm);
    } else if (filters.distance === 'delivery-only') {
      filtered = withDistance.filter((item) => item.available && item.distance != null && item.distance > loc.config.pickupMaxDistanceKm);
    } else if (filters.distance === 'out-of-range') {
      filtered = withDistance.filter((item) => !item.available);
    }
  }

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.product.price - b.product.price;
      case 'price-desc':
        return b.product.price - a.product.price;
      case 'discount':
        return discountPercent(b.product.originalPrice, b.product.price) - discountPercent(a.product.originalPrice, a.product.price);
      case 'newest':
        return b.product.createdAt.localeCompare(a.product.createdAt);
      case 'remaining':
        return a.product.remaining - b.product.remaining;
      case 'distance':
        return (a.distance ?? Infinity) - (b.distance ?? Infinity);
      default:
        return 0;
    }
  });
}
