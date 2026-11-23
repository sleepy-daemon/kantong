import { format, isToday, isYesterday, parseISO } from 'date-fns';

const pad = (n: number) => String(n).padStart(2, '0');

/** Shift a 1-indexed (year, month) by `delta` months. */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/**
 * Half-open date range [start, end) covering one month, as yyyy-MM-dd strings.
 * Avoids invalid dates like 2026-02-31.
 */
export function monthRange(year: number, month: number): { start: string; end: string } {
  const next = shiftMonth(year, month, 1);
  return { start: `${year}-${pad(month)}-01`, end: `${next.year}-${pad(next.month)}-01` };
}

/** Today's local date as yyyy-MM-dd. */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Format a yyyy-MM-dd date (parsed as a local date, not UTC). */
export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'd MMM yyyy');
}

export function formatMonth(year: number, month: number): string {
  return format(new Date(year, month - 1, 1), 'MMMM yyyy');
}
