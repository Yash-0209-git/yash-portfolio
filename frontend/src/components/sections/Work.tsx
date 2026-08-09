import React, { useEffect, useState, useRef } from 'react';
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
    problem: 'Gyms struggle with fragmented communication across members, trainers, and admins, resulting in low member retention, inconsistent workout plans, and unmonitored diet tracking.',
    solution: 'Designed and built a unified full-stack application featuring multi-role access control (Admin, Trainer, Member), automated AI diet & workout recommendation engines via Groq API & Gemini, real-time progress analytics, and instant WhatsApp notification dispatches.',
    challenges: 'Designing a secure multi-role access pipeline with optimistic dual-persistence caching, ensuring instantaneous AI response generation without blocking main event loops.',
  },
];

function applyTilt(el: HTMLElement, e: React.MouseEvent, maxDeg: number) {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rotX = ((y - cy) / cy) * -maxDeg;
  const rotY = ((x - cx) / cx) * maxDeg;
  el.style.setProperty('--mx', `${((x / rect.width) * 100).toFixed(0)}%`);
  el.style.setProperty('--my', `${((y / rect.height) * 100).toFixed(0)}%`);
  el.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.015)`;
  el.style.transition = 'transform 0.06s ease-out';
}

function resetTilt(el: HTMLElement) {
  el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)';
  el.style.transition = 'transform 0.5s ease';
}

const Work: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

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

  const featuredProject = filteredProjects.find(p => p.featured) || filteredProjects[0];
  const regularProjects = filteredProjects.filter(p => p.id !== featuredProject?.id);

  return (
    <section
      id="work"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">
        {/* Chapter Header & Category Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
          <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`} style={{ marginBottom: 0 }}>
            <h2 className="font-bebas chapter-number">02</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span className="font-mono signal-label">SIGNAL 02</span>
              <span className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.18em' }}>
                WORK
              </span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                data-cursor="pointer"
                onClick={() => setSelectedCategory(cat)}
                className="font-mono"
                style={{
                  fontSize: '9px',
                  padding: '0.4rem 0.8rem',
                  border: `1px solid ${selectedCategory === cat ? 'var(--red)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: selectedCategory === cat ? 'rgba(200,16,46,0.12)' : 'var(--bg-3)',
                  color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter / Hovered Tech Indicator */}
        {hoveredTech && (
          <div
            className="font-mono"
            style={{
              fontSize: '9px',
              color: 'var(--red)',
              letterSpacing: '0.15em',
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            HIGLIGHTING PROJECTS USING: {hoveredTech.toUpperCase()}
          </div>
        )}

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {featuredProject && (
              <FeaturedCard
                project={featuredProject}
                onClick={() => setSelectedProject(featuredProject)}
                hoveredTech={hoveredTech}
                setHoveredTech={setHoveredTech}
                delay={0}
              />
            )}
            {regularProjects.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {regularProjects.map((project, idx) => (
                  <RegularCard
                    key={project.id}
                    project={project}
                    index={idx + 2}
                    onClick={() => setSelectedProject(project)}
                    hoveredTech={hoveredTech}
                    setHoveredTech={setHoveredTech}
                    delay={idx * 80}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

const SkeletonLoader: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div
      style={{
        width: '100%',
        height: '280px',
        background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s infinite',
        borderLeft: '3px solid rgba(200,16,46,0.15)',
      }}
    />
  </div>
);

interface CardProps {
  project: Project;
  onClick: () => void;
  hoveredTech: string | null;
  setHoveredTech: (tech: string | null) => void;
  delay?: number;
}

const FeaturedCard: React.FC<CardProps> = ({ project, onClick, hoveredTech, setHoveredTech, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1, delay });
  const [hovered, setHovered] = useState(false);

  const isTechMatch = hoveredTech ? project.technologies.includes(hoveredTech) : false;

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}`}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title} project details`}
        data-cursor="view"
        onClick={onClick}
        onKeyDown={e => e.key === 'Enter' && onClick()}
        onMouseMove={e => cardRef.current && applyTilt(cardRef.current, e, 3.5)}
        onMouseLeave={() => { cardRef.current && resetTilt(cardRef.current); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{
          width: '100%',
          minHeight: '300px',
          backgroundColor: 'var(--bg-3)',
          borderTop: `1px solid ${hovered || isTechMatch ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.05)'}`,
          borderRight: `1px solid ${hovered || isTechMatch ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.05)'}`,
          borderBottom: `1px solid ${hovered || isTechMatch ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.05)'}`,
          borderLeft: '3px solid var(--red)',
          display: 'flex',
          flexDirection: 'row',
          color: 'var(--text-primary)',
          cursor: 'none',
          position: 'relative',
          overflow: 'hidden',
          transform: 'perspective(1100px)',
          willChange: 'transform',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: hovered || isTechMatch ? '0 16px 48px rgba(200,16,46,0.2)' : '0 4px 24px rgba(0,0,0,0.2)',
        }}
      >
        {/* Mouse-follow inner glow */}
        {(hovered || isTechMatch) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(200,16,46,0.08), transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* FEATURED badge */}
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            backgroundColor: 'var(--red)',
            color: 'white',
            padding: '0.2rem 0.6rem',
            fontSize: '8px',
            letterSpacing: '0.18em',
            zIndex: 1,
          }}
        >
          FEATURED
        </div>

        {/* Left: meta */}
        <div
          style={{
            flex: '0 0 34%',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            className="font-bebas"
            style={{ fontSize: '52px', color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none' }}
          >
            01
          </span>
          <div>
            <div className="font-mono" style={{ color: 'var(--red)', fontSize: '10px', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
              {project.category}
            </div>
            <div className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {project.year}
              <span style={{ width: '3px', height: '3px', backgroundColor: 'var(--red)', borderRadius: '50%', display: 'inline-block' }} />
              {project.status}
            </div>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="font-mono reveal-line"
                data-cursor="open"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '9px',
                  display: 'inline-block',
                  marginTop: '1rem',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                }}
              >
                GITHUB ↗
              </a>
            )}
          </div>
        </div>

        {/* Right: content */}
        <div
          style={{
            flex: 1,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h3 className="font-bebas" style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', lineHeight: 1, margin: 0 }}>
            {project.title}
          </h3>
          <p
            className="font-inter"
            style={{ color: 'rgba(237,235,230,0.6)', fontSize: '13px', lineHeight: 1.75, maxWidth: '500px' }}
          >
            {project.short_description}
          </p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {project.technologies.slice(0, 7).map(tech => (
              <span
                key={tech}
                className="font-mono"
                onMouseEnter={() => setHoveredTech(tech)}
                onMouseLeave={() => setHoveredTech(null)}
                style={{
                  fontSize: '8px',
                  padding: '0.2rem 0.45rem',
                  border: `1px solid ${hoveredTech === tech ? 'var(--red)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: hoveredTech === tech ? 'rgba(200,16,46,0.15)' : 'transparent',
                  color: hoveredTech === tech ? 'var(--text-primary)' : 'rgba(237,235,230,0.45)',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 7 && (
              <span
                className="font-mono"
                style={{ fontSize: '8px', padding: '0.2rem 0.45rem', border: '1px solid rgba(200,16,46,0.25)', color: 'var(--red)' }}
              >
                +{project.technologies.length - 7}
              </span>
            )}
          </div>
          <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.18)', marginTop: '0.25rem', letterSpacing: '0.06em' }}>
            CLICK TO EXPLORE →
          </div>
        </div>
      </div>
    </div>
  );
};

interface RegularCardProps extends CardProps {
  index: number;
}

const RegularCard: React.FC<RegularCardProps> = ({ project, index, onClick, hoveredTech, setHoveredTech, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.08, delay });
  const [hovered, setHovered] = useState(false);

  const isTechMatch = hoveredTech ? project.technologies.includes(hoveredTech) : false;

  return (
    <div ref={ref} className={`reveal-scale${visible ? ' visible' : ''}`}>
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title} project details`}
        data-cursor="view"
        onClick={onClick}
        onKeyDown={e => e.key === 'Enter' && onClick()}
        onMouseMove={e => cardRef.current && applyTilt(cardRef.current, e, 5)}
        onMouseLeave={() => { cardRef.current && resetTilt(cardRef.current); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{
          backgroundColor: 'var(--bg-3)',
          borderTop: `1px solid ${hovered || isTechMatch ? 'rgba(200,16,46,0.4)' : 'rgba(255,255,255,0.05)'}`,
          borderRight: `1px solid ${hovered || isTechMatch ? 'rgba(200,16,46,0.4)' : 'rgba(255,255,255,0.05)'}`,
          borderBottom: `1px solid ${hovered || isTechMatch ? 'rgba(200,16,46,0.4)' : 'rgba(255,255,255,0.05)'}`,
          borderLeft: `2px solid ${hovered || isTechMatch ? 'var(--red)' : 'rgba(200,16,46,0.2)'}`,
          padding: '2rem',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'none',
          transform: 'perspective(1100px)',
          willChange: 'transform',
          transition: 'border-color 0.25s ease, border-left-color 0.25s ease, box-shadow 0.25s ease',
          minHeight: '240px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: hovered || isTechMatch ? '0 12px 36px rgba(200,16,46,0.18)' : 'none',
        }}
      >
        {(hovered || isTechMatch) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(250px circle at var(--mx, 50%) var(--my, 50%), rgba(200,16,46,0.06), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
        <div
          className="font-mono"
          style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: '13px' }}>0{index}</span>
          <span style={{ color: 'var(--red)', letterSpacing: '0.1em' }}>{project.category}</span>
        </div>
        <h3 className="font-bebas" style={{ fontSize: 'clamp(22px, 2.8vw, 30px)', margin: '0 0 0.75rem 0', lineHeight: 1.1 }}>
          {project.title}
        </h3>
        <p
          className="font-inter"
          style={{ color: 'rgba(237,235,230,0.5)', fontSize: '12px', lineHeight: 1.65, flex: 1, marginBottom: '1.5rem' }}
        >
          {project.short_description}
        </p>

        {/* Tech tags preview */}
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {project.technologies.slice(0, 5).map(tech => (
            <span
              key={tech}
              className="font-mono"
              onMouseEnter={() => setHoveredTech(tech)}
              onMouseLeave={() => setHoveredTech(null)}
              style={{
                fontSize: '8px',
                padding: '0.15rem 0.35rem',
                border: `1px solid ${hoveredTech === tech ? 'var(--red)' : 'rgba(255,255,255,0.06)'}`,
                backgroundColor: hoveredTech === tech ? 'rgba(200,16,46,0.15)' : 'transparent',
                color: hoveredTech === tech ? 'var(--text-primary)' : 'rgba(237,235,230,0.4)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div
          className="font-mono"
          style={{
            fontSize: '9px',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: '1rem',
          }}
        >
          <span>{project.year} — {project.status}</span>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              data-cursor="open"
              style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontSize: '10px', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--red)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.25)')}
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Work;
