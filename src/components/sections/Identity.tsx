import React, { useEffect, useState } from 'react';
import { fetchAbout } from '../../api';
import { About } from '../../types';
import { useReveal } from '../../hooks/useReveal';
import { playBeep } from '../../utils/audio';

const FULL_BIO =
  'An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.';

const CAPABILITIES = [
  { label: 'BACKEND ARCHITECTURE (FASTAPI / ASYNC)', percent: 98, status: 'OPTIMAL' },
  { label: 'AI & RAG PIPELINES (GROQ / FAISS / LLAMA 3.3)', percent: 96, status: 'OPTIMAL' },
  { label: 'FULL-STACK UI (REACT 18 / TYPESCRIPT)', percent: 94, status: 'ACTIVE' },
  { label: 'DATABASE & DATA SCHEMAS (POSTGRESQL / SUPABASE)', percent: 92, status: 'ACTIVE' },
  { label: 'SYSTEM LATENCY & API PERFORMANCE', percent: 99, status: 'LOW LATENCY' },
];

const DISPATCHES = [
  {
    date: '2026.07',
    title: 'Development Team Internship',
    org: 'M/s. Xmedia Solutions, Ambattur',
    desc: 'Completed 30-day intensive internship in backend API development, software engineering, and system optimization.',
    badge: 'INTERNSHIP',
  },
  {
    date: '2026.01',
    title: 'Vibe Hack 2.0 (BuildwithIndia Finale)',
    org: 'Hack With India (Finale at Google Office)',
    desc: 'Selected among the top 5,000 teams out of 25,000 participating teams across India.',
    badge: 'TOP 5K FINALE',
  },
  {
    date: '2025.10',
    title: 'Hack A Cure',
    org: 'VIT Chennai (TechnoVIT\'25)',
    desc: 'Developed AI-assisted healthcare diagnostics workflow under competition constraints.',
    badge: 'HACKATHON',
  },
  {
    date: '2024 - PRESENT',
    title: 'Rajalakshmi Engineering College (REC)',
    org: 'Department of Artificial Intelligence & Machine Learning',
    desc: 'Specializing in machine learning algorithms, database architectures, and full-stack software development.',
    badge: 'EDUCATION',
  },
];

const RING_1_NODES = ['PYTHON', 'FASTAPI', 'REACT', 'TYPESCRIPT'];
const RING_2_NODES = ['RAG PIPELINES', 'GROQ API', 'LLAMA 3.3', 'FAISS VECTOR'];
const RING_3_NODES = ['FULL STACK', 'BACKEND ARCH', 'INTELLIGENT AI'];

/* ═══════════════════════════════════════════════════════
   ORBITING NEURAL IDENTITY CORE (IDEA 2)
═══════════════════════════════════════════════════════ */
const OrbitingNeuralCore: React.FC<{ src: string }> = ({ src }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 18, y: -y * 18 });
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
      style={{
        position: 'relative',
        width: '420px',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* ── Outer Ring 3 (Slow Clockwise Rotation) ── */}
      <div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          border: '1px dashed rgba(200, 16, 46, 0.25)',
          animation: 'spinClockwise 28s linear infinite',
        }}
      >
        {RING_3_NODES.map((node, i) => {
          const angle = (i * 360) / RING_3_NODES.length;
          return (
            <div
              key={node}
              onMouseEnter={() => { setActiveNode(node); playBeep(750, 0.05); }}
              onMouseLeave={() => setActiveNode(null)}
              data-cursor="pointer"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translate(210px) rotate(-${angle}deg)`,
                backgroundColor: activeNode === node ? 'var(--red)' : 'rgba(15,15,15,0.9)',
                color: activeNode === node ? 'white' : 'rgba(200,16,46,0.85)',
                border: '1px solid var(--red)',
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
                fontSize: '8.5px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: activeNode === node ? '0 0 12px rgba(200,16,46,0.6)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {node}
            </div>
          );
        })}
      </div>

      {/* ── Middle Ring 2 (Counter-Clockwise Rotation) ── */}
      <div
        style={{
          position: 'absolute',
          width: '345px',
          height: '345px',
          borderRadius: '50%',
          border: '1px solid rgba(200, 16, 46, 0.2)',
          animation: 'spinCounter 20s linear infinite',
        }}
      >
        {RING_2_NODES.map((node, i) => {
          const angle = (i * 360) / RING_2_NODES.length;
          return (
            <div
              key={node}
              onMouseEnter={() => { setActiveNode(node); playBeep(800, 0.05); }}
              onMouseLeave={() => setActiveNode(null)}
              data-cursor="pointer"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translate(172px) rotate(-${angle}deg)`,
                backgroundColor: activeNode === node ? 'var(--red)' : 'rgba(15,15,15,0.9)',
                color: activeNode === node ? 'white' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(200,16,46,0.4)',
                padding: '0.15rem 0.4rem',
                borderRadius: '3px',
                fontSize: '8px',
                fontFamily: 'JetBrains Mono, monospace',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: activeNode === node ? '0 0 10px rgba(200,16,46,0.5)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {node}
            </div>
          );
        })}
      </div>

      {/* ── Inner Ring 1 (Fast Clockwise Rotation) ── */}
      <div
        style={{
          position: 'absolute',
          width: '270px',
          height: '270px',
          borderRadius: '50%',
          border: '1px dashed rgba(200, 16, 46, 0.3)',
          animation: 'spinClockwise 14s linear infinite',
        }}
      >
        {RING_1_NODES.map((node, i) => {
          const angle = (i * 360) / RING_1_NODES.length;
          return (
            <div
              key={node}
              onMouseEnter={() => { setActiveNode(node); playBeep(850, 0.05); }}
              onMouseLeave={() => setActiveNode(null)}
              data-cursor="pointer"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translate(135px) rotate(-${angle}deg)`,
                backgroundColor: activeNode === node ? 'var(--red)' : 'rgba(20,20,25,0.95)',
                color: activeNode === node ? 'white' : 'var(--red)',
                border: '1px solid var(--red)',
                padding: '0.12rem 0.35rem',
                borderRadius: '2px',
                fontSize: '7.5px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: activeNode === node ? '0 0 10px rgba(200,16,46,0.6)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {node}
            </div>
          );
        })}
      </div>

      {/* ── Central 3D Tilt Profile Photo Frame ── */}
      <div
        style={{
          position: 'relative',
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid var(--red)',
          boxShadow: '0 0 30px rgba(200, 16, 46, 0.45)',
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${hovered ? 1.05 : 1})`,
          transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease',
          zIndex: 5,
        }}
      >
        <img
          src={src}
          alt="Yashwanth Profile"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.05) brightness(0.95)',
          }}
        />

        {/* Live Scan Sweep Line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF2A4B, transparent)',
            boxShadow: '0 0 8px #FF2A4B',
            animation: 'photoScanSweep 2.8s ease-in-out infinite',
          }}
        />

        {/* Corner HUD Brackets */}
        <div className="font-mono" style={{ position: 'absolute', top: 4, left: 6, fontSize: '9px', color: 'var(--red)', pointerEvents: 'none' }}>┌</div>
        <div className="font-mono" style={{ position: 'absolute', top: 4, right: 6, fontSize: '9px', color: 'var(--red)', pointerEvents: 'none' }}>┐</div>
        <div className="font-mono" style={{ position: 'absolute', bottom: 4, left: 6, fontSize: '9px', color: 'var(--red)', pointerEvents: 'none' }}>└</div>
        <div className="font-mono" style={{ position: 'absolute', bottom: 4, right: 6, fontSize: '9px', color: 'var(--red)', pointerEvents: 'none' }}>┘</div>
      </div>

      {/* Floating HUD status tags around frame */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          bottom: '-10px',
          fontSize: '8px',
          color: 'var(--red)',
          backgroundColor: 'rgba(10,5,5,0.9)',
          padding: '0.2rem 0.5rem',
          border: '1px solid rgba(200,16,46,0.4)',
          borderRadius: '3px',
          letterSpacing: '0.12em',
          zIndex: 10,
        }}
      >
        ● TRANSMITTING // BASE: INDIA
      </div>

      <style>{`
        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinCounter {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes photoScanSweep {
          0%   { top: 0%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN IDENTITY COMPONENT (IDEA 2 INTEGRATED)
═══════════════════════════════════════════════════════ */
const Identity: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [activeTab, setActiveTab] = useState<'PHILOSOPHY' | 'CAPABILITIES' | 'DISPATCHES'>('PHILOSOPHY');
  const [decrypting, setDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);

  const [ref, isRevealed] = useReveal({ threshold: 0.15 });

  useEffect(() => {
    fetchAbout().then(data => {
      if (data) setAbout(data);
    });
  }, []);

  const handleDecryptResume = () => {
    if (decrypting) return;
    setDecrypting(true);
    playBeep(880, 0.08);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 8;
      if (progress >= 100) {
        progress = 100;
        setDecryptProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setDecrypting(false);
          setDecryptProgress(0);
          window.open('/S_Thavaneshwaran_Resume.pdf', '_blank');
        }, 400);
      } else {
        setDecryptProgress(progress);
        playBeep(400 + progress * 5, 0.02);
      }
    }, 60);
  };

  const bioText = about?.bio || FULL_BIO;
  const photoUrl = about?.profile_photo_url || '/certificates/profile.jpg';

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--smoke)',
        color: 'var(--charcoal)',
        padding: '6rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Section Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200, 16, 46, 0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '4rem' }}>
          <span
            className="font-bebas"
            style={{
              fontSize: 'clamp(80px, 12vw, 160px)',
              lineHeight: 0.8,
              color: 'rgba(200, 16, 46, 0.12)',
              userSelect: 'none',
            }}
          >
            01
          </span>
          <div style={{ paddingBottom: '0.75rem' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '11px',
                color: 'var(--red)',
                letterSpacing: '0.25em',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              — SIGNAL 01 // IDENTITY PROFILE
            </span>
            <h2
              className="font-inter"
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 700,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Yashwanth
            </h2>
            <span
              className="font-mono"
              style={{
                fontSize: '12px',
                color: 'var(--muted)',
                letterSpacing: '0.12em',
              }}
            >
              {about?.role || 'AI Full Stack Developer'}
            </span>
          </div>
        </div>

        {/* Two-Column Core Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >

          {/* ── LEFT COLUMN: ORBITING NEURAL IDENTITY CORE ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <OrbitingNeuralCore src={photoUrl} />

            <div className="font-mono" style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.5 }}>
              HOVER ORBITING TECH NODES TO INSPECT SYSTEM CAPABILITIES
            </div>
          </div>

          {/* ── RIGHT COLUMN: COMMAND LOG TERMINAL (YASHWANTH.SYS) ── */}
          <div
            style={{
              backgroundColor: 'var(--charcoal)',
              color: 'white',
              borderRadius: '8px',
              border: '1px solid rgba(200, 16, 46, 0.3)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Terminal Header Bar */}
            <div
              style={{
                backgroundColor: 'rgba(20, 20, 26, 0.95)',
                borderBottom: '1px solid rgba(200, 16, 46, 0.25)',
                padding: '0.6rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className="font-mono" style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.15em' }}>
                YASHWANTH.SYS v2.0 // COMMAND LOG
              </div>

              {/* Tab selector buttons */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(['PHILOSOPHY', 'CAPABILITIES', 'DISPATCHES'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); playBeep(700, 0.04); }}
                    data-cursor="pointer"
                    style={{
                      backgroundColor: activeTab === tab ? 'rgba(200,16,46,0.25)' : 'transparent',
                      border: `1px solid ${activeTab === tab ? 'var(--red)' : 'transparent'}`,
                      color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.4)',
                      padding: '0.2rem 0.55rem',
                      fontSize: '9.5px',
                      fontFamily: 'JetBrains Mono, monospace',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Content Body */}
            <div style={{ padding: '1.75rem', minHeight: '340px' }}>

              {/* ── TAB 1: PHILOSOPHY & NARRATIVE ── */}
              {activeTab === 'PHILOSOPHY' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.3s ease' }}>
                  <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em' }}>
                    {'> INITIALIZING NARRATIVE LOG...'}
                  </div>

                  <p
                    className="font-inter"
                    style={{
                      fontSize: '14.5px',
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.88)',
                      margin: 0,
                    }}
                  >
                    {bioText}
                  </p>

                  <div style={{ height: '1px', backgroundColor: 'rgba(200, 16, 46, 0.2)', margin: '0.5rem 0' }} />

                  {/* Pillars grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
                    {[
                      { title: 'BACKEND ARCH', desc: 'FastAPI & Async PostgreSQL pipelines' },
                      { title: 'AI & RAG ENGINE', desc: 'Groq API, FAISS & Llama 3.3 70B' },
                      { title: 'EDITORIAL UI', desc: 'React 18 & interactive physics' },
                    ].map((p, idx) => (
                      <div key={idx} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,16,46,0.2)', padding: '0.75rem', borderRadius: '4px' }}>
                        <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', fontWeight: 700, marginBottom: '0.2rem' }}>{p.title}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 2: CAPABILITIES TELEMETRY ── */}
              {activeTab === 'CAPABILITIES' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', animation: 'fadeIn 0.3s ease' }}>
                  <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em' }}>
                    {'> SYSTEM CAPABILITY TELEMETRY GAUGES'}
                  </div>

                  {CAPABILITIES.map(cap => (
                    <div key={cap.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                        <span style={{ color: 'rgba(255,255,255,0.85)' }}>{cap.label}</span>
                        <span style={{ color: 'var(--red)', fontWeight: 700 }}>{cap.percent}% · {cap.status}</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${cap.percent}%`,
                            backgroundColor: 'var(--red)',
                            boxShadow: '0 0 10px rgba(200,16,46,0.7)',
                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 3: DISPATCHES & CAREER NODES ── */}
              {activeTab === 'DISPATCHES' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', animation: 'fadeIn 0.3s ease' }}>
                  <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em' }}>
                    {'> CHRONOLOGICAL CAREER DISPATCHES'}
                  </div>

                  {DISPATCHES.map((d, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 1fr',
                        gap: '0.85rem',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        borderLeft: '2px solid var(--red)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0 4px 4px 0',
                      }}
                    >
                      <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', fontWeight: 700 }}>
                        [{d.date}]
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '12.5px', color: 'white' }}>{d.title}</span>
                          <span className="font-mono" style={{ fontSize: '8px', padding: '0.1rem 0.35rem', backgroundColor: 'rgba(200,16,46,0.2)', border: '1px solid var(--red)', borderRadius: '2px', color: 'var(--red)' }}>
                            {d.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{d.org}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '0.15rem', lineHeight: 1.3 }}>{d.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Terminal Footer with Hex Decrypter Resume Download */}
            <div
              style={{
                backgroundColor: 'rgba(15, 15, 20, 0.95)',
                borderTop: '1px solid rgba(200, 16, 46, 0.2)',
                padding: '0.85rem 1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                DOCUMENT DOSSIER: ENCRYPTED [.PDF]
              </div>

              <button
                onClick={handleDecryptResume}
                data-cursor="pointer"
                disabled={decrypting}
                style={{
                  backgroundColor: decrypting ? 'rgba(200,16,46,0.3)' : 'var(--red)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '3px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  cursor: decrypting ? 'wait' : 'pointer',
                  boxShadow: '0 0 16px rgba(200,16,46,0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                {decrypting ? `DECRYPTING DOSSIER: ${decryptProgress}%...` : 'DECRYPT RESUME [.PDF] ➔'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Identity;
