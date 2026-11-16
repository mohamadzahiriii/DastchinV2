/*
 * Iranian phone number normalization and validation.
 * Normalizes all valid Iranian mobile formats into a single E.164 format (+989xxxxxxxxx).
 * This prevents duplicate accounts for different representations of the same number.
 */

const persianToEnglishDigits = (s: string): string =>
  s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

export function normalizePersianInput(value: string): string {
  return persianToEnglishDigits(value).replace(/[\s\-()]/g, '');
}

/*
 * Validates an Iranian mobile number.
 * Accepts: 09xxxxxxxxx, +989xxxxxxxxx, 989xxxxxxxxx
 * Returns the normalized E.164 format (+989xxxxxxxxx) or null if invalid.
 */
export function normalizeIranianPhone(input: string): string | null {
  const cleaned = normalizePersianInput(input);

  // 09xxxxxxxxx → +989xxxxxxxxx
  if (/^09\d{9}$/.test(cleaned)) {
    return `+98${cleaned.slice(1)}`;
  }
  // 989xxxxxxxxx → +989xxxxxxxxx
  if (/^989\d{9}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  // +989xxxxxxxxx → already E.164
  if (/^\+989\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

export function isValidIranianPhone(input: string): boolean {
  return normalizeIranianPhone(input) !== null;
}

/*
 * Display format: 09xx xxx xx xx (Persian digits, for UI display)
 */
export function displayPhone(e164: string): string {
  const digits = e164.replace(/^\+98/, '0');
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const persian = digits.replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
  // 0912 345 67 89
  return `${persian.slice(0, 4)} ${persian.slice(4, 7)} ${persian.slice(7, 9)} ${persian.slice(9, 11)}`.trim();
}

/*
 * Hash a normalized phone number for the OTP audit log.
 * Uses a simple async SHA-256 via SubtleCrypto.
 * Falls back to a non-cryptographic hash if SubtleCrypto is unavailable.
 */
export async function hashPhone(phone: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(phone);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback: simple djb2 hash (non-cryptographic, but better than raw)
  let hash = 5381;
  for (let i = 0; i < phone.length; i++) {
    hash = ((hash << 5) + hash) + phone.charCodeAt(i);
  }
  return `djb2_${(hash >>> 0).toString(16)}`;
}
