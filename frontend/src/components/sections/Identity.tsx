import React, { useEffect, useState } from 'react';
import { fetchAbout } from '../../api';
import { About } from '../../types';
import { useReveal } from '../../hooks/useReveal';
import { playBeep } from '../../utils/audio';

type PerspectiveTab = 'OVERVIEW' | 'PHILOSOPHY' | 'SYSTEM SPECS';

const Identity: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [activeTab, setActiveTab] = useState<PerspectiveTab>('OVERVIEW');
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [sectionRef] = useReveal<HTMLElement>({ threshold: 0.15 });
  const [leftRef, leftVisible] = useReveal<HTMLDivElement>({ threshold: 0.1, delay: 0 });
  const [rightRef, rightVisible] = useReveal<HTMLDivElement>({ threshold: 0.1, delay: 150 });

  useEffect(() => {
    fetchAbout().then(data => {
      setAbout(data || {
        name: 'C Yashwanth',
        role: 'AI Full Stack Developer',
        tagline: 'Ideas, engineered into reality.',
        bio: 'An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.',
      });
    });
  }, []);

  const handleCopySpecs = () => {
    const specs = JSON.stringify({
      name: about?.name || 'C Yashwanth',
      role: about?.role || 'AI Full Stack Developer',
      stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Groq API'],
      location: 'India',
      status: 'Transmitting',
    }, null, 2);
    navigator.clipboard.writeText(specs);
    setCopied(true);
    playBeep(800, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  const pillars = [
    {
      num: '01',
      title: 'BACKEND ARCHITECTURE',
      subtitle: 'FastAPI & Async Systems',
      desc: 'Building low-latency REST APIs, stateless JWT auth pipelines, and resilient database queries with PostgreSQL & SQLAlchemy.',
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy'],
    },
    {
      num: '02',
      title: 'AI & LLM INTEGRATION',
      subtitle: 'Intelligent Automation',
      desc: 'Integrating real-time AI guidance engines, Groq API acceleration, and Gemini LLM models into full-stack applications.',
      tech: ['Groq API', 'Google Gemini', 'RAG', 'AI Workflows'],
    },
    {
      num: '03',
      title: 'EDITORIAL UI ENGINEERING',
      subtitle: 'React & Interactive Systems',
      desc: 'Crafting brutalist, dynamic user interfaces with smooth physics, custom cursors, and responsive state synchronization.',
      tech: ['React 18', 'TypeScript', 'Vanilla CSS', 'Vite'],
    },
  ];

  return (
    <section
      id="identity"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ backgroundColor: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle top border line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.2), transparent)' }} />

      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(140px, auto) 1fr',
          gap: ' clamp(2rem, 5vw, 5rem)',
          alignItems: 'start',
        }}
      >
        {/* Left — oversized chapter number & quick telemetry */}
        <div
          ref={leftRef}
          className={`reveal-left${leftVisible ? ' visible' : ''}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, position: 'sticky', top: '2rem' }}
        >
          <h2
            className="font-bebas"
            style={{
              fontSize: 'clamp(100px, 13vw, 180px)',
              color: 'rgba(200,16,46,0.07)',
              lineHeight: 0.85,
              margin: 0,
              transition: 'color 0.4s ease',
              userSelect: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(200,16,46,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,16,46,0.07)')}
          >
            01
          </h2>
          <span
            className="font-mono"
            style={{
              fontSize: '10px',
              color: 'rgba(200,16,46,0.35)',
              letterSpacing: '0.3em',
              marginTop: '1rem',
            }}
          >
            IDENTITY
          </span>

          {/* Vertical red line accent */}
          <div
            style={{
              width: '1px',
              height: leftVisible ? '90px' : '0px',
              backgroundColor: 'var(--red)',
              marginTop: '2rem',
              transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1) 0.3s',
              opacity: 0.4,
            }}
          />

          {/* Quick Telemetry Status */}
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div className="font-mono" style={{ fontSize: '8px', color: 'var(--red)', letterSpacing: '0.15em' }}>
              ● BASED IN INDIA
            </div>
            <div className="font-mono" style={{ fontSize: '8px', color: 'rgba(237,235,230,0.4)', letterSpacing: '0.15em' }}>
              STATUS: OPEN TO WORK
            </div>
          </div>
        </div>

        {/* Right — content */}
        <div
          ref={rightRef}
          className={`reveal${rightVisible ? ' visible' : ''}`}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}
        >
          <div className="font-mono signal-label" style={{ fontSize: '10px' }}>
            — ABOUT ME
          </div>

          <div>
            <h3
              className="font-bebas"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}
            >
              {about?.name || 'C Yashwanth'}
            </h3>
            <p
              className="font-mono"
              style={{
                fontSize: '12px',
                color: 'var(--red)',
                marginTop: '0.5rem',
                letterSpacing: '0.12em',
              }}
            >
              {about?.role || 'AI Full Stack Developer'}
            </p>
          </div>

          {/* Interactive Perspective Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
            {(['OVERVIEW', 'PHILOSOPHY', 'SYSTEM SPECS'] as PerspectiveTab[]).map(tab => (
              <button
                key={tab}
                data-cursor="pointer"
                onClick={() => {
                  setActiveTab(tab);
                  playBeep(550, 0.04);
                }}
                className="font-mono"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '10px',
                  color: activeTab === tab ? 'var(--red)' : 'rgba(237,235,230,0.4)',
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                  paddingBottom: '0.4rem',
                  borderBottom: activeTab === tab ? '2px solid var(--red)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          {activeTab === 'OVERVIEW' && (
            <p
              className="font-inter"
              style={{
                fontSize: '15px',
                lineHeight: 1.85,
                color: 'rgba(237,235,230,0.7)',
                fontWeight: 300,
                animation: 'fadeIn 0.3s ease',
              }}
            >
              {about?.bio || 'An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems.'}
            </p>
          )}

          {activeTab === 'PHILOSOPHY' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="font-inter" style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(237,235,230,0.75)', fontWeight: 300 }}>
                "Software should be intelligent, deterministic, and visually expressive. I bridge backend architecture with dynamic frontend experiences — building robust FastAPI APIs connected to high-performance AI engines."
              </p>
              <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.12em' }}>
                → DESIGNED FOR SPEED, ACCURACY, AND USER ENGAGEMENT
              </div>
            </div>
          )}

          {activeTab === 'SYSTEM SPECS' && (
            <div style={{ animation: 'fadeIn 0.3s ease', backgroundColor: 'rgba(8,8,8,0.7)', border: '1px solid rgba(200,16,46,0.25)', padding: '1.25rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em' }}>
                  DEVELOPER_OBJECT.JSON
                </span>
                <button
                  data-cursor="pointer"
                  onClick={handleCopySpecs}
                  className="font-mono"
                  style={{
                    backgroundColor: 'rgba(200,16,46,0.15)',
                    border: '1px solid rgba(200,16,46,0.4)',
                    color: 'var(--text-primary)',
                    fontSize: '9px',
                    padding: '0.2rem 0.6rem',
                    cursor: 'pointer',
                    borderRadius: '3px',
                  }}
                >
                  {copied ? 'COPIED!' : 'COPY SPECS 📋'}
                </button>
              </div>
              <pre className="font-mono" style={{ fontSize: '11px', color: 'rgba(237,235,230,0.75)', margin: 0, lineHeight: 1.6, overflowX: 'auto' }}>
{`{
  "developer": "${about?.name || 'C Yashwanth'}",
  "role": "${about?.role || 'AI Full Stack Developer'}",
  "backend": ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL"],
  "frontend": ["React 18", "TypeScript", "Vite", "Custom CSS"],
  "ai_stack": ["Groq API", "Google Gemini", "RAG Pipelines"],
  "architecture": "Decoupled FastAPI + Supabase Engine"
}`}
              </pre>
            </div>
          )}

          {/* Interactive Core Focus Pillars Grid */}
          <div style={{ marginTop: '1rem' }}>
            <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(200,16,46,0.4)', letterSpacing: '0.2em', marginBottom: '1rem' }}>
              CORE ENGINEERING PILLARS (HOVER TO EXPLORE)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {pillars.map((p, idx) => (
                <div
                  key={p.num}
                  data-cursor="view"
                  onMouseEnter={() => {
                    setActivePillar(idx);
                    playBeep(450 + idx * 100, 0.04);
                  }}
                  onMouseLeave={() => setActivePillar(null)}
                  style={{
                    backgroundColor: activePillar === idx ? 'rgba(200,16,46,0.08)' : 'var(--bg-3)',
                    borderTop: `1px solid ${activePillar === idx ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.05)'}`,
                    borderRight: `1px solid ${activePillar === idx ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.05)'}`,
                    borderBottom: `1px solid ${activePillar === idx ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.05)'}`,
                    borderLeft: `2px solid ${activePillar === idx ? 'var(--red)' : 'rgba(200,16,46,0.2)'}`,
                    padding: '1.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.25s ease',
                    transform: activePillar === idx ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: activePillar === idx ? '0 10px 30px rgba(200,16,46,0.18)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div className="font-mono" style={{ fontSize: '9px', color: 'var(--red)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                    {p.num} // {p.subtitle.toUpperCase()}
                  </div>
                  <h4 className="font-bebas" style={{ fontSize: '18px', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
                    {p.title}
                  </h4>
                  <p className="font-inter" style={{ fontSize: '12px', color: 'rgba(237,235,230,0.5)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                    {p.desc}
                  </p>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {p.tech.map(t => (
                      <span
                        key={t}
                        className="font-mono"
                        style={{
                          fontSize: '8px',
                          padding: '0.15rem 0.4rem',
                          backgroundColor: activePillar === idx ? 'rgba(200,16,46,0.15)' : 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(200,16,46,0.2)',
                          color: activePillar === idx ? 'var(--text-primary)' : 'rgba(237,235,230,0.4)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '48px', height: '2px', backgroundColor: 'var(--red)', opacity: 0.7, marginTop: '1rem' }} />

          {/* Stat counters — Phase 3 */}
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { target: 1, label: 'PROJECTS SHIPPED', suffix: '+' },
              { target: 10, label: 'TECHNOLOGIES', suffix: '+' },
              { target: 2026, label: 'YEAR ACTIVE', suffix: '' },
            ].map((stat, i) => (
              <StatCounter
                key={stat.label}
                target={stat.target}
                label={stat.label}
                suffix={stat.suffix}
                visible={rightVisible}
                delay={i * 200}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatCounterProps {
  target: number;
  label: string;
  suffix: string;
  visible: boolean;
  delay: number;
}

const StatCounter: React.FC<StatCounterProps> = ({ target, label, suffix, visible, delay }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!visible || started) return;
    const t = setTimeout(() => {
      setStarted(true);
      const duration = 1200;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + increment, target);
        setCount(Math.round(current));
        if (current >= target) clearInterval(interval);
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, started, target, delay]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span
        className="font-bebas"
        style={{ fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1 }}
      >
        {count}{suffix}
      </span>
      <span
        className="font-mono"
        style={{ fontSize: '8px', color: 'rgba(200,16,46,0.4)', letterSpacing: '0.2em' }}
      >
        {label}
      </span>
    </div>
  );
};

export default Identity;
