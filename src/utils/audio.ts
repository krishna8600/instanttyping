// Web Audio API Synthesizer for Mechanical Keyboard Keypress Audio
let audioCtx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;

let soundEnabled = true;
let currentVolume = 70; // 0-100 scale
let preMuteVolume = 70; // Remembers volume level before mute

// Defines the available sound themes for the application
export type SoundTheme = 'mechanical' | 'click' | 'piano' | 'guitar' | 'nature' | 'creative';

// Module-level variable to store the currently active sound theme
let currentTheme: SoundTheme = 'mechanical';

// Apply gain value to masterGainNode using perceptual curve (v / 100)^2
function applyMasterVolume(): void {
  if (!masterGainNode || !audioCtx) return;
  const effectiveVol = soundEnabled ? currentVolume : 0;
  // Perceptual curve: gain = (v / 100)^2 to prevent clipping and distortion
  const gainVal = Math.pow(effectiveVol / 100, 2);
  masterGainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
}

// Get master gain node, creating it if needed
export function getMasterGainNode(): GainNode | null {
  const ctx = ensureAudioContext();
  if (!ctx) return null;
  if (!masterGainNode) {
    masterGainNode = ctx.createGain();
    masterGainNode.connect(ctx.destination);
    applyMasterVolume();
  }
  return masterGainNode;
}

// Returns whether the master audio toggle is currently enabled
export function isAudioEnabled(): boolean {
  return soundEnabled && currentVolume > 0;
}

// Returns current volume (0-100)
export function getVolume(): number {
  return currentVolume;
}

// Sets volume (0-100) and persists in localStorage
export function setVolume(vol: number): void {
  const newVol = Math.max(0, Math.min(100, Math.round(vol)));
  currentVolume = newVol;

  if (newVol > 0) {
    soundEnabled = true;
    preMuteVolume = newVol;
  } else {
    soundEnabled = false;
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ptt_audio_volume', String(currentVolume));
      localStorage.setItem('ptt_audio_enabled', soundEnabled ? '1' : '0');
    } catch {
      // ignore
    }
  }

  applyMasterVolume();
}

// Toggles the master audio switch on/off and persists state
export function toggleAudio(): boolean {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    if (currentVolume === 0) {
      currentVolume = preMuteVolume > 0 ? preMuteVolume : 70;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ptt_audio_enabled', soundEnabled ? '1' : '0');
      localStorage.setItem('ptt_audio_volume', String(currentVolume));
    } catch {
      // ignore
    }
  }

  applyMasterVolume();
  return soundEnabled;
}

// Returns icon state for UI rendering
export function getSoundIconState(): 'muted' | 'low' | 'high' {
  if (!soundEnabled || currentVolume === 0) return 'muted';
  return currentVolume < 50 ? 'low' : 'high';
}

// Reads master audio toggle & volume state from localStorage on initial page load
export function initAudioFromStorage(): { enabled: boolean; volume: number; iconState: 'muted' | 'low' | 'high' } {
  if (typeof window !== 'undefined') {
    try {
      const savedVol = localStorage.getItem('ptt_audio_volume');
      if (savedVol !== null) {
        const parsed = parseInt(savedVol, 10);
        if (!isNaN(parsed)) {
          currentVolume = Math.max(0, Math.min(100, parsed));
          if (currentVolume > 0) preMuteVolume = currentVolume;
        }
      }

      const savedEnabled = localStorage.getItem('ptt_audio_enabled');
      if (savedEnabled !== null) {
        soundEnabled = savedEnabled === '1' && currentVolume > 0;
      } else if (currentVolume === 0) {
        soundEnabled = false;
      }
    } catch {
      // ignore
    }
  }
  return {
    enabled: soundEnabled && currentVolume > 0,
    volume: currentVolume,
    iconState: getSoundIconState(),
  };
}

// Retrieves the current sound theme
export function getSoundTheme(): SoundTheme {
  return currentTheme;
}

// Sets a new sound theme and saves the preference to localStorage
export function setSoundTheme(theme: SoundTheme): void {
  currentTheme = theme;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ptt_sound_theme', theme);
    } catch {
      // ignore
    }
  }
}

// Reads the preferred sound theme from localStorage on initial page load
export function initSoundThemeFromStorage(): SoundTheme {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('ptt_sound_theme') as SoundTheme;
      if ((saved as any) === 'default') {
        currentTheme = 'click';
      } else if (saved === 'mechanical' || saved === 'click' || saved === 'piano' || saved === 'guitar' || saved === 'nature' || saved === 'creative') {
        currentTheme = saved;
      }
    } catch {
      // ignore
    }
  }
  return currentTheme;
}

// Resume or create AudioContext strictly on user gesture
export function ensureAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
    getMasterGainNode();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => { });
  }
  return audioCtx;
}

// Ensure audio context is unlocked globally on the first user interaction
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    ensureAudioContext();
    ensureToneStarted().catch(e => console.error("Tone.start error:", e));
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
}

// Lazy-loaded Audio synthesis instances
let toneSampler: any = null;
let toneSamplerPromise: Promise<any> | null = null;
let toneSynth: any = null;
let toneSynthPromise: Promise<any> | null = null;
let toneStarted = false;

// Scales for melodic typing themes
const pentatonicScale = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5'];
let scaleIndex = 0;

// Central dispatcher for keystroke sounds based on the current theme
export function playKeyStrokeSound(key: string, isSpace: boolean = false, isError: boolean = false): void {
  // If master audio toggle is off or volume is 0, exit immediately
  if (!soundEnabled || currentVolume === 0) return;

  // Synchronously ensure AudioContext & master gain node are ready
  const ctx = ensureAudioContext();
  if (!ctx) return;

  try {
    switch (currentTheme) {
      case 'piano':
        try {
          playPianoNote(isError).catch((err: unknown) => console.error("Piano theme error:", err));
        } catch (err) {
          console.error("Piano theme error:", err);
          try { playDefaultClick(isSpace, isError); } catch (e) { console.error("Default fallback error:", e); }
        }
        break;
      case 'guitar':
        try {
          playGuitarNote(isError).catch((err: unknown) => console.error("Guitar theme error:", err));
        } catch (err) {
          console.error("Guitar theme error:", err);
          try { playDefaultClick(isSpace, isError); } catch (e) { console.error("Default fallback error:", e); }
        }
        break;
      case 'nature':
        try {
          playNatureSound(isError);
        } catch (err) {
          console.error("Nature theme error:", err);
          try { playDefaultClick(isSpace, isError); } catch (e) { console.error("Default fallback error:", e); }
        }
        break;
      case 'creative':
        try {
          playSonicFlowNote(currentTheme, isError).catch((err: unknown) => console.error("Creative theme error:", err));
        } catch (err) {
          console.error("Creative theme error:", err);
          try { playDefaultClick(isSpace, isError); } catch (e) { console.error("Default fallback error:", e); }
        }
        break;
      case 'mechanical':
      default:
        try {
          playMechanicalKey(key, isError).catch((err: unknown) => console.error("Mechanical theme error:", err));
        } catch (err) {
          console.error("Mechanical theme error:", err);
          try { playDefaultClick(isSpace, isError); } catch (e) { console.error("Default fallback error:", e); }
        }
        break;
      case 'click':
        try {
          playDefaultClick(isSpace, isError);
        } catch (err) {
          console.error("Click theme error:", err);
        }
        break;
    }
  } catch (err) {
    console.error("Audio theme error in dispatcher:", err);
    try { playDefaultClick(isSpace, isError); } catch (e) { console.error("Default fallback error:", e); }
  }
}

// Lazily initializes Tone.js if it hasn't been started yet
export async function ensureToneStarted() {
  if (typeof window === 'undefined') return;
  if (!toneStarted) {
    try {
      const Tone = await import('tone');
      if (audioCtx) {
        Tone.setContext(audioCtx as unknown as AudioContext);
      }
      
      if (Tone.getContext().state !== 'running') {
        try {
          await Tone.start();
        } catch (e) {
          console.warn("Tone.start warning:", e);
        }
      }

      const masterGain = getMasterGainNode();
      if (masterGain) {
        try {
          Tone.getDestination().disconnect();
          Tone.getDestination().connect(masterGain as any);
        } catch (e) {
          console.warn("Tone connect warning:", e);
        }
      }

      toneStarted = true;
    } catch (err) {
      console.error("Tone initialization error:", err);
      throw err;
    }
  }
}

// Plays a piano sample note using Tone.js
async function playPianoNote(isError: boolean) {
  try {
    await ensureToneStarted();
  } catch (err) {
    console.error("Piano theme error (ensureToneStarted):", err);
    throw err;
  }
  let Tone: any;
  try {
    Tone = await import('tone');
  } catch (err) {
    console.error("Piano theme error (import Tone):", err);
    throw err;
  }

  try {
    if (!toneSamplerPromise) {
      toneSamplerPromise = new Promise((resolve, reject) => {
        try {
          const sampler = new Tone.Sampler({
            urls: {
              A0: "A0.mp3",
              C1: "C1.mp3",
              "D#1": "Ds1.mp3",
              "F#1": "Fs1.mp3",
              A1: "A1.mp3",
              C2: "C2.mp3",
              "D#2": "Ds2.mp3",
              "F#2": "Fs2.mp3",
              A2: "A2.mp3",
              C3: "C3.mp3",
              "D#3": "Ds3.mp3",
              "F#3": "Fs3.mp3",
              A3: "A3.mp3",
              C4: "C4.mp3",
              "D#4": "Ds4.mp3",
              "F#4": "Fs4.mp3",
              A4: "A4.mp3",
              C5: "C5.mp3",
              "D#5": "Ds5.mp3",
              "F#5": "Fs5.mp3",
              A5: "A5.mp3",
              C6: "C6.mp3",
              "D#6": "Ds6.mp3",
              "F#6": "Fs6.mp3",
              A6: "A6.mp3",
              C7: "C7.mp3",
              "D#7": "Ds7.mp3",
              "F#7": "Fs7.mp3",
              A7: "A7.mp3",
              C8: "C8.mp3"
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/",
            onload: () => resolve(sampler),
            onerror: (err: unknown) => {
              console.error("Tone.Sampler load error", err);
              resolve(sampler); // Resolve anyway to avoid hanging forever
            }
          });
          sampler.volume.value = -18;
          const masterGain = getMasterGainNode();
          if (masterGain) {
            sampler.connect(masterGain as any);
          } else {
            sampler.toDestination();
          }
        } catch(err) {
          reject(err);
        }
      });
    }

    if (!toneSampler) {
      toneSampler = await toneSamplerPromise;
      await Tone.loaded();
    }

    if (isError) {
      toneSampler.triggerAttackRelease("C2", "8n");
    } else {
      const note = pentatonicScale[scaleIndex % pentatonicScale.length];
      scaleIndex++;
      toneSampler.triggerAttackRelease(note, "8n");
    }
  } catch (err) {
    console.error("Piano theme error (playback):", err);
    throw err;
  }
}

// Plays a plucked string synthesizer note using Tone.js FMSynth
async function playGuitarNote(isError: boolean) {
  try {
    await ensureToneStarted();
  } catch (err) {
    console.error("Guitar theme error (ensureToneStarted):", err);
    throw err;
  }
  let Tone: any;
  try {
    Tone = await import('tone');
  } catch (err) {
    console.error("Guitar theme error (import Tone):", err);
    throw err;
  }

  try {
    if (!toneSynthPromise) {
      toneSynthPromise = new Promise((resolve) => {
        const synth = new Tone.FMSynth({
          harmonicity: 2,
          modulationIndex: 2,
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 },
          modulation: { type: 'triangle' },
        });
        synth.volume.value = -15;
        const masterGain = getMasterGainNode();
        if (masterGain) {
          synth.connect(masterGain as any);
        } else {
          synth.toDestination();
        }
        resolve(synth);
      });
    }

    if (!toneSynth) {
      toneSynth = await toneSynthPromise;
      await Tone.loaded();
    }

    if (isError) {
      toneSynth.triggerAttackRelease("D2", "8n");
    } else {
      const note = pentatonicScale[scaleIndex % pentatonicScale.length];
      scaleIndex++;
      toneSynth.triggerAttackRelease(note, "8n");
    }
  } catch (err) {
    console.error("Guitar theme error (playback):", err);
    throw err;
  }
}

// Web Audio API synthesized Nature theme
function playNatureSound(isError: boolean): void {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const masterDest = getMasterGainNode() || ctx.destination;
    const now = ctx.currentTime;

    // Rain: short filtered noise burst
    try {
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.6;
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = isError ? 900 : 1800;
      noiseFilter.Q.value = isError ? 0.4 : 0.7;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isError ? 0.10 : 0.06, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterDest);
      noiseSrc.start(now);
      noiseSrc.stop(now + 0.12);
    } catch (err) {
      console.error("Nature theme error (rain):", err);
    }

    // Birds: chirp oscillators on correct keystrokes
    if (!isError && Math.random() < 0.4) {
      try {
        const chirpOsc = ctx.createOscillator();
        const chirpGain = ctx.createGain();
        const chirpFilter = ctx.createBiquadFilter();
        chirpOsc.type = "sine";
        const startFreq = 1600 + Math.random() * 1000;
        const endFreq = 2800 + Math.random() * 600;
        chirpOsc.frequency.setValueAtTime(startFreq, now);
        chirpOsc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.09);
        chirpFilter.type = "highpass";
        chirpFilter.frequency.value = 1400;
        chirpGain.gain.setValueAtTime(0.08, now);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        chirpOsc.connect(chirpFilter);
        chirpFilter.connect(chirpGain);
        chirpGain.connect(masterDest);
        chirpOsc.start(now + 0.015);
        chirpOsc.stop(now + 0.11);

        if (Math.random() < 0.45) {
          const chirp2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          chirp2.type = "sine";
          chirp2.frequency.setValueAtTime(2100, now + 0.13);
          chirp2.frequency.exponentialRampToValueAtTime(3000, now + 0.20);
          g2.gain.setValueAtTime(0.05, now + 0.13);
          g2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          chirp2.connect(g2);
          g2.connect(masterDest);
          chirp2.start(now + 0.13);
          chirp2.stop(now + 0.22);
        }
      } catch (err) {
        console.error("Nature theme error (birds):", err);
      }
    }

    if (isError) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);
        gain.gain.setValueAtTime(0.10, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(masterDest);
        osc.start(now);
        osc.stop(now + 0.07);
      } catch (err) {
        console.error("Nature theme error (error thud):", err);
      }
    }
  } catch (err) {
    console.error("Nature theme error:", err);
    throw err;
  }
}

// Plays creative sounds using the sonic-flow package
async function playSonicFlowNote(_theme: 'nature' | 'creative', _isError: boolean) {
  try {
    // @ts-ignore
    const { play } = await import('sonic-flow');
    const soundName = scaleIndex % 2 === 0 ? "sparkle" : "chime";
    scaleIndex++;
    // Scale volume according to current master volume level
    const baseVol = 0.25;
    const effectiveVol = soundEnabled ? (currentVolume / 100) : 0;
    const vol = baseVol * Math.pow(effectiveVol, 2);
    if (vol > 0.001) {
      play(soundName, { volume: vol });
    }
  } catch (err) {
    console.error("Creative theme error:", err);
    throw err;
  }
}

// Web Audio API click logic for default theme
function playDefaultClick(isSpace: boolean, isError: boolean): void {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const masterDest = getMasterGainNode() || ctx.destination;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    if (isError) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterDest);

      osc.start(now);
      osc.stop(now + 0.08);
    } else if (isSpace) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.06);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterDest);

      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      osc.type = 'sine';
      const baseFreq = 750 + Math.random() * 80;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterDest);

      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (err) {
    console.error("Default theme error:", err);
    throw err;
  }
}

// Mechanical Theme (NK Cream samples)
const mechanicalCache = new Map<string, AudioBuffer>();
let mechAudioCtx: AudioContext | null = null;
const letterWavs = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

async function playMechanicalKey(key: string, isError: boolean) {
  if (typeof window === 'undefined') return;

  if (!mechAudioCtx) {
    mechAudioCtx = ensureAudioContext();
    if (!mechAudioCtx) return;
  }

  let mappedKey = key.toLowerCase();
  if (mappedKey === ' ') {
    mappedKey = 'space';
  } else if (mappedKey === 'enter') {
    mappedKey = 'enter';
  } else if (mappedKey === 'backspace') {
    mappedKey = 'backspace';
  } else if (!letterWavs.includes(mappedKey)) {
    mappedKey = letterWavs[Math.floor(Math.random() * letterWavs.length)];
  }

  const url = `/sounds/nk-cream/${mappedKey}.wav`;

  let buffer = mechanicalCache.get(url);
  if (!buffer) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      buffer = await mechAudioCtx.decodeAudioData(arrayBuffer);
      mechanicalCache.set(url, buffer);
    } catch (e) {
      console.error(`Failed to load mechanical sound ${url}`, e);
      throw e;
    }
  }

  const source = mechAudioCtx.createBufferSource();
  source.buffer = buffer!;

  const gainNode = mechAudioCtx.createGain();
  const volOffset = (Math.random() * 0.14) - 0.07;
  gainNode.gain.value = 1.0 + volOffset;

  const rateOffset = (Math.random() * 0.08) - 0.04;
  source.playbackRate.value = 1.0 + rateOffset;

  const masterDest = getMasterGainNode() || mechAudioCtx.destination;
  source.connect(gainNode);
  gainNode.connect(masterDest);
  source.start(0);
}
