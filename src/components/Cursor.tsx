import { useEffect, useState, useRef, useCallback } from 'react';

type CursorMode = 'default' | 'view' | 'explore' | 'open' | 'enter' | 'drag' | 'pointer';

const LABEL: Record<CursorMode, string> = {
  default: '',
  view: 'VIEW',
  explore: 'EXPLORE',
  open: 'OPEN',
  enter: 'ENTER',
  drag: 'DRAG',
  pointer: '',
};

const RING_SIZE: Record<CursorMode, number> = {
  default: 42,
  view: 78,
  explore: 78,
  open: 68,
  enter: 68,
  drag: 60,
  pointer: 52,
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
}

export default function Cursor() {
  const dotRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const particlesRef = useRef<Particle[]>([]);
  const nextParticleId = useRef(0);
  const rafRef = useRef(0);

  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mode, setMode] = useState<CursorMode>('default');
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);

  const detectMode = useCallback((target: HTMLElement): CursorMode => {
    const el = target.closest<HTMLElement>('[data-cursor]');
    if (el) {
      const val = el.getAttribute('data-cursor') as CursorMode;
      if (val in LABEL) return val;
    }
    const tag = target.tagName.toLowerCase();
    if (tag === 'a') return 'open';
    if (tag === 'button') return 'pointer';
    return 'default';
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let lastSpawnTime = 0;

    const onMove = (e: MouseEvent) => {
      dotRef.current = { x: e.clientX, y: e.clientY };
      setHidden(false);

      // Spawn Cyberpunk trailing particles
      const now = performance.now();
      if (now - lastSpawnTime > 35) {
        lastSpawnTime = now;
        particlesRef.current.push({
          id: nextParticleId.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 3 + 2,
          alpha: 0.8,
        });
        if (particlesRef.current.length > 12) {
          particlesRef.current.shift();
        }
      }
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    const onOver = (e: MouseEvent) => setMode(detectMode(e.target as HTMLElement));
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    // Animation Loop: Inertia spring + Particle decay
    const loop = () => {
      ringRef.current = {
        x: ringRef.current.x + (dotRef.current.x - ringRef.current.x) * 0.14,
        y: ringRef.current.y + (dotRef.current.y - ringRef.current.y) * 0.14,
      };

      // Decay particles
      particlesRef.current = particlesRef.current
        .map(p => ({ ...p, alpha: p.alpha - 0.04 }))
        .filter(p => p.alpha > 0);

      setDotPos({ ...dotRef.current });
      setRingPos({ ...ringRef.current });
      setParticles([...particlesRef.current]);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [detectMode]);

  if (hidden && dotPos.x < 0) return null;

  const label = LABEL[mode];
  const size = RING_SIZE[mode];
  const hasLabel = !!label;
  const scale = clicked ? 0.85 : 1;

  return (
    <>
      {/* Particle Trail */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: 'var(--red)',
            boxShadow: '0 0 6px rgba(200,16,46,0.8)',
            transform: `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0)`,
            opacity: hidden ? 0 : p.alpha,
            pointerEvents: 'none',
            zIndex: 199998,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Central Laser Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--red)',
          boxShadow: '0 0 10px rgba(200,16,46,0.9), 0 0 20px rgba(200,16,46,0.6)',
          transform: `translate3d(${dotPos.x - 4}px, ${dotPos.y - 4}px, 0) scale(${clicked ? 0.6 : 1})`,
          pointerEvents: 'none',
          zIndex: 200000,
          opacity: hidden ? 0 : 1,
          transition: 'transform 0.08s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Cyberpunk HUD Outer Ring with Lens Flare */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: '50%',
          border: hasLabel ? '1px solid var(--red)' : '1px dashed rgba(200,16,46,0.5)',
          backgroundColor: hasLabel ? 'rgba(200,16,46,0.9)' : 'rgba(200,16,46,0.03)',
          boxShadow: hasLabel
            ? '0 0 30px rgba(200,16,46,0.5), inset 0 0 15px rgba(200,16,46,0.3)'
            : '0 0 15px rgba(200,16,46,0.15)',
          transform: `translate3d(${ringPos.x - size / 2}px, ${ringPos.y - size / 2}px, 0) scale(${scale})`,
          pointerEvents: 'none',
          zIndex: 199999,
          opacity: hidden ? 0 : 0.95,
          transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1), height 0.22s cubic-bezier(0.4,0,0.2,1), background-color 0.2s ease, border 0.2s ease, opacity 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          backdropFilter: hasLabel ? 'blur(4px)' : 'none',
        }}
      >
        {/* HUD Crosshair Corner Accents */}
        <div style={{ position: 'absolute', top: -3, left: '50%', width: 6, height: 1, backgroundColor: 'var(--red)', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', bottom: -3, left: '50%', width: 6, height: 1, backgroundColor: 'var(--red)', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', left: -3, top: '50%', height: 6, width: 1, backgroundColor: 'var(--red)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', right: -3, top: '50%', height: 6, width: 1, backgroundColor: 'var(--red)', transform: 'translateY(-50%)' }} />

        {hasLabel && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.12em',
              userSelect: 'none',
              textShadow: '0 0 8px rgba(0,0,0,0.8)',
            }}
          >
            {label}
          </span>
        )}

        {mode === 'pointer' && !hasLabel && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </>
  );
}
