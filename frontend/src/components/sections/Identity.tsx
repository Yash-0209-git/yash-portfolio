import React, { useEffect, useState } from 'react';
import { fetchAbout } from '../../api';
import { About } from '../../types';
import { useReveal } from '../../hooks/useReveal';

const Identity: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [sectionRef] = useReveal<HTMLElement>({ threshold: 0.15 });

  // Individual reveals with delay stagger
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

  return (
    <section
      id="identity"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ backgroundColor: 'var(--bg-2)' }}
    >
      {/* Subtle top border line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.2), transparent)' }} />

      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '5rem',
          alignItems: 'center',
        }}
      >
        {/* Left — oversized chapter number */}
        <div
          ref={leftRef}
          className={`reveal-left${leftVisible ? ' visible' : ''}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}
        >
          <h2
            className="font-bebas"
            style={{
              fontSize: 'clamp(110px, 14vw, 190px)',
              color: 'rgba(200,16,46,0.07)',
              lineHeight: 0.85,
              margin: 0,
              transition: 'color 0.4s ease',
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
              height: leftVisible ? '80px' : '0px',
              backgroundColor: 'var(--red)',
              marginTop: '2rem',
              transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1) 0.3s',
              opacity: 0.4,
            }}
          />
        </div>

        {/* Right — content */}
        <div
          ref={rightRef}
          className={`reveal${rightVisible ? ' visible' : ''}`}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '640px' }}
        >
          <div className="font-mono signal-label" style={{ fontSize: '10px' }}>
            — ABOUT ME
          </div>

          <div>
            <h3
              className="font-bebas"
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              {about?.name || 'C Yashwanth'}
            </h3>
            <p
              className="font-mono"
              style={{
                fontSize: '11px',
                color: 'var(--red)',
                marginTop: '0.4rem',
                letterSpacing: '0.12em',
              }}
            >
              {about?.role || 'AI Full Stack Developer'}
            </p>
          </div>

          <p
            className="font-inter"
            style={{
              fontSize: '15px',
              lineHeight: 1.85,
              color: 'rgba(237,235,230,0.65)',
              fontWeight: 300,
            }}
          >
            {about?.bio || 'Loading profile...'}
          </p>

          <div style={{ width: '36px', height: '2px', backgroundColor: 'var(--red)', opacity: 0.7 }} />

          {/* Stat counters — Phase 3 */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
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
