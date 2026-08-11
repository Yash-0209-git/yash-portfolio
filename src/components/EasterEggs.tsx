import { useState, useEffect, useRef } from 'react';
import { playBeep } from '../utils/audio';

const MATRIX_CHARS = '0123456789ABCDEFFASTAPIPYTHONREACTRAGGROQLLAMACODESAGELEESCULPTYASHWANTH';

interface PhysicsElement {
  el: HTMLElement;
  origTransform: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
}

export default function EasterEggs() {
  const [matrixActive, setMatrixActive] = useState(false);
  const [zeroGActive, setZeroGActive] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const physicsItemsRef = useRef<PhysicsElement[]>([]);
  const animFrameRef = useRef<number>(0);
  const activeDragRef = useRef<PhysicsElement | null>(null);

  // ── 1. GLOBAL KEYBOARD LISTENERS FOR 'M' AND 'CTRL+SHIFT+G' ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      // 'Ctrl + Shift + G' -> Toggle Zero-G Physics Surge
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        triggerZeroG();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── 2. INTERACTIVE ZERO-G TOSS PHYSICS ENGINE ──
  const triggerZeroG = () => {
    if (zeroGActive) return;
    setZeroGActive(true);
    setCountdown(15);
    playBeep(1200, 0.12);

    document.body.classList.add('zero-g-mode');

    // Query interactive floating targets across the portfolio
    const selectors = [
      '.project-card',
      '.vault-card',
      'h1',
      'h2',
      '.font-share-tech',
      '.font-mono',
      'button',
      '.broadcast-card',
    ];
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(',')))
      .filter(el => !el.closest('.zero-g-hud-toast') && !el.closest('.matrix-hud'));

    const items: PhysicsElement[] = [];

    elements.forEach(el => {
      // Give initial random zero-g floating velocity
      const initialVx = (Math.random() - 0.5) * 3.5;
      const initialVy = (Math.random() - 0.5) * 3.5;
      const initialVRot = (Math.random() - 0.5) * 1.5;

      const physicsItem: PhysicsElement = {
        el,
        origTransform: el.style.transform || '',
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
        vx: initialVx,
        vy: initialVy,
        rotation: (Math.random() - 0.5) * 8,
        vRot: initialVRot,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        lastX: 0,
        lastY: 0,
        lastTime: performance.now(),
      };

      el.style.cursor = 'grab';
      el.style.willChange = 'transform';
      items.push(physicsItem);
    });

    physicsItemsRef.current = items;

    // Attach global Mouse & Touch Drag/Toss Handlers
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const target = e.target as HTMLElement;
      const hit = items.find(item => item.el.contains(target) || item.el === target);

      if (hit) {
        hit.isDragging = true;
        hit.dragStartX = clientX - hit.x;
        hit.dragStartY = clientY - hit.y;
        hit.lastX = clientX;
        hit.lastY = clientY;
        hit.lastTime = performance.now();
        hit.vx = 0;
        hit.vy = 0;
        hit.el.style.cursor = 'grabbing';
        hit.el.style.zIndex = '99999';
        activeDragRef.current = hit;
        playBeep(750, 0.05);
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const active = activeDragRef.current;
      if (!active || !active.isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const now = performance.now();
      const dt = Math.max(1, now - active.lastTime);

      // Instantaneous toss velocity
      active.vx = ((clientX - active.lastX) / dt) * 16;
      active.vy = ((clientY - active.lastY) / dt) * 16;
      active.vRot = active.vx * 0.15;

      active.x = clientX - active.dragStartX;
      active.y = clientY - active.dragStartY;

      active.lastX = clientX;
      active.lastY = clientY;
      active.lastTime = now;
    };

    const handleMouseUp = () => {
      const active = activeDragRef.current;
      if (active) {
        active.isDragging = false;
        active.el.style.cursor = 'grab';
        active.el.style.zIndex = '';
        if (Math.abs(active.vx) > 2 || Math.abs(active.vy) > 2) {
          playBeep(920 + Math.abs(active.vx) * 20, 0.08); // Toss sound effect
        }
        activeDragRef.current = null;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    // 60FPS Physics Simulation Loop
    const updatePhysics = () => {
      items.forEach(item => {
        if (!item.isDragging) {
          // Move elements by velocity
          item.x += item.vx;
          item.y += item.vy;
          item.rotation += item.vRot;

          // Space air drag friction
          item.vx *= 0.985;
          item.vy *= 0.985;
          item.vRot *= 0.985;

          // Ambient micro zero-g drift
          item.vx += (Math.random() - 0.5) * 0.15;
          item.vy += (Math.random() - 0.5) * 0.15;

          // Viewport boundary bounces
          const bounds = 250;
          if (Math.abs(item.x) > bounds) {
            item.vx *= -0.75;
            item.x = Math.sign(item.x) * bounds;
          }
          if (Math.abs(item.y) > bounds) {
            item.vy *= -0.75;
            item.y = Math.sign(item.y) * bounds;
          }
        }

        // Apply 2D Physics Transform to element
        item.el.style.transform = `${item.origTransform} translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`;
      });

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    // Countdown Timer
    const iv = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          cancelAnimationFrame(animFrameRef.current);
          window.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          window.removeEventListener('touchstart', handleMouseDown);
          window.removeEventListener('touchmove', handleMouseMove);
          window.removeEventListener('touchend', handleMouseUp);

          // Restore Gravity: Smoothly return all elements back to original layout position
          items.forEach(item => {
            item.el.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            item.el.style.transform = item.origTransform;
            item.el.style.cursor = '';
            setTimeout(() => {
              item.el.style.transition = '';
            }, 800);
          });

          setZeroGActive(false);
          document.body.classList.remove('zero-g-mode');
          playBeep(600, 0.1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Listen for custom trigger event from Work section or Broadcast Tower
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
            className="font-mono matrix-hud"
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

      {/* ── ZERO-G INTERACTIVE PHYSICS HUD TOAST ── */}
      {zeroGActive && (
        <div
          className="font-mono zero-g-hud-toast"
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
            letterSpacing: '0.12em',
            boxShadow: '0 0 35px rgba(200, 16, 46, 0.9)',
            zIndex: 999999,
            pointerEvents: 'none',
            animation: 'pulse 0.8s infinite alternate',
          }}
        >
          ⚡ ZERO-G TOSS PHYSICS SURGE // DRAG & THROW ELEMENTS ANYWHERE! ({countdown}s)
        </div>
      )}

      {/* Zero-G Body Styles */}
      <style>{`
        body.zero-g-mode {
          overflow-x: hidden !important;
        }
      `}</style>
    </>
  );
}
