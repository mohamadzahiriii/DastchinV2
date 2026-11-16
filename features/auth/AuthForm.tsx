'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader as Loader2 } from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase/typed-client';
import { translateAuthError } from '@/lib/auth/auth-errors';
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '@/lib/validation/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'login' | 'signup';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/profile';
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<SignInInput & Partial<SignUpInput>>({
    email: '',
    password: '',
    full_name: '',
  });

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const supabase = getTypedSupabaseClient();

      if (mode === 'signup') {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          const fieldErrors: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            if (issue.path[0] && !fieldErrors[issue.path[0] as string]) {
              fieldErrors[issue.path[0] as string] = issue.message;
            }
          }
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            data: {
              full_name: parsed.data.full_name,
              phone: parsed.data.phone || undefined,
            },
          },
        });

        if (error) {
          toast.error(translateAuthError(error.message));
          setLoading(false);
          return;
        }

        toast.success('حساب کاربری ساخته شد. وارد شوید.');
        router.push('/login');
      } else {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          const fieldErrors: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            if (issue.path[0] && !fieldErrors[issue.path[0] as string]) {
              fieldErrors[issue.path[0] as string] = issue.message;
            }
          }
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });

        if (error) {
          toast.error(translateAuthError(error.message));
          setLoading(false);
          return;
        }

        toast.success('خوش آمدید');
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      toast.error('خطایی رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {mode === 'signup' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="full_name">نام و نام خانوادگی</Label>
          <Input
            id="full_name"
            type="text"
            value={form.full_name ?? ''}
            onChange={(e) => setField('full_name', e.target.value)}
            placeholder="مثال: نگار رضایی"
            className="bg-ink-900 border-ink-700"
          />
          {errors.full_name && <p className="text-xs text-red-400">{errors.full_name}</p>}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          placeholder="you@example.com"
          className="bg-ink-900 border-ink-700"
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      {mode === 'signup' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">شماره موبایل (اختیاری)</Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            value={form.phone ?? ''}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="09121234567"
            className="bg-ink-900 border-ink-700"
          />
          {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          dir="ltr"
          value={form.password}
          onChange={(e) => setField('password', e.target.value)}
          placeholder="حداقل ۸ نویسه"
          className="bg-ink-900 border-ink-700"
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
        {mode === 'login' ? 'ورود' : 'ساخت حساب'}
      </Button>

      <p className="text-center text-sm text-ink-400">
        {mode === 'login' ? (
          <>
            حساب ندارید؟{' '}
            <Link href="/signup" className="font-medium text-saffron-300 hover:underline">
              ثبت‌نام کنید
            </Link>
          </>
        ) : (
          <>
            حساب دارید؟{' '}
            <Link href="/login" className="font-medium text-saffron-300 hover:underline">
              وارد شوید
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
