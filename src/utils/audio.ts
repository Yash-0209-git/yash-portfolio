// Web Audio API & Background Music Utility
// Plays Sunflower Spiderman.mp3 gently as portfolio BGM (volume: ~0.16, mild & soothing)

let audioCtx: AudioContext | null = null;
let isMuted = true; // Default muted for UX, unmutes on first interaction or button click
let bgmAudio: HTMLAudioElement | null = null;
let bgmStarted = false;

function initBgm() {
  if (typeof window === 'undefined' || bgmAudio) return;
  bgmAudio = new Audio('/bgm.mp3');
  bgmAudio.loop = true;
  bgmAudio.volume = 0.16; // Mild, soothing volume level — audible but gentle
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Global user interaction listener to start BGM smoothly when permitted by browser
export function setupBgmAutoplay() {
  initBgm();
  if (typeof window === 'undefined') return;

  const handleUserInteraction = () => {
    if (!bgmStarted && bgmAudio) {
      bgmStarted = true;
      isMuted = false;
      bgmAudio.play().catch(() => {
        // Autoplay policy prevented playback
      });
      // Remove listeners once started
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    }
  };

  window.addEventListener('click', handleUserInteraction);
  window.addEventListener('keydown', handleUserInteraction);
  window.addEventListener('touchstart', handleUserInteraction);
}

export function toggleAudioMute(): boolean {
  initBgm();
  isMuted = !isMuted;

  if (bgmAudio) {
    if (isMuted) {
      bgmAudio.pause();
    } else {
      bgmAudio.volume = 0.16;
      bgmAudio.play().catch(() => {});
      playBeep(880, 0.05, 0.05); // unmute chime
    }
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
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C E G C arpeggio
    freqs.forEach((f, i) => {
      setTimeout(() => playBeep(f, 0.08, 0.04), i * 60);
    });
  } catch (e) {
    // Ignore silently
  }
}
