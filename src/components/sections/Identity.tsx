import React, { useEffect, useState, useRef } from 'react';
import { fetchAbout } from '../../api';
import { About } from '../../types';
import { useReveal } from '../../hooks/useReveal';
import { playBeep } from '../../utils/audio';

const FULL_BIO =
  'An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.';

const TRAITS = [
  { label: 'BACKEND ARCHITECTURE', level: 5, max: 5 },
  { label: 'AI & LLM INTEGRATION', level: 5, max: 5 },
  { label: 'FRONTEND ENGINEERING', level: 4, max: 5 },
  { label: 'SYSTEM DESIGN',        level: 4, max: 5 },
  { label: 'PROBLEM SOLVING',      level: 5, max: 5 },
];

const PILLARS = [
  {
    num: '01', title: 'BACKEND ARCHITECTURE', subtitle: 'FastAPI & Async Systems',
    desc: 'Low-latency REST APIs, stateless JWT auth pipelines, and resilient database queries with PostgreSQL & SQLAlchemy.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy'],
  },
  {
    num: '02', title: 'AI & LLM INTEGRATION', subtitle: 'Intelligent Automation',
    desc: 'Integrating Groq API, Gemini LLM models, and RAG pipelines into full-stack applications with real-time AI guidance.',
    tech: ['Groq API', 'Google Gemini', 'RAG', 'AI Workflows'],
  },
  {
    num: '03', title: 'EDITORIAL UI', subtitle: 'React & Interactive Systems',
    desc: 'Brutalist, dynamic interfaces with smooth physics, custom cursors, and responsive state synchronization.',
    tech: ['React 18', 'TypeScript', 'Vanilla CSS', 'Vite'],
  },
];

/* ═══════════════════════════════════════════════════════
   RADAR PHOTO DISPLAY (WITH INTERACTIVE HOVER & TILT)
═══════════════════════════════════════════════════════ */
const RadarDisplay: React.FC<{ src: string; scanning: boolean }> = ({ src, scanning }) => {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 20, y: -y * 20 });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="view"
      style={{
        position: 'relative',
        width: 290,
        height: 290,
        flexShrink: 0,
        cursor: 'pointer',
        perspective: 1000,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${hovered ? 1.05 : 1})`,
          transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease',
        }}
      >
        {/* Outer glow aura */}
        <div style={{
          position: 'absolute', inset: -14,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(200,16,46,${hovered ? 0.35 : 0.15}) 0%, transparent 70%)`,
          animation: 'radarAuraPulse 3s ease-in-out infinite',
          transition: 'background 0.3s ease',
          pointerEvents: 'none',
        }} />

        {/* Outermost ring — rotating dashed */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: `1px dashed ${hovered ? 'rgba(200,16,46,0.6)' : 'rgba(200,16,46,0.25)'}`,
          transition: 'border-color 0.3s ease',
        }} />

        {/* Coordinate tick marks at cardinal points */}
        {[0, 90, 180, 270].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const r = 143;
          const cx = 145 + r * Math.sin(rad);
          const cy = 145 - r * Math.cos(rad);
          return (
            <div key={deg} style={{
              position: 'absolute',
              left: cx - 2, top: cy - 2,
              width: hovered ? 7 : 5,
              height: hovered ? 7 : 5,
              borderRadius: '50%',
              backgroundColor: hovered ? '#C8102E' : 'rgba(200,16,46,0.5)',
              boxShadow: hovered ? '0 0 10px #C8102E' : 'none',
              transition: 'all 0.3s ease',
            }} />
          );
        })}

        {/* Radar sweep beam */}
        <div style={{
          position: 'absolute', inset: 8,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg at 50% 50%, rgba(200,16,46,${hovered ? 0.45 : 0.22}) 0deg, transparent 55deg, transparent 360deg)`,
          animation: `radarSweep ${hovered ? '1.5s' : '3s'} linear infinite`,
          animationPlayState: scanning || hovered ? 'running' : 'paused',
        }} />

        {/* Middle ring — thicker, crisp */}
        <div style={{
          position: 'absolute', inset: 16,
          borderRadius: '50%',
          border: `1.5px solid ${hovered ? 'rgba(200,16,46,0.7)' : 'rgba(200,16,46,0.35)'}`,
          transition: 'border-color 0.3s ease',
        }} />

        {/* Cross-hair lines */}
        <div style={{ position:'absolute', left:'50%', top:8, bottom:8, width:1, background: hovered ? 'rgba(200,16,46,0.4)' : 'rgba(200,16,46,0.15)', transform:'translateX(-50%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'50%', left:8, right:8, height:1, background: hovered ? 'rgba(200,16,46,0.4)' : 'rgba(200,16,46,0.15)', transform:'translateY(-50%)', pointerEvents:'none' }} />

        {/* Photo circle */}
        <div style={{
          position: 'absolute', inset: 28,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${hovered ? '#C8102E' : 'rgba(200,16,46,0.55)'}`,
          boxShadow: hovered
            ? '0 0 30px rgba(200,16,46,0.6), inset 0 0 25px rgba(0,0,0,0.6)'
            : '0 0 20px rgba(200,16,46,0.3), inset 0 0 20px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease',
        }}>
          {src ? (
            <img src={src} alt="C Yashwanth"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                filter: hovered
                  ? 'brightness(1.05) contrast(1.15)'
                  : 'brightness(0.92) contrast(1.05)',
                transform: hovered ? 'scale(1.12)' : 'scale(1)',
                transition: 'transform 0.4s ease, filter 0.4s ease',
              }}
            />
          ) : (
            <div style={{ width:'100%', height:'100%', background:'rgba(200,16,46,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize: 48, opacity: 0.4 }}>👤</span>
            </div>
          )}

          {/* Scanline overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Floating HUD Tags on Hover */}
        {hovered && (
          <>
            <div
              className="font-mono"
              style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '8px',
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(10,5,5,0.92)',
                border: '1px solid var(--red)',
                padding: '0.2rem 0.6rem',
                borderRadius: '3px',
                letterSpacing: '0.15em',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 12px rgba(200,16,46,0.4)',
                zIndex: 10,
              }}
            >
              ● IDENTITY SCAN // ACTIVE
            </div>
            <div
              className="font-mono"
              style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '8px',
                color: '#00FF66',
                backgroundColor: 'rgba(10,5,5,0.92)',
                border: '1px solid rgba(0,255,102,0.4)',
                padding: '0.2rem 0.6rem',
                borderRadius: '3px',
                letterSpacing: '0.12em',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 10px rgba(0,255,102,0.3)',
                zIndex: 10,
              }}
            >
              AI FULL STACK DEV
            </div>
          </>
        )}

        {/* Center crosshair dot */}
        <div style={{
          position: 'absolute', left:'50%', top:'50%',
          transform:'translate(-50%,-50%)',
          width: hovered ? 10 : 8,
          height: hovered ? 10 : 8,
          borderRadius:'50%',
          backgroundColor: hovered ? '#C8102E' : 'rgba(200,16,46,0.6)',
          boxShadow: hovered ? '0 0 16px #C8102E' : '0 0 8px rgba(200,16,46,0.8)',
          pointerEvents:'none',
          transition: 'all 0.3s ease',
        }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SIGNAL STRENGTH BAR (like WiFi bars, but vertical)
═══════════════════════════════════════════════════════ */
const SignalBar: React.FC<{ label: string; level: number; max: number; animate: boolean; delay: number }> =
  ({ label, level, max, animate, delay }) => {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setFilled(i);
        if (i >= level) clearInterval(interval);
      }, 80);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [animate, level, delay]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '20px' }}>
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} style={{
            width: 6,
            height: `${40 + i * 12}%`,
            borderRadius: '1px',
            backgroundColor: i < filled ? '#C8102E' : 'rgba(200,16,46,0.15)',
            boxShadow: i < filled ? '0 0 5px rgba(200,16,46,0.5)' : 'none',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          }} />
        ))}
      </div>
      {/* Label */}
      <span style={{ fontFamily:'monospace', fontSize:'8px', letterSpacing:'0.12em', color:'rgba(237,235,230,0.5)' }}>
        {label}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   DOWNLOAD RESUME WITH PROGRESS BAR
═══════════════════════════════════════════════════════ */
const DownloadButton: React.FC = () => {
  const [progress, setProgress] = useState<number | null>(null);

  const handleClick = () => {
    if (progress !== null) return;
    playBeep(600, 0.06);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 7 + Math.random() * 11;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          window.open('/C_Yashwanth_Resume.pdf', '_blank');
          setProgress(null);
        }, 300);
      }
      setProgress(Math.round(p));
    }, 55);
  };

  return (
    <button onClick={handleClick} data-cursor="pointer"
      style={{
        position: 'relative', overflow: 'hidden',
        backgroundColor: progress !== null ? 'rgba(200,16,46,0.15)' : 'var(--red)',
        border: '1px solid var(--red)',
        color: 'white', fontFamily:'monospace',
        fontSize: '9px', fontWeight: 700,
        letterSpacing: '0.12em',
        padding: '0.65rem 1.2rem', borderRadius: '3px',
        cursor: 'pointer', width: '100%',
        transition: 'background-color 0.3s ease',
        boxShadow: progress === null ? '0 0 16px rgba(200,16,46,0.35)' : 'none',
      }}>
      {/* Fill bar */}
      {progress !== null && (
        <div style={{
          position: 'absolute', inset: 0, left: 0,
          width: `${progress}%`,
          backgroundColor: 'rgba(200,16,46,0.4)',
          transition: 'width 0.05s linear',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {progress === null
          ? '📡 TRANSMIT RESUME'
          : progress === 100
          ? '✓ TRANSFER COMPLETE'
          : `TRANSMITTING... ${progress}%`
        }
      </span>
    </button>
  );
};

/* ═══════════════════════════════════════════════════════
   STAT COUNTER (reused from original)
═══════════════════════════════════════════════════════ */
const StatCounter: React.FC<{ target: number; label: string; suffix: string; visible: boolean; delay: number }> =
  ({ target, label, suffix, visible, delay }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!visible || started) return;
    const t = setTimeout(() => {
      setStarted(true);
      const steps = 40;
      const inc = target / steps;
      let cur = 0;
      const iv = setInterval(() => {
        cur = Math.min(cur + inc, target);
        setCount(Math.round(cur));
        if (cur >= target) clearInterval(iv);
      }, 1200 / steps);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, started, target, delay]);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
      <span className="font-bebas" style={{ fontSize:'34px', color:'var(--text-primary)', lineHeight:1 }}>
        {count}{suffix}
      </span>
      <span className="font-mono" style={{ fontSize:'7.5px', color:'rgba(200,16,46,0.4)', letterSpacing:'0.2em' }}>
        {label}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN IDENTITY SECTION
═══════════════════════════════════════════════════════ */
const Identity: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [typedBio, setTypedBio] = useState('');
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const bioRef = useRef(false);

  const [sectionRef, sectionVisible] = useReveal<HTMLElement>({ threshold: 0.15 });
  const [leftRef, leftVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [rightRef, rightVisible] = useReveal<HTMLDivElement>({ threshold: 0.1, delay: 100 });

  useEffect(() => {
    fetchAbout().then(data => setAbout(data || {
      name: 'C Yashwanth',
      role: 'AI Full Stack Developer',
      tagline: 'Ideas, engineered into reality.',
      bio: FULL_BIO,
      profile_photo_url: '/profile.jpg',
    }));
  }, []);

  // Typewriter effect — fires once when section visible
  useEffect(() => {
    if (!sectionVisible || bioRef.current) return;
    bioRef.current = true;
    const bio = about?.bio || FULL_BIO;
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setTypedBio(bio.slice(0, i));
      if (i >= bio.length) clearInterval(iv);
    }, 22);
    return () => clearInterval(iv);
  }, [sectionVisible, about]);

  const handleCopySpecs = () => {
    navigator.clipboard.writeText(JSON.stringify({
      name: about?.name, role: about?.role,
      stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Groq API'],
      location: 'India', status: 'Transmitting',
    }, null, 2));
    setCopied(true);
    playBeep(800, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="identity"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ backgroundColor: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ height:'1px', background:'linear-gradient(90deg, transparent, rgba(200,16,46,0.2), transparent)' }} />

      <div className="section-container">

        {/* Chapter header */}
        <div ref={leftRef} className={`chapter-header reveal${leftVisible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
          <h2 className="font-bebas chapter-number">01</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
            <span className="font-mono signal-label">SIGNAL 01</span>
            <span className="font-mono" style={{ fontSize:'14px', color:'var(--text-primary)', letterSpacing:'0.18em' }}>ABOUT ME</span>
          </div>
        </div>

        {/* ── MAIN CONTENT: two columns ── */}
        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'clamp(2rem, 5vw, 5rem)', alignItems:'start' }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem', position:'sticky', top:'2rem' }}>

            {/* Radar Photo */}
            <RadarDisplay
              src={about?.profile_photo_url || '/profile.jpg'}
              scanning={sectionVisible}
            />

            {/* Signal Origin HUD */}
            <div style={{
              width: '100%',
              background: 'rgba(10,6,6,0.9)',
              border: '1px solid rgba(200,16,46,0.25)',
              borderRadius: '4px',
              padding: '0.9rem 1rem',
            }}>
              <div className="font-mono" style={{ fontSize:'7px', letterSpacing:'0.22em', color:'var(--red)', marginBottom:'0.7rem', borderBottom:'1px solid rgba(200,16,46,0.15)', paddingBottom:'0.5rem' }}>
                SIGNAL ORIGIN
              </div>
              {[
                { key: 'ENTITY',   val: about?.name || 'C YASHWANTH' },
                { key: 'ROLE',     val: about?.role || 'AI FULL STACK DEV' },
                { key: 'ORIGIN',   val: 'INDIA' },
                { key: 'COORDS',   val: '12.97°N · 77.59°E' },
                { key: 'FREQ',     val: '2.4 GHz' },
                { key: 'STATUS',   val: '● TRANSMITTING', color: '#00FF66' },
              ].map(row => (
                <div key={row.key} style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem', gap:'0.5rem' }}>
                  <span className="font-mono" style={{ fontSize:'7px', letterSpacing:'0.1em', color:'rgba(237,235,230,0.3)', flexShrink:0 }}>{row.key}</span>
                  <span className="font-mono" style={{ fontSize:'7px', letterSpacing:'0.08em', color: row.color || 'rgba(237,235,230,0.75)', textAlign:'right' }}>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Download Resume with transfer progress */}
            <DownloadButton />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div ref={rightRef} className={`reveal${rightVisible ? ' visible' : ''}`}
            style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

            {/* Name & Role */}
            <div>
              <h3 className="font-bebas" style={{ fontSize:'clamp(36px, 5vw, 60px)', color:'var(--text-primary)', margin:0, lineHeight:1 }}>
                {about?.name || 'C Yashwanth'}
              </h3>
              <p className="font-mono" style={{ fontSize:'11px', color:'var(--red)', marginTop:'0.4rem', letterSpacing:'0.15em' }}>
                {about?.role || 'AI Full Stack Developer'}
              </p>
            </div>

            {/* ── TYPEWRITER BIO ── */}
            <div style={{
              background: 'rgba(8,5,5,0.7)',
              border: '1px solid rgba(200,16,46,0.2)',
              borderLeft: '3px solid rgba(200,16,46,0.6)',
              borderRadius: '3px',
              padding: '1.1rem 1.2rem',
              position: 'relative',
            }}>
              <div className="font-mono" style={{ fontSize:'7px', letterSpacing:'0.22em', color:'rgba(200,16,46,0.55)', marginBottom:'0.6rem' }}>
                INCOMING TRANSMISSION ▼
              </div>
              <p style={{ fontSize:'13.5px', lineHeight:1.8, color:'rgba(237,235,230,0.75)', margin:0, fontWeight:300, minHeight:'4.5rem' }}>
                {typedBio}
                <span style={{ display:'inline-block', width:'2px', height:'14px', backgroundColor:'var(--red)', marginLeft:'2px', verticalAlign:'middle', animation:'cursorBlink 0.8s ease infinite' }} />
              </p>
            </div>

            {/* ── SIGNAL STRENGTH BARS ── */}
            <div>
              <div className="font-mono" style={{ fontSize:'7.5px', letterSpacing:'0.22em', color:'rgba(200,16,46,0.4)', marginBottom:'1rem' }}>
                CAPABILITY SIGNALS
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                {TRAITS.map((t, i) => (
                  <SignalBar key={t.label} label={t.label} level={t.level} max={t.max}
                    animate={sectionVisible} delay={i * 120} />
                ))}
              </div>
            </div>

            {/* ── CORE ENGINEERING PILLARS ── */}
            <div>
              <div className="font-mono" style={{ fontSize:'7.5px', letterSpacing:'0.22em', color:'rgba(200,16,46,0.4)', marginBottom:'1rem' }}>
                CORE ENGINEERING PILLARS
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'0.85rem' }}>
                {PILLARS.map((p, idx) => (
                  <div key={p.num} data-cursor="view"
                    onMouseEnter={() => { setActivePillar(idx); playBeep(450 + idx * 100, 0.04); }}
                    onMouseLeave={() => setActivePillar(null)}
                    style={{
                      background: activePillar === idx ? 'rgba(200,16,46,0.08)' : 'var(--bg-3)',
                      border: `1px solid ${activePillar === idx ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.05)'}`,
                      borderLeft: `2px solid ${activePillar === idx ? 'var(--red)' : 'rgba(200,16,46,0.25)'}`,
                      borderRadius: '4px', padding: '1rem',
                      transition: 'all 0.25s ease',
                      transform: activePillar === idx ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: activePillar === idx ? '0 8px 24px rgba(200,16,46,0.18)' : 'none',
                      cursor: 'pointer',
                    }}>
                    <div className="font-mono" style={{ fontSize:'8px', color:'var(--red)', letterSpacing:'0.12em', marginBottom:'0.4rem' }}>
                      {p.num} // {p.subtitle.toUpperCase()}
                    </div>
                    <h4 className="font-bebas" style={{ fontSize:'16px', color:'var(--text-primary)', margin:'0 0 0.4rem 0', lineHeight:1.1 }}>
                      {p.title}
                    </h4>
                    <p style={{ fontSize:'11px', color:'rgba(237,235,230,0.5)', lineHeight:1.6, margin:'0 0 0.7rem 0' }}>
                      {p.desc}
                    </p>
                    <div style={{ display:'flex', gap:'0.25rem', flexWrap:'wrap' }}>
                      {p.tech.map(t => (
                        <span key={t} className="font-mono" style={{
                          fontSize:'7px', padding:'0.1rem 0.35rem',
                          backgroundColor: activePillar === idx ? 'rgba(200,16,46,0.15)' : 'rgba(255,255,255,0.03)',
                          border:'1px solid rgba(200,16,46,0.2)',
                          color: activePillar === idx ? 'var(--text-primary)' : 'rgba(237,235,230,0.4)',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SYSTEM SPECS JSON ── */}
            <div style={{
              background: 'rgba(8,5,5,0.7)',
              border: '1px solid rgba(200,16,46,0.2)',
              borderRadius: '4px', padding: '1rem 1.1rem',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
                <span className="font-mono" style={{ fontSize:'8px', color:'var(--red)', letterSpacing:'0.15em' }}>
                  DEVELOPER_OBJECT.JSON
                </span>
                <button data-cursor="pointer" onClick={handleCopySpecs} className="font-mono"
                  style={{
                    background:'rgba(200,16,46,0.12)', border:'1px solid rgba(200,16,46,0.35)',
                    color:'var(--text-primary)', fontSize:'8px', padding:'0.2rem 0.6rem',
                    cursor:'pointer', borderRadius:'3px', letterSpacing:'0.08em',
                  }}>
                  {copied ? 'COPIED ✓' : 'COPY'}
                </button>
              </div>
              <pre className="font-mono" style={{ fontSize:'10px', color:'rgba(237,235,230,0.65)', margin:0, lineHeight:1.65, overflowX:'auto' }}>
{`{
  "developer": "${about?.name || 'C Yashwanth'}",
  "role":      "${about?.role || 'AI Full Stack Developer'}",
  "backend":   ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL"],
  "frontend":  ["React 18", "TypeScript", "Vite"],
  "ai_stack":  ["Groq API", "Google Gemini", "RAG Pipelines"],
  "status":    "TRANSMITTING ●"
}`}
              </pre>
            </div>

            {/* ── STAT COUNTERS ── */}
            <div style={{ display:'flex', gap:'2.5rem', flexWrap:'wrap' }}>
              {[
                { target: 2, label: 'PROJECTS SHIPPED', suffix: '+' },
                { target: 15, label: 'TECHNOLOGIES', suffix: '+' },
                { target: 2026, label: 'YEAR ACTIVE', suffix: '' },
              ].map((s, i) => (
                <StatCounter key={s.label} target={s.target} label={s.label}
                  suffix={s.suffix} visible={rightVisible} delay={i * 180} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes radarAuraPulse {
          0%,100% { opacity:0.6; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.05); }
        }
        @keyframes cursorBlink {
          0%,100% { opacity:1; }
          50%     { opacity:0; }
        }
      `}</style>
    </section>
  );
};

export default Identity;
