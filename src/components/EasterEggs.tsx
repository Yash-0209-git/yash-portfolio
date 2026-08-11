import { useState, useEffect, useRef } from 'react';
import { playBeep } from '../utils/audio';

const MATRIX_CHARS = '0123456789ABCDEFFASTAPIPYTHONREACTRAGGROQLLAMACODESAGELEESCULPTYASHWANTH';

export default function EasterEggs() {
  const [matrixActive, setMatrixActive] = useState(false);
  const [zeroGActive, setZeroGActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  // ── 1. GLOBAL KEYBOARD LISTENERS FOR 'M' AND 'CTRL+SHIFT+G' ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing inside inputs or textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // 'M' Key -> Toggle Matrix Rain
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMatrixActive(prev => {
          const next = !prev;
          playBeep(next ? 1046.5 : 440, 0.08);
          return next;
        });
      }

      // 'Ctrl + Shift + G' -> Toggle Zero-G Physics
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        triggerZeroG();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── 2. ZERO-G PHYSICS SURGE LOGIC ──
  const triggerZeroG = () => {
    if (zeroGActive) return;
    setZeroGActive(true);
    setCountdown(10);
    playBeep(1200, 0.12);

    // Apply zero-g class to body
    document.body.classList.add('zero-g-mode');

    const iv = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          setZeroGActive(false);
          document.body.classList.remove('zero-g-mode');
          playBeep(600, 0.1);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Listen for custom trigger event from Work section or elsewhere
  useEffect(() => {
    const handleZeroGEvent = () => triggerZeroG();
    window.addEventListener('trigger-zero-g', handleZeroGEvent);
    return () => window.removeEventListener('trigger-zero-g', handleZeroGEvent);
  }, [zeroGActive]);

  // ── 3. MATRIX RAIN CANVAS RENDER LOOP ──
  useEffect(() => {
    if (!matrixActive) return;

    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const fontSize = 14;
    const columns = Math.floor(w / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const render = () => {
      ctx.fillStyle = 'rgba(8, 8, 12, 0.1)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (Math.random() > 0.85) {
          ctx.fillStyle = '#FF2A4B'; // Bright glowing crimson lead
        } else {
          ctx.fillStyle = 'rgba(200, 16, 46, 0.8)';
        }

        ctx.fillText(text, x, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [matrixActive]);

  return (
    <>
      {/* ── MATRIX RAIN OVERLAY ── */}
      {matrixActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99990,
            pointerEvents: 'none',
          }}
        >
          <canvas ref={matrixCanvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

          {/* Matrix Status HUD Toast */}
          <div
            className="font-mono"
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(10, 5, 5, 0.9)',
              border: '1px solid var(--red)',
              borderRadius: '4px',
              padding: '0.4rem 1rem',
              color: 'var(--red)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              boxShadow: '0 0 20px rgba(200, 16, 46, 0.6)',
              zIndex: 99999,
              pointerEvents: 'auto',
            }}
          >
            ● MATRIX MODE ACTIVE // PRESS 'M' TO EXIT
          </div>
        </div>
      )}

      {/* ── ZERO-G PHYSICS HUD TOAST BANNER ── */}
      {zeroGActive && (
        <div
          className="font-mono"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(200, 16, 46, 0.95)',
            color: 'white',
            border: '1px solid #FF2A4B',
            borderRadius: '4px',
            padding: '0.5rem 1.25rem',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            boxShadow: '0 0 30px rgba(200, 16, 46, 0.8)',
            zIndex: 99999,
            pointerEvents: 'none',
            animation: 'pulse 0.8s infinite alternate',
          }}
        >
          ⚡ ZERO-G PHYSICS SURGE ENGAGED // GRAVITY RESTORING IN {countdown}s
        </div>
      )}

      {/* Zero-G Global CSS Keyframes & Styles */}
      <style>{`
        body.zero-g-mode section,
        body.zero-g-mode .project-card,
        body.zero-g-mode .vault-card,
        body.zero-g-mode button,
        body.zero-g-mode h1,
        body.zero-g-mode h2 {
          animation: zeroGFloat 3.5s ease-in-out infinite alternate !important;
          transition: transform 0.5s ease !important;
        }

        @keyframes zeroGFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-18px) rotate(2deg);
          }
          66% {
            transform: translateY(12px) rotate(-2.5deg);
          }
          100% {
            transform: translateY(-12px) rotate(1.5deg);
          }
        }
      `}</style>
    </>
  );
}
