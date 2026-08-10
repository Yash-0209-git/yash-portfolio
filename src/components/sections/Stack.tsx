import React, { useState } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface SkillGroup { category: string; items: string[]; }

const FALLBACK_SKILL_GROUPS: SkillGroup[] = [
  { category: 'Languages',  items: ['Python', 'TypeScript'] },
  { category: 'Backend',    items: ['FastAPI', 'SQLAlchemy', 'REST APIs', 'JWT Auth'] },
  { category: 'Frontend',   items: ['React', 'Tailwind CSS'] },
  { category: 'Database',   items: ['PostgreSQL', 'Supabase'] },
  { category: 'AI & ML',    items: ['AI/LLMs', 'RAG', 'Groq API'] },
  { category: 'Tools',      items: ['API Integration', 'Git/GitHub'] },
];

/* ═══════════════════════════════════════════════════════
   STATIC NODE LAYOUT  (all coords in SVG viewBox 0 0 900 720)
   Center: (450, 360) | Hub radius: 188 | Skill radius: 88
═══════════════════════════════════════════════════════ */
interface HubNode { id: string; label: string; x: number; y: number; }
interface SkillNode { id: string; label: string; hubId: string; x: number; y: number; }

const CENTER = { x: 450, y: 360 };

const HUBS: HubNode[] = [
  { id: 'ai',        label: 'AI & ML',   x: 450, y: 172 },   // -90°
  { id: 'backend',   label: 'Backend',   x: 613, y: 266 },   // -30°
  { id: 'languages', label: 'Languages', x: 613, y: 454 },   // 30°
  { id: 'tools',     label: 'Tools',     x: 450, y: 548 },   // 90°
  { id: 'database',  label: 'Database',  x: 287, y: 454 },   // 150°
  { id: 'frontend',  label: 'Frontend',  x: 287, y: 266 },   // 210°
];

// Skill nodes fanned around each hub, pointing away from center
const SKILLS: SkillNode[] = [
  // AI & ML  (hub at top, fan upward)
  { id: 'ai-llms',   label: 'AI/LLMs',     hubId: 'ai',        x: 370, y: 93  },
  { id: 'rag',       label: 'RAG',          hubId: 'ai',        x: 450, y: 75  },
  { id: 'groq',      label: 'Groq API',     hubId: 'ai',        x: 530, y: 93  },

  // Backend  (hub at upper-right, fan right)
  { id: 'fastapi',   label: 'FastAPI',      hubId: 'backend',   x: 720, y: 196 },
  { id: 'sqla',      label: 'SQLAlchemy',   hubId: 'backend',   x: 760, y: 248 },
  { id: 'rest',      label: 'REST APIs',    hubId: 'backend',   x: 756, y: 306 },
  { id: 'jwt',       label: 'JWT Auth',     hubId: 'backend',   x: 700, y: 348 },

  // Languages  (hub at lower-right, fan right-down)
  { id: 'python',    label: 'Python',       hubId: 'languages', x: 738, y: 436 },
  { id: 'ts',        label: 'TypeScript',   hubId: 'languages', x: 700, y: 524 },

  // Tools  (hub at bottom, fan downward)
  { id: 'api-int',   label: 'API Integration', hubId: 'tools', x: 530, y: 630 },
  { id: 'git',       label: 'Git/GitHub',   hubId: 'tools',     x: 370, y: 630 },

  // Database  (hub at lower-left, fan left-down)
  { id: 'postgres',  label: 'PostgreSQL',   hubId: 'database',  x: 200, y: 524 },
  { id: 'supabase',  label: 'Supabase',     hubId: 'database',  x: 162, y: 436 },

  // Frontend  (hub at upper-left, fan left-up)
  { id: 'react',     label: 'React',        hubId: 'frontend',  x: 162, y: 284 },
  { id: 'tailwind',  label: 'Tailwind CSS', hubId: 'frontend',  x: 200, y: 196 },
];

// Cross-connections between skill nodes (for synapse lines)
const CROSS_LINKS: [string, string][] = [
  ['ai-llms', 'rag'], ['rag', 'groq'],
  ['fastapi', 'rest'], ['sqla', 'postgres'],
  ['fastapi', 'ai-llms'], ['rest', 'api-int'],
  ['python', 'ai-llms'], ['python', 'fastapi'],
  ['react', 'ts'], ['ts', 'rest'],
];

/* ═══════════════════════════════════════════════════════
   HELPER — find node coords by id
═══════════════════════════════════════════════════════ */
function getCoords(id: string): { x: number; y: number } | null {
  if (id === 'center') return CENTER;
  return HUBS.find(h => h.id === id) || SKILLS.find(s => s.id === id) || null;
}

/* ═══════════════════════════════════════════════════════
   ANIMATED SYNAPSE PULSE DOT (travels along a line)
═══════════════════════════════════════════════════════ */
const SynapseDot: React.FC<{ x1:number; y1:number; x2:number; y2:number; dur:number; delay?:number }> =
  ({ x1, y1, x2, y2, dur, delay = 0 }) => (
    <circle r="2.5" fill="#C8102E" opacity="0.9"
      style={{ filter: 'drop-shadow(0 0 4px #C8102E)' }}>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${delay}s`}>
        <mpath href="#_" />
      </animateMotion>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${delay}s`}
        path={`M ${x1} ${y1} L ${x2} ${y2}`} />
    </circle>
  );

/* ═══════════════════════════════════════════════════════
   MAIN STACK SECTION
═══════════════════════════════════════════════════════ */
const Stack: React.FC = () => {
  const [hoveredHub, setHoveredHub]   = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const [headerRef, headerVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });

  // Determine which nodes/lines are "active"
  const activeHub   = hoveredHub || (hoveredSkill ? SKILLS.find(s => s.id === hoveredSkill)?.hubId ?? null : null);
  const activeSkill = hoveredSkill;

  const isLineActive = (fromId: string, toId: string) => {
    if (activeHub) {
      if (fromId === 'center' && toId === activeHub) return true;
      if (fromId === activeHub || toId === activeHub) return true;
    }
    if (activeSkill) {
      if (fromId === activeSkill || toId === activeSkill) return true;
    }
    return false;
  };

  const isNodeDimmed = (nodeId: string) => {
    if (!hoveredHub && !hoveredSkill) return false;
    if (activeHub) {
      const skillHub = SKILLS.find(s => s.id === nodeId)?.hubId;
      if (nodeId === activeHub || nodeId === 'center' || skillHub === activeHub) return false;
      if (HUBS.find(h => h.id === nodeId)) return true; // other hubs dim
      if (skillHub !== activeHub) return true;
    }
    if (activeSkill && !activeHub) {
      const skill = SKILLS.find(s => s.id === activeSkill);
      if (!skill) return false;
      if (nodeId === activeSkill || nodeId === skill.hubId || nodeId === 'center') return false;
      return true;
    }
    return false;
  };

  return (
    <section id="stack" style={{ backgroundColor: 'var(--bg-2)', position: 'relative' }}>
      <div style={{ height:'1px', background:'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">
        {/* Header */}
        <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`}>
          <h2 className="font-bebas chapter-number">03</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
            <span className="font-mono signal-label">SIGNAL 03</span>
            <span className="font-mono" style={{ fontSize:'14px', color:'var(--text-primary)', letterSpacing:'0.18em' }}>STACK</span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="font-mono" style={{ fontSize:'10px', letterSpacing:'0.18em', color:'rgba(200,16,46,0.45)', marginBottom:'2rem' }}>
          NEURAL SYNAPSE MAP · HOVER NODES TO FIRE CONNECTIONS
        </p>

        {/* ── NEURAL NETWORK SVG ── */}
        <div style={{ position:'relative', width:'100%', overflow:'visible' }}>
          <svg
            viewBox="0 0 900 720"
            width="100%"
            style={{ display:'block', overflow:'visible' }}
            aria-label="Tech stack neural network map"
          >
            <defs>
              {/* Glow filter */}
              <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Center glow radial */}
              <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(200,16,46,0.5)" />
                <stop offset="100%" stopColor="rgba(200,16,46,0)"   />
              </radialGradient>
            </defs>

            {/* ── Background grid dots ── */}
            {Array.from({ length: 9 }).map((_, row) =>
              Array.from({ length: 12 }).map((_, col) => (
                <circle key={`${row}-${col}`}
                  cx={col * 82 + 30} cy={row * 82 + 30}
                  r="1.2" fill="rgba(200,16,46,0.07)" />
              ))
            )}

            {/* ── Center ambient glow ── */}
            <circle cx={CENTER.x} cy={CENTER.y} r="80"
              fill="url(#centerGrad)" opacity="0.6">
              <animate attributeName="r" values="75;90;75" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite"/>
            </circle>

            {/* ── Center-to-Hub lines ── */}
            {HUBS.map(hub => {
              const active = isLineActive('center', hub.id);
              return (
                <g key={`c-${hub.id}`}>
                  <line
                    x1={CENTER.x} y1={CENTER.y} x2={hub.x} y2={hub.y}
                    stroke={active ? 'rgba(200,16,46,0.85)' : 'rgba(200,16,46,0.15)'}
                    strokeWidth={active ? 1.8 : 1}
                    strokeDasharray={active ? 'none' : '5 4'}
                    style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                  />
                  {/* Synapse dot from center to hub */}
                  {active && (
                    <SynapseDot x1={CENTER.x} y1={CENTER.y} x2={hub.x} y2={hub.y}
                      dur={1.6 + Math.random() * 0.6} />
                  )}
                </g>
              );
            })}

            {/* ── Hub-to-Skill lines ── */}
            {SKILLS.map(skill => {
              const hub = HUBS.find(h => h.id === skill.hubId)!;
              const active = isLineActive(skill.hubId, skill.id);
              return (
                <g key={`h-${skill.id}`}>
                  <line
                    x1={hub.x} y1={hub.y} x2={skill.x} y2={skill.y}
                    stroke={active ? 'rgba(200,16,46,0.75)' : 'rgba(200,16,46,0.12)'}
                    strokeWidth={active ? 1.5 : 0.8}
                    strokeDasharray={active ? 'none' : '4 5'}
                    style={{ transition: 'stroke 0.25s ease, stroke-width 0.25s ease' }}
                  />
                  {active && (
                    <SynapseDot x1={hub.x} y1={hub.y} x2={skill.x} y2={skill.y}
                      dur={1.2} delay={Math.random() * 0.5} />
                  )}
                </g>
              );
            })}

            {/* ── Cross-skill synapse links ── */}
            {CROSS_LINKS.map(([a, b], i) => {
              const na = getCoords(a);
              const nb = getCoords(b);
              if (!na || !nb) return null;
              const active = isLineActive(a, b) || (activeSkill === a) || (activeSkill === b);
              return (
                <line key={`cross-${i}`}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={active ? 'rgba(200,16,46,0.5)' : 'rgba(200,16,46,0.06)'}
                  strokeWidth={active ? 1.2 : 0.6}
                  strokeDasharray="3 6"
                  style={{ transition: 'stroke 0.25s ease' }}
                />
              );
            })}

            {/* ── CENTER NODE ── */}
            <g style={{ cursor: 'default' }}>
              {/* Outer pulse rings */}
              {[52, 40, 30].map((r, i) => (
                <circle key={i} cx={CENTER.x} cy={CENTER.y} r={r}
                  fill="none"
                  stroke="rgba(200,16,46,0.2)"
                  strokeWidth="1"
                  style={{ animation: `neuronPulse ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.8}s` }}
                />
              ))}
              {/* Core */}
              <circle cx={CENTER.x} cy={CENTER.y} r="22"
                fill="rgba(200,16,46,0.9)"
                filter="url(#strongGlow)"
                style={{ animation: 'neuronPulse 3s ease-in-out infinite' }}
              />
              <circle cx={CENTER.x} cy={CENTER.y} r="16" fill="#C8102E" />
              <text x={CENTER.x} y={CENTER.y - 4}
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="6.5" fontFamily="monospace" letterSpacing="1" fontWeight="700">
                YASH
              </text>
              <text x={CENTER.x} y={CENTER.y + 6}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.75)" fontSize="5" fontFamily="monospace" letterSpacing="1">
                .SYS
              </text>
            </g>

            {/* ── HUB NODES ── */}
            {HUBS.map(hub => {
              const isActive  = hoveredHub === hub.id || activeHub === hub.id;
              const isDimmed  = isNodeDimmed(hub.id);
              return (
                <g key={hub.id}
                  style={{ cursor: 'pointer', opacity: isDimmed ? 0.25 : 1, transition: 'opacity 0.3s ease' }}
                  onMouseEnter={() => setHoveredHub(hub.id)}
                  onMouseLeave={() => setHoveredHub(null)}
                >
                  {/* Glow ring */}
                  {isActive && (
                    <circle cx={hub.x} cy={hub.y} r="28"
                      fill="rgba(200,16,46,0.12)"
                      style={{ animation: 'neuronPulse 1.5s ease-in-out infinite' }}
                    />
                  )}
                  {/* Hub body */}
                  <circle cx={hub.x} cy={hub.y} r={isActive ? 18 : 14}
                    fill={isActive ? 'rgba(200,16,46,0.9)' : 'rgba(30,10,14,0.95)'}
                    stroke={isActive ? '#C8102E' : 'rgba(200,16,46,0.45)'}
                    strokeWidth={isActive ? 2 : 1.2}
                    filter={isActive ? 'url(#nodeGlow)' : undefined}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Inner ring */}
                  <circle cx={hub.x} cy={hub.y} r={isActive ? 11 : 8}
                    fill="none"
                    stroke={isActive ? 'rgba(255,255,255,0.35)' : 'rgba(200,16,46,0.25)'}
                    strokeWidth="0.8"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Dot center */}
                  <circle cx={hub.x} cy={hub.y} r="3"
                    fill={isActive ? 'white' : '#C8102E'}
                    style={{ transition: 'fill 0.3s ease' }}
                  />
                  {/* Label */}
                  <text
                    x={hub.x} y={hub.y + 28}
                    textAnchor="middle"
                    fill={isActive ? '#EDEBE6' : 'rgba(237,235,230,0.55)'}
                    fontSize="9.5" fontFamily="monospace" letterSpacing="1.5" fontWeight="600"
                    style={{ transition: 'fill 0.3s ease', userSelect: 'none' }}
                  >
                    {hub.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* ── SKILL NODES ── */}
            {SKILLS.map(skill => {
              const isActive = hoveredSkill === skill.id;
              const isLinked = activeHub === skill.hubId;
              const isDimmed = isNodeDimmed(skill.id);
              const lit = isActive || isLinked;

              return (
                <g key={skill.id}
                  style={{ cursor: 'pointer', opacity: isDimmed ? 0.18 : 1, transition: 'opacity 0.3s ease' }}
                  onMouseEnter={() => setHoveredSkill(skill.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Glow */}
                  {lit && (
                    <circle cx={skill.x} cy={skill.y} r="18"
                      fill="rgba(200,16,46,0.15)"
                      filter="url(#nodeGlow)"
                      style={{ animation: 'neuronPulse 1.2s ease-in-out infinite' }}
                    />
                  )}
                  {/* Body */}
                  <circle cx={skill.x} cy={skill.y} r={lit ? 12 : 9}
                    fill={isActive ? '#C8102E' : lit ? 'rgba(200,16,46,0.35)' : 'rgba(20,10,12,0.95)'}
                    stroke={lit ? '#C8102E' : 'rgba(200,16,46,0.28)'}
                    strokeWidth={lit ? 1.8 : 1}
                    filter={isActive ? 'url(#nodeGlow)' : undefined}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                  {/* Inner dot */}
                  <circle cx={skill.x} cy={skill.y} r={isActive ? 5 : 3.5}
                    fill={isActive ? 'white' : lit ? '#C8102E' : 'rgba(200,16,46,0.5)'}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                  {/* Label — position smartly based on hub angle */}
                  <text
                    x={skill.x}
                    y={skill.y + (skill.y > CENTER.y + 80 ? 22 : skill.y < CENTER.y - 80 ? -16 : 22)}
                    textAnchor="middle"
                    fill={lit ? '#EDEBE6' : 'rgba(237,235,230,0.4)'}
                    fontSize="8.5" fontFamily="monospace" letterSpacing="0.5"
                    style={{ transition: 'fill 0.25s ease', userSelect: 'none' }}
                  >
                    {skill.label}
                  </text>
                </g>
              );
            })}

            {/* ── HOVER TOOLTIP ── */}
            {hoveredSkill && (() => {
              const sk = SKILLS.find(s => s.id === hoveredSkill);
              const hub = sk ? HUBS.find(h => h.id === sk.hubId) : null;
              if (!sk || !hub) return null;
              // Position tooltip above/below node
              const ty = sk.y < 360 ? sk.y + 20 : sk.y - 36;
              return (
                <g>
                  <rect x={sk.x - 52} y={ty - 8} width="104" height="18"
                    rx="3" fill="rgba(12,5,7,0.95)"
                    stroke="rgba(200,16,46,0.5)" strokeWidth="0.8" />
                  <text x={sk.x} y={ty + 4}
                    textAnchor="middle"
                    fill="rgba(200,16,46,0.85)" fontSize="7.5" fontFamily="monospace" letterSpacing="1">
                    {hub.label.toUpperCase()} MODULE
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* ── Status telemetry bar ── */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(8,5,5,0.7)',
          border: '1px solid rgba(200,16,46,0.2)',
          borderRadius: '4px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              backgroundColor: (hoveredHub || hoveredSkill) ? '#C8102E' : 'rgba(200,16,46,0.3)',
              boxShadow: (hoveredHub || hoveredSkill) ? '0 0 10px rgba(200,16,46,0.9)' : 'none',
              transition: 'all 0.3s ease',
            }} />
            <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(237,235,230,0.7)' }}>
              {hoveredHub
                ? <><span style={{ color: '#C8102E' }}>HUB ACTIVE: {hoveredHub.toUpperCase()}</span>{' '}— {(FALLBACK_SKILL_GROUPS.find(g => g.category.toLowerCase().replace(' & ', ' ').replace(' ', '') === hoveredHub) || FALLBACK_SKILL_GROUPS.find(g => g.category.toLowerCase().includes(hoveredHub.split('')[0].toLowerCase())))?.items.length ?? ''} SKILL NODES FIRING</>
                : hoveredSkill
                ? <><span style={{ color: '#C8102E' }}>SYNAPSE: {hoveredSkill.toUpperCase()}</span>{' '}— MODULE SIGNAL ACTIVE</>
                : 'NEURAL MAP ONLINE · 15 NODES · 6 CLUSTERS · HOVER TO FIRE SYNAPSES'
              }
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'NODES', value: SKILLS.length },
              { label: 'CLUSTERS', value: HUBS.length },
              { label: 'LINKS', value: SKILLS.length + HUBS.length + CROSS_LINKS.length },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div className="font-bebas" style={{ fontSize: '18px', color: 'var(--red)', lineHeight: 1 }}>{stat.value}</div>
                <div className="font-mono" style={{ fontSize: '6.5px', letterSpacing: '0.15em', color: 'rgba(237,235,230,0.3)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes neuronPulse {
          0%,100% { opacity:0.7; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.12); }
        }
      `}</style>
    </section>
  );
};

export default Stack;
