/*
 * Location configuration and Tehran neighborhood data.
 * This is the client-side directory used for manual selection and reverse-geocoding fallback.
 * The authoritative directory lives in the `location_neighborhoods` database table and is
 * seeded in the database migration. This config mirrors the seed for offline/fallback use.
 */

export type Neighborhood = {
  id: string;
  city: string;
  citySlug: string;
  district: string | null;
  districtSlug: string | null;
  neighborhood: string;
  neighborhoodSlug: string;
  latitude: number;
  longitude: number;
};

export type LocationConfig = {
  nearbyThresholdKm: number;
  pickupMaxDistanceKm: number;
  deliveryMaxDistanceKm: number;
  defaultCity: string;
};

export const defaultLocationConfig: LocationConfig = {
  nearbyThresholdKm: 3,
  pickupMaxDistanceKm: 5,
  deliveryMaxDistanceKm: 10,
  defaultCity: 'تهران',
};

/*
 * Tehran neighborhoods with approximate center coordinates.
 * Coordinates are rough area centers — NOT precise addresses.
 * Used for manual selection and as a fallback reverse-geocoding dictionary
 * when no external geocoding provider is configured.
 */
export const tehranNeighborhoods: Neighborhood[] = [
  // مرکز تهران
  { id: 'tehran-centre', city: 'تهران', citySlug: 'tehran', district: 'مرکز', districtSlug: 'centre', neighborhood: 'امیریه', neighborhoodSlug: 'amiriyeh', latitude: 35.6872, longitude: 51.4231 },
  { id: 'tehran-bazar', city: 'تهران', citySlug: 'tehran', district: 'مرکز', districtSlug: 'centre', neighborhood: 'بازار', neighborhoodSlug: 'bazar', latitude: 35.6739, longitude: 51.4239 },
  { id: 'tehran-arg', city: 'تهران', citySlug: 'tehran', district: 'مرکز', districtSlug: 'centre', neighborhood: 'ارگ', neighborhoodSlug: 'arg', latitude: 35.6996, longitude: 51.4240 },
  { id: 'tehran-lalehzar', city: 'تهران', citySlug: 'tehran', district: 'مرکز', districtSlug: 'centre', neighborhood: 'لهرزداری', neighborhoodSlug: 'lalehzar', latitude: 35.7019, longitude: 51.4209 },

  // شمال تهران
  { id: 'tehran-niavaran', city: 'تهران', citySlug: 'tehran', district: 'شمال', districtSlug: 'north', neighborhood: 'نیاوران', neighborhoodSlug: 'niavaran', latitude: 35.8167, longitude: 51.4667 },
  { id: 'tehran-zafaraniyeh', city: 'تهران', citySlug: 'tehran', district: 'شمال', districtSlug: 'north', neighborhood: 'زعفرانیه', neighborhoodSlug: 'zafaraniyeh', latitude: 35.8100, longitude: 51.4100 },
  { id: 'tehran-tajrish', city: 'تهران', citySlug: 'tehran', district: 'شمال', districtSlug: 'north', neighborhood: 'تجریش', neighborhoodSlug: 'tajrish', latitude: 35.8045, longitude: 51.4334 },
  { id: 'tehran-qeytariyeh', city: 'تهران', citySlug: 'tehran', district: 'شمال', districtSlug: 'north', neighborhood: 'قیطریه', neighborhoodSlug: 'qeytariyeh', latitude: 35.7967, longitude: 51.4333 },
  { id: 'tehran-afrasiyab', city: 'تهران', citySlug: 'tehran', district: 'شمال', districtSlug: 'north', neighborhood: 'دربند', neighborhoodSlug: 'darband', latitude: 35.8300, longitude: 51.4200 },
  { id: 'tehran-gheytarieh-park', city: 'تهران', citySlug: 'tehran', district: 'شمال', districtSlug: 'north', neighborhood: 'قلهک', neighborhoodSlug: 'gholhak', latitude: 35.7900, longitude: 51.4500 },
  { id: 'tehran-shemiran', city: 'تهران', citySlug: 'tehran', district: 'شمال', districtSlug: 'north', neighborhood: 'شمیران', neighborhoodSlug: 'shemiran', latitude: 35.8000, longitude: 51.4500 },

  // شمال‌غرب
  { id: 'tehran-sadat-abad', city: 'تهران', citySlug: 'tehran', district: 'شمال‌غرب', districtSlug: 'northwest', neighborhood: 'سعادت‌آباد', neighborhoodSlug: 'sadat-abad', latitude: 35.7950, longitude: 51.3700 },
  { id: 'tehran-ponak', city: 'تهران', citySlug: 'tehran', district: 'شمال‌غرب', districtSlug: 'northwest', neighborhood: 'پونک', neighborhoodSlug: 'ponak', latitude: 35.7800, longitude: 51.3600 },
  { id: 'tehran-shahrak-gharb', city: 'تهران', citySlug: 'tehran', district: 'شمال‌غرب', districtSlug: 'northwest', neighborhood: 'شهرک غرب', neighborhoodSlug: 'shahrak-gharb', latitude: 35.7600, longitude: 51.3200 },
  { id: 'tehran-jordan', city: 'تهران', citySlug: 'tehran', district: 'شمال‌غرب', districtSlug: 'northwest', neighborhood: 'ژوردن', neighborhoodSlug: 'jordan', latitude: 35.7767, longitude: 51.4100 },

  // غرب تهران
  { id: 'tehran-aquds', city: 'تهران', citySlug: 'tehran', district: 'غرب', districtSlug: 'west', neighborhood: 'قدس', neighborhoodSlug: 'quds', latitude: 35.7200, longitude: 51.3200 },
  { id: 'tehran-setareh-khan', city: 'تهران', citySlug: 'tehran', district: 'غرب', districtSlug: 'west', neighborhood: 'ستارخان', neighborhoodSlug: 'satar-khan', latitude: 35.7100, longitude: 51.3700 },
  { id: 'tehran-yaftabad', city: 'تهران', citySlug: 'tehran', district: 'غرب', districtSlug: 'west', neighborhood: 'یافت‌آباد', neighborhoodSlug: 'yaftabad', latitude: 35.6700, longitude: 51.3200 },
  { id: 'tehran-ferdosi', city: 'تهران', citySlug: 'tehran', district: 'غرب', districtSlug: 'west', neighborhood: 'فردوسی', neighborhoodSlug: 'ferdosi', latitude: 35.7000, longitude: 51.3800 },

  // جنوب تهران
  { id: 'tehran-shush', city: 'تهران', citySlug: 'tehran', district: 'جنوب', districtSlug: 'south', neighborhood: 'شوش', neighborhoodSlug: 'shush', latitude: 35.6500, longitude: 51.4300 },
  { id: 'tehran-khayyam', city: 'تهران', citySlug: 'tehran', district: 'جنوب', districtSlug: 'south', neighborhood: 'خیام', neighborhoodSlug: 'khayyam', latitude: 35.6600, longitude: 51.4400 },
  { id: 'tehran-mokhberi', city: 'تهران', citySlug: 'tehran', district: 'جنوب', districtSlug: 'south', neighborhood: 'مخبرالدوله', neighborhoodSlug: 'mokhbari', latitude: 35.6700, longitude: 51.4200 },

  // شرق تهران
  { id: 'tehran-tehranpars', city: 'تهران', citySlug: 'tehran', district: 'شرق', districtSlug: 'east', neighborhood: 'تهرانپارس', neighborhoodSlug: 'tehranpars', latitude: 35.7300, longitude: 51.5200 },
  { id: 'tehran-narmak', city: 'تهران', citySlug: 'tehran', district: 'شرق', districtSlug: 'east', neighborhood: 'نارمک', neighborhoodSlug: 'narmak', latitude: 35.7300, longitude: 51.4900 },
  { id: 'tehran-majidiyeh', city: 'تهران', citySlug: 'tehran', district: 'شرق', districtSlug: 'east', neighborhood: 'مجیدیه', neighborhoodSlug: 'majidiyeh', latitude: 35.7400, longitude: 51.4900 },

  // مرکز-شمال
  { id: 'tehran-vanak', city: 'تهران', citySlug: 'tehran', district: 'مرکز-شمال', districtSlug: 'centre-north', neighborhood: 'ونک', neighborhoodSlug: 'vanak', latitude: 35.7567, longitude: 51.4100 },
  { id: 'tehran-valiasr', city: 'تهران', citySlug: 'tehran', district: 'مرکز-شمال', districtSlug: 'centre-north', neighborhood: 'ولیعصر', neighborhoodSlug: 'valiasr', latitude: 35.7400, longitude: 51.4100 },
  { id: 'tehran-mirdamad', city: 'تهران', citySlug: 'tehran', district: 'مرکز-شمال', districtSlug: 'centre-north', neighborhood: 'میرداماد', neighborhoodSlug: 'mirdamad', latitude: 35.7600, longitude: 51.4300 },
  { id: 'tehran-sheriatishomali', city: 'تهران', citySlug: 'tehran', district: 'مرکز-شمال', districtSlug: 'centre-north', neighborhood: 'شریعتی شمالی', neighborhoodSlug: 'shariati-shomali', latitude: 35.7800, longitude: 51.4500 },

  // مرکز-غرب
  { id: 'tehran-yousefabad', city: 'تهران', citySlug: 'tehran', district: 'مرکز-غرب', districtSlug: 'centre-west', neighborhood: 'یوسف‌آباد', neighborhoodSlug: 'yousefabad', latitude: 35.7300, longitude: 51.3900 },
  { id: 'tehran-keshavarz', city: 'تهران', citySlug: 'tehran', district: 'مرکز-غرب', districtSlug: 'centre-west', neighborhood: 'کشاورز', neighborhoodSlug: 'keshavarz', latitude: 35.7100, longitude: 51.3900 },
  { id: 'tehran-argarntin', city: 'تهران', citySlug: 'tehran', district: 'مرکز-غرب', districtSlug: 'centre-west', neighborhood: 'آرژانتین', neighborhoodSlug: 'argantin', latitude: 35.7400, longitude: 51.3700 },
  { id: 'tehran-fereshteh', city: 'تهران', citySlug: 'tehran', district: 'مرکز-غرب', districtSlug: 'centre-west', neighborhood: 'فرشته', neighborhoodSlug: 'fereshteh', latitude: 35.7800, longitude: 51.4000 },
  { id: 'tehran-ekbatan', city: 'تهران', citySlug: 'tehran', district: 'غرب', districtSlug: 'west', neighborhood: 'اکباتان', neighborhoodSlug: 'ekbatan', latitude: 35.7100, longitude: 51.3100 },
];

export function getNeighborhoodsByCity(citySlug = 'tehran'): Neighborhood[] {
  return tehranNeighborhoods.filter((n) => n.citySlug === citySlug);
}

export function getDistrictsByCity(citySlug = 'tehran'): { district: string; districtSlug: string }[] {
  const seen = new Set<string>();
  const result: { district: string; districtSlug: string }[] = [];
  for (const n of tehranNeighborhoods) {
    if (n.citySlug !== citySlug || !n.district || !n.districtSlug) continue;
    if (seen.has(n.districtSlug)) continue;
    seen.add(n.districtSlug);
    result.push({ district: n.district, districtSlug: n.districtSlug });
  }
  return result;
}

export function getNeighborhoodsByDistrict(citySlug: string, districtSlug: string): Neighborhood[] {
  return tehranNeighborhoods.filter(
    (n) => n.citySlug === citySlug && n.districtSlug === districtSlug,
  );
}

export function findNeighborhoodBySlug(neighborhoodSlug: string): Neighborhood | undefined {
  return tehranNeighborhoods.find((n) => n.neighborhoodSlug === neighborhoodSlug);
}

export function findNearestNeighborhood(lat: number, lng: number): Neighborhood | undefined {
  let nearest: Neighborhood | undefined;
  let minDist = Infinity;
  for (const n of tehranNeighborhoods) {
    const d = haversineKm(lat, lng, n.latitude, n.longitude);
    if (d < minDist) {
      minDist = d;
      nearest = n;
    }
  }
  return nearest;
}

import { haversineKm } from '@/lib/geo';
