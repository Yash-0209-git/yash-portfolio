import React, { useEffect, useState, useRef } from 'react';
import { playBeep, playTransmissionSound } from '../utils/audio';

interface BugNode {
  id: number;
  x: number;
  y: number;
  speed: number;
  label: string;
  points: number;
  radius: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  alpha: number;
}

const BUG_TYPES = [
  { label: '404_NOT_FOUND', points: 10, radius: 24 },
  { label: 'NULL_POINTER', points: 20, radius: 20 },
  { label: 'MEMORY_LEAK', points: 30, radius: 18 },
  { label: 'SYNTAX_ERROR', points: 15, radius: 22 },
  { label: 'RACE_CONDITION', points: 50, radius: 16 },
];

export default function SignalDefender({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('signal_defender_highscore') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [bugs, setBugs] = useState<BugNode[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  const bugsRef = useRef<BugNode[]>([]);
  const nextId = useRef(1);
  const animationFrameRef = useRef(0);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    playTransmissionSound();

    const spawnBug = () => {
      if (gameOver) return;
      const type = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
      const newBug: BugNode = {
        id: nextId.current++,
        x: Math.random() * (window.innerWidth - 120) + 60,
        y: -40,
        speed: Math.random() * 1.5 + 1.2,
        label: type.label,
        points: type.points,
        radius: type.radius,
      };
      bugsRef.current.push(newBug);
      setBugs([...bugsRef.current]);
    };

    spawnTimerRef.current = setInterval(spawnBug, 900);

    // Main game loop
    const updateGame = () => {
      let breach = false;

      bugsRef.current = bugsRef.current
        .map(b => ({ ...b, y: b.y + b.speed }))
        .filter(b => {
          if (b.y > window.innerHeight - 80) {
            breach = true;
            return false;
          }
          return true;
        });

      if (breach && !gameOver) {
        playBeep(200, 0.3, 0.1);
        setGameOver(true);
      } else {
        setBugs([...bugsRef.current]);
      }

      setExplosions(prev =>
        prev.map(e => ({ ...e, alpha: e.alpha - 0.05 })).filter(e => e.alpha > 0)
      );

      if (!breach) {
        animationFrameRef.current = requestAnimationFrame(updateGame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameOver]);

  const handleShootBug = (e: React.MouseEvent, bugId: number, points: number) => {
    e.stopPropagation();
    playBeep(850, 0.06);

    const hitBug = bugsRef.current.find(b => b.id === bugId);
    if (hitBug) {
      setExplosions(prev => [
        ...prev,
        { id: Math.random(), x: hitBug.x, y: hitBug.y, alpha: 1 },
      ]);
    }

    bugsRef.current = bugsRef.current.filter(b => b.id !== bugId);
    setBugs([...bugsRef.current]);

    setScore(prev => {
      const next = prev + points;
      if (next > highScore) {
        setHighScore(next);
        localStorage.setItem('signal_defender_highscore', String(next));
      }
      return next;
    });
  };

  const handleRestart = () => {
    bugsRef.current = [];
    setBugs([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8,8,8,0.95)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        userSelect: 'none',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Red CRT Scanline Effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(200,16,46,0.06) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Telemetry Header */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
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
          <span style={{ color: 'var(--red)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em' }}>
            ● SIGNAL DEFENDER // ARCADE MODE
          </span>
          <span style={{ color: 'rgba(237,235,230,0.6)', fontSize: '11px' }}>
            SCORE: <strong style={{ color: 'white' }}>{score}</strong>
          </span>
          <span style={{ color: 'rgba(200,16,46,0.6)', fontSize: '11px' }}>
            HIGH SCORE: <strong style={{ color: 'var(--red)' }}>{highScore}</strong>
          </span>
        </div>

        <button
          onClick={onClose}
          data-cursor="pointer"
          style={{
            background: 'none',
            border: '1px solid rgba(200,16,46,0.4)',
            color: 'white',
            fontSize: '11px',
            padding: '0.4rem 0.8rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
        >
          EXIT GAME [ESC] ×
        </button>
      </div>

      {/* Explosions */}
      {explosions.map(exp => (
        <div
          key={exp.id}
          style={{
            position: 'absolute',
            top: exp.y,
            left: exp.x,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid var(--red)',
            boxShadow: '0 0 20px var(--red)',
            transform: 'translate(-50%, -50%) scale(1.5)',
            opacity: exp.alpha,
            pointerEvents: 'none',
            transition: 'opacity 0.2s linear',
          }}
        />
      ))}

      {/* Falling Bug Nodes */}
      {!gameOver &&
        bugs.map(bug => (
          <div
            key={bug.id}
            data-cursor="view"
            onClick={e => handleShootBug(e, bug.id, bug.points)}
            style={{
              position: 'absolute',
              top: bug.y,
              left: bug.x,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(200,16,46,0.15)',
              border: '1px solid var(--red)',
              borderRadius: '4px',
              padding: '0.4rem 0.75rem',
              color: 'var(--text-primary)',
              fontSize: '10px',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(200,16,46,0.4)',
              transition: 'transform 0.05s linear',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span style={{ color: 'var(--red)' }}>👾</span>
            <span>{bug.label}</span>
            <span style={{ fontSize: '8px', color: 'rgba(200,16,46,0.6)', marginLeft: '0.2rem' }}>
              +{bug.points}
            </span>
          </div>
        ))}

      {/* Game Over Screen */}
      {gameOver && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(12,12,12,0.9)',
            border: '1px solid var(--red)',
            padding: '3rem 4rem',
            borderRadius: '8px',
            boxShadow: '0 0 40px rgba(200,16,46,0.3)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <h2 className="font-bebas" style={{ fontSize: '64px', color: 'var(--red)', margin: 0, lineHeight: 1 }}>
            SYSTEM BREACHED!
          </h2>
          <p style={{ color: 'rgba(237,235,230,0.7)', fontSize: '13px', margin: 0 }}>
            A bug breached defence parameter. Final Score: <strong>{score}</strong>
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
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              REBOOT DEFENCE 🔄
            </button>
            <button
              onClick={onClose}
              data-cursor="pointer"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.6rem 1.4rem',
                fontSize: '12px',
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              RETURN TO PORTFOLIO
            </button>
          </div>
        </div>
      )}

      {/* Bottom instructions */}
      {!gameOver && (
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            color: 'rgba(237,235,230,0.35)',
            fontSize: '10px',
            letterSpacing: '0.2em',
          }}
        >
          CLICK FLOATING BUG NODES TO BLAST THEM WITH LASER CURSOR
        </div>
      )}
    </div>
  );
}
