import { useEffect, useRef } from 'react';

export type WallpaperMode = 'signal_mesh' | 'matrix_rain' | 'cyber_grid' | 'crt_lines';

const MATRIX_CHARS = '0123456789ABCDEFFASTAPIPYTHONREACTRAGGROQLLAMA';

export default function MatrixWallpaperCanvas({ mode }: { mode: WallpaperMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode !== 'matrix_rain' && mode !== 'cyber_grid') return;

    const canvas = canvasRef.current;
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

    // Matrix rain setup
    const fontSize = 14;
    const columns = Math.floor(w / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Cyber grid setup
    let gridOffset = 0;

    const render = () => {
      if (mode === 'matrix_rain') {
        ctx.fillStyle = 'rgba(8, 10, 15, 0.08)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#C8102E'; // Crimson red matrix rain
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Random brighter lead character
          if (Math.random() > 0.85) {
            ctx.fillStyle = '#FF4D6D';
          } else {
            ctx.fillStyle = 'rgba(200, 16, 46, 0.75)';
          }

          ctx.fillText(text, x, y);

          if (y > h && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else if (mode === 'cyber_grid') {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(200, 16, 46, 0.18)';
        ctx.lineWidth = 1;

        gridOffset = (gridOffset + 0.8) % 40;

        // Vertical lines
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }

        // Moving horizontal lines
        for (let y = gridOffset; y < h; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  if (mode === 'signal_mesh') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(200, 16, 46, 0.18) 0%, rgba(10, 13, 20, 0.95) 75%)',
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (mode === 'crt_lines') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0a0a0e',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(200,16,46,0.08), rgba(200,16,46,0.08) 2px, transparent 2px, transparent 5px)',
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
