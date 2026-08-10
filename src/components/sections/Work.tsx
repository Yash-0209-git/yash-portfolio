import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchProjects } from '../../api';
import { Project } from '../../types';
import ProjectModal from '../ui/ProjectModal';
import { useReveal } from '../../hooks/useReveal';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'leesculpt',
    slug: 'leesculpt',
    title: 'LeeSculpt Gym Application',
    short_description:
      'An AI-powered Gym Management System that connects admins, trainers, and members through personalized fitness tracking, workout and diet management, AI-driven guidance, automated notifications, and real-time progress monitoring.',
    category: 'Web App',
    year: 2026,
    status: 'completed',
    github_url: 'https://github.com/Yash-0209-git/gym-management-system',
    technologies: [
      'Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Supabase',
      'Groq API', 'Google Gemini', 'SQLAlchemy', 'JWT Authentication', 'WhatsApp API',
    ],
    featured: true,
    published: true,
    display_order: 0,
    thumbnail_url: '/projects/leesculpt.png',
    problem: 'Gyms struggle with fragmented communication across members, trainers, and admins, resulting in low member retention, inconsistent workout plans, and unmonitored diet tracking.',
    solution: 'Designed and built a unified full-stack application featuring multi-role access control (Admin, Trainer, Member), automated AI diet & workout recommendation engines via Groq API & Gemini, real-time progress analytics, and instant WhatsApp notification dispatches.',
    challenges: 'Designing a secure multi-role access pipeline with optimistic dual-persistence caching, ensuring instantaneous AI response generation without blocking main event loops.',
  },
];

// ── Broadcast Tower SVG ────────────────────────────────────────────────────
const BroadcastTower: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base legs */}
    <line x1="60" y1="30" x2="20" y2="140" stroke="rgba(200,16,46,0.7)" strokeWidth="2.5" />
    <line x1="60" y1="30" x2="100" y2="140" stroke="rgba(200,16,46,0.7)" strokeWidth="2.5" />
    {/* Cross braces */}
    <line x1="30" y1="95" x2="90" y2="95" stroke="rgba(200,16,46,0.4)" strokeWidth="1.5" />
    <line x1="37" y1="118" x2="83" y2="118" stroke="rgba(200,16,46,0.4)" strokeWidth="1.5" />
    <line x1="22" y1="140" x2="98" y2="140" stroke="rgba(200,16,46,0.6)" strokeWidth="2" />
    {/* Mast */}
    <line x1="60" y1="0" x2="60" y2="30" stroke={active ? '#C8102E' : 'rgba(200,16,46,0.7)'} strokeWidth="3" />
    {/* Antenna tip */}
    <circle cx="60" cy="0" r={active ? 5 : 3} fill="#C8102E"
      style={{ filter: active ? 'drop-shadow(0 0 8px #C8102E) drop-shadow(0 0 16px #C8102E)' : 'drop-shadow(0 0 4px #C8102E)' }} />
    {/* Diagonal signal arms */}
    <line x1="60" y1="18" x2="42" y2="30" stroke="rgba(200,16,46,0.5)" strokeWidth="1.5" />
    <line x1="60" y1="18" x2="78" y2="30" stroke="rgba(200,16,46,0.5)" strokeWidth="1.5" />
  </svg>
);

// ── Radial Signal Line (SVG-based, from tower center to card) ─────────────
const SignalLine: React.FC<{
  fromX: number; fromY: number;
  toX: number; toY: number;
  active: boolean;
}> = ({ fromX, fromY, toX, toY, active }) => {
  const id = `grad-${Math.round(toX)}-${Math.round(toY)}`;
  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 1 }}
      width="100%" height="100%"
    >
      <defs>
        <linearGradient id={id} x1={fromX} y1={fromY} x2={toX} y2={toY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C8102E" stopOpacity={active ? 0.9 : 0.35} />
          <stop offset="100%" stopColor="#C8102E" stopOpacity={active ? 0.4 : 0.08} />
        </linearGradient>
      </defs>
      <line
        x1={fromX} y1={fromY}
        x2={toX} y2={toY}
        stroke={`url(#${id})`}
        strokeWidth={active ? 2 : 1}
        strokeDasharray={active ? 'none' : '6 4'}
        style={{ transition: 'stroke-width 0.3s ease, opacity 0.3s ease' }}
      />
      {active && (
        <circle r={3} fill="#C8102E"
          style={{ filter: 'drop-shadow(0 0 4px #C8102E)' }}
        >
          <animateMotion dur="1.4s" repeatCount="indefinite"
            path={`M ${fromX} ${fromY} L ${toX} ${toY}`} />
        </circle>
      )}
    </svg>
  );
};

// ── Project Station Card ───────────────────────────────────────────────────
interface StationCardProps {
  project: Project;
  index: number;
  angle: number;
  radius: number;
  centerX: number;
  centerY: number;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: () => void;
  hoveredTech: string | null;
  setHoveredTech: (t: string | null) => void;
}

const StationCard: React.FC<StationCardProps> = ({
  project, index, angle, radius, centerX, centerY,
  hoveredId, onHover, onClick, hoveredTech, setHoveredTech,
}) => {
  const cardW = 260;
  const cardH = 200;
  const rad = (angle * Math.PI) / 180;
  const cx = centerX + radius * Math.cos(rad);
  const cy = centerY + radius * Math.sin(rad);

  const isHovered = hoveredId === project.id;
  const isTechMatch = hoveredTech ? project.technologies.includes(hoveredTech) : false;
  const isActive = isHovered || isTechMatch;

  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* SVG signal line from tower to card */}
      <SignalLine
        fromX={centerX}
        fromY={centerY}
        toX={cx}
        toY={cy}
        active={isActive}
      />

      {/* Receiving station dot at card anchor point */}
      <div style={{
        position: 'absolute',
        left: cx - 5,
        top: cy - 5,
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: isActive ? '#C8102E' : 'rgba(200,16,46,0.4)',
        boxShadow: isActive ? '0 0 12px #C8102E, 0 0 24px rgba(200,16,46,0.6)' : 'none',
        zIndex: 3,
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.6)' : 'scale(1)',
      }} />

      {/* Project Card */}
      <div
        ref={cardRef}
        data-cursor="view"
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title}`}
        onClick={onClick}
        onKeyDown={e => e.key === 'Enter' && onClick()}
        onMouseEnter={() => onHover(project.id)}
        onMouseLeave={() => onHover(null)}
        style={{
          position: 'absolute',
          left: cx - cardW / 2,
          top: cy - cardH / 2,
          width: cardW,
          backgroundColor: isActive ? 'rgba(20,20,20,0.98)' : 'rgba(16,16,16,0.9)',
          border: `1px solid ${isActive ? 'rgba(200,16,46,0.7)' : 'rgba(200,16,46,0.2)'}`,
          borderRadius: '6px',
          padding: '1.1rem',
          cursor: 'none',
          zIndex: 4,
          backdropFilter: 'blur(12px)',
          boxShadow: isActive
            ? '0 0 30px rgba(200,16,46,0.35), 0 8px 32px rgba(0,0,0,0.6)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          transform: isActive ? 'scale(1.04) translateZ(0)' : 'scale(1) translateZ(0)',
        }}
      >
        {/* HUD Corner Brackets */}
        {(['tl','tr','bl','br'] as const).map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            top: pos.startsWith('t') ? 4 : undefined,
            bottom: pos.startsWith('b') ? 4 : undefined,
            left: pos.endsWith('l') ? 4 : undefined,
            right: pos.endsWith('r') ? 4 : undefined,
            width: 8, height: 8,
            borderTop: pos.startsWith('t') ? `2px solid ${isActive ? 'var(--red)' : 'rgba(200,16,46,0.4)'}` : undefined,
            borderBottom: pos.startsWith('b') ? `2px solid ${isActive ? 'var(--red)' : 'rgba(200,16,46,0.4)'}` : undefined,
            borderLeft: pos.endsWith('l') ? `2px solid ${isActive ? 'var(--red)' : 'rgba(200,16,46,0.4)'}` : undefined,
            borderRight: pos.endsWith('r') ? `2px solid ${isActive ? 'var(--red)' : 'rgba(200,16,46,0.4)'}` : undefined,
            transition: 'border-color 0.3s ease',
          }} />
        ))}

        {/* Station index + status */}
        <div className="font-mono" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '8px', color: 'rgba(200,16,46,0.7)', letterSpacing: '0.18em', marginBottom: '0.6rem',
        }}>
          <span>STATION-0{index + 1}</span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              backgroundColor: isActive ? '#00FF66' : 'rgba(0,255,102,0.4)',
              boxShadow: isActive ? '0 0 6px #00FF66' : 'none',
              display: 'inline-block',
            }} />
            {isActive ? 'SIGNAL LOCKED' : 'STANDBY'}
          </span>
        </div>

        {/* Thumbnail */}
        {project.thumbnail_url && (
          <div style={{ width: '100%', height: '90px', overflow: 'hidden', borderRadius: '3px', marginBottom: '0.7rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <img src={project.thumbnail_url} alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover',
                filter: isActive ? 'brightness(0.85)' : 'brightness(0.6)',
                transition: 'filter 0.3s ease' }} />
          </div>
        )}

        {/* Title */}
        <h3 className="font-bebas" style={{
          fontSize: 'clamp(18px, 2vw, 22px)', margin: '0 0 0.4rem 0', lineHeight: 1.1,
          color: isActive ? 'var(--text-primary)' : 'rgba(237,235,230,0.75)',
        }}>{project.title}</h3>

        {/* Category + Year */}
        <div className="font-mono" style={{ fontSize: '8px', color: 'var(--red)', letterSpacing: '0.12em', marginBottom: '0.5rem', display: 'flex', gap: '0.6rem' }}>
          <span>{project.category}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ color: 'rgba(237,235,230,0.4)' }}>{project.year}</span>
        </div>

        {/* Tech tags */}
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {project.technologies.slice(0, 4).map(tech => (
            <span key={tech} className="font-mono"
              onMouseEnter={() => setHoveredTech(tech)}
              onMouseLeave={() => setHoveredTech(null)}
              style={{
                fontSize: '7px', padding: '0.15rem 0.3rem',
                border: `1px solid ${hoveredTech === tech ? 'var(--red)' : 'rgba(255,255,255,0.08)'}`,
                backgroundColor: hoveredTech === tech ? 'rgba(200,16,46,0.15)' : 'transparent',
                color: hoveredTech === tech ? 'var(--text-primary)' : 'rgba(237,235,230,0.4)',
                cursor: 'pointer', transition: 'all 0.15s ease', borderRadius: '2px',
              }}>{tech}</span>
          ))}
          {project.technologies.length > 4 && (
            <span className="font-mono" style={{ fontSize: '7px', padding: '0.15rem 0.3rem', border: '1px solid rgba(200,16,46,0.3)', color: 'var(--red)', borderRadius: '2px' }}>
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* GitHub link */}
        {isActive && project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()} data-cursor="open"
            className="font-mono"
            style={{ display: 'inline-block', marginTop: '0.6rem', fontSize: '8px', color: 'rgba(200,16,46,0.7)', textDecoration: 'none', letterSpacing: '0.1em' }}>
            GITHUB ↗
          </a>
        )}
      </div>
    </>
  );
};

// ── Main Work Section ──────────────────────────────────────────────────────
const Work: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 900, h: 620 });

  const [headerRef, headerVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [sectionRef] = useReveal<HTMLElement>({ threshold: 0.05 });

  useEffect(() => {
    (async () => {
      const data = await fetchProjects();
      setProjects(data.length > 0 ? data : FALLBACK_PROJECTS);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProject(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Measure container for correct card positioning
  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      setDimensions({ w: r.width, h: r.height });
    }
  }, []);

  useEffect(() => {
    measureContainer();
    const ro = new ResizeObserver(measureContainer);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureContainer]);

  const categories = ['ALL', ...Array.from(new Set(projects.map(p => p.category.toUpperCase())))];
  const filteredProjects = projects.filter(p =>
    selectedCategory === 'ALL' ? true : p.category.toUpperCase() === selectedCategory
  );

  // Tower center in pixels
  const cx = dimensions.w / 2;
  const cy = dimensions.h / 2;
  // Radius: adaptive
  const radius = Math.min(cx - 160, cy - 120, 280);

  // Assign angle per project (start at -90° = top, go clockwise)
  const getAngle = (i: number, total: number) => -90 + (360 / Math.max(total, 1)) * i;

  return (
    <section
      id="work"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ backgroundColor: 'var(--bg)', position: 'relative' }}
    >
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">
        {/* Chapter Header & Category Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
          <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`} style={{ marginBottom: 0 }}>
            <h2 className="font-bebas chapter-number">02</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span className="font-mono signal-label">SIGNAL 02</span>
              <span className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.18em' }}>
                WORK
              </span>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} data-cursor="pointer" onClick={() => setSelectedCategory(cat)} className="font-mono"
                style={{
                  fontSize: '9px', padding: '0.4rem 0.8rem',
                  border: `1px solid ${selectedCategory === cat ? 'var(--red)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: selectedCategory === cat ? 'rgba(200,16,46,0.12)' : 'var(--bg-3)',
                  color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                  letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tech highlight indicator */}
        {hoveredTech && (
          <div className="font-mono" style={{ fontSize: '9px', color: 'var(--red)', letterSpacing: '0.15em', marginBottom: '1rem', animation: 'fadeIn 0.2s ease' }}>
            HIGHLIGHTING STATIONS USING: {hoveredTech.toUpperCase()}
          </div>
        )}

        {/* ── SIGNAL BROADCAST TOWER ORBITAL LAYOUT ── */}
        {loading ? (
          <div style={{ width: '100%', height: '280px', background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.8s infinite' }} />
        ) : (
          <div
            ref={containerRef}
            style={{ position: 'relative', width: '100%', minHeight: '620px', userSelect: 'none' }}
          >
            {/* ── Concentric Signal Rings ── */}
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                position: 'absolute',
                left: cx - radius * n * 0.42,
                top: cy - radius * n * 0.42,
                width: radius * n * 0.84,
                height: radius * n * 0.84,
                borderRadius: '50%',
                border: `1px dashed rgba(200,16,46,${0.18 - n * 0.04})`,
                pointerEvents: 'none',
                zIndex: 0,
                animation: `signalRingPulse${n} ${4 + n * 2}s ease-in-out infinite`,
              }} />
            ))}

            {/* Radar sweep beam that rotates around center */}
            <div style={{
              position: 'absolute',
              left: cx - radius * 1.2,
              top: cy - radius * 1.2,
              width: radius * 2.4,
              height: radius * 2.4,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(200,16,46,0.12) 0deg, transparent 55deg, transparent 360deg)',
              animation: 'radarSweep 8s linear infinite',
              pointerEvents: 'none',
              zIndex: 1,
              overflow: 'hidden',
            }} />

            {/* ── Tower Center ── */}
            <div style={{
              position: 'absolute',
              left: cx,
              top: cy,
              transform: 'translate(-50%, -62%)',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <BroadcastTower active={hoveredId !== null} />

              {/* Platform base label */}
              <div className="font-mono" style={{
                fontSize: '8px',
                color: 'var(--red)',
                letterSpacing: '0.22em',
                backgroundColor: 'rgba(8,8,8,0.9)',
                border: '1px solid rgba(200,16,46,0.35)',
                padding: '0.3rem 0.8rem',
                borderRadius: '3px',
                boxShadow: '0 0 16px rgba(200,16,46,0.25)',
                whiteSpace: 'nowrap',
              }}>
                THE SIGNAL
              </div>

              {/* Live status */}
              <div className="font-mono" style={{ fontSize: '7px', color: 'rgba(237,235,230,0.4)', letterSpacing: '0.15em', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ width: 5, height: 5, backgroundColor: '#00FF66', borderRadius: '50%', boxShadow: '0 0 6px #00FF66', display: 'inline-block' }} />
                {filteredProjects.length} STATION{filteredProjects.length !== 1 ? 'S' : ''} ACTIVE
              </div>
            </div>

            {/* ── Project Station Cards ── */}
            {filteredProjects.map((project, i) => (
              <StationCard
                key={project.id}
                project={project}
                index={i}
                angle={getAngle(i, filteredProjects.length)}
                radius={radius}
                centerX={cx}
                centerY={cy}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={() => setSelectedProject(project)}
                hoveredTech={hoveredTech}
                setHoveredTech={setHoveredTech}
              />
            ))}

            {/* "Incoming signal" ghost slots for future projects */}
            {filteredProjects.length < 3 &&
              Array.from({ length: 3 - filteredProjects.length }).map((_, gi) => {
                const ghostAngle = getAngle(filteredProjects.length + gi, 3);
                const ghRad = (ghostAngle * Math.PI) / 180;
                const gx = cx + radius * Math.cos(ghRad);
                const gy = cy + radius * Math.sin(ghRad);
                return (
                  <div key={`ghost-${gi}`} style={{
                    position: 'absolute',
                    left: gx - 80,
                    top: gy - 60,
                    width: 160,
                    height: 120,
                    border: '1px dashed rgba(200,16,46,0.15)',
                    borderRadius: '6px',
                    zIndex: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    pointerEvents: 'none',
                    opacity: 0.6,
                  }}>
                    <div className="font-mono" style={{ fontSize: '7px', color: 'rgba(200,16,46,0.3)', letterSpacing: '0.2em' }}>STATION-0{filteredProjects.length + gi + 1}</div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1px dashed rgba(200,16,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'rgba(200,16,46,0.3)' }}>+</div>
                    </div>
                    <div className="font-mono" style={{ fontSize: '6px', color: 'rgba(200,16,46,0.2)', letterSpacing: '0.15em' }}>AWAITING SIGNAL</div>
                  </div>
                );
              })
            }
          </div>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes radarSweep {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes signalRingPulse1 {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.03); }
        }
        @keyframes signalRingPulse2 {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes signalRingPulse3 {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.01); }
        }
      `}</style>
    </section>
  );
};

export default Work;
