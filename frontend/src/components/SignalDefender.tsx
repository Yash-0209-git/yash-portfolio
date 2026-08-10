import { useEffect, useState, useRef } from 'react';
import { playBeep, playTransmissionSound } from '../utils/audio';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  label: string;
  points: number;
  isBug: boolean;
  color: string;
}

const GOOD_ITEMS = [
  { label: 'PYTHON_CORE', points: 20, color: '#60a5fa' },
  { label: 'FASTAPI_API', points: 25, color: '#34d399' },
  { label: 'REACT_UI', points: 15, color: '#a78bfa' },
  { label: 'GROQ_AI', points: 40, color: '#f59e0b' },
  { label: 'CERTIFICATE', points: 50, color: '#C8102E' },
  { label: 'LEESCULPT', points: 100, color: '#ec4899' },
];

const BAD_ITEMS = [
  { label: 'BUG: 404', points: 0, color: '#ef4444' },
  { label: 'NULL_POINTER', points: 0, color: '#ef4444' },
  { label: 'SYNTAX_ERR', points: 0, color: '#ef4444' },
];

export default function SignalDefender({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('signal_defender_highscore') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [items, setItems] = useState<FallingItem[]>([]);

  // Paddle state (center X)
  const paddleXRef = useRef(window.innerWidth / 2);
  const [paddleX, setPaddleX] = useState(window.innerWidth / 2);

  const itemsRef = useRef<FallingItem[]>([]);
  const nextId = useRef(1);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const animationFrameRef = useRef(0);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const PADDLE_WIDTH = 140;
  const PADDLE_HEIGHT = 18;
  const PADDLE_Y = window.innerHeight - 90;

  useEffect(() => {
    playTransmissionSound();

    // Keyboard listeners
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === 'Escape') onClose();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };

    // Mouse drag support
    const onMouseMove = (e: MouseEvent) => {
      paddleXRef.current = Math.max(PADDLE_WIDTH / 2, Math.min(window.innerWidth - PADDLE_WIDTH / 2, e.clientX));
      setPaddleX(paddleXRef.current);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);

    // Spawn falling items
    const spawnItem = () => {
      if (gameOver) return;
      const isBug = Math.random() < 0.25; // 25% chance of bug
      const pool = isBug ? BAD_ITEMS : GOOD_ITEMS;
      const template = pool[Math.floor(Math.random() * pool.length)];

      const newItem: FallingItem = {
        id: nextId.current++,
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: -30,
        speed: Math.random() * 1.5 + 2.2,
        label: template.label,
        points: template.points,
        isBug,
        color: template.color,
      };

      itemsRef.current.push(newItem);
      setItems([...itemsRef.current]);
    };

    // Immediate initial spawn
    spawnItem();
    spawnItem();

    spawnTimerRef.current = setInterval(spawnItem, 750);

    // Game loop
    let currentLives = 3;
    let currentScore = 0;

    const updateGame = () => {
      const speed = 16;
      if (keysRef.current.left) {
        paddleXRef.current = Math.max(PADDLE_WIDTH / 2, paddleXRef.current - speed);
        setPaddleX(paddleXRef.current);
      }
      if (keysRef.current.right) {
        paddleXRef.current = Math.min(window.innerWidth - PADDLE_WIDTH / 2, paddleXRef.current + speed);
        setPaddleX(paddleXRef.current);
      }

      const pLeft = paddleXRef.current - PADDLE_WIDTH / 2;
      const pRight = paddleXRef.current + PADDLE_WIDTH / 2;

      itemsRef.current = itemsRef.current.filter(item => {
        item.y += item.speed;

        // Catch collision check
        if (item.y >= PADDLE_Y - 20 && item.y <= PADDLE_Y + PADDLE_HEIGHT + 15) {
          if (item.x >= pLeft - 25 && item.x <= pRight + 25) {
            if (item.isBug) {
              playBeep(220, 0.25, 0.1);
              currentLives -= 1;
              setLives(currentLives);
              if (currentLives <= 0) {
                setGameOver(true);
              }
            } else {
              playBeep(650 + item.points * 3, 0.05);
              currentScore += item.points;
              setScore(currentScore);
              if (currentScore > highScore) {
                setHighScore(currentScore);
                localStorage.setItem('signal_defender_highscore', String(currentScore));
              }
            }
            return false; // Caught & removed
          }
        }

        // Remove off-screen items
        if (item.y > window.innerHeight + 40) {
          return false;
        }

        return true;
      });

      setItems([...itemsRef.current]);

      if (currentLives > 0) {
        animationFrameRef.current = requestAnimationFrame(updateGame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameOver, highScore, onClose]);

  const handleRestart = () => {
    itemsRef.current = [];
    setItems([]);
    setScore(0);
    setLives(3);
    setGameOver(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8,8,8,0.96)',
        zIndex: 99999,
        fontFamily: 'JetBrains Mono, monospace',
        userSelect: 'none',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Red CRT Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(200,16,46,0.05) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Telemetry Header */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '2rem',
          right: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(200,16,46,0.3)',
          paddingBottom: '1rem',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--red)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em' }}>
            ● SIGNAL CATCHER // ARCADE MODE
          </span>
          <span style={{ color: 'rgba(237,235,230,0.6)', fontSize: '11px' }}>
            SCORE: <strong style={{ color: 'white' }}>{score}</strong>
          </span>
          <span style={{ color: 'rgba(200,16,46,0.6)', fontSize: '11px' }}>
            HIGH SCORE: <strong style={{ color: 'var(--red)' }}>{highScore}</strong>
          </span>
          <span style={{ color: 'white', fontSize: '12px' }}>
            LIVES: <span style={{ color: 'var(--red)' }}>{'♥'.repeat(Math.max(0, lives))}</span>
          </span>
        </div>

        <button
          onClick={onClose}
          data-cursor="pointer"
          style={{
            background: 'none',
            border: '1px solid rgba(200,16,46,0.4)',
            color: 'white',
            fontSize: '10px',
            padding: '0.4rem 0.8rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
        >
          EXIT GAME [ESC] ×
        </button>
      </div>

      {/* Falling Signal Nodes */}
      {!gameOver &&
        items.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: item.y,
              left: item.x,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(12,12,12,0.92)',
              border: `1.5px solid ${item.color}`,
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
              color: 'white',
              fontSize: '11px',
              boxShadow: `0 0 14px ${item.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <span>{item.isBug ? '👾' : '⚡'}</span>
            <span>{item.label}</span>
            {!item.isBug && (
              <span style={{ fontSize: '9px', color: item.color, marginLeft: '0.2rem' }}>
                +{item.points}
              </span>
            )}
          </div>
        ))}

      {/* Player Defender Catcher Paddle */}
      {!gameOver && (
        <div
          style={{
            position: 'absolute',
            top: PADDLE_Y,
            left: paddleX,
            transform: 'translateX(-50%)',
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            backgroundColor: 'var(--red)',
            borderRadius: '6px',
            boxShadow: '0 0 25px var(--red), 0 0 45px rgba(200,16,46,0.6)',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 8,
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '9px',
              color: 'white',
              fontWeight: 700,
              letterSpacing: '0.15em',
            }}
          >
            [ CATCHER ]
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(12,12,12,0.95)',
            border: '1px solid var(--red)',
            padding: '3rem 4rem',
            borderRadius: '8px',
            boxShadow: '0 0 50px rgba(200,16,46,0.3)',
            animation: 'fadeIn 0.3s ease',
            zIndex: 20,
          }}
        >
          <h2 className="font-bebas" style={{ fontSize: '64px', color: 'var(--red)', margin: 0, lineHeight: 1 }}>
            TRANSMISSION OVER!
          </h2>
          <p style={{ color: 'rgba(237,235,230,0.7)', fontSize: '14px', margin: 0 }}>
            Caught corrupt signals. Final Score: <strong style={{ color: 'white' }}>{score}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleRestart}
              data-cursor="pointer"
              style={{
                backgroundColor: 'var(--red)',
                border: 'none',
                color: 'white',
                padding: '0.6rem 1.4rem',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              PLAY AGAIN 🔄
            </button>
            <button
              onClick={onClose}
              data-cursor="pointer"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.6rem 1.4rem',
                fontSize: '11px',
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              RETURN TO PORTFOLIO
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls Legend */}
      {!gameOver && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: 0,
            right: 0,
            color: 'rgba(237,235,230,0.4)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <span>← / → OR A / D KEYS TO MOVE CATCHER</span>
          <span>OR GLIDE MOUSE LEFT / RIGHT</span>
        </div>
      )}
    </div>
  );
}
