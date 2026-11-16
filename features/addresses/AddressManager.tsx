'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader as Loader2, MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useSupabase } from '@/lib/auth/use-supabase';
import { addressSchema } from '@/lib/validation/schemas';
import type { Database } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddressRow = Database['public']['Tables']['addresses']['Row'];

const iranProvinces = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'گیلان', 'مازندران', 'آذربایجان شرقی',
  'کرمان', 'خوزستان', 'البرز', 'قم', 'زنجان', 'سمنان', 'هرمزگان', 'بوشهر',
];

export function AddressManager() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    recipient_name: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    district: '',
    address_line: '',
    postal_code: '',
    is_default: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (!error) setAddresses(data ?? []);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  function setField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setErrors({});

    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] && !fieldErrors[issue.path[0] as string]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    if (parsed.data.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false } as never)
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { error } = await supabase.from('addresses').insert({
      user_id: user.id,
      title: parsed.data.title,
      recipient_name: parsed.data.recipient_name,
      phone: parsed.data.phone,
      province: parsed.data.province,
      city: parsed.data.city,
      district: parsed.data.district || null,
      address_line: parsed.data.address_line,
      postal_code: parsed.data.postal_code || null,
      is_default: parsed.data.is_default ?? false,
    });

    setSaving(false);

    if (error) {
      toast.error('افزودن نشانی ناموفق بود.');
      return;
    }

    toast.success('نشانی اضافه شد');
    setForm({
      title: '', recipient_name: '', phone: '', province: 'تهران',
      city: 'تهران', district: '', address_line: '', postal_code: '', is_default: false,
    });
    setShowForm(false);
    loadAddresses();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) {
      toast.error('حذف نشانی ناموفق بود.');
      return;
    }
    toast.success('نشانی حذف شد');
    loadAddresses();
  }

  async function handleSetDefault(id: string) {
    if (!user) return;
    await supabase
      .from('addresses')
      .update({ is_default: false } as never)
      .eq('user_id', user.id)
      .eq('is_default', true);

    await supabase.from('addresses').update({ is_default: true } as never).eq('id', id);
    loadAddresses();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-400">
        <Loader2 className="h-4 w-4 animate-spin" /> در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-300">{addresses.length} نشانی ذخیره‌شده</span>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
          <Plus className="ms-2 h-4 w-4" />
          {showForm ? 'انصراف' : 'افزودن نشانی'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-4 rounded-xl border border-ink-800 bg-ink-950 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-title">عنوان</Label>
              <Input id="addr-title" value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="منزل" className="bg-ink-900 border-ink-700" />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-recipient">نام گیرنده</Label>
              <Input id="addr-recipient" value={form.recipient_name} onChange={(e) => setField('recipient_name', e.target.value)} className="bg-ink-900 border-ink-700" />
              {errors.recipient_name && <p className="text-xs text-red-400">{errors.recipient_name}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-phone">شماره تماس</Label>
              <Input id="addr-phone" type="tel" dir="ltr" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="09121234567" className="bg-ink-900 border-ink-700" />
              {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-province">استان</Label>
              <select
                id="addr-province"
                value={form.province}
                onChange={(e) => setField('province', e.target.value)}
                className="h-10 rounded-md border border-ink-700 bg-ink-900 px-3 text-sm text-ink-50"
              >
                {iranProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-city">شهر</Label>
              <Input id="addr-city" value={form.city} onChange={(e) => setField('city', e.target.value)} className="bg-ink-900 border-ink-700" />
              {errors.city && <p className="text-xs text-red-400">{errors.city}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-district">منطقه (اختیاری)</Label>
              <Input id="addr-district" value={form.district} onChange={(e) => setField('district', e.target.value)} className="bg-ink-900 border-ink-700" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="addr-line">نشانی کامل</Label>
            <Input id="addr-line" value={form.address_line} onChange={(e) => setField('address_line', e.target.value)} className="bg-ink-900 border-ink-700" />
            {errors.address_line && <p className="text-xs text-red-400">{errors.address_line}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="addr-postal">کد پستی (اختیاری)</Label>
            <Input id="addr-postal" dir="ltr" value={form.postal_code} onChange={(e) => setField('postal_code', e.target.value)} placeholder="1234567890" className="bg-ink-900 border-ink-700" />
            {errors.postal_code && <p className="text-xs text-red-400">{errors.postal_code}</p>}
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-200">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setField('is_default', e.target.checked)} className="h-4 w-4 rounded border-ink-600" />
            نشانی پیش‌فرض
          </label>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
            ذخیره نشانی
          </Button>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-sm leading-relaxed text-ink-300">هنوز نشانی‌ای ثبت نکرده‌اید.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {addresses.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-ink-800 p-4">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-semibold text-saffron-300">
                  <MapPin className="h-3 w-3" />
                  {a.title}
                  {a.is_default && <span className="rounded-full bg-saffron-400/15 px-2 py-0.5 text-[10px] text-saffron-300">پیش‌فرض</span>}
                </span>
                <span className="text-sm leading-relaxed text-ink-200">{a.address_line}</span>
                <span className="text-xs text-ink-400">{a.recipient_name} · {a.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                {!a.is_default && (
                  <Button size="sm" variant="ghost" onClick={() => handleSetDefault(a.id)} className="text-xs">
                    پیش‌فرض
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:text-red-400"
                  aria-label="حذف نشانی"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
