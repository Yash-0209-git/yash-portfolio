import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  ox: number; // origin x
  oy: number; // origin y
  vx: number;
  vy: number;
}

const GRID_COLS = 24;
const GRID_ROWS = 16;
const PARTICLE_COUNT = 40;
const CURSOR_RADIUS = 180;
const DISTORT_STRENGTH = 18;
const RETURN_FORCE = 0.06;
const DAMPING = 0.82;

export default function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const scanY = useRef(0);
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      buildGrid();
    };

    const buildGrid = () => {
      const w = canvas.width;
      const h = canvas.height;
      const pts: Point[] = [];

      // Grid intersection points
      for (let col = 0; col <= GRID_COLS; col++) {
        for (let row = 0; row <= GRID_ROWS * (h / window.innerHeight); row++) {
          const ox = (col / GRID_COLS) * w;
          const oy = (row / (GRID_ROWS * (h / window.innerHeight))) * h;
          pts.push({ x: ox, y: oy, ox, oy, vx: 0, vy: 0 });
        }
      }

      // Floating particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ox = Math.random() * w;
        const oy = Math.random() * h;
        pts.push({ x: ox, y: oy, ox, oy, vx: 0, vy: 0 });
      }

      pointsRef.current = pts;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const rowCount = Math.round(GRID_ROWS * (h / window.innerHeight));
      const gridCols = GRID_COLS;
      const gridRows = rowCount;
      const totalGrid = (gridCols + 1) * (gridRows + 1);

      // Update physics for all points
      const pts = pointsRef.current;
      for (const p of pts) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_RADIUS && dist > 0) {
          const force = (1 - dist / CURSOR_RADIUS) * DISTORT_STRENGTH;
          p.vx -= (dx / dist) * force * 0.12;
          p.vy -= (dy / dist) * force * 0.12;
        }

        // Spring return
        p.vx += (p.ox - p.x) * RETURN_FORCE;
        p.vy += (p.oy - p.y) * RETURN_FORCE;

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw grid lines (horizontal)
      for (let row = 0; row <= gridRows; row++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200, 16, 46, 0.09)';
        ctx.lineWidth = 0.5;
        for (let col = 0; col <= gridCols; col++) {
          const idx = col * (gridRows + 1) + row;
          const p = pts[idx];
          if (!p) continue;
          if (col === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Draw grid lines (vertical)
      for (let col = 0; col <= gridCols; col++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200, 16, 46, 0.09)';
        ctx.lineWidth = 0.5;
        for (let row = 0; row <= gridRows; row++) {
          const idx = col * (gridRows + 1) + row;
          const p = pts[idx];
          if (!p) continue;
          if (row === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Draw intersection dots
      for (let i = 0; i < totalGrid; i++) {
        const p = pts[i];
        if (!p) continue;
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = dist < CURSOR_RADIUS ? 0.22 + (1 - dist / CURSOR_RADIUS) * 0.3 : 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 16, 46, ${alpha})`;
        ctx.fill();
      }

      // Draw floating particles
      for (let i = totalGrid; i < pts.length; i++) {
        const p = pts[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 16, 46, 0.18)';
        ctx.fill();
      }

      // Scan line (more visible on dark bg)
      scanY.current = (scanY.current + 0.4) % h;
      const grad = ctx.createLinearGradient(0, scanY.current - 80, 0, scanY.current + 80);
      grad.addColorStop(0, 'rgba(200, 16, 46, 0)');
      grad.addColorStop(0.5, 'rgba(200, 16, 46, 0.04)');
      grad.addColorStop(1, 'rgba(200, 16, 46, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY.current - 80, w, 160);

      // Cursor glow (brighter on dark bg)
      if (mx > 0) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, CURSOR_RADIUS * 0.8);
        glow.addColorStop(0, 'rgba(200, 16, 46, 0.07)');
        glow.addColorStop(1, 'rgba(200, 16, 46, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(mx - CURSOR_RADIUS, my - CURSOR_RADIUS, CURSOR_RADIUS * 2, CURSOR_RADIUS * 2);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', resize);

    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
}
