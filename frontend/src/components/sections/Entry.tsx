import React, { useEffect, useState, useRef, useCallback } from 'react';

const NAME = 'C YASHWANTH';

// Floating terminal fragments — theme-consistent signal/tech data
const FRAGMENTS = [
  'SIGNAL_STRENGTH: 98.7%',
  '> INIT PORTFOLIO',
  'BANDWIDTH: ∞',
  'LATENCY: 0.001ms',
  '> LOAD IDENTITY',
  'STATUS: TRANSMITTING',
  'TYPE: AI_ENGINEER',
  'BUILD: 2026.08',
  '> SIGNAL_ON',
  'ENCODING: UTF-8',
  'NODE: ACTIVE',
  'PROTOCOL: HTTP/3',
  '> ESTABLISHING',
  'FREQ: 440Hz',
  'CORE: PYTHON',
];

interface Fragment {
  id: number;
  text: string;
  x: number;  // % from left
  y: number;  // % from top
  vx: number;
  vy: number;
  opacity: number;
  phase: number; // 0=idle, 1=appearing, 2=visible, 3=fading
  age: number;
  lifespan: number;
}

const TERMINAL_LINES = [
  '> ESTABLISHING CONNECTION...',
  '> SIGNAL LOCKED ██████████ 100%',
  '> IDENTITY LOADED',
  '> PORTFOLIO ONLINE',
  '> SECRET: TYPE "konami" OR ↑ ↑ ↓ ↓ ← → ← → B A',
];

const Entry: React.FC = () => {
  const [lineDrawn, setLineDrawn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [objectActive, setObjectActive] = useState(false);
  const [objectClicked, setObjectClicked] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [signalBars, setSignalBars] = useState([0.4, 0.6, 0.8, 0.95, 1.0]);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const fragmentsRef = useRef<Fragment[]>([]);
  const nextId = useRef(0);

  // Boot sequence
  useEffect(() => {
    const t1 = setTimeout(() => setLineDrawn(true), 400);
    const t2 = setTimeout(() => setShowContent(true), 1000);

    // Terminal lines stagger
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, 1400 + i * 500);
    });

    // Signal bars animation
    const barInterval = setInterval(() => {
      setSignalBars([
        0.3 + Math.random() * 0.4,
        0.5 + Math.random() * 0.4,
        0.6 + Math.random() * 0.35,
        0.8 + Math.random() * 0.18,
        0.92 + Math.random() * 0.08,
      ]);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(barInterval);
    };
  }, []);

  // Mouse tracking
  const onMouseMove = useCallback((e: MouseEvent) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
    setCursorCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
  }, []);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    sec.addEventListener('mousemove', onMouseMove);
    return () => sec.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  // Floating fragments loop
  useEffect(() => {
    const spawnFragment = () => {
      const f: Fragment = {
        id: nextId.current++,
        text: FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)],
        x: 5 + Math.random() * 85,
        y: 5 + Math.random() * 85,
        vx: (Math.random() - 0.5) * 0.008,
        vy: (Math.random() - 0.5) * 0.006 - 0.003,
        opacity: 0,
        phase: 1,
        age: 0,
        lifespan: 120 + Math.random() * 180,
      };
      fragmentsRef.current = [...fragmentsRef.current, f];
      if (fragmentsRef.current.length > 10) {
        fragmentsRef.current = fragmentsRef.current.slice(-10);
      }
    };

    const spawnInterval = setInterval(spawnFragment, 1200);
    spawnFragment();

    const animate = () => {
      fragmentsRef.current = fragmentsRef.current.map(f => {
        const newAge = f.age + 1;
        let newOpacity = f.opacity;
        let newPhase = f.phase;

        if (f.phase === 1) {
          newOpacity = Math.min(1, f.opacity + 0.04);
          if (newOpacity >= 1) newPhase = 2;
        } else if (f.phase === 2) {
          if (newAge > f.lifespan) newPhase = 3;
        } else if (f.phase === 3) {
          newOpacity = Math.max(0, f.opacity - 0.03);
        }

        return {
          ...f,
          x: f.x + f.vx,
          y: f.y + f.vy,
          opacity: newOpacity,
          phase: newPhase,
          age: newAge,
        };
      }).filter(f => !(f.phase === 3 && f.opacity <= 0));

      setFragments([...fragmentsRef.current]);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(spawnInterval);
    };
  }, []);

  const dx = (mousePos.x - 0.5) * 2;
  const dy = (mousePos.y - 0.5) * 2;

  const handleObjectClick = () => {
    setObjectClicked(true);
    setTimeout(() => {
      document.getElementById('identity')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <section
      id="entry"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg)',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* CRT scanlines overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Floating fragments */}
      {fragments.map(f => (
        <div
          key={f.id}
          aria-hidden="true"
          className="font-mono"
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontSize: '9px',
            color: `rgba(200,16,46,${(f.opacity * 0.35).toFixed(2)})`,
            letterSpacing: '0.12em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 2,
            userSelect: 'none',
          }}
        >
          {f.text}
        </div>
      ))}

      {/* Background oversized chapter number */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-0.04em',
          bottom: '-0.08em',
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(220px, 30vw, 440px)',
          color: 'rgba(200,16,46,0.022)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          transform: `translate(${dx * 10}px, ${dy * 8}px)`,
          transition: 'transform 0.5s ease',
          zIndex: 1,
        }}
      >
        00
      </div>

      {/* Top-left: Terminal panel */}
      <div
        style={{
          position: 'absolute',
          top: '2.5rem',
          left: '2.5rem',
          zIndex: 6,
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.5s ease 1.2s',
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: '9px',
            color: 'rgba(200,16,46,0.3)',
            letterSpacing: '0.2em',
            marginBottom: '0.5rem',
          }}
        >
          TERMINAL
        </div>
        <div
          style={{
            background: 'rgba(200,16,46,0.03)',
            border: '1px solid rgba(200,16,46,0.1)',
            padding: '0.6rem 0.9rem',
            minWidth: '240px',
          }}
        >
          {terminalLines.map((line, i) => (
            <div
              key={i}
              className="font-mono"
              style={{
                fontSize: '9px',
                color: i === terminalLines.length - 1 ? 'var(--red)' : 'rgba(200,16,46,0.4)',
                letterSpacing: '0.06em',
                lineHeight: 1.7,
                animation: 'typeIn 0.3s ease',
              }}
            >
              {line}
              {i === terminalLines.length - 1 && terminalLines.length < TERMINAL_LINES.length && (
                <span style={{ animation: 'blink 1s infinite' }}>▋</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive signal object — top right */}
      <div
        data-cursor="explore"
        onClick={handleObjectClick}
        onMouseEnter={() => setObjectActive(true)}
        onMouseLeave={() => setObjectActive(false)}
        style={{
          position: 'absolute',
          top: '2.5rem',
          right: '2.5rem',
          zIndex: 6,
          cursor: 'pointer',
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.5s ease 1s',
        }}
      >
        {/* Label */}
        <div
          className="font-mono"
          style={{
            fontSize: '8px',
            color: 'rgba(200,16,46,0.3)',
            letterSpacing: '0.2em',
            marginBottom: '0.5rem',
            textAlign: 'right',
            opacity: objectActive ? 1 : 0.4,
            transition: 'opacity 0.2s ease',
          }}
        >
          INTERACT ↓
        </div>
        <div
          onClick={() => setObjectClicked(!objectClicked)}
          style={{
            width: objectClicked ? '90px' : objectActive ? '66px' : '50px',
            height: objectClicked ? '90px' : objectActive ? '66px' : '50px',
            border: `1px solid ${objectActive ? 'rgba(200,16,46,0.8)' : 'rgba(200,16,46,0.3)'}`,
            borderRadius: objectClicked ? '50%' : '2px',
            transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
            transform: `rotate(${objectClicked ? 45 : objectActive ? 20 : 0}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: objectActive ? '0 0 24px rgba(200,16,46,0.15)' : 'none',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '55%',
              height: '55%',
              border: '1px solid rgba(200,16,46,0.2)',
              animation: 'rotateInner 4s linear infinite',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>

      {/* Main content grid (2 columns on desktop) */}
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 3,
        }}
      >
        {/* Left column: Text & Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Signal label */}
          <div
            className="font-mono"
            style={{
              fontSize: '10px',
              color: 'rgba(200,16,46,0.35)',
              marginBottom: '1.5rem',
              letterSpacing: '0.35em',
              opacity: showContent ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            SIGNAL 00 / ENTRY
          </div>

          {/* Red line */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--red)',
              width: lineDrawn ? '75%' : '0%',
              transition: 'width 700ms cubic-bezier(0.4,0,0.2,1)',
              marginBottom: '3rem',
              boxShadow: '0 0 10px rgba(200,16,46,0.3)',
            }}
          />

          {/* Name — two parallax layers */}
          <div style={{ position: 'relative' }}>
            <h1
              className="font-bebas"
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: 'clamp(52px, 8vw, 105px)',
                color: 'var(--red)',
                lineHeight: 1,
                opacity: showContent ? 0.07 : 0,
                transform: `translate(${dx * 14}px, ${dy * 8}px)`,
                transition: 'transform 0.55s ease, opacity 0.9s ease',
                userSelect: 'none',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {NAME}
            </h1>
            <h1
              className="font-bebas"
              style={{
                fontSize: 'clamp(52px, 8vw, 105px)',
                color: 'var(--text-primary)',
                lineHeight: 1,
                transform: `translate(${dx * -4}px, ${dy * -2.5}px)`,
                transition: 'transform 0.35s ease',
                display: 'flex',
                flexWrap: 'wrap',
                willChange: 'transform',
              }}
            >
              {NAME.split('').map((letter, i) => (
                <span
                  key={i}
                  style={{
                    opacity: showContent ? 1 : 0,
                    transform: showContent ? 'translateY(0)' : 'translateY(28px)',
                    transition: `opacity 400ms ease ${i * 36}ms, transform 420ms ease ${i * 36}ms`,
                    display: 'inline-block',
                    minWidth: letter === ' ' ? '0.55em' : 'auto',
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>

          {/* Role */}
          <h2
            className="font-inter"
            style={{
              fontSize: 'clamp(16px, 2vw, 24px)',
              fontWeight: 300,
              color: 'var(--text-secondary)',
              marginTop: '1.25rem',
              opacity: showContent ? 1 : 0,
              transform: showContent
                ? `translate(${dx * -6}px, ${dy * -3.5}px)`
                : 'translateY(16px)',
              transition: `opacity 500ms ease 500ms, transform ${showContent ? '0.45s ease' : '500ms ease 500ms'}`,
              letterSpacing: '0.04em',
            }}
          >
            AI Full Stack Developer
          </h2>

          {/* Tagline */}
          <p
            className="font-mono"
            style={{
              fontSize: '12px',
              color: 'var(--red)',
              marginTop: '1.75rem',
              opacity: showContent ? 1 : 0,
              transition: 'opacity 600ms ease 900ms',
              letterSpacing: '0.06em',
            }}
          >
            Ideas, engineered into reality.
          </p>

          {/* Quick stat strip */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '2.5rem',
              opacity: showContent ? 1 : 0,
              transition: 'opacity 0.8s ease 1.8s',
            }}
          >
            {[
              { val: '1+', label: 'PROJECTS' },
              { val: '10+', label: 'TECHNOLOGIES' },
              { val: '∞', label: 'CURIOSITY' },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span
                  className="font-bebas"
                  style={{ fontSize: '26px', color: 'var(--text-primary)', lineHeight: 1 }}
                >
                  {stat.val}
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: '8px', color: 'rgba(200,16,46,0.4)', letterSpacing: '0.2em' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Blended Interactive Hero Image & HUD frame */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            opacity: showContent ? 1 : 0,
            transform: showContent ? `translate(${dx * 12}px, ${dy * 8}px)` : 'scale(0.92) translateY(20px)',
            transition: 'opacity 1s ease 0.6s, transform 0.6s ease',
          }}
        >
          {/* Ambient red backglow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,16,46,0.22) 0%, rgba(200,16,46,0.06) 55%, transparent 75%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
              transform: `scale(${imageHovered ? 1.15 : 1})`,
              transition: 'transform 0.5s ease',
            }}
          />

          {/* Concentric orbit rings behind portrait */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '340px',
              height: '340px',
              borderRadius: '50%',
              border: '1px stroke rgba(200,16,46,0.12)',
              pointerEvents: 'none',
            }}
          >
            {[340, 260].map((size, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  border: `1px ${i % 2 === 0 ? 'dashed' : 'solid'} rgba(200,16,46,${0.12 - i * 0.03})`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `orbitSpin${i} ${20 - i * 5}s linear infinite`,
                }}
              />
            ))}
          </div>

          {/* Image Container — Un-boxed, full right space coverage, transparent website background blend */}
          <div
            data-cursor="enter"
            onClick={() => document.getElementById('identity')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '500px',
              maxHeight: '75vh',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.5s ease',
              transform: imageHovered ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {/* Main Portrait Image — Seamless multi-edge mask fade to website background */}
            <img
              src="/profile.jpg"
              alt="C Yashwanth — AI Full Stack Developer"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                filter: imageHovered
                  ? 'brightness(0.85) contrast(1.15) opacity(0.92)'
                  : 'brightness(0.65) contrast(1.1) opacity(0.78)',
                transition: 'filter 0.4s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1)',
                maskImage: 'radial-gradient(ellipse 88% 88% at 50% 45%, black 35%, rgba(0,0,0,0.75) 65%, transparent 98%)',
                WebkitMaskImage: 'radial-gradient(ellipse 88% 88% at 50% 45%, black 35%, rgba(0,0,0,0.75) 65%, transparent 98%)',
                pointerEvents: 'none',
              }}
            />

            {/* Hover Tech HUD Overlay Tags */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: imageHovered ? 1 : 0,
                transition: 'opacity 0.35s ease',
              }}
            >
              {/* Tech Tag 1: Top-Left */}
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '12%',
                  left: '2%',
                  fontSize: '9px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(8,8,8,0.85)',
                  border: '1px solid rgba(200,16,46,0.5)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '3px',
                  letterSpacing: '0.12em',
                  boxShadow: '0 0 14px rgba(200,16,46,0.3)',
                  animation: imageHovered ? 'fadeInUp 0.3s ease' : 'none',
                }}
              >
                ● PYTHON · FASTAPI
              </div>

              {/* Tech Tag 2: Top-Right */}
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '18%',
                  right: '2%',
                  fontSize: '9px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(8,8,8,0.85)',
                  border: '1px solid rgba(200,16,46,0.5)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '3px',
                  letterSpacing: '0.12em',
                  boxShadow: '0 0 14px rgba(200,16,46,0.3)',
                  animation: imageHovered ? 'fadeInUp 0.4s ease' : 'none',
                }}
              >
                ● AI / LLM · GROQ
              </div>

              {/* Tech Tag 3: Bottom-Left */}
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  bottom: '18%',
                  left: '2%',
                  fontSize: '9px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(8,8,8,0.85)',
                  border: '1px solid rgba(200,16,46,0.5)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '3px',
                  letterSpacing: '0.12em',
                  boxShadow: '0 0 14px rgba(200,16,46,0.3)',
                  animation: imageHovered ? 'fadeInUp 0.45s ease' : 'none',
                }}
              >
                ● REACT · TS
              </div>

              {/* Tech Tag 4: Bottom-Right */}
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  bottom: '12%',
                  right: '2%',
                  fontSize: '9px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(8,8,8,0.85)',
                  border: '1px solid rgba(200,16,46,0.5)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '3px',
                  letterSpacing: '0.12em',
                  boxShadow: '0 0 14px rgba(200,16,46,0.3)',
                  animation: imageHovered ? 'fadeInUp 0.5s ease' : 'none',
                }}
              >
                ● POSTGRES · SUPABASE
              </div>

              {/* Center Tag: Click Action */}
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '9px',
                  color: 'var(--red)',
                  backgroundColor: 'rgba(8,8,8,0.92)',
                  border: '1px solid var(--red)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  letterSpacing: '0.15em',
                  boxShadow: '0 0 18px rgba(200,16,46,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                CLICK TO EXPLORE IDENTITY ↓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left: Signal strength bars */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '2.5rem',
          zIndex: 6,
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1s ease 2s',
        }}
      >
        <div
          className="font-mono"
          style={{ fontSize: '8px', color: 'rgba(200,16,46,0.3)', letterSpacing: '0.2em', marginBottom: '0.4rem' }}
        >
          SIGNAL STRENGTH
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px' }}>
          {signalBars.map((h, i) => (
            <div
              key={i}
              style={{
                width: '5px',
                height: `${h * 100}%`,
                backgroundColor: `rgba(200,16,46,${0.4 + i * 0.12})`,
                transition: 'height 0.8s ease',
                minHeight: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom-center: Cursor coords */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          opacity: showContent && cursorCoords.x > 0 ? 0.5 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '9px', color: 'rgba(200,16,46,0.4)', letterSpacing: '0.15em' }}
        >
          X:{cursorCoords.x.toString().padStart(4, '0')} Y:{cursorCoords.y.toString().padStart(4, '0')}
        </span>
      </div>

      {/* Bottom-right: Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 6,
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1s ease 1.5s',
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: '8px',
            color: 'var(--text-secondary)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            letterSpacing: '0.2em',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: '1px',
            height: '52px',
            backgroundColor: 'rgba(200,16,46,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '40%',
              backgroundColor: 'var(--red)',
              animation: 'scrollDrop 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes rotateInner {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitSpin0 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbitSpin1 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes scrollDrop {
          0%   { top: -40%; opacity: 1; }
          80%  { top: 100%; opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes typeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Entry;
