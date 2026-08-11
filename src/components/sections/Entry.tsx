import React, { useEffect, useState, useRef, useCallback } from 'react';
import { setBgmVolume, getBgmVolume, getRealtimeAudioData } from '../../utils/audio';

const NAME = 'YASHWANTH';

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
  '> IDENTITY LOADED & PORTFOLIO ONLINE',
  '> SHORTCUT COMMANDS & EASTER EGGS:',
  '  [KONAMI CODE] : ↑ ↑ ↓ ↓ ← → ← → B A (YashOS)',
  '  [PRESS "M"]    : MATRIX CODE RAIN MODE',
  '  [CTRL+SHIFT+G]: ZERO-G PHYSICS SURGE',
];

/* ═══════════════════════════════════════════════════════
   OPTION 2: 360° CIRCULAR CYBER-RADAR FREQUENCY RING (JARVIS / SCI-FI CORE)
═══════════════════════════════════════════════════════ */
interface RealtimeTelemetry {
  bass: number;
  mid: number;
  treble: number;
  peak: number;
}

const CircularRadarCanvas: React.FC<{
  mouseVelocity: number;
  surge: boolean;
  volume: number;
  onTelemetry: (t: RealtimeTelemetry) => void;
}> = ({ mouseVelocity, surge, volume, onTelemetry }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peaksRef = useRef<number[]>(new Array(64).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    let shockwaveR = 0;

    const render = () => {
      const w = (canvas.width = canvas.offsetWidth || 850);
      const h = (canvas.height = canvas.offsetHeight || 180);

      ctx.clearRect(0, 0, w, h);

      // Fetch 100% real-time Web Audio frequency data
      const { freqData, bass, mid, treble, peak, isPlaying } = getRealtimeAudioData();
      onTelemetry({ bass, mid, treble, peak });

      phase += 0.03 + mouseVelocity * 0.03 + (surge ? 0.08 : 0);
      const cx = w / 2;
      const cy = h / 2;

      const effectiveVol = Math.max(0.12, volume);
      const baseRadius = 38 + bass * 22 + (surge ? 15 : 0);
      const numSpikes = 64;
      const peaks = peaksRef.current;

      // ── 1. Outer Concentric Telemetry Target Orbit Rings ──
      ctx.save();
      ctx.translate(cx, cy);

      // Outer dashed orbit ring 1
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius + 45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Outer thin orbit ring 2
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius + 68, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cardinal direction ticks (N, S, E, W)
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.5)';
      ctx.lineWidth = 1.5;
      [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map(angle => {
        const r1 = baseRadius + 40;
        const r2 = baseRadius + 50;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.stroke();
      });

      // ── 2. Inner Glowing Core HUD Ring ──
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = bass > 0.6 ? 'rgba(255, 42, 75, 0.18)' : 'rgba(200, 16, 46, 0.08)';
      ctx.fill();
      ctx.strokeStyle = surge || bass > 0.65 ? '#FF2A4B' : '#C8102E';
      ctx.lineWidth = surge || bass > 0.65 ? 2.5 : 1.5;
      ctx.shadowColor = '#C8102E';
      ctx.shadowBlur = surge || bass > 0.65 ? 18 : 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Rotating inner dashed compass ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius - 8, phase * 0.5, phase * 0.5 + Math.PI * 1.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center Core Target Indicator Dot
      ctx.beginPath();
      ctx.arc(0, 0, 4 + bass * 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FF2A4B';
      ctx.shadowColor = '#FF2A4B';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── 3. 360° Polar Frequency Spikes & Hologram Peak Dots ──
      for (let i = 0; i < numSpikes; i++) {
        const angle = (i * 2 * Math.PI) / numSpikes - Math.PI / 2 + phase * 0.15;
        let rawVal = 0;

        if (isPlaying && freqData && freqData.length > 0) {
          const sampleIdx = Math.floor((i / numSpikes) * freqData.length);
          rawVal = freqData[sampleIdx] || 0;
        } else {
          // Ambient smooth breathing sine when idle
          const wave = Math.sin(i * 0.25 + phase * 1.2);
          rawVal = (Math.abs(wave) * 75 + 30) * effectiveVol;
        }

        // Calculate spike length
        let spikeLen = (rawVal / 255) * 50 * effectiveVol + (surge ? 25 : 3);
        spikeLen = Math.max(3, spikeLen);

        // Inner and Outer coordinates
        const rStart = baseRadius + 4;
        const rEnd = rStart + spikeLen;

        const x1 = Math.cos(angle) * rStart;
        const y1 = Math.sin(angle) * rStart;
        const x2 = Math.cos(angle) * rEnd;
        const y2 = Math.sin(angle) * rEnd;

        // Peak Hold Hologram Logic
        if (spikeLen >= (peaks[i] || 0)) {
          peaks[i] = spikeLen;
        } else {
          peaks[i] = Math.max(3, (peaks[i] || 0) - 1.2); // Gravity decay
        }

        // Draw Frequency Spike
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = surge || rawVal > 180 ? '#FF2A4B' : 'rgba(200, 16, 46, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Outer Hologram Peak Dot
        const rPeak = rStart + peaks[i] + 3;
        const px = Math.cos(angle) * rPeak;
        const py = Math.sin(angle) * rPeak;

        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FF2A4B';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── 4. Click Surge Shockwave Animation ──
      if (surge) {
        shockwaveR += 6;
        if (shockwaveR < 180) {
          ctx.beginPath();
          ctx.arc(0, 0, shockwaveR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 42, 75, ${1 - shockwaveR / 180})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else {
        shockwaveR = baseRadius;
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [mouseVelocity, surge, volume, onTelemetry]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '160px',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN ENTRY COMPONENT
═══════════════════════════════════════════════════════ */
const Entry: React.FC = () => {
  const [lineDrawn, setLineDrawn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [mouseVelocity, setMouseVelocity] = useState(0);
  const [surge, setSurge] = useState(false);
  const [bgmVolumeState, setBgmVolumeState] = useState(() => getBgmVolume());
  const [telemetry, setTelemetry] = useState<RealtimeTelemetry>({ bass: 0, mid: 0, treble: 0, peak: 0 });
  const [objectActive, setObjectActive] = useState(false);
  const [objectClicked, setObjectClicked] = useState(false);
  const [signalBars, setSignalBars] = useState([0.4, 0.6, 0.8, 0.95, 1.0]);
  const [fragments, setFragments] = useState<Fragment[]>([]);

  const handleTelemetry = useCallback((t: RealtimeTelemetry) => {
    setTelemetry(t);
  }, []);

  const handleVolumeChange = (val: number) => {
    const updated = setBgmVolume(val);
    setBgmVolumeState(updated);
  };

  const sectionRef = useRef<HTMLElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
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
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(barInterval);
    };
  }, []);

  // Mouse tracking & velocity calculation
  const onMouseMove = useCallback((e: MouseEvent) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    // Velocity calc
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy) / 30, 1.5);
    setMouseVelocity(speed);

    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setMousePos({ x: nx, y: ny });
    setCursorCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
  }, []);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    sec.addEventListener('mousemove', onMouseMove);
    return () => sec.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  // Click wave surge trigger
  const handleSectionClick = () => {
    setSurge(true);
    setTimeout(() => setSurge(false), 900);
  };

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

  const handleObjectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setObjectClicked(true);
    setTimeout(() => {
      document.getElementById('identity')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <section
      id="entry"
      ref={sectionRef}
      onClick={handleSectionClick}
      style={{
        backgroundColor: 'var(--bg)',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'none',
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
            background: 'rgba(12, 6, 8, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200, 16, 46, 0.4)',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            minWidth: '290px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(200, 16, 46, 0.15)',
          }}
        >
          {terminalLines.map((line, i) => {
            const isHeader = line.includes('SHORTCUT COMMANDS');
            const isShortcut = line.includes('[KONAMI') || line.includes('[PRESS') || line.includes('[CTRL');

            return (
              <div
                key={i}
                className="font-mono"
                style={{
                  fontSize: '9px',
                  color: isHeader ? '#FF2A4B' : isShortcut ? 'rgba(255,255,255,0.95)' : 'rgba(200,16,46,0.6)',
                  fontWeight: isHeader || isShortcut ? 700 : 400,
                  letterSpacing: '0.06em',
                  lineHeight: 1.8,
                  animation: 'typeIn 0.3s ease',
                  backgroundColor: isShortcut ? 'rgba(200,16,46,0.12)' : 'transparent',
                  borderLeft: isShortcut ? '2px solid var(--red)' : 'none',
                  paddingLeft: isShortcut ? '0.4rem' : '0',
                  margin: isShortcut ? '0.2rem 0' : '0',
                  borderRadius: isShortcut ? '0 3px 3px 0' : '0',
                }}
              >
                {line}
                {i === terminalLines.length - 1 && terminalLines.length < TERMINAL_LINES.length && (
                  <span style={{ animation: 'blink 1s infinite', color: 'var(--red)' }}> ▋</span>
                )}
              </div>
            );
          })}
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
          onClick={(e) => { e.stopPropagation(); setObjectClicked(!objectClicked); }}
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

      {/* ── CENTRALLY ALIGNED HERO CONTENT (NAME CENTERED) ── */}
      <div
        className="section-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 3,
          maxWidth: '1000px',
          margin: '0 auto',
          paddingTop: '2rem',
        }}
      >
        {/* Signal label */}
        <div
          className="font-mono"
          style={{
            fontSize: '11px',
            color: 'rgba(200,16,46,0.5)',
            marginBottom: '1.25rem',
            letterSpacing: '0.4em',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          SIGNAL 00 / BROADCAST HUB
        </div>

        {/* Centered Red Divider line */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--red)',
            width: lineDrawn ? '60%' : '0%',
            transition: 'width 700ms cubic-bezier(0.4,0,0.2,1)',
            marginBottom: '2rem',
            boxShadow: '0 0 12px rgba(200,16,46,0.4)',
          }}
        />

        {/* Centered Name — two parallax layers */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
          <h1
            className="font-share-tech"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              fontSize: 'clamp(36px, 7vw, 96px)',
              fontWeight: 400,
              color: 'var(--red)',
              lineHeight: 1.0,
              opacity: showContent ? 0.12 : 0,
              transform: `translate(${dx * 14}px, ${dy * 8}px)`,
              transition: 'transform 0.55s ease, opacity 0.9s ease',
              userSelect: 'none',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              letterSpacing: '0.12em',
            }}
          >
            {NAME}
          </h1>
          <h1
            className="font-share-tech"
            style={{
              fontSize: 'clamp(36px, 7vw, 96px)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              lineHeight: 1.0,
              transform: `translate(${dx * -4}px, ${dy * -2.5}px)`,
              transition: 'transform 0.35s ease',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              willChange: 'transform',
              letterSpacing: '0.12em',
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
                  minWidth: letter === ' ' ? '0.4em' : 'auto',
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* ── REALTIME 360° CIRCULAR CYBER-RADAR FREQUENCY SPECTRUM CANVAS ── */}
        <div style={{
          width: '100%',
          maxWidth: '850px',
          margin: '0.5rem 0 1.25rem 0',
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1s ease 0.6s',
          position: 'relative',
        }}>
          <CircularRadarCanvas
            mouseVelocity={mouseVelocity}
            surge={surge}
            volume={bgmVolumeState}
            onTelemetry={handleTelemetry}
          />

          {/* Realtime 64-Band Spectrum Telemetry HUD Strip */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(10,5,5,0.88)',
            border: `1px solid ${telemetry.bass > 0.65 ? '#FF2A4B' : 'rgba(200,16,46,0.3)'}`,
            borderRadius: '4px',
            marginTop: '-0.5rem',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: telemetry.bass > 0.65 ? '0 0 20px rgba(200,16,46,0.4)' : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}>
            <div className="font-mono" style={{ fontSize: '9px', color: 'var(--red)', letterSpacing: '0.12em', display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: surge || telemetry.bass > 0.6 ? '#FF2A4B' : '#00FF66', boxShadow: '0 0 8px #00FF66' }} />
              BASS:{Math.round(telemetry.bass * 100)}% · MID:{Math.round(telemetry.mid * 100)}% · TRBL:{Math.round(telemetry.treble * 100)}%
            </div>

            {/* Interactive Amplitude & BGM Volume Slider */}
            <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '9px', color: 'rgba(237,235,230,0.85)' }}>
              <span>AMPLITUDE / BGM VOL:</span>
              <button
                onClick={() => handleVolumeChange(Math.max(0, bgmVolumeState - 0.1))}
                style={{ background: 'rgba(200,16,46,0.2)', border: '1px solid var(--red)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '2px', cursor: 'pointer', fontSize: '10px' }}
              >-</button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={bgmVolumeState}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                style={{
                  width: '110px',
                  accentColor: 'var(--red)',
                  cursor: 'pointer',
                }}
              />
              <button
                onClick={() => handleVolumeChange(Math.min(1, bgmVolumeState + 0.1))}
                style={{ background: 'rgba(200,16,46,0.2)', border: '1px solid var(--red)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '2px', cursor: 'pointer', fontSize: '10px' }}
              >+</button>
              <span style={{ color: 'var(--red)', fontWeight: 700, minWidth: '36px' }}>
                {Math.round(bgmVolumeState * 100)}%
              </span>
            </div>

            <div className="font-mono" style={{ fontSize: '8px', color: 'rgba(200,16,46,0.6)', letterSpacing: '0.12em' }}>
              CLICK CANVAS TO SURGE ↵
            </div>
          </div>
        </div>

        {/* Role */}
        <h2
          className="font-inter"
          style={{
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontWeight: 300,
            color: 'var(--text-secondary)',
            margin: '0.25rem 0 0 0',
            opacity: showContent ? 1 : 0,
            transform: showContent ? `translate(${dx * -4}px, ${dy * -2}px)` : 'translateY(16px)',
            transition: `opacity 500ms ease 500ms, transform ${showContent ? '0.45s ease' : '500ms ease 500ms'}`,
            letterSpacing: '0.06em',
          }}
        >
          AI Full Stack Developer
        </h2>

        {/* Tagline */}
        <p
          className="font-mono"
          style={{
            fontSize: '13px',
            color: 'var(--red)',
            marginTop: '1.25rem',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 600ms ease 900ms',
            letterSpacing: '0.1em',
          }}
        >
          Ideas, engineered into reality.
        </p>

        {/* Quick stat strip */}
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '2.5rem',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.8s ease 1.5s',
          }}
        >
          {[
            { val: '2+', label: 'PROJECTS SHIPPED' },
            { val: '15+', label: 'TECHNOLOGIES' },
            { val: '∞', label: 'CURIOSITY' },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <span
                className="font-bebas"
                style={{ fontSize: '32px', color: 'var(--text-primary)', lineHeight: 1 }}
              >
                {stat.val}
              </span>
              <span
                className="font-mono"
                style={{ fontSize: '8.5px', color: 'rgba(200,16,46,0.5)', letterSpacing: '0.2em' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
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
