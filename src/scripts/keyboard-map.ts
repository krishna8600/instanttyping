export type FingerId =
  | 'left_pinky'
  | 'left_ring'
  | 'left_middle'
  | 'left_index'
  | 'right_index'
  | 'right_middle'
  | 'right_ring'
  | 'right_pinky'
  | 'thumb';

export type Hand = 'left' | 'right';

export interface KeyResult {
  code: string;
  shift: boolean;
  finger: FingerId;
  hand: Hand;
}

export const HOME_ROW_CODES = ['KeyF', 'KeyJ'];

type KeyDef = { code: string; shift: boolean };

const keyMap = new Map<string, KeyDef>();

function mapChar(char: string, code: string, shift: boolean) {
  keyMap.set(char, { code, shift });
}

// Top row (digits and symbols)
mapChar('`', 'Backquote', false); mapChar('~', 'Backquote', true);
mapChar('1', 'Digit1', false); mapChar('!', 'Digit1', true);
mapChar('2', 'Digit2', false); mapChar('@', 'Digit2', true);
mapChar('3', 'Digit3', false); mapChar('#', 'Digit3', true);
mapChar('4', 'Digit4', false); mapChar('$', 'Digit4', true);
mapChar('5', 'Digit5', false); mapChar('%', 'Digit5', true);
mapChar('6', 'Digit6', false); mapChar('^', 'Digit6', true);
mapChar('7', 'Digit7', false); mapChar('&', 'Digit7', true);
mapChar('8', 'Digit8', false); mapChar('*', 'Digit8', true);
mapChar('9', 'Digit9', false); mapChar('(', 'Digit9', true);
mapChar('0', 'Digit0', false); mapChar(')', 'Digit0', true);
mapChar('-', 'Minus', false); mapChar('_', 'Minus', true);
mapChar('=', 'Equal', false); mapChar('+', 'Equal', true);

// Letters
const letters = [
  ['q', 'KeyQ'], ['w', 'KeyW'], ['e', 'KeyE'], ['r', 'KeyR'], ['t', 'KeyT'], ['y', 'KeyY'], ['u', 'KeyU'], ['i', 'KeyI'], ['o', 'KeyO'], ['p', 'KeyP'],
  ['a', 'KeyA'], ['s', 'KeyS'], ['d', 'KeyD'], ['f', 'KeyF'], ['g', 'KeyG'], ['h', 'KeyH'], ['j', 'KeyJ'], ['k', 'KeyK'], ['l', 'KeyL'],
  ['z', 'KeyZ'], ['x', 'KeyX'], ['c', 'KeyC'], ['v', 'KeyV'], ['b', 'KeyB'], ['n', 'KeyN'], ['m', 'KeyM']
];

for (const [lower, code] of letters) {
  mapChar(lower, code, false);
  mapChar(lower.toUpperCase(), code, true);
}

// Punctuation
mapChar('[', 'BracketLeft', false); mapChar('{', 'BracketLeft', true);
mapChar(']', 'BracketRight', false); mapChar('}', 'BracketRight', true);
mapChar('\\', 'Backslash', false); mapChar('|', 'Backslash', true);
mapChar(';', 'Semicolon', false); mapChar(':', 'Semicolon', true);
mapChar('\'', 'Quote', false); mapChar('"', 'Quote', true);
mapChar(',', 'Comma', false); mapChar('<', 'Comma', true);
mapChar('.', 'Period', false); mapChar('>', 'Period', true);
mapChar('/', 'Slash', false); mapChar('?', 'Slash', true);
mapChar(' ', 'Space', false);

const codeToFinger = new Map<string, FingerId>([
  ['Backquote', 'left_pinky'], ['Digit1', 'left_pinky'], ['KeyQ', 'left_pinky'], ['KeyA', 'left_pinky'], ['KeyZ', 'left_pinky'],
  ['Digit2', 'left_ring'], ['KeyW', 'left_ring'], ['KeyS', 'left_ring'], ['KeyX', 'left_ring'],
  ['Digit3', 'left_middle'], ['KeyE', 'left_middle'], ['KeyD', 'left_middle'], ['KeyC', 'left_middle'],
  ['Digit4', 'left_index'], ['KeyR', 'left_index'], ['KeyF', 'left_index'], ['KeyV', 'left_index'], ['Digit5', 'left_index'], ['KeyT', 'left_index'], ['KeyG', 'left_index'], ['KeyB', 'left_index'],
  ['Digit6', 'right_index'], ['KeyY', 'right_index'], ['KeyH', 'right_index'], ['KeyN', 'right_index'], ['Digit7', 'right_index'], ['KeyU', 'right_index'], ['KeyJ', 'right_index'], ['KeyM', 'right_index'],
  ['Digit8', 'right_middle'], ['KeyI', 'right_middle'], ['KeyK', 'right_middle'], ['Comma', 'right_middle'],
  ['Digit9', 'right_ring'], ['KeyO', 'right_ring'], ['KeyL', 'right_ring'], ['Period', 'right_ring'],
  ['Digit0', 'right_pinky'], ['KeyP', 'right_pinky'], ['Semicolon', 'right_pinky'], ['Slash', 'right_pinky'], ['Minus', 'right_pinky'], ['Equal', 'right_pinky'], ['BracketLeft', 'right_pinky'], ['BracketRight', 'right_pinky'], ['Backslash', 'right_pinky'], ['Quote', 'right_pinky'],
  ['Space', 'thumb']
]);

export function getKeyForChar(char: string): KeyResult | null {
  const def = keyMap.get(char);
  if (!def) return null;
  
  const finger = codeToFinger.get(def.code);
  if (!finger) return null;
  
  const hand: Hand = finger.startsWith('left_') ? 'left' : 'right';

  return {
    code: def.code,
    shift: def.shift,
    finger,
    hand
  };
}

export function getShiftKeyFor(hand: Hand): string {
  return hand === 'left' ? 'ShiftRight' : 'ShiftLeft';
}
