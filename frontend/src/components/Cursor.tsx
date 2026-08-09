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
  default: 36,
  view: 72,
  explore: 72,
  open: 64,
  enter: 64,
  drag: 56,
  pointer: 48,
};

export default function Cursor() {
  // Target = where mouse actually is (dot snaps here instantly)
  const dotRef = useRef({ x: 0, y: 0 });
  // Ring = lagged follower
  const ringRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<CursorMode>('default');
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);

  // Mode detection
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
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      dotRef.current = { x: e.clientX, y: e.clientY };
      setHidden(false);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onOver = (e: MouseEvent) => {
      setMode(detectMode(e.target as HTMLElement));
    };

    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    // Animation loop: ring follows dot with inertia (lerp 0.12)
    const loop = () => {
      ringRef.current = {
        x: ringRef.current.x + (dotRef.current.x - ringRef.current.x) * 0.12,
        y: ringRef.current.y + (dotRef.current.y - ringRef.current.y) * 0.12,
      };
      setDotPos({ ...dotRef.current });
      setRingPos({ ...ringRef.current });
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

  if (hidden && dotPos.x === 0) return null;

  const label = LABEL[mode];
  const size = RING_SIZE[mode];
  const hasLabel = !!label;
  const scale = clicked ? 0.85 : 1;

  return (
    <>
      {/* Dot — snaps to cursor instantly */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: 'var(--red)',
          transform: `translate3d(${dotPos.x - 3.5}px, ${dotPos.y - 3.5}px, 0) scale(${clicked ? 0.6 : 1})`,
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: hidden ? 0 : 1,
          transition: 'transform 0.08s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Ring — lags behind with inertia */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: '50%',
          border: hasLabel ? 'none' : `1.5px solid var(--red)`,
          backgroundColor: hasLabel ? 'var(--red)' : 'transparent',
          transform: `translate3d(${ringPos.x - size / 2}px, ${ringPos.y - size / 2}px, 0) scale(${scale})`,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: hidden ? 0 : 0.9,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), height 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.2s ease, border 0.2s ease, opacity 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          mixBlendMode: mode === 'default' ? 'normal' : 'normal',
        }}
      >
        {hasLabel && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.1em',
              userSelect: 'none',
              opacity: 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            {label}
          </span>
        )}
        {mode === 'pointer' && !hasLabel && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </>
  );
}
