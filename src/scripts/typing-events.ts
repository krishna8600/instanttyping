/**
 * WARNING: This event subsystem currently handles physical key presses and simple strings.
 * It does not fully support IME (Input Method Editor) or composition events 
 * (e.g. typing in Pinyin or Romaji to output Chinese/Japanese characters),
 * as those can emit multiple characters at once or fire compositionstart/update/end events
 * without standard keydown sequences. If full IME support is added in the future,
 * these events will need to be adapted.
 */

export interface TypingKeyResultDetail {
  char: string;
  correct: boolean;
}

export interface TypingNextCharDetail {
  char: string | null;
}

export type TypingEventMap = {
  'typing-start': CustomEvent<void>;
  'typing-stop': CustomEvent<void>;
  'typing-reset': CustomEvent<void>;
  'typing-key-result': CustomEvent<TypingKeyResultDetail>;
  'typing-backspace': CustomEvent<void>;
  'typing-next-char': CustomEvent<TypingNextCharDetail>;
};

declare global {
  interface WindowEventMap extends TypingEventMap {}
}
