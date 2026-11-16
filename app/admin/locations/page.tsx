'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2, MapPin, Plus, Trash2, ToggleRight, Save, AlertCircle } from 'lucide-react';
import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { inputClass, labelClass } from '@/features/dashboard/form-styles';
import { getTypedSupabaseClient } from '@/lib/supabase/typed-client';
import { tehranNeighborhoods, defaultLocationConfig } from '@/config/location';
import { toPersianDigits, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type LocationConfigRow = Database['public']['Tables']['location_config']['Row'];
type NeighborhoodRow = Database['public']['Tables']['location_neighborhoods']['Row'];

export default function AdminLocationsPage() {
  const supabase = getTypedSupabaseClient();
  const [config, setConfig] = useState({
    nearbyThresholdKm: defaultLocationConfig.nearbyThresholdKm,
    pickupMaxDistanceKm: defaultLocationConfig.pickupMaxDistanceKm,
    deliveryMaxDistanceKm: defaultLocationConfig.deliveryMaxDistanceKm,
    defaultCity: defaultLocationConfig.defaultCity,
  });
  const [configLoading, setConfigLoading] = useState(true);
  const [configSaving, setConfigSaving] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodRow[]>([]);
  const [neighborhoodsLoading, setNeighborhoodsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNh, setNewNh] = useState({
    city: 'تهران',
    citySlug: 'tehran',
    district: '',
    districtSlug: '',
    neighborhood: '',
    neighborhoodSlug: '',
    latitude: '',
    longitude: '',
  });

  const loadConfig = useCallback(async () => {
    setConfigLoading(true);
    const { data, error } = await supabase.from('location_config').select('*').eq('id', 1).maybeSingle();
    if (!error && data) {
      const row = data as LocationConfigRow;
      setConfig({
        nearbyThresholdKm: Number(row.nearby_threshold_km),
        pickupMaxDistanceKm: Number(row.pickup_max_distance_km),
        deliveryMaxDistanceKm: Number(row.delivery_max_distance_km),
        defaultCity: row.default_city,
      });
    }
    setConfigLoading(false);
  }, [supabase]);

  const loadNeighborhoods = useCallback(async () => {
    setNeighborhoodsLoading(true);
    const { data, error } = await supabase
      .from('location_neighborhoods')
      .select('*')
      .order('city_slug')
      .order('display_order')
      .order('neighborhood');
    if (!error && data) {
      setNeighborhoods(data as NeighborhoodRow[]);
    }
    setNeighborhoodsLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadConfig();
    loadNeighborhoods();
  }, [loadConfig, loadNeighborhoods]);

  async function handleSaveConfig() {
    setConfigSaving(true);
    const { error } = await supabase
      .from('location_config')
      .update({
        nearby_threshold_km: config.nearbyThresholdKm,
        pickup_max_distance_km: config.pickupMaxDistanceKm,
        delivery_max_distance_km: config.deliveryMaxDistanceKm,
        default_city: config.defaultCity,
      })
      .eq('id', 1);

    if (error) {
      toast.error('ذخیره تنظیمات ناموفق بود');
    } else {
      toast.success('تنظیمات ذخیره شد');
    }
    setConfigSaving(false);
  }

  async function handleToggleNeighborhood(id: string, currentActive: boolean) {
    const { error } = await supabase
      .from('location_neighborhoods')
      .update({ is_active: !currentActive })
      .eq('id', id);

    if (error) {
      toast.error('تغییر وضعیت ناموفق بود');
    } else {
      toast.success(!currentActive ? 'محله فعال شد' : 'محله غیرفعال شد');
      loadNeighborhoods();
    }
  }

  async function handleDeleteNeighborhood(id: string) {
    const { error } = await supabase.from('location_neighborhoods').delete().eq('id', id);
    if (error) {
      toast.error('حذف ناموفق بود');
    } else {
      toast.success('محله حذف شد');
      loadNeighborhoods();
    }
  }

  async function handleAddNeighborhood() {
    if (!newNh.neighborhood || !newNh.neighborhoodSlug || !newNh.citySlug) {
      toast.error('نام محله و نامک الزامی است');
      return;
    }

    const { error } = await supabase.from('location_neighborhoods').insert({
      city: newNh.city,
      city_slug: newNh.citySlug,
      district: newNh.district || null,
      district_slug: newNh.districtSlug || null,
      neighborhood: newNh.neighborhood,
      neighborhood_slug: newNh.neighborhoodSlug,
      latitude: newNh.latitude ? parseFloat(newNh.latitude) : null,
      longitude: newNh.longitude ? parseFloat(newNh.longitude) : null,
      is_active: true,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('این محله قبلاً اضافه شده است');
      } else {
        toast.error('افزودن محله ناموفق بود');
      }
      return;
    }

    toast.success('محله اضافه شد');
    setNewNh({
      city: 'تهران', citySlug: 'tehran', district: '', districtSlug: '',
      neighborhood: '', neighborhoodSlug: '', latitude: '', longitude: '',
    });
    setShowAddForm(false);
    loadNeighborhoods();
  }

  async function handleSeedTehran() {
    toast.info('در حال افزودن محله‌های تهران...');
    const rows = tehranNeighborhoods.map((n, i) => ({
      city: n.city,
      city_slug: n.citySlug,
      district: n.district,
      district_slug: n.districtSlug,
      neighborhood: n.neighborhood,
      neighborhood_slug: n.neighborhoodSlug,
      latitude: n.latitude,
      longitude: n.longitude,
      is_active: true,
      display_order: i,
    }));

    const { error } = await supabase
      .from('location_neighborhoods')
      .upsert(rows, { onConflict: 'city_slug,neighborhood_slug' });

    if (error) {
      toast.error('افزودن محله‌ها ناموفق بود');
    } else {
      toast.success(`${formatNumber(rows.length)} محله تهران اضافه/به‌روز شد`);
      loadNeighborhoods();
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="مکان و محله‌ها"
        description="مدیریت شهرها، مناطق، محله‌ها و قوانین فاصله برای کشف فروشگاه‌های نزدیک."
      />

      {/* Distance Config */}
      <section className="flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-6">
        <h2 className="text-lg font-bold text-ink-50">قوانین فاصله و در دسترس بودن</h2>
        <p className="text-sm text-ink-400">
          این مقادیر تعیین می‌کنند کدام فروشگاه‌ها برای مشتریان در محدوده‌های مختلف قابل دسترس نمایش داده شوند.
        </p>

        {configLoading ? (
          <div className="flex items-center gap-2 text-sm text-ink-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            در حال بارگذاری...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              حداکثر فاصله «نزدیک» (کیلومتر)
              <input
                type="number"
                step="0.5"
                min="0"
                value={config.nearbyThresholdKm}
                onChange={(e) => setConfig((prev) => ({ ...prev, nearbyThresholdKm: parseFloat(e.target.value) || 0 }))}
                className={inputClass}
              />
              <span className="text-xs text-ink-500">فروشگاه‌های داخل این شعاع به‌عنوان «نزدیک» نمایش داده می‌شوند.</span>
            </label>

            <label className={labelClass}>
              حداکثر فاصله کشف با تحویل حضوری (کیلومتر)
              <input
                type="number"
                step="0.5"
                min="0"
                value={config.pickupMaxDistanceKm}
                onChange={(e) => setConfig((prev) => ({ ...prev, pickupMaxDistanceKm: parseFloat(e.target.value) || 0 }))}
                className={inputClass}
              />
              <span className="text-xs text-ink-500">فروشگاه‌های داخل این شعاع در صورت فعال بودن تحویل حضوری در دسترس هستند.</span>
            </label>

            <label className={labelClass}>
              حداکثر فاصله ارسال (کیلومتر)
              <input
                type="number"
                step="0.5"
                min="0"
                value={config.deliveryMaxDistanceKm}
                onChange={(e) => setConfig((prev) => ({ ...prev, deliveryMaxDistanceKm: parseFloat(e.target.value) || 0 }))}
                className={inputClass}
              />
              <span className="text-xs text-ink-500">فروشگاه‌های دورتر فقط در صورت پشتیبانی از ارسال تا این فاصله نمایش داده می‌شوند.</span>
            </label>

            <label className={labelClass}>
              شهر پیش‌فرض
              <input
                type="text"
                value={config.defaultCity}
                onChange={(e) => setConfig((prev) => ({ ...prev, defaultCity: e.target.value }))}
                className={inputClass}
              />
              <span className="text-xs text-ink-500">شهری که به‌صورت پیش‌فرض برای کاربران جدید نمایش داده می‌شود.</span>
            </label>

            <div className="md:col-span-2 flex justify-end border-t border-ink-800 pt-4">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={configSaving}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-saffron-400 px-5 text-sm font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95 disabled:opacity-60"
              >
                {configSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Neighborhoods Management */}
      <section className="flex flex-col gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-ink-50">محله‌ها</h2>
            <p className="text-sm text-ink-400">مدیریت محله‌های قابل انتخاب توسط کاربران.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSeedTehran}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-ink-600 px-4 text-xs font-medium text-ink-100 transition-colors hover:bg-ink-800"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              افزودن محله‌های تهران
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-saffron-400 px-4 text-xs font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              محله جدید
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="grid gap-3 rounded-xl border border-ink-700 bg-ink-950 p-4 md:grid-cols-2">
            <label className={labelClass}>
              نام شهر
              <input value={newNh.city} onChange={(e) => setNewNh((p) => ({ ...p, city: e.target.value }))} className={inputClass} />
            </label>
            <label className={labelClass}>
              نامک شهر (انگلیسی)
              <input value={newNh.citySlug} onChange={(e) => setNewNh((p) => ({ ...p, citySlug: e.target.value }))} className={inputClass} dir="ltr" />
            </label>
            <label className={labelClass}>
              منطقه (اختیاری)
              <input value={newNh.district} onChange={(e) => setNewNh((p) => ({ ...p, district: e.target.value }))} className={inputClass} />
            </label>
            <label className={labelClass}>
              نامک منطقه (اختیاری)
              <input value={newNh.districtSlug} onChange={(e) => setNewNh((p) => ({ ...p, districtSlug: e.target.value }))} className={inputClass} dir="ltr" />
            </label>
            <label className={labelClass}>
              نام محله
              <input value={newNh.neighborhood} onChange={(e) => setNewNh((p) => ({ ...p, neighborhood: e.target.value }))} className={inputClass} />
            </label>
            <label className={labelClass}>
              نامک محله (انگلیسی)
              <input value={newNh.neighborhoodSlug} onChange={(e) => setNewNh((p) => ({ ...p, neighborhoodSlug: e.target.value }))} className={inputClass} dir="ltr" />
            </label>
            <label className={labelClass}>
              عرض جغرافیایی (اختیاری)
              <input value={newNh.latitude} onChange={(e) => setNewNh((p) => ({ ...p, latitude: e.target.value }))} className={inputClass} dir="ltr" inputMode="decimal" placeholder="35.7950" />
            </label>
            <label className={labelClass}>
              طول جغرافیایی (اختیاری)
              <input value={newNh.longitude} onChange={(e) => setNewNh((p) => ({ ...p, longitude: e.target.value }))} className={inputClass} dir="ltr" inputMode="decimal" placeholder="51.3700" />
            </label>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="h-9 rounded-full border border-ink-600 px-4 text-xs text-ink-200 hover:bg-ink-800">انصراف</button>
              <button type="button" onClick={handleAddNeighborhood} className="h-9 rounded-full bg-saffron-400 px-4 text-xs font-semibold text-ink-950 hover:bg-saffron-300">افزودن</button>
            </div>
          </div>
        )}

        {neighborhoodsLoading ? (
          <div className="flex items-center gap-2 text-sm text-ink-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            در حال بارگذاری محله‌ها...
          </div>
        ) : neighborhoods.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-700 py-10 text-center">
            <AlertCircle className="h-6 w-6 text-ink-500" aria-hidden />
            <p className="text-sm text-ink-300">هیچ محله‌ای اضافه نشده است.</p>
            <button type="button" onClick={handleSeedTehran} className="text-sm font-medium text-saffron-300 hover:text-saffron-200">
              افزودن محله‌های تهران
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-800 text-right text-xs text-ink-400">
                  <th className="py-2 pe-3 font-medium">محله</th>
                  <th className="py-2 px-3 font-medium">منطقه</th>
                  <th className="py-2 px-3 font-medium">شهر</th>
                  <th className="py-2 px-3 font-medium">مختصات</th>
                  <th className="py-2 px-3 font-medium">وضعیت</th>
                  <th className="py-2 ps-3 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {neighborhoods.map((nh) => (
                  <tr key={nh.id} className="border-b border-ink-800/50">
                    <td className="py-3 pe-3 font-medium text-ink-100">{nh.neighborhood}</td>
                    <td className="py-3 px-3 text-ink-300">{nh.district ?? '—'}</td>
                    <td className="py-3 px-3 text-ink-300">{nh.city}</td>
                    <td className="py-3 px-3 text-xs text-ink-400" dir="ltr">
                      {nh.latitude && nh.longitude
                        ? `${Number(nh.latitude).toFixed(4)}, ${Number(nh.longitude).toFixed(4)}`
                        : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleNeighborhood(nh.id, nh.is_active)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors',
                          nh.is_active
                            ? 'bg-sage-400/15 text-sage-300'
                            : 'bg-ink-800 text-ink-400',
                        )}
                      >
                        <ToggleRight className="h-3.5 w-3.5" aria-hidden />
                        {nh.is_active ? 'فعال' : 'غیرفعال'}
                      </button>
                    </td>
                    <td className="py-3 ps-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteNeighborhood(nh.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <DemoNotice>
        قوانین فاصله و محله‌ها در دیتابیس ذخیره می‌شوند. برای استفاده در صفحات مشتری، این مقادیر باید در تنظیمات کلاینت نیز اعمال شوند.
      </DemoNotice>
    </div>
  );
}
