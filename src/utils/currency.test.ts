/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAmountInput } from './currency.ts';

test('parses plain integers', () => {
  assert.equal(parseAmountInput('50000'), 50000);
  assert.equal(parseAmountInput(' 50 000 '), 50000);
});

test('treats id-ID dot grouping as thousands', () => {
  assert.equal(parseAmountInput('1.500.000'), 1500000);
  assert.equal(parseAmountInput('1.500'), 1500);
});

test('treats en-US comma grouping as thousands', () => {
  assert.equal(parseAmountInput('1,500,000'), 1500000);
});

test('parses decimals in either style', () => {
  assert.equal(parseAmountInput('12.5'), 12.5);
  assert.equal(parseAmountInput('12,50'), 12.5);
  assert.equal(parseAmountInput('1,500,000.75'), 1500000.75);
  assert.equal(parseAmountInput('1.500.000,75'), 1500000.75);
});

test('rejects non-numeric input', () => {
  assert.ok(Number.isNaN(parseAmountInput('')));
  assert.ok(Number.isNaN(parseAmountInput('abc')));
  assert.ok(Number.isNaN(parseAmountInput('-5')));
  assert.ok(Number.isNaN(parseAmountInput('.')));
  assert.ok(Number.isNaN(parseAmountInput('1,2,3.4.5')));
});
