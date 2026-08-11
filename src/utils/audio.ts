// Web Audio API & Background Music Utility
// Plays Annihilate.mp3 as portfolio BGM (Default Volume: 0.85, plays immediately on entry)

let audioCtx: AudioContext | null = null;
let isMuted = false; // Enabled by default; user can mute/unmute anytime
let bgmAudio: HTMLAudioElement | null = null;
let bgmStarted = false;
let currentVolume = 0.85; // DEFAULT 85% VOLUME

function initBgm() {
  if (typeof window === 'undefined' || bgmAudio) return;
  bgmAudio = new Audio('/bgm.mp3');
  bgmAudio.loop = true;
  bgmAudio.volume = currentVolume; // 0.85 Volume
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

// Global listener to start BGM right away / on first user gesture
export function setupBgmAutoplay() {
  initBgm();
  if (typeof window === 'undefined') return;

  // Try playing immediately
  if (bgmAudio && !bgmStarted && !isMuted) {
    bgmAudio.play().then(() => {
      bgmStarted = true;
    }).catch(() => {
      // Browser autoplay policy required user gesture; listen for first interaction
    });
  }

  const handleUserInteraction = () => {
    if (!bgmStarted && bgmAudio && !isMuted) {
      bgmStarted = true;
      bgmAudio.volume = currentVolume;
      bgmAudio.play().catch(() => {});
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    }
  };

  window.addEventListener('click', handleUserInteraction);
  window.addEventListener('keydown', handleUserInteraction);
  window.addEventListener('touchstart', handleUserInteraction);
  window.addEventListener('scroll', handleUserInteraction);
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
