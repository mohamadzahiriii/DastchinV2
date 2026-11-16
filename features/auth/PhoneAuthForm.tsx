'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Phone, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase/typed-client';
import { normalizePersianInput, normalizeIranianPhone, isValidIranianPhone, displayPhone, hashPhone } from '@/lib/phone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toPersianDigits } from '@/lib/format';

type Step = 'phone' | 'otp';

const RESEND_COOLDOWN_SECONDS = 60;

export function PhoneAuthForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = redirectTo || searchParams.get('redirect') || '/profile';

  const [step, setStep] = useState<Step>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = normalizeIranianPhone(phoneInput);
    if (!normalized) {
      setError('شماره موبایل معتبر نیست. مثال: 09121234567');
      return;
    }

    setLoading(true);

    try {
      const supabase = getTypedSupabaseClient();
      const phoneHash = await hashPhone(normalized);

      // Check rate limit via RPC
      const { data: rateCheck } = await supabase.rpc('check_otp_rate_limit', {
        p_phone_hash: phoneHash,
        p_attempt_type: 'request',
      });

      if (rateCheck && !rateCheck.allowed) {
        setError('تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه بعد تلاش کنید.');
        setLoading(false);
        return;
      }

      // Send OTP via Supabase Auth
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: normalized,
        options: {
          channel: 'sms',
        },
      });

      // Log the attempt
      await supabase.rpc('log_otp_attempt', {
        p_phone_hash: phoneHash,
        p_attempt_type: 'request',
        p_success: !otpError,
      });

      if (otpError) {
        // Generic error — don't reveal whether the phone has an account
        const msg = otpError.message.toLowerCase();
        if (msg.includes('sms') || msg.includes('phone') || msg.includes('not_enabled') || msg.includes('provider')) {
          setError('ارسال پیامک در حال حاضر مقدور نیست. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.');
        } else if (msg.includes('rate') || msg.includes('too_many')) {
          setError('تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه بعد تلاش کنید.');
        } else {
          setError('خطا در ارسال کد. لطفاً دوباره تلاش کنید.');
        }
        setLoading(false);
        return;
      }

      setNormalizedPhone(normalized);
      setStep('otp');
      setResendCountdown(RESEND_COOLDOWN_SECONDS);
      toast.success('کد تایید ارسال شد');
    } catch {
      setError('خطایی رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!normalizedPhone) {
      setError('خطا در اطلاعات. لطفاً دوباره شماره را وارد کنید.');
      setStep('phone');
      return;
    }

    if (otp.length < 6) {
      setError('کد تایید باید ۶ رقم باشد.');
      return;
    }

    setLoading(true);

    try {
      const supabase = getTypedSupabaseClient();
      const phoneHash = await hashPhone(normalizedPhone);

      // Check rate limit for verify attempts
      const { data: rateCheck } = await supabase.rpc('check_otp_rate_limit', {
        p_phone_hash: phoneHash,
        p_attempt_type: 'verify',
      });

      if (rateCheck && !rateCheck.allowed) {
        setError('تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً چند دقیقه بعد تلاش کنید.');
        setLoading(false);
        return;
      }

      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: otp,
        type: 'sms',
      });

      // Log the attempt
      await supabase.rpc('log_otp_attempt', {
        p_phone_hash: phoneHash,
        p_attempt_type: 'verify',
        p_success: !verifyError,
      });

      if (verifyError) {
        const msg = verifyError.message.toLowerCase();
        if (msg.includes('expired') || msg.includes('invalid') || msg.includes('token')) {
          setError('کد تایید اشتباه است یا منقضی شده. دوباره وارد کنید.');
        } else {
          setError('خطا در تایید کد. دوباره تلاش کنید.');
        }
        setLoading(false);
        return;
      }

      // Success — user is now authenticated
      // If this is a new user, they need a profile and customer role
      if (verifyData.user) {
        await ensureProfileAndRole(verifyData.user.id, normalizedPhone);
      }

      toast.success('خوش آمدید');
      router.push(destination);
      router.refresh();
    } catch {
      setError('خطایی رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!normalizedPhone || resendCountdown > 0) return;
    setError(null);
    setLoading(true);

    try {
      const supabase = getTypedSupabaseClient();
      const phoneHash = await hashPhone(normalizedPhone);

      const { data: rateCheck } = await supabase.rpc('check_otp_rate_limit', {
        p_phone_hash: phoneHash,
        p_attempt_type: 'request',
      });

      if (rateCheck && !rateCheck.allowed) {
        setError('تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه بعد تلاش کنید.');
        setLoading(false);
        return;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
        options: { channel: 'sms' },
      });

      await supabase.rpc('log_otp_attempt', {
        p_phone_hash: phoneHash,
        p_attempt_type: 'request',
        p_success: !otpError,
      });

      if (otpError) {
        setError('خطا در ارسال مجدد کد. لطفاً بعداً تلاش کنید.');
        setLoading(false);
        return;
      }

      setResendCountdown(RESEND_COOLDOWN_SECONDS);
      toast.success('کد تایید مجدداً ارسال شد');
    } catch {
      setError('خطایی رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  function handleBackToPhone() {
    setStep('phone');
    setOtp('');
    setError(null);
    setNormalizedPhone(null);
  }

  function handleOtpChange(value: string) {
    const cleaned = normalizePersianInput(value).replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    setError(null);
  }

  if (step === 'phone') {
    return (
      <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">شماره موبایل</Label>
          <div className="flex h-11 items-center gap-2 rounded-xl border border-ink-700 bg-ink-900 px-3 transition-colors focus-within:border-saffron-400/60">
            <span className="text-sm font-medium text-ink-300" dir="ltr">+98</span>
            <span className="h-5 w-px bg-ink-700" />
            <Phone className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
            <input
              id="phone"
              type="tel"
              dir="ltr"
              inputMode="numeric"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                setError(null);
              }}
              placeholder="912 123 4567"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none"
              autoComplete="tel-national"
            />
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              {error}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full h-11">
          {loading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
          ادامه
        </Button>

        <p className="text-center text-xs leading-relaxed text-ink-400">
          با ادامه، شما قوانین و حریم خصوصی گنجینه را می‌پذیرید. کد تایید به شماره شما ارسال می‌شود.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="otp">کد تایید</Label>
        <div className="flex h-11 items-center gap-2 rounded-xl border border-ink-700 bg-ink-900 px-3 transition-colors focus-within:border-saffron-400/60">
          <ShieldCheck className="h-4 w-4 shrink-0 text-saffron-300" aria-hidden />
          <input
            id="otp"
            type="text"
            dir="ltr"
            inputMode="numeric"
            value={otp}
            onChange={(e) => handleOtpChange(e.target.value)}
            placeholder="------"
            className="min-w-0 flex-1 bg-transparent text-center text-lg tracking-[0.5em] text-ink-50 placeholder:text-ink-600 focus:outline-none"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
          />
        </div>
        <p className="text-xs text-ink-400">
          کد ۶ رقمی به شماره {normalizedPhone && displayPhone(normalizedPhone)} ارسال شد.
        </p>
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-400">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            {error}
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading || otp.length < 6} className="w-full h-11">
        {loading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
        تایید و ورود
      </Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBackToPhone}
          className="flex items-center gap-1.5 text-xs text-ink-300 transition-colors hover:text-ink-50"
        >
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          تغییر شماره
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCountdown > 0 || loading}
          className={cn(
            'flex items-center gap-1.5 text-xs transition-colors',
            resendCountdown > 0 ? 'text-ink-500' : 'text-saffron-300 hover:text-saffron-200',
          )}
        >
          {resendCountdown > 0 ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 opacity-50" aria-hidden />
              ارسال مجدد در {toPersianDigits(resendCountdown)} ثانیه
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              ارسال مجدد کد
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/*
 * Ensures a profile row and customer role exist for a newly authenticated phone user.
 * This is idempotent — safe to call on every login.
 * Does NOT touch existing roles (won't convert merchants/admins to customers).
 */
async function ensureProfileAndRole(userId: string, phone: string) {
  const supabase = getTypedSupabaseClient();

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, phone')
    .eq('id', userId)
    .maybeSingle();

  if (!existingProfile) {
    // Create profile for new user
    await supabase.from('profiles').insert({
      id: userId,
      phone,
      account_status: 'active',
    });
  } else if (!existingProfile.phone) {
    // Update phone if not set
    await supabase.from('profiles').update({ phone }).eq('id', userId);
  }

  // Check if user already has any role
  const { data: existingRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  // Only add customer role if user has NO roles at all
  // This preserves merchant/admin roles — we never downgrade
  if (!existingRoles || existingRoles.length === 0) {
    await supabase.from('user_roles').insert({
      user_id: userId,
      role: 'customer',
    });
  }
}
