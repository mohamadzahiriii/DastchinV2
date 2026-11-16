'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Loader2,
  Check,
  AlertCircle,
  X,
  ChevronLeft,
  LocateFixed,
  ShieldCheck,
} from 'lucide-react';
import {
  getDistrictsByCity,
  getNeighborhoodsByDistrict,
  getNeighborhoodsByCity,
  findNearestNeighborhood,
  type Neighborhood,
} from '@/config/location';
import { useLocation, type UserLocation } from '@/lib/location/location-context';
import { cn } from '@/lib/utils';
import { toPersianDigits } from '@/lib/format';

type Step = 'intro' | 'geolocation-result' | 'manual' | 'confirm';

type Props = {
  open: boolean;
  onClose: () => void;
  onSelected?: () => void;
};

export function LocationSelector({ open, onClose, onSelected }: Props) {
  const { setLocation } = useLocation();
  const [step, setStep] = useState<Step>('intro');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [detectedNeighborhood, setDetectedNeighborhood] = useState<Neighborhood | null>(null);
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const districts = useMemo(() => getDistrictsByCity('tehran'), []);

  const allNeighborhoods = useMemo(() => getNeighborhoodsByCity('tehran'), []);

  const filteredNeighborhoods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allNeighborhoods;
    return allNeighborhoods.filter(
      (n) =>
        n.neighborhood.toLowerCase().includes(q) ||
        (n.district ?? '').toLowerCase().includes(q),
    );
  }, [allNeighborhoods, searchQuery]);

  const districtNeighborhoods = useMemo(() => {
    if (!selectedDistrict) return [];
    return getNeighborhoodsByDistrict('tehran', selectedDistrict);
  }, [selectedDistrict]);

  const requestGeolocation = useCallback(() => {
    setGeoLoading(true);
    setGeoError(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('مرورگر شما از تشخیص موقعیت پشتیبانی نمی‌کند. لطفاً به‌صورت دستی محله خود را انتخاب کنید.');
      setGeoLoading(false);
      setStep('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDetectedCoords({ lat: latitude, lng: longitude });
        const nearest = findNearestNeighborhood(latitude, longitude);
        if (nearest) {
          setDetectedNeighborhood(nearest);
          setStep('geolocation-result');
        } else {
          setGeoError('محله شما شناسایی نشد. لطفاً به‌صورت دستی انتخاب کنید.');
          setStep('manual');
        }
        setGeoLoading(false);
      },
      (error) => {
        let msg = 'خطا در دریافت موقعیت. ';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'دسترسی به موقعیت داده نشد. می‌توانید به‌صورت دستی محله خود را انتخاب کنید.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'موقعیت شما در دسترس نیست. لطفاً به‌صورت دستی انتخاب کنید.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'زمان دریافت موقعیت به پایان رسید. لطفاً دوباره تلاش کنید یا به‌صورت دستی انتخاب کنید.';
        }
        setGeoError(msg);
        setGeoLoading(false);
        setStep('manual');
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  function confirmLocation(nh: Neighborhood, method: 'geolocation' | 'manual', coords?: { lat: number; lng: number }) {
    const loc: UserLocation = {
      city: nh.city,
      citySlug: nh.citySlug,
      district: nh.district,
      districtSlug: nh.districtSlug,
      neighborhood: nh.neighborhood,
      neighborhoodSlug: nh.neighborhoodSlug,
      latitude: coords?.lat ?? nh.latitude,
      longitude: coords?.lng ?? nh.longitude,
      method,
      confirmedAt: new Date().toISOString(),
    };
    setLocation(loc);
    onSelected?.();
    handleClose();
  }

  function handleClose() {
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setStep('intro');
      setGeoError(null);
      setDetectedNeighborhood(null);
      setDetectedCoords(null);
      setSelectedNeighborhood(null);
      setSearchQuery('');
      setSelectedDistrict(null);
      setGeoLoading(false);
    }, 300);
  }

  function selectManual(nh: Neighborhood) {
    setSelectedNeighborhood(nh);
    setStep('confirm');
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true" aria-label="انتخاب محدوده">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={handleClose} aria-hidden />

      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-ink-700 bg-ink-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-800 px-6 py-4">
          <div className="flex items-center gap-2">
            {step !== 'intro' && (
              <button
                type="button"
                onClick={() => setStep(step === 'confirm' ? 'manual' : step === 'geolocation-result' ? 'intro' : step === 'manual' ? 'intro' : 'intro')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-ink-800 hover:text-ink-50"
                aria-label="بازگشت"
              >
                <ChevronLeft className="h-5 w-5 rotate-180" aria-hidden />
              </button>
            )}
            <h2 className="text-lg font-bold text-ink-50">انتخاب محدوده</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-50"
            aria-label="بستن"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 'intro' && (
            <IntroStep
              onUseGeo={requestGeolocation}
              onManual={() => setStep('manual')}
              geoLoading={geoLoading}
              geoError={geoError}
            />
          )}

          {step === 'geolocation-result' && detectedNeighborhood && (
            <GeoResultStep
              neighborhood={detectedNeighborhood}
              coords={detectedCoords}
              onConfirm={() => confirmLocation(detectedNeighborhood, 'geolocation', detectedCoords ?? undefined)}
              onRetry={requestGeolocation}
              onManual={() => setStep('manual')}
            />
          )}

          {step === 'manual' && (
            <ManualStep
              districts={districts}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              districtNeighborhoods={districtNeighborhoods}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              filteredNeighborhoods={filteredNeighborhoods}
              onSelect={selectManual}
            />
          )}

          {step === 'confirm' && selectedNeighborhood && (
            <ConfirmStep
              neighborhood={selectedNeighborhood}
              onConfirm={() => confirmLocation(selectedNeighborhood, 'manual')}
              onBack={() => setStep('manual')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function IntroStep({
  onUseGeo,
  onManual,
  geoLoading,
  geoError,
}: {
  onUseGeo: () => void;
  onManual: () => void;
  geoLoading: boolean;
  geoError: string | null;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-400/10">
          <MapPin className="h-8 w-8 text-saffron-300" aria-hidden />
        </div>
        <h3 className="text-xl font-bold text-ink-50">
          محدوده خرید خود را انتخاب کنید
        </h3>
        <p className="text-sm leading-[1.9] text-ink-300">
          برای نمایش فروشگاه‌ها و پیشنهادهای نزدیک شما، محدوده خود را انتخاب کنید. این اطلاعات فقط برای شخصی‌سازی نمایش محصولات استفاده می‌شود.
        </p>
      </div>

      {geoError && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-900/20 px-4 py-3 text-sm leading-relaxed text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{geoError}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onUseGeo}
          disabled={geoLoading}
          className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-saffron-400 font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-[0.98] disabled:opacity-60"
        >
          {geoLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <LocateFixed className="h-5 w-5" aria-hidden />
          )}
          {geoLoading ? 'در حال دریافت موقعیت...' : 'استفاده از موقعیت فعلی من'}
        </button>

        <button
          type="button"
          onClick={onManual}
          className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-ink-700 font-medium text-ink-100 transition-all hover:border-ink-500 hover:bg-ink-800 active:scale-[0.98]"
        >
          <MapPin className="h-5 w-5 text-ink-300" aria-hidden />
          انتخاب دستی محله
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-ink-800/50 px-4 py-3 text-xs leading-relaxed text-ink-400">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden />
        <p>
          موقعیت شما فقط محله تقریبی را برای نمایش فروشگاه‌های نزدیک تعیین می‌کند. مختصات دقیق شما هرگز برای فروشگاه‌ها ارسال نمی‌شود و در هر زمان قابل حذف است.
        </p>
      </div>
    </div>
  );
}

function GeoResultStep({
  neighborhood,
  coords,
  onConfirm,
  onRetry,
  onManual,
}: {
  neighborhood: Neighborhood;
  coords: { lat: number; lng: number } | null;
  onConfirm: () => void;
  onRetry: () => void;
  onManual: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-400/10">
          <Navigation className="h-8 w-8 text-teal-400" aria-hidden />
        </div>
        <h3 className="text-xl font-bold text-ink-50">محدوده شما شناسایی شد</h3>
        <p className="text-sm leading-relaxed text-ink-300">
          بر اساس موقعیت شما، محله زیر شناسایی شده است. آیا تایید می‌کنید؟
        </p>
      </div>

      <div className="rounded-2xl border border-ink-700 bg-ink-950 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-saffron-300" aria-hidden />
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-ink-50">{neighborhood.neighborhood}</span>
            <span className="text-sm text-ink-400">
              {neighborhood.district ? `${neighborhood.district}، ` : ''}{neighborhood.city}
            </span>
            {coords && (
              <span className="mt-1 text-[11px] text-ink-500" dir="ltr">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-saffron-400 font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-[0.98]"
        >
          <Check className="h-5 w-5" aria-hidden />
          تایید و ادامه
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-ink-700 text-sm font-medium text-ink-200 transition-colors hover:bg-ink-800"
          >
            <LocateFixed className="h-4 w-4" aria-hidden />
            تلاش مجدد
          </button>
          <button
            type="button"
            onClick={onManual}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-ink-700 text-sm font-medium text-ink-200 transition-colors hover:bg-ink-800"
          >
            انتخاب دستی
          </button>
        </div>
      </div>
    </div>
  );
}

function ManualStep({
  districts,
  selectedDistrict,
  onSelectDistrict,
  districtNeighborhoods,
  searchQuery,
  onSearch,
  filteredNeighborhoods,
  onSelect,
}: {
  districts: { district: string; districtSlug: string }[];
  selectedDistrict: string | null;
  onSelectDistrict: (slug: string | null) => void;
  districtNeighborhoods: Neighborhood[];
  searchQuery: string;
  onSearch: (value: string) => void;
  filteredNeighborhoods: Neighborhood[];
  onSelect: (nh: Neighborhood) => void;
}) {
  const showSearchResults = searchQuery.trim().length > 0;
  const showDistrictNeighborhoods = !showSearchResults && selectedDistrict;
  const showDistricts = !showSearchResults && !selectedDistrict;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-ink-50">انتخاب دستی محله</h3>
        <p className="text-sm text-ink-300">محله خود را جستجو کنید یا بر اساس منطقه انتخاب کنید.</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-950 px-4 py-1 transition-colors focus-within:border-saffron-400/60">
        <Search className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="جستجوی محله..."
          aria-label="جستجوی محله"
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearch('')}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-400 hover:text-ink-50"
            aria-label="پاک کردن"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {/* Search results */}
      {showSearchResults && (
        <div className="flex flex-col gap-2">
          {filteredNeighborhoods.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-400">محله‌ای با این نام پیدا نشد.</p>
          ) : (
            filteredNeighborhoods.map((nh) => (
              <NeighborhoodRow key={nh.id} nh={nh} onClick={() => onSelect(nh)} />
            ))
          )}
        </div>
      )}

      {/* District neighborhoods */}
      {showDistrictNeighborhoods && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onSelectDistrict(null)}
            className="flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-saffron-300"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden />
            بازگشت به مناطق
          </button>
          <div className="mt-2 flex flex-col gap-2">
            {districtNeighborhoods.map((nh) => (
              <NeighborhoodRow key={nh.id} nh={nh} onClick={() => onSelect(nh)} />
            ))}
          </div>
        </div>
      )}

      {/* Districts */}
      {showDistricts && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-ink-400">منطقه تهران</span>
          <div className="grid grid-cols-2 gap-2">
            {districts.map((d) => (
              <button
                key={d.districtSlug}
                type="button"
                onClick={() => onSelectDistrict(d.districtSlug)}
                className="flex items-center justify-between rounded-xl border border-ink-700 bg-ink-950 px-4 py-3 text-sm font-medium text-ink-100 transition-all hover:border-saffron-400/40 hover:bg-ink-800 active:scale-[0.98]"
              >
                {d.district}
                <ChevronLeft className="h-4 w-4 text-ink-500" aria-hidden />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NeighborhoodRow({ nh, onClick }: { nh: Neighborhood; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-950 px-4 py-3 text-start transition-all hover:border-saffron-400/40 hover:bg-ink-800 active:scale-[0.98]"
    >
      <MapPin className="h-4 w-4 shrink-0 text-saffron-300" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-ink-50">{nh.neighborhood}</span>
        {nh.district && <span className="truncate text-xs text-ink-400">{nh.district}</span>}
      </div>
      <ChevronLeft className="h-4 w-4 shrink-0 text-ink-500" aria-hidden />
    </button>
  );
}

function ConfirmStep({
  neighborhood,
  onConfirm,
  onBack,
}: {
  neighborhood: Neighborhood;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-400/10">
          <Check className="h-8 w-8 text-saffron-300" aria-hidden />
        </div>
        <h3 className="text-xl font-bold text-ink-50">تایید محدوده انتخابی</h3>
        <p className="text-sm leading-relaxed text-ink-300">
          محدوده زیر برای نمایش فروشگاه‌ها و پیشنهادهای نزدیک شما استفاده خواهد شد.
        </p>
      </div>

      <div className="rounded-2xl border border-ink-700 bg-ink-950 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-saffron-300" aria-hidden />
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-ink-50">{neighborhood.neighborhood}</span>
            <span className="text-sm text-ink-400">
              {neighborhood.district ? `${neighborhood.district}، ` : ''}{neighborhood.city}
            </span>
            <span className="mt-1 text-[11px] text-ink-500" dir="ltr">
              {toPersianDigits(neighborhood.latitude.toFixed(4))}، {toPersianDigits(neighborhood.longitude.toFixed(4))}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-saffron-400 font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-[0.98]"
        >
          <Check className="h-5 w-5" aria-hidden />
          تایید و ادامه
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 items-center justify-center rounded-xl border border-ink-700 text-sm font-medium text-ink-200 transition-colors hover:bg-ink-800"
        >
          تغییر انتخاب
        </button>
      </div>
    </div>
  );
}
