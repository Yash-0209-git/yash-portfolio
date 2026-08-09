// Web Audio API Synthesizer Utility (Phase 6)
// Zero external assets required — synthesizes futuristic sound cues natively

let audioCtx: AudioContext | null = null;
let isMuted = true; // Default muted for clean UX

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAudioMute(): boolean {
  isMuted = !isMuted;
  if (!isMuted) {
    playBeep(880, 0.05, 0.05); // unmute chime
  }
  return isMuted;
}

export function getAudioMuted(): boolean {
  return isMuted;
}

export function playBeep(freq = 440, duration = 0.06, gainValue = 0.03) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio context errors silently
  }
}

export function playTransmissionSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C E G C arpeggio
    freqs.forEach((f, i) => {
      setTimeout(() => playBeep(f, 0.08, 0.04), i * 60);
    });
  } catch (e) {
    // Ignore silently
  }
}
