/*
 * Map and geocoding provider abstraction.
 *
 * This module defines the interface for map/geocoding providers and provides
 * a no-op default when no provider is configured. The implementation is
 * intentionally NOT coupled to any specific provider.
 *
 * To activate a provider:
 * 1. Set the provider-specific env vars (e.g. NEXT_PUBLIC_MAP_PROVIDER, and API keys as Edge Function secrets).
 * 2. Implement the provider adapter in this file or a separate module.
 * 3. The manual neighborhood selection remains fully functional regardless.
 *
 * Currently NO provider is configured. The manual selection path is the active path.
 */

export type ReverseGeocodeResult = {
  neighborhood: string;
  district: string | null;
  city: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
};

export type SearchResult = {
  label: string;
  neighborhood: string | null;
  district: string | null;
  city: string;
  latitude: number;
  longitude: number;
};

export type MapProvider = {
  name: string;
  isConfigured: boolean;
  reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null>;
  search(query: string): Promise<SearchResult[]>;
};

/*
 * No-op provider — used when no map/geocoding provider is configured.
 * All methods return null/empty. The manual neighborhood selection handles everything.
 */
const noopProvider: MapProvider = {
  name: 'none',
  isConfigured: false,
  async reverseGeocode() {
    return null;
  },
  async search() {
    return [];
  },
};

/*
 * Get the active map provider. Currently always returns the no-op provider
 * since no provider is configured. When a provider is added, check env vars
 * here and return the appropriate adapter.
 */
export function getMapProvider(): MapProvider {
  // No provider configured — manual selection is the active path.
  // To add a provider, check process.env.NEXT_PUBLIC_MAP_PROVIDER here
  // and return the corresponding adapter.
  return noopProvider;
}

/*
 * Fallback reverse-geocoding using the local neighborhood database.
 * Finds the nearest known neighborhood to the given coordinates.
 * This is NOT a real geocoding service — it's an approximate nearest-neighbor match.
 */
import { findNearestNeighborhood } from '@/config/location';

export function fallbackReverseGeocode(lat: number, lng: number): ReverseGeocodeResult | null {
  const nearest = findNearestNeighborhood(lat, lng);
  if (!nearest) return null;
  return {
    neighborhood: nearest.neighborhood,
    district: nearest.district,
    city: nearest.city,
    latitude: nearest.latitude,
    longitude: nearest.longitude,
    formattedAddress: `${nearest.neighborhood}${nearest.district ? `, ${nearest.district}` : ''}, ${nearest.city}`,
  };
}
