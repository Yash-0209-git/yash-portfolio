import React, { useEffect, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  organization?: string;
  category?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });

  useEffect(() => {
    fetch(`${API_BASE}/api/achievements`)
      .then(r => r.json())
      .then((data: Achievement[]) => {
        if (Array.isArray(data) && data.length > 0) setAchievements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="achievements" style={{ backgroundColor: 'var(--bg-2)' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">
        <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`}>
          <h2 className="font-bebas chapter-number">05</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span className="font-mono signal-label">SIGNAL 05</span>
            <span className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.18em' }}>
              JOURNEY
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map(i => (
              <div
                key={i}
                style={{
                  height: '80px',
                  background: 'linear-gradient(90deg, #0e0e0e 25%, #1a1a1a 50%, #0e0e0e 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s infinite',
                  borderLeft: '2px solid rgba(200,16,46,0.1)',
                }}
              />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {achievements.map((item, idx) => (
              <TimelineItem key={item.id} item={item} index={idx} delay={idx * 80} isLast={idx === achievements.length - 1} />
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </section>
  );
};

const TimelineItem: React.FC<{
  item: Achievement;
  index: number;
  delay: number;
  isLast: boolean;
}> = ({ item, index, delay, isLast }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1, delay });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`reveal-left${visible ? ' visible' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1px 1fr',
        gap: '0 2rem',
        paddingBottom: isLast ? 0 : '2.5rem',
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Index */}
      <div
        className="font-bebas"
        style={{
          fontSize: '48px',
          color: hovered ? 'rgba(200,16,46,0.2)' : 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          textAlign: 'right',
          paddingTop: '4px',
          transition: 'color 0.3s ease',
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Timeline spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: hovered ? 'var(--red)' : 'rgba(200,16,46,0.3)',
            border: `1px solid ${hovered ? 'var(--red)' : 'rgba(200,16,46,0.15)'}`,
            flexShrink: 0,
            marginTop: '6px',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
            boxShadow: hovered ? '0 0 10px rgba(200,16,46,0.3)' : 'none',
          }}
        />
        {!isLast && (
          <div
            style={{
              flex: 1,
              width: '1px',
              background: 'rgba(255,255,255,0.04)',
              marginTop: '4px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '0 0 0 0',
          paddingBottom: isLast ? 0 : '2rem',
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: '9px',
            color: hovered ? 'var(--red)' : 'rgba(200,16,46,0.35)',
            letterSpacing: '0.2em',
            marginBottom: '0.4rem',
            transition: 'color 0.25s ease',
          }}
        >
          {item.category?.toUpperCase() || 'ACHIEVEMENT'}
          {item.date && <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>{item.date}</span>}
        </div>
        <h4
          className="font-bebas"
          style={{
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            color: hovered ? 'var(--text-primary)' : 'rgba(237,235,230,0.8)',
            margin: '0 0 0.35rem 0',
            lineHeight: 1.1,
            transition: 'color 0.25s ease',
          }}
        >
          {item.title}
        </h4>
        {item.organization && (
          <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            {item.organization}
          </p>
        )}
        {item.description && (
          <p
            className="font-inter"
            style={{
              fontSize: '13px',
              color: 'rgba(237,235,230,0.45)',
              lineHeight: 1.65,
              maxWidth: '520px',
            }}
          >
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}`}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '5rem 0',
        borderLeft: '1px solid rgba(200,16,46,0.08)',
        paddingLeft: '2rem',
      }}
    >
      <div className="font-bebas" style={{ fontSize: '80px', color: 'rgba(200,16,46,0.04)', lineHeight: 1, userSelect: 'none' }}>
        JOURNEY
      </div>
      <p className="font-inter" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
        Achievements are being documented.
      </p>
      <span
        className="font-mono"
        style={{ fontSize: '10px', color: 'rgba(200,16,46,0.35)', letterSpacing: '0.2em', borderBottom: '1px solid rgba(200,16,46,0.15)', paddingBottom: '2px' }}
      >
        CHECK BACK SOON
      </span>
    </div>
  );
};

export default Achievements;
