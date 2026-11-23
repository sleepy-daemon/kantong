/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthRange, shiftMonth } from './date.ts';

test('monthRange returns a half-open range ending on the 1st of next month', () => {
  assert.deepEqual(monthRange(2026, 2), { start: '2026-02-01', end: '2026-03-01' });
  assert.deepEqual(monthRange(2026, 11), { start: '2026-11-01', end: '2026-12-01' });
});

test('monthRange rolls over the year in December', () => {
  assert.deepEqual(monthRange(2026, 12), { start: '2026-12-01', end: '2027-01-01' });
});

test('shiftMonth wraps across year boundaries in both directions', () => {
  assert.deepEqual(shiftMonth(2026, 1, -1), { year: 2025, month: 12 });
  assert.deepEqual(shiftMonth(2026, 12, 1), { year: 2027, month: 1 });
  assert.deepEqual(shiftMonth(2026, 6, -18), { year: 2024, month: 12 });
});
