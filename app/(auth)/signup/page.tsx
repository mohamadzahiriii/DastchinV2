import { PhoneAuthForm } from '@/features/auth/PhoneAuthForm';

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-ink-800 bg-ink-900 p-8">
      <div className="mb-6 flex flex-col gap-2 text-center">
        <h1 className="text-xl font-bold text-ink-50">ورود یا ثبت‌نام</h1>
        <p className="text-sm text-ink-400">برای ادامه، شماره موبایل خود را وارد کنید.</p>
      </div>
      <PhoneAuthForm />
    </div>
  );
}
