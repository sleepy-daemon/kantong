export const SUPPORTED_CURRENCIES = ['IDR', 'USD', 'SGD', 'MYR', 'EUR'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

const ZERO_DECIMAL = new Set(['IDR']);

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  const digits = ZERO_DECIMAL.has(currency) ? 0 : 2;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Parse a user-typed amount, accepting both "1.500.000" (id-ID) and
 * "1,500,000.50" (en-US) styles. Returns NaN when the input isn't a number.
 *
 * Rule: if both separators appear, the last one is the decimal separator.
 * If only one kind appears, it is a decimal separator only when it occurs
 * once and is followed by 1–2 digits; otherwise it groups thousands.
 */
export function parseAmountInput(input: string): number {
  const s = input.replace(/\s/g, '');
  if (!/^[\d.,]+$/.test(s) || !/\d/.test(s)) return NaN;

  const lastDot = s.lastIndexOf('.');
  const lastComma = s.lastIndexOf(',');
  let decimalSep: '.' | ',' | null = null;

  if (lastDot !== -1 && lastComma !== -1) {
    decimalSep = lastDot > lastComma ? '.' : ',';
  } else {
    const sep = lastDot !== -1 ? '.' : lastComma !== -1 ? ',' : null;
    if (sep && s.split(sep).length === 2 && /^\d{1,2}$/.test(s.slice(s.lastIndexOf(sep) + 1))) {
      decimalSep = sep;
    }
  }

  let normalized = s;
  if (decimalSep) {
    const groupSep = decimalSep === '.' ? ',' : '.';
    const [intPart, fracPart, ...rest] = s.split(groupSep).join('').split(decimalSep);
    if (rest.length > 0) return NaN;
    normalized = `${intPart}.${fracPart}`;
  } else {
    normalized = s.replace(/[.,]/g, '');
  }
  return Number(normalized);
}
