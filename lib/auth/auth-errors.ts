const errorMap: Record<string, string> = {
  'Invalid login credentials': 'ایمیل یا رمز عبور نادرست است.',
  'Email not confirmed': 'ایمیل شما تایید نشده است.',
  'User already registered': 'این ایمیل قبلاً ثبت شده است.',
  'Password should be at least 6 characters': 'رمز عبور باید حداقل ۶ نویسه باشد.',
  'Unable to validate email address': 'ایمیل معتبر نیست.',
  'Signup requires a valid password': 'رمز عبور معتبر وارد کنید.',
  'Email rate limit exceeded': 'تلاش‌های زیادی انجام شده. کمی بعد دوباره امتحان کنید.',
  'User not found': 'کاربر یافت نشد.',
  'over_email_send_rate_limit': 'تلاش‌های زیادی انجام شده. کمی بعد دوباره امتحان کنید.',
};

export function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, value] of Object.entries(errorMap)) {
    if (lower.includes(key.toLowerCase())) return value;
  }
  return 'خطایی رخ داد. دوباره تلاش کنید.';
}
