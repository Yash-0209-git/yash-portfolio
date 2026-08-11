// Web Audio API & Background Music Utility
// Plays Sunflower Spiderman.mp3 as portfolio BGM (Default Volume: MAX 1.0, controlled via Entry amplitude slider)

let audioCtx: AudioContext | null = null;
let isMuted = true; // Default muted for browser policies, un-mutes on user interaction
let bgmAudio: HTMLAudioElement | null = null;
let bgmStarted = false;
let currentVolume = 1.0; // MAX DEFAULT VOLUME

function initBgm() {
  if (typeof window === 'undefined' || bgmAudio) return;
  bgmAudio = new Audio('/bgm.mp3');
  bgmAudio.loop = true;
  bgmAudio.volume = currentVolume; // MAX volume by default
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

export function setBgmVolume(val: number) {
  initBgm();
  currentVolume = Math.min(1.0, Math.max(0.0, val));
  if (bgmAudio) {
    bgmAudio.volume = currentVolume;
  }
  if (currentVolume > 0 && isMuted && bgmAudio) {
    isMuted = false;
    bgmAudio.play().catch(() => {});
  }
  return currentVolume;
}

export function getBgmVolume(): number {
  return currentVolume;
}

// Global user interaction listener to start BGM smoothly when permitted by browser
export function setupBgmAutoplay() {
  initBgm();
  if (typeof window === 'undefined') return;

  const handleUserInteraction = () => {
    if (!bgmStarted && bgmAudio) {
      bgmStarted = true;
      isMuted = false;
      bgmAudio.volume = currentVolume;
      bgmAudio.play().catch(() => {
        // Autoplay policy prevented playback
      });
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
      bgmAudio.volume = currentVolume;
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
