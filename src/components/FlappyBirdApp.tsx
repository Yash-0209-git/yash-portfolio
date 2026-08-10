import { useEffect, useState, useRef } from 'react';
import { playBeep } from '../utils/audio';

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export default function FlappyBirdApp({ onClose }: { onClose?: () => void }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappy_signal_highscore') || '0');
  });
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game physics state
  const birdY = useRef(200);
  const birdVelocity = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const frameCount = useRef(0);
  const scoreRef = useRef(0);
  const animationFrameRef = useRef(0);

  const GRAVITY = 0.42;
  const JUMP_STRENGTH = -7.5;
  const PIPE_SPEED = 2.2;
  const PIPE_GAP = 120;
  const PIPE_WIDTH = 52;
  const CANVAS_WIDTH = 340;
  const CANVAS_HEIGHT = 440;

  const jump = () => {
    if (gameState === 'start') {
      setGameState('playing');
      birdY.current = 200;
      birdVelocity.current = JUMP_STRENGTH;
      pipes.current = [];
      scoreRef.current = 0;
      setScore(0);
    } else if (gameState === 'playing') {
      birdVelocity.current = JUMP_STRENGTH;
      playBeep(700, 0.05);
    } else if (gameState === 'gameover') {
      restart();
    }
  };

  const restart = () => {
    birdY.current = 200;
    birdVelocity.current = JUMP_STRENGTH;
    pipes.current = [];
    scoreRef.current = 0;
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const gameLoop = () => {
      if (!isRunning) return;

      // Clear Canvas
      ctx.fillStyle = '#0f141d';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid Lines (Cyberpunk Background)
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }

      if (gameState === 'playing') {
        // Physics update
        birdVelocity.current += GRAVITY;
        birdY.current += birdVelocity.current;

        // Spawn Pipes
        frameCount.current++;
        if (frameCount.current % 90 === 0) {
          const minPipe = 40;
          const maxPipe = CANVAS_HEIGHT - PIPE_GAP - minPipe - 40;
          const topH = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
          pipes.current.push({
            x: CANVAS_WIDTH,
            topHeight: topH,
            bottomHeight: CANVAS_HEIGHT - topH - PIPE_GAP,
            passed: false,
          });
        }

        // Move Pipes & Check Collisions
        pipes.current.forEach(pipe => {
          pipe.x -= PIPE_SPEED;

          // Score Check
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 60) {
            pipe.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playBeep(900, 0.06);

            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
              localStorage.setItem('flappy_signal_highscore', String(scoreRef.current));
            }
          }

          // Pipe Collision Check (Bird X is fixed at 60px, radius ~12px)
          const birdX = 60;
          const birdR = 11;
          if (
            birdX + birdR > pipe.x &&
            birdX - birdR < pipe.x + PIPE_WIDTH &&
            (birdY.current - birdR < pipe.topHeight || birdY.current + birdR > CANVAS_HEIGHT - pipe.bottomHeight)
          ) {
            playBeep(200, 0.2);
            setGameState('gameover');
          }
        });

        // Remove Offscreen Pipes
        pipes.current = pipes.current.filter(p => p.x + PIPE_WIDTH > 0);

        // Ground / Ceiling Collision
        if (birdY.current + 12 >= CANVAS_HEIGHT - 20 || birdY.current - 12 <= 0) {
          playBeep(200, 0.2);
          setGameState('gameover');
        }
      }

      // Draw Pipes
      pipes.current.forEach(pipe => {
        // Top Pipe
        ctx.fillStyle = '#C8102E';
        ctx.shadowColor = '#C8102E';
        ctx.shadowBlur = 8;
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

        // Bottom Pipe
        ctx.fillRect(pipe.x, CANVAS_HEIGHT - pipe.bottomHeight, PIPE_WIDTH, pipe.bottomHeight);
        ctx.shadowBlur = 0;
      });

      // Draw Ground
      ctx.fillStyle = '#181e2b';
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
      ctx.fillStyle = 'var(--red)';
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 2);

      // Draw Bird (Neon Flappy Signal)
      ctx.save();
      ctx.translate(60, birdY.current);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdVelocity.current * 0.06));
      ctx.rotate(angle);

      // Bird Body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // Bird Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(4, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(5, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Bird Beak
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(16, 2);
      ctx.lineTo(8, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // UI Overlay Text
      if (gameState === 'start') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 16px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FLAPPY BIRD // YASH OS', CANVAS_WIDTH / 2, 180);
        ctx.fillStyle = 'var(--red)';
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.fillText('CLICK OR SPACEBAR TO FLAP', CANVAS_WIDTH / 2, 220);
      } else if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = 'var(--red)';
        ctx.font = '700 20px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', CANVAS_WIDTH / 2, 170);
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px JetBrains Mono, monospace';
        ctx.fillText(`SCORE: ${scoreRef.current}`, CANVAS_WIDTH / 2, 210);
        ctx.fillText(`HIGH SCORE: ${highScore}`, CANVAS_WIDTH / 2, 235);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText('CLICK OR PRESS SPACE TO RETRY', CANVAS_WIDTH / 2, 285);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, highScore]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '340px', fontSize: '12px', color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>
        <span>SCORE: <strong style={{ color: 'var(--red)' }}>{score}</strong></span>
        <span>BEST: <strong style={{ color: 'var(--red)' }}>{highScore}</strong></span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={jump}
        data-cursor="pointer"
        style={{
          borderRadius: '6px',
          border: '1px solid var(--red)',
          boxShadow: '0 0 20px rgba(200,16,46,0.3)',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
