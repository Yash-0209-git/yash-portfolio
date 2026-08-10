import React, { useEffect, useState } from 'react';
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

/* ═══════════════════════════════════════════════════════
   BROADCAST TOWER — Detailed SVG lattice tower
═══════════════════════════════════════════════════════ */
const BroadcastTower: React.FC<{ active: boolean }> = ({ active }) => {
  const red = 'rgba(200,16,46,0.85)';
  const redFaint = 'rgba(200,16,46,0.28)';
  const redMid = 'rgba(200,16,46,0.5)';

  return (
    <svg
      width="110"
      height="320"
      viewBox="0 0 110 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', display: 'block' }}
    >
      {/* ── Glow under tower base ── */}
      <ellipse cx="55" cy="310" rx="45" ry="7"
        fill="rgba(200,16,46,0.18)"
        style={{ filter: 'blur(6px)' }} />

      {/* ── Base concrete footing ── */}
      <rect x="10" y="295" width="90" height="6" rx="2" fill={redMid} />
      <rect x="18" y="290" width="74" height="5" rx="1" fill="rgba(200,16,46,0.35)" />

      {/* ── Section 5: widest base legs ── */}
      <line x1="55" y1="55" x2="13" y2="290" stroke={red} strokeWidth="2.5" />
      <line x1="55" y1="55" x2="97" y2="290" stroke={red} strokeWidth="2.5" />

      {/* Horizontal platform rings at each major section */}
      {/* Level 1 at y=100 */}
      <line x1="26" y1="130" x2="84" y2="130" stroke={redMid} strokeWidth="1.8" />
      {/* Level 2 at y=175 */}
      <line x1="20" y1="190" x2="90" y2="190" stroke={redMid} strokeWidth="1.8" />
      {/* Level 3 at y=240 */}
      <line x1="15" y1="248" x2="95" y2="248" stroke={redMid} strokeWidth="1.8" />

      {/* ── Cross-bracing Section 1 (y 55–130) ── */}
      <line x1="40" y1="78" x2="68" y2="130" stroke={redFaint} strokeWidth="1.2" />
      <line x1="68" y1="78" x2="40" y2="130" stroke={redFaint} strokeWidth="1.2" />
      <line x1="34" y1="103" x2="74" y2="103" stroke="rgba(200,16,46,0.18)" strokeWidth="1" />

      {/* ── Cross-bracing Section 2 (y 130–190) ── */}
      <line x1="26" y1="130" x2="57" y2="190" stroke={redFaint} strokeWidth="1.2" />
      <line x1="84" y1="130" x2="53" y2="190" stroke={redFaint} strokeWidth="1.2" />
      <line x1="23" y1="160" x2="87" y2="160" stroke="rgba(200,16,46,0.15)" strokeWidth="1" />

      {/* ── Cross-bracing Section 3 (y 190–248) ── */}
      <line x1="20" y1="190" x2="55" y2="248" stroke={redFaint} strokeWidth="1.2" />
      <line x1="90" y1="190" x2="55" y2="248" stroke={redFaint} strokeWidth="1.2" />
      <line x1="17" y1="220" x2="93" y2="220" stroke="rgba(200,16,46,0.12)" strokeWidth="1" />

      {/* ── Cross-bracing Section 4 (y 248–290) ── */}
      <line x1="15" y1="248" x2="55" y2="290" stroke={redFaint} strokeWidth="1.1" />
      <line x1="95" y1="248" x2="55" y2="290" stroke={redFaint} strokeWidth="1.1" />
      <line x1="13" y1="270" x2="97" y2="270" stroke="rgba(200,16,46,0.12)" strokeWidth="1" />

      {/* ── Upper mast section ── */}
      <line x1="55" y1="10" x2="55" y2="55" stroke={red} strokeWidth="3"
        style={{ filter: 'drop-shadow(0 0 3px rgba(200,16,46,0.6))' }} />

      {/* ── Antenna dish / cross arms ── */}
      <line x1="35" y1="22" x2="75" y2="22" stroke={red} strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 4px rgba(200,16,46,0.7))' }} />
      <line x1="42" y1="35" x2="68" y2="35" stroke="rgba(200,16,46,0.6)" strokeWidth="1.5" />
      {/* diagonal arms */}
      <line x1="55" y1="10" x2="35" y2="22" stroke="rgba(200,16,46,0.5)" strokeWidth="1.2" />
      <line x1="55" y1="10" x2="75" y2="22" stroke="rgba(200,16,46,0.5)" strokeWidth="1.2" />

      {/* ── Antenna tip — blinking beacon ── */}
      <circle cx="55" cy="6" r={active ? 5.5 : 4} fill="#C8102E"
        style={{
          filter: active
            ? 'drop-shadow(0 0 8px #C8102E) drop-shadow(0 0 18px rgba(200,16,46,0.7))'
            : 'drop-shadow(0 0 5px #C8102E)',
          transition: 'r 0.3s ease, filter 0.3s ease',
        }}>
        <animate attributeName="opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite" />
      </circle>

      {/* ── Signal radiating rings from antenna (decorative) ── */}
      {[18, 30, 43].map((r, i) => (
        <circle key={i} cx="55" cy="6" r={r}
          stroke="rgba(200,16,46,0.1)"
          strokeWidth="1"
          fill="none"
          style={{ animation: `towerRingFade ${2 + i * 0.7}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════
   PROJECT STATION CARD
═══════════════════════════════════════════════════════ */
interface StationProps {
  project: Project;
  index: number;
  isHovered: boolean;
  isTechHighlighted: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
  hoveredTech: string | null;
  setHoveredTech: (t: string | null) => void;
}

const StationCard: React.FC<StationProps> = ({
  project, index, isHovered, isTechHighlighted,
  onHover, onClick, hoveredTech, setHoveredTech,
}) => {
  const active = isHovered || isTechHighlighted;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title}`}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      data-cursor="view"
      style={{
        position: 'relative',
        marginBottom: '1.5rem',
        cursor: 'none',
      }}
    >
      {/* Connection dot on the vertical spine */}
      <div style={{
        position: 'absolute',
        left: -25,
        top: '50%',
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: active ? '#C8102E' : 'rgba(200,16,46,0.35)',
        boxShadow: active ? '0 0 12px #C8102E, 0 0 24px rgba(200,16,46,0.5)' : 'none',
        border: '1px solid rgba(200,16,46,0.5)',
        zIndex: 2,
        transition: 'all 0.3s ease',
        transform: `translateY(-50%) scale(${active ? 1.5 : 1})`,
      }} />

      {/* Horizontal branch line from spine to card */}
      <div style={{
        position: 'absolute',
        left: -20,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 24,
        height: 1,
        background: active
          ? 'linear-gradient(90deg, #C8102E, rgba(200,16,46,0.4))'
          : 'linear-gradient(90deg, rgba(200,16,46,0.35), rgba(200,16,46,0.08))',
        transition: 'all 0.3s ease',
        zIndex: 1,
      }} />

      {/* Main Card */}
      <div style={{
        background: active
          ? 'linear-gradient(135deg, rgba(24,8,10,0.98), rgba(20,20,22,0.96))'
          : 'linear-gradient(135deg, rgba(18,18,20,0.95), rgba(15,15,18,0.92))',
        border: `1px solid ${active ? 'rgba(200,16,46,0.55)' : 'rgba(200,16,46,0.15)'}`,
        borderLeft: `3px solid ${active ? '#C8102E' : 'rgba(200,16,46,0.3)'}`,
        borderRadius: '4px',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: project.thumbnail_url ? '1fr 240px' : '1fr',
        gap: '1.5rem',
        backdropFilter: 'blur(16px)',
        boxShadow: active
          ? '0 0 40px rgba(200,16,46,0.2), 0 12px 40px rgba(0,0,0,0.6)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        transform: active ? 'translateX(6px)' : 'translateX(0)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* ── Left content ── */}
        <div>
          {/* Top meta row */}
          <div className="font-mono" style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            fontSize: '9px', letterSpacing: '0.18em', marginBottom: '1rem',
            color: 'rgba(200,16,46,0.65)',
          }}>
            <span>STATION-0{index + 1}</span>
            <span style={{ width: 1, height: 10, background: 'rgba(200,16,46,0.3)' }} />
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}>
              <span style={{
                display: 'inline-block', width: 5, height: 5,
                borderRadius: '50%',
                backgroundColor: active ? '#00FF66' : 'rgba(0,255,102,0.35)',
                boxShadow: active ? '0 0 7px #00FF66' : 'none',
                transition: 'all 0.3s ease',
              }} />
              {active ? 'SIGNAL RECEIVED' : 'STANDBY'}
            </span>
            <span style={{ marginLeft: 'auto', color: 'rgba(237,235,230,0.3)' }}>
              {project.category} · {project.year}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="font-bebas" style={{
            fontSize: 'clamp(26px, 3vw, 36px)',
            lineHeight: 1.0,
            margin: '0 0 0.6rem 0',
            color: active ? 'var(--text-primary)' : 'rgba(237,235,230,0.8)',
            letterSpacing: '0.04em',
            transition: 'color 0.3s ease',
          }}>{project.title}</h3>

          {/* Short description */}
          <p style={{
            fontSize: '13px', lineHeight: 1.65,
            color: 'rgba(237,235,230,0.55)',
            margin: '0 0 1.1rem 0',
            maxWidth: '520px',
          }}>{project.short_description}</p>

          {/* Tech stack */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            {project.technologies.map(tech => (
              <span key={tech} className="font-mono"
                onMouseEnter={() => setHoveredTech(tech)}
                onMouseLeave={() => setHoveredTech(null)}
                style={{
                  fontSize: '8px', padding: '0.2rem 0.5rem',
                  border: `1px solid ${hoveredTech === tech ? '#C8102E' : 'rgba(200,16,46,0.2)'}`,
                  backgroundColor: hoveredTech === tech ? 'rgba(200,16,46,0.18)' : 'transparent',
                  color: hoveredTech === tech ? 'var(--text-primary)' : 'rgba(237,235,230,0.4)',
                  borderRadius: '2px', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.08em',
                }}>{tech}</span>
            ))}
          </div>

          {/* Action links */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()} data-cursor="open"
                className="font-mono"
                style={{
                  fontSize: '9px', letterSpacing: '0.15em',
                  color: active ? 'var(--red)' : 'rgba(200,16,46,0.45)',
                  textDecoration: 'none',
                  border: `1px solid ${active ? 'rgba(200,16,46,0.5)' : 'rgba(200,16,46,0.15)'}`,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '2px',
                  background: active ? 'rgba(200,16,46,0.08)' : 'transparent',
                  transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}>
                <span>⟨/⟩</span> GITHUB
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()} data-cursor="open"
                className="font-mono"
                style={{
                  fontSize: '9px', letterSpacing: '0.15em',
                  color: 'rgba(237,235,230,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}>
                LIVE ↗
              </a>
            )}
            <button
              className="font-mono"
              onClick={e => { e.stopPropagation(); onClick(); }}
              data-cursor="view"
              style={{
                marginLeft: 'auto', fontSize: '9px', letterSpacing: '0.15em',
                color: 'rgba(237,235,230,0.4)', background: 'none',
                border: '1px solid rgba(255,255,255,0.08)', padding: '0.4rem 0.8rem',
                borderRadius: '2px', cursor: 'none', transition: 'all 0.2s ease',
              }}>
              VIEW CASE →
            </button>
          </div>
        </div>

        {/* ── Right: Thumbnail ── */}
        {project.thumbnail_url && (
          <div style={{
            borderRadius: '3px',
            overflow: 'hidden',
            border: `1px solid ${active ? 'rgba(200,16,46,0.35)' : 'rgba(255,255,255,0.06)'}`,
            position: 'relative',
            transition: 'border-color 0.3s ease',
          }}>
            <img
              src={project.thumbnail_url}
              alt={project.title}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                filter: active ? 'brightness(0.9)' : 'brightness(0.55) grayscale(0.3)',
                transition: 'filter 0.4s ease',
              }}
            />
            {/* Scanline overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
              pointerEvents: 'none',
            }} />
            {/* Thumbnail label */}
            <div className="font-mono" style={{
              position: 'absolute', bottom: 8, left: 8,
              fontSize: '7px', letterSpacing: '0.15em',
              color: 'rgba(200,16,46,0.8)',
              background: 'rgba(8,8,8,0.85)',
              padding: '0.2rem 0.5rem', borderRadius: '2px',
              border: '1px solid rgba(200,16,46,0.25)',
            }}>
              PREVIEW
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   GHOST STATION (future project placeholder)
═══════════════════════════════════════════════════════ */
const GhostStation: React.FC<{ index: number }> = ({ index }) => (
  <div style={{ position: 'relative', marginBottom: '1.5rem', opacity: 0.4 }}>
    <div style={{
      position: 'absolute', left: -25, top: '50%',
      width: 8, height: 8, borderRadius: '50%',
      border: '1px dashed rgba(200,16,46,0.3)',
      transform: 'translateY(-50%)',
    }} />
    <div style={{
      position: 'absolute', left: -17, top: '50%',
      width: 20, height: 1,
      background: 'linear-gradient(90deg, rgba(200,16,46,0.2), transparent)',
      transform: 'translateY(-50%)',
    }} />
    <div style={{
      border: '1px dashed rgba(200,16,46,0.15)',
      borderLeft: '3px dashed rgba(200,16,46,0.2)',
      borderRadius: '4px',
      padding: '1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '1px dashed rgba(200,16,46,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(200,16,46,0.3)', fontSize: '16px',
      }}>+</div>
      <div>
        <div className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.18em', color: 'rgba(200,16,46,0.3)', marginBottom: '0.25rem' }}>
          STATION-0{index + 1}
        </div>
        <div className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(237,235,230,0.2)' }}>
          AWAITING SIGNAL TRANSMISSION
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN WORK SECTION
═══════════════════════════════════════════════════════ */
const Work: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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

  const categories = ['ALL', ...Array.from(new Set(projects.map(p => p.category.toUpperCase())))];
  const filteredProjects = projects.filter(p =>
    selectedCategory === 'ALL' ? true : p.category.toUpperCase() === selectedCategory
  );

  const anyHovered = hoveredId !== null;

  return (
    <section
      id="work"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ backgroundColor: 'var(--bg)', position: 'relative' }}
    >
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">

        {/* ── Section Header + Filter ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
          <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`} style={{ marginBottom: 0 }}>
            <h2 className="font-bebas chapter-number">02</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span className="font-mono signal-label">SIGNAL 02</span>
              <span className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.18em' }}>WORK</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} data-cursor="pointer" onClick={() => setSelectedCategory(cat)}
                className="font-mono"
                style={{
                  fontSize: '9px', padding: '0.4rem 0.9rem', cursor: 'none',
                  border: `1px solid ${selectedCategory === cat ? 'var(--red)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: selectedCategory === cat ? 'rgba(200,16,46,0.12)' : 'var(--bg-3)',
                  color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                  letterSpacing: '0.12em', transition: 'all 0.2s ease', borderRadius: '2px',
                }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Tech highlight banner */}
        {hoveredTech && (
          <div className="font-mono" style={{
            fontSize: '9px', letterSpacing: '0.15em',
            color: 'var(--red)', marginBottom: '1.2rem',
          }}>
            ↳ HIGHLIGHTING STATIONS USING: <strong>{hoveredTech.toUpperCase()}</strong>
          </div>
        )}

        {/* ── BROADCAST LAYOUT ── */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', minHeight: '480px' }}>

          {/* ── LEFT: Signal Source Panel ── */}
          <div style={{
            flex: '0 0 200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRight: '1px solid rgba(200,16,46,0.15)',
            paddingRight: '1.5rem',
            position: 'relative',
          }}>
            {/* Ambient rings behind tower */}
            {[80, 60, 40].map((r, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: `1px solid rgba(200,16,46,${0.06 - i * 0.015})`,
                pointerEvents: 'none',
                animation: `towerRingFade ${5 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }} />
            ))}

            {/* Tower */}
            <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
              <BroadcastTower active={anyHovered} />
            </div>

            {/* HUD Status Block */}
            <div style={{
              marginTop: '1.5rem',
              width: '100%',
              background: 'rgba(12,8,8,0.9)',
              border: '1px solid rgba(200,16,46,0.25)',
              borderRadius: '3px',
              padding: '0.8rem',
            }}>
              <div className="font-mono" style={{
                fontSize: '7px', letterSpacing: '0.2em',
                color: 'var(--red)', textAlign: 'center',
                borderBottom: '1px solid rgba(200,16,46,0.15)',
                paddingBottom: '0.5rem', marginBottom: '0.6rem',
              }}>THE SIGNAL</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { label: 'STATUS', value: 'BROADCASTING', color: '#00FF66' },
                  { label: 'STATIONS', value: `${filteredProjects.length} ACTIVE`, color: 'var(--red)' },
                  { label: 'FREQ', value: '2.4GHz', color: 'rgba(237,235,230,0.5)' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '6px', letterSpacing: '0.12em', color: 'rgba(237,235,230,0.3)' }}>
                      {row.label}
                    </span>
                    <span className="font-mono" style={{ fontSize: '6px', letterSpacing: '0.1em', color: row.color }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CENTER: Vertical Spine + traveling signal ── */}
          <div style={{
            flex: '0 0 50px',
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
          }}>
            {/* Vertical spine line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'linear-gradient(180deg, rgba(200,16,46,0.5) 0%, rgba(200,16,46,0.08) 100%)',
            }} />
            {/* Traveling signal dot on spine */}
            <div style={{
              position: 'absolute',
              left: 'calc(50% - 3px)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#C8102E',
              boxShadow: '0 0 8px #C8102E',
              animation: 'signalTravel 3s linear infinite',
            }} />
          </div>

          {/* ── RIGHT: Project Receiving Stations ── */}
          <div style={{ flex: 1, paddingLeft: '1.5rem', paddingTop: '0.5rem' }}>
            {loading ? (
              <div style={{
                height: '200px',
                background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.8s infinite',
                borderRadius: '4px',
              }} />
            ) : (
              <>
                {filteredProjects.map((project, i) => (
                  <StationCard
                    key={project.id}
                    project={project}
                    index={i}
                    isHovered={hoveredId === project.id}
                    isTechHighlighted={hoveredTech ? project.technologies.includes(hoveredTech) : false}
                    onHover={setHoveredId}
                    onClick={() => setSelectedProject(project)}
                    hoveredTech={hoveredTech}
                    setHoveredTech={setHoveredTech}
                  />
                ))}

                {/* Ghost slots */}
                {filteredProjects.length < 3 &&
                  Array.from({ length: 3 - filteredProjects.length }).map((_, gi) => (
                    <GhostStation key={`ghost-${gi}`} index={filteredProjects.length + gi} />
                  ))
                }
              </>
            )}
          </div>
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <style>{`
        @keyframes towerRingFade {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.06); }
        }
        @keyframes signalTravel {
          0%   { top: 0%; opacity: 1; }
          80%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

export default Work;
