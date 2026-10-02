import test from 'node:test';
import assert from 'node:assert/strict';
import { getKeyForChar, getShiftKeyFor, HOME_ROW_CODES } from './keyboard-map.ts';

test('HOME_ROW_CODES are defined correctly', () => {
  assert.deepEqual(HOME_ROW_CODES, ['KeyF', 'KeyJ']);
});

test('a -> KeyA/left_pinky/no-shift', () => {
  const result = getKeyForChar('a');
  assert.notEqual(result, null);
  assert.equal(result!.code, 'KeyA');
  assert.equal(result!.shift, false);
  assert.equal(result!.finger, 'left_pinky');
  assert.equal(result!.hand, 'left');
});

test('A -> KeyA/shift', () => {
  const result = getKeyForChar('A');
  assert.notEqual(result, null);
  assert.equal(result!.code, 'KeyA');
  assert.equal(result!.shift, true);
  assert.equal(result!.finger, 'left_pinky');
  assert.equal(result!.hand, 'left');
});

test('! -> Digit1/shift', () => {
  const result = getKeyForChar('!');
  assert.notEqual(result, null);
  assert.equal(result!.code, 'Digit1');
  assert.equal(result!.shift, true);
  assert.equal(result!.finger, 'left_pinky');
  assert.equal(result!.hand, 'left');
});

test('space -> Space/thumb', () => {
  const result = getKeyForChar(' ');
  assert.notEqual(result, null);
  assert.equal(result!.code, 'Space');
  assert.equal(result!.shift, false);
  assert.equal(result!.finger, 'thumb');
});

test('é -> null', () => {
  const result = getKeyForChar('é');
  assert.equal(result, null);
});

test('getShiftKeyFor returns correct shift key', () => {
  assert.equal(getShiftKeyFor('left'), 'ShiftRight');
  assert.equal(getShiftKeyFor('right'), 'ShiftLeft');
});
