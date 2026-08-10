import React, { useEffect, useState } from 'react';
import { fetchSkills, groupSkills } from '../../api';
import { SkillGroup } from '../../types';
import { useReveal } from '../../hooks/useReveal';

const FALLBACK_SKILL_GROUPS: SkillGroup[] = [
  { category: 'Languages',  items: ['Python', 'TypeScript'] },
  { category: 'Backend',    items: ['FastAPI', 'SQLAlchemy', 'REST APIs', 'JWT Authentication'] },
  { category: 'Frontend',   items: ['React', 'Tailwind CSS'] },
  { category: 'Database',   items: ['PostgreSQL', 'Supabase'] },
  { category: 'AI & ML',    items: ['AI/LLMs', 'RAG', 'Groq API'] },
  { category: 'Tools',      items: ['API Integration', 'Backend Development', 'AI Engineering', 'Git/GitHub'] },
];

const CAT_COLOR: Record<string, string> = {
  'Languages':  '#C8102E',
  'Backend':    '#e05c1a',
  'Frontend':   '#a78bfa',
  'Database':   '#34d399',
  'AI & ML':    '#60a5fa',
  'Tools':      '#fbbf24',
};

// Tech Ecosystem Connections Map (Phase 5)
const TECH_CONNECTIONS: Record<string, string[]> = {
  'Python': ['FastAPI', 'SQLAlchemy', 'AI/LLMs', 'RAG', 'Groq API', 'Backend Development', 'AI Engineering'],
  'TypeScript': ['React', 'FastAPI', 'Frontend'],
  'FastAPI': ['Python', 'SQLAlchemy', 'REST APIs', 'JWT Authentication', 'PostgreSQL', 'Supabase', 'React', 'API Integration'],
  'SQLAlchemy': ['Python', 'FastAPI', 'PostgreSQL'],
  'REST APIs': ['FastAPI', 'JWT Authentication', 'API Integration', 'Python'],
  'JWT Authentication': ['FastAPI', 'REST APIs', 'Backend Development'],
  'React': ['TypeScript', 'Tailwind CSS', 'FastAPI', 'Frontend'],
  'Tailwind CSS': ['React'],
  'PostgreSQL': ['Supabase', 'SQLAlchemy', 'FastAPI'],
  'Supabase': ['PostgreSQL', 'FastAPI', 'Backend Development'],
  'AI/LLMs': ['Groq API', 'RAG', 'Python', 'AI Engineering'],
  'RAG': ['AI/LLMs', 'Groq API', 'Python', 'AI Engineering'],
  'Groq API': ['AI/LLMs', 'RAG', 'Python', 'FastAPI'],
  'API Integration': ['REST APIs', 'FastAPI', 'Backend Development'],
  'Backend Development': ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'JWT Authentication'],
  'AI Engineering': ['AI/LLMs', 'RAG', 'Groq API', 'Python'],
  'Git/GitHub': ['Python', 'TypeScript', 'FastAPI', 'React'],
};

const Stack: React.FC = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const flat = await fetchSkills();
      setSkillGroups(flat.length > 0 ? groupSkills(flat) : FALLBACK_SKILL_GROUPS);
    })();
  }, []);

  const connectedSkills = hoveredSkill ? (TECH_CONNECTIONS[hoveredSkill] || []) : [];

  return (
    <section id="stack" style={{ backgroundColor: 'var(--bg-2)' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">
        {/* Chapter Header */}
        <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`}>
          <h2 className="font-bebas chapter-number">03</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span className="font-mono signal-label">SIGNAL 03</span>
            <span className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.18em' }}>
              STACK
            </span>
          </div>
        </div>

        {/* Two-panel layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '4rem', alignItems: 'start' }}>

          {/* Left: Category nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'sticky', top: '2rem' }}>
            <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(200,16,46,0.3)', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              CATEGORIES
            </div>
            {skillGroups.map(group => (
              <button
                key={group.category}
                data-cursor="pointer"
                onClick={() => setActiveCategory(prev => prev === group.category ? null : group.category)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '3px',
                  backgroundColor: activeCategory === group.category ? 'rgba(200,16,46,0.08)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: CAT_COLOR[group.category] || 'var(--red)',
                    flexShrink: 0,
                    opacity: activeCategory === group.category || !activeCategory ? 1 : 0.3,
                    transition: 'opacity 0.2s',
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    fontSize: '10px',
                    color: activeCategory === group.category
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    letterSpacing: '0.12em',
                    transition: 'color 0.2s',
                  }}
                >
                  {group.category.toUpperCase()}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '9px',
                    color: 'rgba(200,16,46,0.4)',
                    marginLeft: 'auto',
                  }}
                >
                  {group.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Skills display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {skillGroups
              .filter(g => !activeCategory || g.category === activeCategory)
              .map((group, idx) => (
                <SkillGroupRow
                  key={group.category}
                  group={group}
                  delay={idx * 70}
                  color={CAT_COLOR[group.category] || 'var(--red)'}
                  hoveredSkill={hoveredSkill}
                  setHoveredSkill={setHoveredSkill}
                  connectedSkills={connectedSkills}
                />
              ))}
          </div>
        </div>

        {/* Phase 5 — Neural Connection Telemetry Strip */}
        <div
          style={{
            marginTop: '4rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(8,8,8,0.6)',
            border: '1px solid rgba(200,16,46,0.2)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: hoveredSkill ? 'var(--red)' : 'rgba(200,16,46,0.3)',
                boxShadow: hoveredSkill ? '0 0 10px rgba(200,16,46,0.8)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(237,235,230,0.85)', letterSpacing: '0.1em' }}>
              {hoveredSkill ? (
                <>
                  <span style={{ color: 'var(--red)' }}>[NODE: {hoveredSkill.toUpperCase()}]</span> ↔ CONNECTED TO:{' '}
                  <span style={{ color: 'rgba(237,235,230,0.6)' }}>
                    {connectedSkills.length > 0 ? connectedSkills.join(' · ') : 'PRIMARY CORE'}
                  </span>
                </>
              ) : (
                'HOVER OVER ANY TECHNOLOGY MODULE TO VISUALIZE ECOSYSTEM CONNECTIONS'
              )}
            </span>
          </div>

          <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(200,16,46,0.4)', letterSpacing: '0.15em' }}>
            {hoveredSkill ? `${connectedSkills.length + 1} ACTIVE NODES` : 'NEURAL MAP ONLINE'}
          </span>
        </div>
      </div>
    </section>
  );
};

const SkillGroupRow: React.FC<{
  group: SkillGroup;
  delay: number;
  color: string;
  hoveredSkill: string | null;
  setHoveredSkill: (name: string | null) => void;
  connectedSkills: string[];
}> = ({ group, delay, color, hoveredSkill, setHoveredSkill, connectedSkills }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1, delay });

  return (
    <div
      ref={ref}
      className={`reveal-left${visible ? ' visible' : ''}`}
    >
      <div
        className="font-mono"
        style={{
          fontSize: '10px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.25em',
          marginBottom: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
        {group.category.toUpperCase()}
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {group.items.map((item, i) => (
          <SkillPill
            key={item}
            name={item}
            delay={i * 30}
            color={color}
            hoveredSkill={hoveredSkill}
            setHoveredSkill={setHoveredSkill}
            connectedSkills={connectedSkills}
          />
        ))}
      </div>
    </div>
  );
};

const SkillPill: React.FC<{
  name: string;
  delay: number;
  color: string;
  hoveredSkill: string | null;
  setHoveredSkill: (name: string | null) => void;
  connectedSkills: string[];
}> = ({ name, delay, color, hoveredSkill, setHoveredSkill, connectedSkills }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.05, delay });

  const isCurrentHovered = hoveredSkill === name;
  const isConnected = connectedSkills.includes(name);
  const isAnyHovered = !!hoveredSkill;

  let opacity = 1;
  if (isAnyHovered && !isCurrentHovered && !isConnected) {
    opacity = 0.35;
  }

  return (
    <div
      ref={ref}
      className={`reveal-scale${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="font-inter"
        onMouseEnter={() => setHoveredSkill(name)}
        onMouseLeave={() => setHoveredSkill(null)}
        style={{
          fontSize: '12px',
          color: isCurrentHovered || isConnected ? 'white' : 'rgba(237,235,230,0.65)',
          backgroundColor: isCurrentHovered
            ? 'var(--red)'
            : isConnected
            ? 'rgba(200,16,46,0.18)'
            : 'var(--bg-3)',
          border: `1px solid ${
            isCurrentHovered
              ? 'var(--red)'
              : isConnected
              ? color
              : 'rgba(255,255,255,0.06)'
          }`,
          padding: '0.4rem 0.85rem',
          transition: 'all 0.22s ease',
          transform: isCurrentHovered ? 'translateY(-3px)' : isConnected ? 'translateY(-1px)' : 'translateY(0)',
          cursor: 'pointer',
          letterSpacing: '0.02em',
          opacity,
          boxShadow: isCurrentHovered
            ? '0 4px 18px rgba(200,16,46,0.4)'
            : isConnected
            ? '0 0 12px rgba(200,16,46,0.2)'
            : 'none',
        }}
      >
        {name}
        {isConnected && !isCurrentHovered && (
          <span style={{ fontSize: '8px', color: 'var(--red)', marginLeft: '0.4rem' }}>●</span>
        )}
      </div>
    </div>
  );
};

export default Stack;
