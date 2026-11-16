'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { defaultLocationConfig, findNeighborhoodBySlug, type LocationConfig, type Neighborhood } from '@/config/location';
import { haversineKm, classifyDistance, type DistanceBucket } from '@/lib/geo';
import { stores } from '@/data/stores';
import { products } from '@/data/products';
import type { Product, Store } from '@/types';

export type UserLocation = {
  city: string;
  citySlug: string;
  district: string | null;
  districtSlug: string | null;
  neighborhood: string;
  neighborhoodSlug: string;
  latitude: number;
  longitude: number;
  method: 'geolocation' | 'manual';
  confirmedAt: string;
};

type LocationContextValue = {
  location: UserLocation | null;
  loading: boolean;
  needsPrompt: boolean;
  config: LocationConfig;
  setLocation: (loc: UserLocation) => void;
  clearLocation: () => void;
  dismissPrompt: () => void;
  distanceToStore: (store: Store) => number | null;
  distanceLabelForStore: (store: Store) => string;
  storeAvailability: (store: Store) => { bucket: DistanceBucket; distance: number | null; available: boolean; reason: string };
  nearbyStores: () => Store[];
  nearbyProducts: () => Product[];
  areaDiscountProducts: () => Product[];
  todayPickupProducts: () => Product[];
  outOfRangeStores: () => Store[];
};

const STORAGE_KEY = 'ganjineh.user-location';

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPrompt, setNeedsPrompt] = useState(false);
  const [config] = useState<LocationConfig>(defaultLocationConfig);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserLocation;
        if (parsed.neighborhoodSlug && parsed.latitude && parsed.longitude) {
          setLocationState(parsed);
        }
      } else {
        setNeedsPrompt(true);
      }
    } catch {
      setNeedsPrompt(true);
    }
    setLoading(false);
  }, []);

  const setLocation = useCallback((loc: UserLocation) => {
    setLocationState(loc);
    setNeedsPrompt(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      // localStorage may be unavailable in private browsing
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    setNeedsPrompt(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    setNeedsPrompt(false);
  }, []);

  const distanceToStore = useCallback(
    (store: Store): number | null => {
      if (!location) return null;
      if (store.latitude == null || store.longitude == null) return null;
      return haversineKm(location.latitude, location.longitude, store.latitude, store.longitude);
    },
    [location],
  );

  const distanceLabelForStore = useCallback(
    (store: Store): string => {
      if (!location) return 'نامشخص';
      const km = distanceToStore(store);
      if (km == null) return 'نامشخص';
      if (km < 1) return 'کمتر از ۱ کیلومتر';
      if (km <= 3) return `${formatKm(km)} کیلومتر`;
      if (km <= 5) return `${formatKm(km)} کیلومتر`;
      return 'بیشتر از ۵ کیلومتر';
    },
    [location, distanceToStore],
  );

  const storeAvailability = useCallback(
    (store: Store) => {
      if (!location) {
        return { bucket: 'out-of-range' as DistanceBucket, distance: null, available: true, reason: 'no-location' };
      }
      const distance = distanceToStore(store);
      const bucket = classifyDistance(distance, config);

      // A store is "available" if:
      // - nearby (within nearby threshold) → always available
      // - available range → available if pickup enabled
      // - delivery-only range → available only if delivery enabled AND within store's delivery max distance
      // - out of range → not available
      let available = false;
      let reason = '';

      if (bucket === 'nearby') {
        available = true;
        reason = 'nearby';
      } else if (bucket === 'available') {
        if (store.pickupEnabled) {
          available = true;
          reason = 'pickup-available';
        } else if (store.deliveryEnabled && distance != null && distance <= store.deliveryMaxDistanceKm) {
          available = true;
          reason = 'delivery-available';
        } else {
          available = false;
          reason = 'no-fulfillment-in-range';
        }
      } else if (bucket === 'delivery-only') {
        if (store.deliveryEnabled && distance != null && distance <= store.deliveryMaxDistanceKm) {
          available = true;
          reason = 'delivery-only';
        } else {
          available = false;
          reason = 'delivery-out-of-range';
        }
      } else {
        available = false;
        reason = 'out-of-range';
      }

      return { bucket, distance, available, reason };
    },
    [location, distanceToStore, config],
  );

  const nearbyStores = useCallback(() => {
    if (!location) return stores.filter((s) => s.pickupEnabled).slice(0, 4);
    return stores
      .map((s) => ({ store: s, ...storeAvailability(s) }))
      .filter((item) => item.available)
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
      .map((item) => item.store);
  }, [location, storeAvailability]);

  const nearbyProducts = useCallback(() => {
    const available = nearbyStores();
    const availableStoreIds = new Set(available.map((s) => s.id));
    return products.filter((p) => availableStoreIds.has(p.storeId));
  }, [nearbyStores]);

  const areaDiscountProducts = useCallback(() => {
    return [...nearbyProducts()].sort((a, b) => {
      const discA = 1 - a.price / a.originalPrice;
      const discB = 1 - b.price / b.originalPrice;
      return discB - discA;
    });
  }, [nearbyProducts]);

  const todayPickupProducts = useCallback(() => {
    return nearbyProducts().filter((p) => p.fulfillment.includes('pickup'));
  }, [nearbyProducts]);

  const outOfRangeStores = useCallback(() => {
    if (!location) return [];
    return stores
      .map((s) => ({ store: s, ...storeAvailability(s) }))
      .filter((item) => !item.available)
      .map((item) => item.store);
  }, [location, storeAvailability]);

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      loading,
      needsPrompt,
      config,
      setLocation,
      clearLocation,
      dismissPrompt,
      distanceToStore,
      distanceLabelForStore,
      storeAvailability,
      nearbyStores,
      nearbyProducts,
      areaDiscountProducts,
      todayPickupProducts,
      outOfRangeStores,
    }),
    [location, loading, needsPrompt, config, setLocation, clearLocation, dismissPrompt, distanceToStore, distanceLabelForStore, storeAvailability, nearbyStores, nearbyProducts, areaDiscountProducts, todayPickupProducts, outOfRangeStores],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}

function formatKm(km: number): string {
  const rounded = Math.round(km);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(rounded).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}
