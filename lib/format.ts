const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

export function formatNumber(value: number): string {
  return toPersianDigits(value.toLocaleString('en-US').replace(/,/g, '٬'));
}

export function formatToman(value: number): string {
  return `${formatNumber(value)} تومان`;
}

export function discountPercent(original: number, price: number): number {
  if (original <= 0) return 0;
  return Math.round((1 - price / original) * 100);
}

export function formatPercent(value: number): string {
  return `${toPersianDigits(value)}٪`;
}

export function formatPersianDate(iso: string): string {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date(iso));
}

export function formatPersianTime(iso: string): string {
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tehran',
  }).format(new Date(iso));
  return toPersianDigits(time);
}

export function formatCollectionWindow(startsAt: string, endsAt: string): string {
  const sameDay = formatPersianDate(startsAt) === formatPersianDate(endsAt);
  const day = formatPersianDate(startsAt);
  const range = `${formatPersianTime(startsAt)} تا ${formatPersianTime(endsAt)}`;
  return sameDay ? `${day}، ${range}` : `${day} ${formatPersianTime(startsAt)} تا ${formatPersianDate(endsAt)} ${formatPersianTime(endsAt)}`;
}

export function formatRating(value: number): string {
  return toPersianDigits(value.toFixed(1));
}
