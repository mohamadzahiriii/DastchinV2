/*
 * Geographic distance utilities.
 * Uses the Haversine formula for great-circle distance between two points
 * on Earth (specified in decimal degrees). Returns distance in kilometers.
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export type DistanceLabel = {
  label: string;
  exactKm: number | null;
};

/*
 * Returns a human-readable distance label in Persian.
 * Only shows a numeric distance when coordinates are sufficiently accurate
 * (i.e. both points have real coordinates). Otherwise returns a general label.
 */
export function distanceLabel(
  userLat: number | null,
  userLng: number | null,
  storeLat: number | null,
  storeLng: number | null,
): DistanceLabel {
  if (
    userLat == null ||
    userLng == null ||
    storeLat == null ||
    storeLng == null
  ) {
    return { label: 'نامشخص', exactKm: null };
  }

  const km = haversineKm(userLat, userLng, storeLat, storeLng);

  if (km < 1) return { label: 'کمتر از ۱ کیلومتر', exactKm: km };
  if (km <= 3) return { label: `${formatKm(km)} کیلومتر`, exactKm: km };
  if (km <= 5) return { label: `${formatKm(km)} کیلومتر`, exactKm: km };
  return { label: `بیشتر از ۵ کیلومتر`, exactKm: km };
}

function formatKm(km: number): string {
  const rounded = Math.round(km);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(rounded).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

/*
 * Classify distance into a bucket for filtering.
 */
export type DistanceBucket = 'nearby' | 'available' | 'delivery-only' | 'out-of-range';

export function classifyDistance(
  km: number | null,
  config: { nearbyThresholdKm: number; pickupMaxDistanceKm: number; deliveryMaxDistanceKm: number },
): DistanceBucket {
  if (km == null) return 'out-of-range';
  if (km <= config.nearbyThresholdKm) return 'nearby';
  if (km <= config.pickupMaxDistanceKm) return 'available';
  if (km <= config.deliveryMaxDistanceKm) return 'delivery-only';
  return 'out-of-range';
}
