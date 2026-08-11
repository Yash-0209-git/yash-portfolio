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
      'An AI-powered Gym Management System connecting admins, trainers, and members through personalized fitness tracking, AI-driven guidance, and real-time monitoring.',
    category: 'Web App',
    year: 2026,
    status: 'completed',
    github_url: 'https://github.com/Yash-0209-git/gym-management-system',
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'Groq API', 'Google Gemini', 'SQLAlchemy', 'JWT Authentication', 'WhatsApp API'],
    featured: true, published: true, display_order: 0,
    thumbnail_url: '/projects/leesculpt.png',
    problem: 'Gyms struggle with fragmented communication across members, trainers, and admins, resulting in low member retention, inconsistent workout plans, and unmonitored diet tracking.',
    solution: 'Designed and built a unified full-stack application featuring multi-role access control, automated AI diet & workout recommendation engines, real-time progress analytics, and instant WhatsApp notification dispatches.',
    challenges: 'Designing a secure multi-role access pipeline with optimistic dual-persistence caching, ensuring instantaneous AI response generation without blocking main event loops.',
  },
  {
    id: 'code-sage-ai',
    slug: 'code-sage-ai',
    title: 'CodeSage AI',
    short_description:
      'An intelligent Codebase Analysis & RAG Debugging Platform that extracts repository .zip files, detects project architecture, flags bugs & security issues, generates feature roadmaps, and provides an interactive Deep AI RAG assistant for full repository Q&A.',
    category: 'AI / Developer Tools',
    year: 2026,
    status: 'completed',
    github_url: 'https://github.com/Yash-0209-git/code-sage-ai.git',
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'RAG', 'Groq API', 'Llama 3.3 70B', 'ZIP Parsing', 'AST Parser', 'Tailwind CSS'],
    featured: true, published: true, display_order: 1,
    thumbnail_url: '/projects/code-sage-ai.png',
    problem: 'Developers and code reviewers spend hours understanding unfamiliar codebases, tracing architectural symbols, detecting hidden bugs, and configuring environment setup.',
    solution: 'CodeSage AI automates full repository comprehension by parsing uploaded .zip project archives, extracting AST file symbols, detecting architectural type, running automated issue detection, and providing an interactive Deep AI RAG chatbot for immediate repository Q&A.',
    challenges: 'Efficiently parsing multi-file ZIP archives in memory, extracting AST symbols without code execution, and indexing repository context for low-latency RAG vector search.',
  },
  {
    id: 'rag-tech-bot',
    slug: 'rag-tech-bot',
    title: 'RAG-Tech Bot',
    short_description:
      'AI chatbot that answers technical questions using a custom knowledge base and RAG — delivering accurate, context-aware responses without relying on general LLM knowledge alone.',
    category: 'AI / ML',
    year: 2025,
    status: 'completed',
    github_url: 'https://github.com/Yash-0209-git/rag-tech-bot.git',
    technologies: ['Python', 'FastAPI', 'FAISS', 'Sentence Transformers', 'Groq', 'Llama 3.3 70B', 'React', 'Vite', 'Three.js', 'Tailwind CSS', 'PyTorch'],
    featured: true, published: true, display_order: 2,
    thumbnail_url: '/projects/rag-tech-bot.png',
    problem: 'Standard LLMs answer from general training data, producing hallucinations or outdated answers for domain-specific technical queries.',
    solution: 'Built a full RAG pipeline with query expansion, FAISS vector retrieval, reranking, and context boosting — served through a FastAPI backend and a React + Three.js frontend.',
    challenges: 'Improving retrieval accuracy on short queries, handling multi-stage RAG pipeline latency, and ensuring consistent grounded generation via Llama 3.3 70B.',
  },
];

/* ═══════════════════════════════════════════════════════
   BROADCAST TOWER — Centre-piece SVG
═══════════════════════════════════════════════════════ */
const BroadcastTower: React.FC<{ anyActive: boolean }> = ({ anyActive }) => {
  const col  = 'rgba(200,16,46,0.85)';
  const faint= 'rgba(200,16,46,0.28)';
  const mid  = 'rgba(200,16,46,0.50)';
  return (
    <svg width="120" height="330" viewBox="0 0 120 330" fill="none"
      style={{ overflow: 'visible', display: 'block', filter: anyActive ? 'drop-shadow(0 0 10px rgba(200,16,46,0.5))' : 'drop-shadow(0 0 4px rgba(200,16,46,0.25))', transition: 'filter 0.4s ease' }}>

      {/* Glow base */}
      <ellipse cx="60" cy="318" rx="48" ry="7" fill="rgba(200,16,46,0.18)" style={{ filter:'blur(6px)' }}/>

      {/* Base footing */}
      <rect x="8" y="308" width="104" height="6" rx="2" fill={mid}/>
      <rect x="20" y="314" width="80" height="3" rx="1" fill="rgba(200,16,46,0.3)"/>

      {/* Main legs — wide at bottom */}
      <line x1="60" y1="55"  x2="12"  y2="308" stroke={col} strokeWidth="2.5"/>
      <line x1="60" y1="55"  x2="108" y2="308" stroke={col} strokeWidth="2.5"/>

      {/* Horizontal platforms */}
      <line x1="26" y1="138" x2="94"  y2="138" stroke={mid} strokeWidth="1.8"/>
      <line x1="20" y1="198" x2="100" y2="198" stroke={mid} strokeWidth="1.8"/>
      <line x1="14" y1="258" x2="106" y2="258" stroke={mid} strokeWidth="1.8"/>

      {/* Cross-bracing S1 (55→138) */}
      <line x1="41" y1="80"  x2="70"  y2="138" stroke={faint} strokeWidth="1.2"/>
      <line x1="70" y1="80"  x2="41"  y2="138" stroke={faint} strokeWidth="1.2"/>
      <line x1="34" y1="108" x2="76"  y2="108" stroke="rgba(200,16,46,0.16)" strokeWidth="1"/>

      {/* Cross-bracing S2 (138→198) */}
      <line x1="26" y1="138" x2="60"  y2="198" stroke={faint} strokeWidth="1.2"/>
      <line x1="94" y1="138" x2="60"  y2="198" stroke={faint} strokeWidth="1.2"/>
      <line x1="22" y1="168" x2="98"  y2="168" stroke="rgba(200,16,46,0.14)" strokeWidth="1"/>

      {/* Cross-bracing S3 (198→258) */}
      <line x1="20" y1="198" x2="60"  y2="258" stroke={faint} strokeWidth="1.2"/>
      <line x1="100" y1="198" x2="60" y2="258" stroke={faint} strokeWidth="1.2"/>
      <line x1="16" y1="228" x2="104" y2="228" stroke="rgba(200,16,46,0.12)" strokeWidth="1"/>

      {/* Cross-bracing S4 (258→308) */}
      <line x1="14" y1="258" x2="60"  y2="308" stroke={faint} strokeWidth="1.1"/>
      <line x1="106" y1="258" x2="60" y2="308" stroke={faint} strokeWidth="1.1"/>
      <line x1="12" y1="283" x2="108" y2="283" stroke="rgba(200,16,46,0.10)" strokeWidth="1"/>

      {/* Mast */}
      <line x1="60" y1="8" x2="60" y2="55" stroke={col} strokeWidth="3"
        style={{ filter:'drop-shadow(0 0 4px rgba(200,16,46,0.6))' }}/>

      {/* Dish arms */}
      <line x1="36" y1="22" x2="84" y2="22" stroke={col} strokeWidth="2.2" style={{ filter:'drop-shadow(0 0 5px rgba(200,16,46,0.7))' }}/>
      <line x1="43" y1="36" x2="77" y2="36" stroke="rgba(200,16,46,0.6)" strokeWidth="1.5"/>
      <line x1="60" y1="8"  x2="36" y2="22" stroke="rgba(200,16,46,0.5)" strokeWidth="1.2"/>
      <line x1="60" y1="8"  x2="84" y2="22" stroke="rgba(200,16,46,0.5)" strokeWidth="1.2"/>

      {/* Beacon */}
      <circle cx="60" cy="5" r={anyActive ? 6 : 4} fill="#C8102E"
        style={{ filter: anyActive ? 'drop-shadow(0 0 10px #C8102E) drop-shadow(0 0 22px rgba(200,16,46,0.8))' : 'drop-shadow(0 0 5px #C8102E)', transition:'all 0.3s ease' }}>
        <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════
   COMPACT ORBIT CARD
═══════════════════════════════════════════════════════ */
interface OrbitCardProps {
  project: Project;
  index: number;
  count: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

const OrbitCard: React.FC<OrbitCardProps> = ({ project, index, count, isHovered, onHover, onClick }) => {
  const ORBIT_DUR  = 24; // seconds per revolution — slow, elegant
  const delay = -((index / count) * ORBIT_DUR);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: 0, height: 0,
        transformOrigin: '0 0',
        animation: `orbitRotate ${ORBIT_DUR}s linear infinite`,
        animationDelay: `${delay}s`,
        animationPlayState: isHovered ? 'paused' : 'running',
        zIndex: isHovered ? 10 : 5,
      }}
    >
      {/* Counter-rotate so card text stays upright */}
      <div
        style={{
          position: 'absolute',
          left: 260, // orbit radius
          animation: `counterOrbit ${ORBIT_DUR}s linear infinite`,
          animationDelay: `${delay}s`,
          animationPlayState: isHovered ? 'paused' : 'running',
        }}
        onMouseEnter={() => onHover(project.id)}
        onMouseLeave={() => onHover(null)}
        onClick={onClick}
        data-cursor="view"
      >
        {/* Connecting line from center to card (visual spoke) */}
        <div style={{
          position: 'absolute',
          right: '100%',
          top: '50%',
          width: 20,
          height: 1,
          background: isHovered
            ? 'linear-gradient(90deg, transparent, #C8102E)'
            : 'linear-gradient(90deg, transparent, rgba(200,16,46,0.3))',
          transform: 'translateY(-50%)',
          transition: 'all 0.3s ease',
        }} />

        {/* Anchor dot */}
        <div style={{
          position: 'absolute',
          right: 'calc(100% + 17px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#C8102E' : 'rgba(200,16,46,0.4)',
          boxShadow: isHovered ? '0 0 10px #C8102E' : 'none',
          transition: 'all 0.3s ease',
        }} />

        {/* ── CARD BODY ── */}
        <div style={{
          width: isHovered ? 210 : 155,
          backgroundColor: isHovered ? 'rgba(20,8,10,0.97)' : 'rgba(13,13,15,0.92)',
          border: `1px solid ${isHovered ? 'rgba(200,16,46,0.7)' : 'rgba(200,16,46,0.22)'}`,
          borderLeft: `3px solid ${isHovered ? '#C8102E' : 'rgba(200,16,46,0.35)'}`,
          borderRadius: '4px',
          padding: isHovered ? '0.85rem' : '0.6rem 0.75rem',
          backdropFilter: 'blur(14px)',
          boxShadow: isHovered
            ? '0 0 28px rgba(200,16,46,0.35), 0 8px 32px rgba(0,0,0,0.7)'
            : '0 4px 18px rgba(0,0,0,0.6)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          cursor: 'none',
          position: 'relative',
          transform: 'translateY(-50%)',
        }}>
          {/* HUD corner TL */}
          <div style={{ position:'absolute', top:4, left:4, width:7, height:7,
            borderTop:`1.5px solid ${isHovered ? '#C8102E' : 'rgba(200,16,46,0.35)'}`,
            borderLeft:`1.5px solid ${isHovered ? '#C8102E' : 'rgba(200,16,46,0.35)'}`,
            transition:'border-color 0.3s ease' }} />
          {/* HUD corner BR */}
          <div style={{ position:'absolute', bottom:4, right:4, width:7, height:7,
            borderBottom:`1.5px solid ${isHovered ? '#C8102E' : 'rgba(200,16,46,0.35)'}`,
            borderRight:`1.5px solid ${isHovered ? '#C8102E' : 'rgba(200,16,46,0.35)'}`,
            transition:'border-color 0.3s ease' }} />

          {/* Station ID row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.35rem' }}>
            <span style={{ fontFamily:'monospace', fontSize:'7px', letterSpacing:'0.18em', color:'rgba(200,16,46,0.65)' }}>
              STA-0{index + 1}
            </span>
            <span style={{
              fontFamily:'monospace', fontSize:'6px', letterSpacing:'0.12em',
              color: isHovered ? 'rgba(0,255,102,0.85)' : 'rgba(0,255,102,0.4)',
              display:'flex', alignItems:'center', gap:'0.25rem',
            }}>
              <span style={{ display:'inline-block', width:4, height:4, borderRadius:'50%',
                backgroundColor: isHovered ? '#00FF66' : 'rgba(0,255,102,0.35)',
                boxShadow: isHovered ? '0 0 6px #00FF66' : 'none' }} />
              {isHovered ? 'LOCKED' : 'LIVE'}
            </span>
          </div>

          {/* Thumbnail strip (compact always-visible) */}
          {project.thumbnail_url && (
            <div style={{ width:'100%', height: isHovered ? 85 : 55, overflow:'hidden',
              borderRadius:'2px', marginBottom:'0.4rem',
              border:'1px solid rgba(255,255,255,0.05)', transition:'height 0.3s ease' }}>
              <img src={project.thumbnail_url} alt={project.title}
                style={{ width:'100%', height:'100%', objectFit:'cover',
                  filter: isHovered ? 'brightness(0.85)' : 'brightness(0.5) grayscale(0.4)',
                  transition:'filter 0.35s ease' }} />
            </div>
          )}

          {/* Title */}
          <div style={{ fontFamily:'"Bebas Neue", sans-serif', fontSize: isHovered ? 18 : 15,
            color: isHovered ? '#EDEBE6' : 'rgba(237,235,230,0.75)',
            lineHeight:1.1, marginBottom:'0.25rem', transition:'all 0.3s ease' }}>
            {project.title}
          </div>

          {/* Category · Year */}
          <div style={{ fontFamily:'monospace', fontSize:'7px', color:'rgba(200,16,46,0.65)',
            letterSpacing:'0.1em', marginBottom: isHovered ? '0.5rem' : 0 }}>
            {project.category} · {project.year}
          </div>

          {/* Hover-only: brief description */}
          {isHovered && (
            <>
              <p style={{ fontSize:'10px', color:'rgba(237,235,230,0.5)', lineHeight:1.5, margin:'0 0 0.5rem 0' }}>
                {project.short_description?.slice(0, 95)}{(project.short_description?.length ?? 0) > 95 ? '…' : ''}
              </p>

              {/* Top 3 techs */}
              <div style={{ display:'flex', gap:'0.25rem', flexWrap:'wrap', marginBottom:'0.5rem' }}>
                {project.technologies.slice(0, 3).map(t => (
                  <span key={t} style={{ fontFamily:'monospace', fontSize:'7px', padding:'0.15rem 0.35rem',
                    border:'1px solid rgba(200,16,46,0.3)', color:'rgba(200,16,46,0.75)',
                    borderRadius:'2px' }}>{t}</span>
                ))}
                {project.technologies.length > 3 && (
                  <span style={{ fontFamily:'monospace', fontSize:'7px', padding:'0.15rem 0.3rem',
                    border:'1px solid rgba(255,255,255,0.08)', color:'rgba(237,235,230,0.35)',
                    borderRadius:'2px' }}>+{project.technologies.length - 3}</span>
                )}
              </div>

              <div style={{ fontFamily:'monospace', fontSize:'7px', letterSpacing:'0.15em',
                color:'rgba(200,16,46,0.5)', textAlign:'center' }}>
                CLICK FOR FULL DETAILS ↵
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN WORK SECTION
═══════════════════════════════════════════════════════ */
const Work: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProject(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const categories = ['ALL', ...Array.from(new Set(projects.map(p => p.category.toUpperCase())))];
  const filtered = selectedCategory === 'ALL' ? projects : projects.filter(p => p.category.toUpperCase() === selectedCategory);

  return (
    <section id="work" ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ backgroundColor: 'var(--bg)', position: 'relative' }}>

      <div style={{ height:'1px', background:'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">

        {/* Header + filter row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1.5rem', marginBottom:'2.5rem' }}>
          <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`} style={{ marginBottom:0 }}>
            <h2 className="font-bebas chapter-number">02</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
              <span className="font-mono signal-label">SIGNAL 02</span>
              <span className="font-mono" style={{ fontSize:'14px', color:'var(--text-primary)', letterSpacing:'0.18em' }}>WORK</span>
            </div>
          </div>

          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} data-cursor="pointer"
                className="font-mono"
                style={{
                  fontSize:'9px', padding:'0.4rem 0.9rem', cursor:'none', borderRadius:'2px',
                  border:`1px solid ${selectedCategory === cat ? 'var(--red)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: selectedCategory === cat ? 'rgba(200,16,46,0.12)' : 'var(--bg-3)',
                  color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                  letterSpacing:'0.12em', transition:'all 0.2s ease',
                }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* ── ORBITAL ARENA ── */}
        {loading ? (
          <div style={{ height:680, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontFamily:'monospace', fontSize:'10px', letterSpacing:'0.2em', color:'rgba(200,16,46,0.5)', animation:'signalBlink 1.2s ease infinite' }}>
              SCANNING FOR SIGNALS…
            </div>
          </div>
        ) : (
          <div style={{ position:'relative', width:'100%', height:680, display:'flex', alignItems:'center', justifyContent:'center' }}>

            {/* ── Background orbit-path ring ── */}
            <div style={{
              position:'absolute', width:520+10, height:520+10,
              borderRadius:'50%',
              border:'1px dashed rgba(200,16,46,0.12)',
              pointerEvents:'none',
            }} />
            {/* Inner decorative rings */}
            {[180, 120, 60].map((r, i) => (
              <div key={i} style={{
                position:'absolute',
                width: r*2, height: r*2,
                borderRadius:'50%',
                border:`1px solid rgba(200,16,46,${0.10 - i*0.025})`,
                pointerEvents:'none',
                animation:`pulseRing ${6 + i*2}s ease-in-out infinite`,
                animationDelay:`${i*1.2}s`,
              }} />
            ))}

            {/* ── Radar sweep ── */}
            <div style={{
              position:'absolute',
              width:520, height:520,
              borderRadius:'50%',
              background:'conic-gradient(from 0deg at 50% 50%, rgba(200,16,46,0.13) 0deg, transparent 50deg, transparent 360deg)',
              animation:'radarSweep 9s linear infinite',
              pointerEvents:'none',
            }} />

            {/* ── Tower center ── */}
            <div style={{
              position:'absolute',
              display:'flex', flexDirection:'column', alignItems:'center', gap:'0.6rem',
              zIndex:6,
              transform:'translateY(-14px)', // visually center (tower has base weight)
            }}>
              <BroadcastTower anyActive={hoveredId !== null} />

              {/* HUD label under tower */}
              <div style={{
                fontFamily:'monospace', fontSize:'7.5px', letterSpacing:'0.22em',
                color:'var(--red)', backgroundColor:'rgba(8,5,5,0.9)',
                border:'1px solid rgba(200,16,46,0.35)',
                padding:'0.3rem 1rem', borderRadius:'3px',
                boxShadow:'0 0 16px rgba(200,16,46,0.25)',
                whiteSpace:'nowrap',
              }}>
                THE SIGNAL
              </div>

              {/* Active count */}
              <div style={{ fontFamily:'monospace', fontSize:'6.5px', letterSpacing:'0.15em',
                color:'rgba(237,235,230,0.35)', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <span style={{ display:'inline-block', width:4, height:4, borderRadius:'50%',
                  backgroundColor:'#00FF66', boxShadow:'0 0 6px #00FF66' }} />
                {filtered.length} STATION{filtered.length !== 1 ? 'S' : ''} ORBITING
              </div>
            </div>

            {/* ── Orbiting project cards ── */}
            {filtered.map((project, i) => (
              <OrbitCard
                key={project.id}
                project={project}
                index={i}
                count={filtered.length}
                isHovered={hoveredId === project.id}
                onHover={setHoveredId}
                onClick={() => setSelectedProject(project)}
              />
            ))}

            {/* Hint */}
            <div style={{
              position:'absolute', bottom:12,
              fontFamily:'monospace', fontSize:'8px', letterSpacing:'0.15em',
              color:'rgba(200,16,46,0.3)', textAlign:'center', pointerEvents:'none',
            }}>
              HOVER TO INSPECT · CLICK TO OPEN CASE
            </div>
          </div>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <style>{`
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counterOrbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%, 100% { opacity:0.6; transform:scale(1); }
          50%       { opacity:1;   transform:scale(1.04); }
        }
        @keyframes signalBlink {
          0%,100% { opacity:1; }
          50%     { opacity:0.3; }
        }
      `}</style>
    </section>
  );
};

export default Work;
