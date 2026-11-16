'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader as Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useSupabase } from '@/lib/auth/use-supabase';
import { profileUpdateSchema } from '@/lib/validation/schemas';
import type { Database } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function ProfileEditor({ profile }: { profile: ProfileRow }) {
  const { signOut } = useAuth();
  const supabase = useSupabase();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    phone: profile.phone ?? '',
    email: profile.email ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = profileUpdateSchema.safeParse({
      ...form,
      avatar_url: profile.avatar_url,
    });
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
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: parsed.data.full_name || null,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
      } as never)
      .eq('id', profile.id);

    setSaving(false);

    if (error) {
      toast.error('ذخیره تغییرات ناموفق بود.');
      return;
    }

    toast.success('تغییرات ذخیره شد');
    router.refresh();
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name">نام و نام خانوادگی</Label>
        <Input
          id="full_name"
          value={form.full_name}
          onChange={(e) => setField('full_name', e.target.value)}
          className="bg-ink-900 border-ink-700"
        />
        {errors.full_name && <p className="text-xs text-red-400">{errors.full_name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">شماره موبایل</Label>
        <Input
          id="phone"
          type="tel"
          dir="ltr"
          value={form.phone}
          onChange={(e) => setField('phone', e.target.value)}
          placeholder="09121234567"
          className="bg-ink-900 border-ink-700"
        />
        {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          className="bg-ink-900 border-ink-700"
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
          ذخیره تغییرات
        </Button>
        <Button type="button" variant="outline" onClick={handleSignOut}>
          <LogOut className="ms-2 h-4 w-4" />
          خروج از حساب
        </Button>
      </div>
    </form>
  );
}
