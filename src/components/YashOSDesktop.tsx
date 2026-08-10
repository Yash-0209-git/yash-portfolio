import React, { useState, useEffect } from 'react';
import { playTransmissionSound, playBeep } from '../utils/audio';
import { STATIC_PROJECTS } from '../api';
import FlappyBirdApp from './FlappyBirdApp';
import TaskManagerApp from './TaskManagerApp';
import MatrixWallpaperCanvas, { WallpaperMode } from './MatrixWallpaperCanvas';

type ActiveWindow = 'this_pc' | 'file_manager' | 'about_me' | 'cert_preview' | 'flappy_bird' | 'projects' | 'task_manager' | 'wallpapers' | null;

export default function YashOSDesktop({ onClose }: { onClose: () => void }) {
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>('this_pc');
  const [activeFolder, setActiveFolder] = useState<'root' | 'certs' | 'documents'>('root');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [selectedCertImg, setSelectedCertImg] = useState('/certificates/hack_a_cure.jpg');
  const [wallpaperMode, setWallpaperMode] = useState<WallpaperMode>('signal_mesh');

  useEffect(() => {
    playTransmissionSound();

    const updateClock = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const openApp = (app: ActiveWindow) => {
    playBeep(600, 0.08);
    setActiveWindow(app);
    setStartMenuOpen(false);
  };

  const openExternal = (url: string) => {
    playBeep(750, 0.1);
    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0d14',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(200, 16, 46, 0.18) 0%, rgba(10, 13, 20, 0.95) 75%)',
        zIndex: 99999,
        fontFamily: 'Segoe UI, Inter, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Dynamic Background Canvas (Wallpaper Engine) */}
      <MatrixWallpaperCanvas mode={wallpaperMode} />

      {/* Windows CRT / Grid Mesh Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(200,16,46,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,16,46,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '36px',
          backgroundColor: 'rgba(18, 22, 32, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(200,16,46,0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 1.25rem',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em' }}>
            YASH OS v1.0 // OVERDRIVE EDITION
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>| SECURITY CLEARANCE: LEVEL 5</span>
        </div>

        <button
          onClick={onClose}
          data-cursor="pointer"
          style={{
            backgroundColor: 'var(--red)',
            color: 'white',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            padding: '0.35rem 0.9rem',
            borderRadius: '3px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            boxShadow: '0 0 12px rgba(200,16,46,0.4)',
          }}
        >
          EXIT YASH OS ×
        </button>
      </div>

      {/* Desktop App Icons Grid — Windows multi-column wrap layout */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '1.5rem',
          bottom: '54px',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: '0.4rem 1.25rem',
          maxHeight: 'calc(100vh - 108px)',
          zIndex: 10,
        }}
      >
        {/* 💻 This PC */}
        <DesktopIcon
          icon="💻"
          label="This PC"
          onClick={() => openApp('this_pc')}
        />

        {/* 📁 File Manager */}
        <DesktopIcon
          icon="📁"
          label="File Manager"
          onClick={() => {
            setActiveFolder('root');
            openApp('file_manager');
          }}
        />

        {/* 🐤 Flappy Bird */}
        <DesktopIcon
          icon="🐤"
          label="Flappy Bird.exe"
          badge="GAME"
          onClick={() => openApp('flappy_bird')}
        />

        {/* 👤 About Me */}
        <DesktopIcon
          icon="📄"
          label="About Me.txt"
          onClick={() => openApp('about_me')}
        />

        {/* 🗂️ Projects */}
        <DesktopIcon
          icon="🗂️"
          label="Projects"
          badge="NEW"
          onClick={() => openApp('projects')}
        />

        {/* ⚡ Task Manager */}
        <DesktopIcon
          icon="⚡"
          label="Task Manager"
          badge="SYS"
          onClick={() => openApp('task_manager')}
        />

        {/* 🖼️ Wallpapers */}
        <DesktopIcon
          icon="🖼️"
          label="Wallpapers"
          badge="MOD"
          onClick={() => openApp('wallpapers')}
        />

        {/* 🐙 GitHub */}
        <DesktopIcon
          icon="🐙"
          label="GitHub"
          badge="LINK"
          onClick={() => openExternal('https://github.com/Yash-0209-git')}
        />

        {/* 💼 LinkedIn */}
        <DesktopIcon
          icon="💼"
          label="LinkedIn"
          badge="LINK"
          onClick={() => openExternal('https://www.linkedin.com/in/yashwanth-c-918a53317')}
        />

        {/* 📸 Instagram */}
        <DesktopIcon
          icon="📸"
          label="Instagram"
          badge="LINK"
          onClick={() => openExternal('https://instagram.com/yashhwanth__')}
        />

        {/* ✉️ Gmail */}
        <DesktopIcon
          icon="✉️"
          label="Gmail"
          badge="MAIL"
          onClick={() => openExternal('https://mail.google.com/mail/?view=cm&fs=1&to=yashwanth02092006@gmail.com')}
        />
      </div>

      {/* WINDOW 1: THIS PC */}
      {activeWindow === 'this_pc' && (
        <WindowsFrame title="This PC — System Specs" onClose={() => setActiveWindow(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '40px' }}>💻</div>
              <div>
                <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Yashwanth's System Workstation</h3>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>OS: YashOS 2026.08 Enterprise Edition</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div><strong>PROCESSOR:</strong> AI/ML Neural Pipeline (Python, Groq, Gemini)</div>
              <div><strong>MEMORY:</strong> High-Concurrency FastAPI Caching</div>
              <div><strong>GRAPHICS:</strong> Modern React + CSS Design Engine</div>
              <div><strong>STORAGE:</strong> Persistent JSON Disk Engine</div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.15em' }}>DRIVES & FILES</span>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                <FileGridItem
                  icon="📝"
                  name="About Me.txt"
                  size="2.4 KB"
                  onClick={() => openApp('about_me')}
                />
                <FileGridItem
                  icon="📁"
                  name="Certificates"
                  size="1 item"
                  onClick={() => {
                    setActiveFolder('certs');
                    openApp('file_manager');
                  }}
                />
              </div>
            </div>
          </div>
        </WindowsFrame>
      )}

      {/* WINDOW 2: FILE MANAGER */}
      {activeWindow === 'file_manager' && (
        <WindowsFrame title={`File Explorer — ${activeFolder.toUpperCase()}`} onClose={() => setActiveWindow(null)}>
          <div>
            {/* Breadcrumb path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <span
                onClick={() => setActiveFolder('root')}
                style={{ cursor: 'pointer', color: activeFolder === 'root' ? 'var(--red)' : 'white' }}
              >
                Root
              </span>
              <span>/</span>
              <span>{activeFolder}</span>
            </div>

            {activeFolder === 'root' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                <FileGridItem
                  icon="📜"
                  name="Certificates"
                  size="Folder"
                  onClick={() => setActiveFolder('certs')}
                />
                <FileGridItem
                  icon="📄"
                  name="Documents"
                  size="Folder"
                  onClick={() => setActiveFolder('documents')}
                />
              </div>
            )}

            {activeFolder === 'certs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { title: 'Xmedia_Solutions_Internship.png', desc: 'Internship Programme · Issued: 24/07/2026', url: '/certificates/xmedia_internship.png' },
                  { title: 'Vibe_Hack_2.0_BuildwithIndia.jpg', desc: 'Hack With India Finale at Google · 2026', url: '/certificates/vibe_hack_2.jpg' },
                  { title: 'Hack_A_Cure_VIT_Chennai.jpg', desc: 'TechnoVIT\'25 · Issued: 28/10/2025', url: '/certificates/hack_a_cure.jpg' },
                ].map((c) => (
                  <div key={c.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.85rem 1rem', borderRadius: '4px', border: '1px solid rgba(200,16,46,0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ fontSize: '28px' }}>📜</div>
                      <div>
                        <strong style={{ color: 'white', fontSize: '12.5px' }}>{c.title}</strong>
                        <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)' }}>{c.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCertImg(c.url);
                        openApp('cert_preview');
                      }}
                      data-cursor="pointer"
                      style={{
                        backgroundColor: 'var(--red)',
                        color: 'white',
                        border: 'none',
                        padding: '0.35rem 0.8rem',
                        fontSize: '10px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                        fontWeight: 700,
                      }}
                    >
                      VIEW IMAGE 🖼️
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeFolder === 'documents' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '32px' }}>📄</div>
                <div>
                  <strong style={{ color: 'white', fontSize: '13px' }}>C_Yashwanth_Resume.pdf</strong>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>AI Full Stack Developer Dossier</div>
                </div>
                <button
                  onClick={() => openExternal('/C_Yashwanth_Resume.pdf')}
                  data-cursor="pointer"
                  style={{
                    backgroundColor: 'var(--red)',
                    border: 'none',
                    color: 'white',
                    padding: '0.4rem 0.9rem',
                    fontSize: '11px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginLeft: 'auto',
                    fontWeight: 700,
                  }}
                >
                  DOWNLOAD RESUME 📄
                </button>
              </div>
            )}
          </div>
        </WindowsFrame>
      )}

      {/* WINDOW 3: ABOUT ME.TXT */}
      {activeWindow === 'about_me' && (
        <WindowsFrame title="About Me.txt — Notepad" onClose={() => setActiveWindow(null)}>
          <div style={{ fontSize: '13px', color: 'rgba(237,235,230,0.9)', lineHeight: 1.7 }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--red)', fontSize: '18px' }}>YASHWANTH // AI FULL STACK DEVELOPER</h3>
            <p style={{ margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.7)' }}>
              Ideas, engineered into reality.
            </p>
            <div style={{ backgroundColor: 'rgba(200,16,46,0.08)', borderLeft: '3px solid var(--red)', padding: '0.8rem 1rem', marginBottom: '1.2rem' }}>
              An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.
            </div>

            <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>CORE ENGINEERING PILLARS:</div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.85)' }}>
              <li><strong>AI & LLM Integration:</strong> Building RAG pipelines, Groq API, and Gemini automated engines.</li>
              <li><strong>High-Concurrency Backend:</strong> FastAPI, SQLAlchemy, RESTful architectures with JWT security.</li>
              <li><strong>Modern Frontend:</strong> React, TypeScript, custom CSS animations, and responsive UIs.</li>
            </ul>
          </div>
        </WindowsFrame>
      )}

      {/* WINDOW 4: CERTIFICATE PREVIEW MODAL */}
      {activeWindow === 'cert_preview' && (
        <WindowsFrame title="Photo Viewer — Certificate Credential" onClose={() => setActiveWindow('file_manager')}>
          <div style={{ textAlign: 'center' }}>
            <img
              src={selectedCertImg}
              alt="Certificate Preview"
              style={{ maxWidth: '100%', maxHeight: '430px', borderRadius: '4px', border: '1px solid var(--red)' }}
            />
            <div style={{ marginTop: '0.75rem', fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
              VERIFIED DECRYPTED CREDENTIAL FILE
            </div>
          </div>
        </WindowsFrame>
      )}

      {/* WINDOW 5: FLAPPY BIRD */}
      {activeWindow === 'flappy_bird' && (
        <WindowsFrame title="Flappy Bird.exe — Arcade Game" onClose={() => setActiveWindow(null)}>
          <FlappyBirdApp onClose={() => setActiveWindow(null)} />
        </WindowsFrame>
      )}

      {/* WINDOW 6: PROJECTS */}
      {activeWindow === 'projects' && (
        <WindowsFrame title="Projects — Portfolio" onClose={() => setActiveWindow(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
              {STATIC_PROJECTS.length} PROJECT{STATIC_PROJECTS.length !== 1 ? 'S' : ''} — CLICK THUMBNAIL TO OPEN GITHUB REPO
            </div>
            {STATIC_PROJECTS.map((project) => (
              <div
                key={project.id}
                onClick={() => openExternal(project.github_url || 'https://github.com/Yash-0209-git')}
                data-cursor="pointer"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  gap: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(200,16,46,0.18)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--red)';
                  e.currentTarget.style.backgroundColor = 'rgba(200,16,46,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(200,16,46,0.18)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: '90px', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🗂️</div>
                  )}
                  {/* GitHub overlay icon */}
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', opacity: 0,
                    background: 'rgba(200,16,46,0.6)',
                    fontSize: '22px', transition: 'opacity 0.2s ease',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >🐙</div>
                </div>

                {/* Info */}
                <div style={{ padding: '0.75rem 0.75rem 0.75rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem' }}>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>{project.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', lineHeight: 1.4 }}>
                    {project.short_description?.slice(0, 90)}{(project.short_description?.length ?? 0) > 90 ? '...' : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '9px', padding: '0.15rem 0.4rem', border: '1px solid rgba(200,16,46,0.35)', borderRadius: '2px', color: 'var(--red)' }}>
                      {project.category}
                    </span>
                    <span style={{ fontSize: '9px', padding: '0.15rem 0.4rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'rgba(255,255,255,0.4)' }}>
                      {project.year}
                    </span>
                    <span style={{ fontSize: '9px', padding: '0.15rem 0.4rem', border: '1px solid rgba(0,255,102,0.3)', borderRadius: '2px', color: 'rgba(0,255,102,0.7)' }}>
                      {project.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WindowsFrame>
      )}

      {/* WINDOW 7: TASK MANAGER */}
      {activeWindow === 'task_manager' && (
        <WindowsFrame title="Task Manager.exe — Live Telemetry Monitor" onClose={() => setActiveWindow(null)}>
          <TaskManagerApp />
        </WindowsFrame>
      )}

      {/* WINDOW 8: WALLPAPER SELECTOR */}
      {activeWindow === 'wallpapers' && (
        <WindowsFrame title="Wallpapers — Desktop Personalization" onClose={() => setActiveWindow(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
              SELECT DESKTOP BACKGROUND MATRIX ENGINE:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { mode: 'signal_mesh', name: 'Signal Mesh', desc: 'Radial crimson telemetry grid' },
                { mode: 'matrix_rain', name: 'Matrix Code Rain', desc: 'Falling crimson digital code stream' },
                { mode: 'cyber_grid', name: 'Cyber Grid', desc: 'Perspective 3D moving grid' },
                { mode: 'crt_lines', name: 'CRT Phosphor Scan', desc: 'Retro TV scanlines & phosphor bloom' },
              ].map(item => (
                <div
                  key={item.mode}
                  onClick={() => {
                    setWallpaperMode(item.mode as WallpaperMode);
                    playBeep(700, 0.05);
                  }}
                  data-cursor="pointer"
                  style={{
                    padding: '1rem',
                    backgroundColor: wallpaperMode === item.mode ? 'rgba(200,16,46,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${wallpaperMode === item.mode ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '13px', marginBottom: '0.3rem' }}>
                    {wallpaperMode === item.mode ? '● ' : ''}{item.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </WindowsFrame>
      )}

      {/* Start Menu Popover */}
      {startMenuOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '1rem',
            width: '280px',
            backgroundColor: 'rgba(18, 22, 32, 0.95)',
            border: '1px solid var(--red)',
            borderRadius: '6px',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
            padding: '1rem',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
            YASH OS START MENU
          </div>
          <StartMenuItem icon="💻" label="This PC" onClick={() => openApp('this_pc')} />
          <StartMenuItem icon="📁" label="File Manager" onClick={() => openApp('file_manager')} />
          <StartMenuItem icon="🗂️" label="Projects" onClick={() => openApp('projects')} />
          <StartMenuItem icon="⚡" label="Task Manager.exe" onClick={() => openApp('task_manager')} />
          <StartMenuItem icon="🖼️" label="Wallpapers.exe" onClick={() => openApp('wallpapers')} />
          <StartMenuItem icon="🐤" label="Flappy Bird.exe" onClick={() => openApp('flappy_bird')} />
          <StartMenuItem icon="📄" label="About Me.txt" onClick={() => openApp('about_me')} />
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0.4rem 0' }} />
          <StartMenuItem icon="🐙" label="GitHub Profile" onClick={() => openExternal('https://github.com/Yash-0209-git')} />
          <StartMenuItem icon="💼" label="LinkedIn Profile" onClick={() => openExternal('https://www.linkedin.com/in/yashwanth-c-918a53317')} />
          <StartMenuItem icon="📸" label="Instagram Profile" onClick={() => openExternal('https://instagram.com/yashhwanth__')} />
          <StartMenuItem icon="✉️" label="Send Email" onClick={() => openExternal('https://mail.google.com/mail/?view=cm&fs=1&to=yashwanth02092006@gmail.com')} />
        </div>
      )}

      {/* Bottom Taskbar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '44px',
          backgroundColor: 'rgba(12, 15, 22, 0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(200,16,46,0.3)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          justifyContent: 'space-between',
          zIndex: 100,
        }}
      >
        {/* Start Button & Active Apps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            data-cursor="pointer"
            style={{
              backgroundColor: startMenuOpen ? 'var(--red)' : 'rgba(200,16,46,0.2)',
              border: '1px solid var(--red)',
              color: 'white',
              fontSize: '13px',
              fontWeight: 700,
              padding: '0.35rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>❖</span>
            <span>Start</span>
          </button>

          {activeWindow && (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(200,16,46,0.4)',
                padding: '0.3rem 0.8rem',
                borderRadius: '4px',
                color: 'white',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span style={{ color: 'var(--red)' }}>●</span>
              <span>{activeWindow.toUpperCase().replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* System Clock & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', fontSize: '12px' }}>
          <span>🌐 ONLINE</span>
          <span>⚡ 100%</span>
          <span style={{ fontWeight: 700, color: 'var(--red)' }}>{currentTime}</span>
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({ icon, label, badge, onClick }: { icon: string; label: string; badge?: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      data-cursor="pointer"
      style={{
        width: '88px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.45rem 0.2rem',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(200,16,46,0.18)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div style={{ fontSize: '32px', position: 'relative' }}>
        {icon}
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -6,
              backgroundColor: 'var(--red)',
              color: 'white',
              fontSize: '7px',
              fontWeight: 700,
              padding: '1px 3px',
              borderRadius: '2px',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <span style={{ fontSize: '11px', color: 'white', textAlign: 'center', marginTop: '0.3rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        {label}
      </span>
    </div>
  );
}

function WindowsFrame({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(640px, 90vw)',
        maxHeight: '80vh',
        backgroundColor: 'rgba(15, 18, 26, 0.95)',
        border: '1px solid var(--red)',
        borderRadius: '6px',
        boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(200,16,46,0.2)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'scaleUp 0.2s ease-out',
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          backgroundColor: 'rgba(25, 30, 42, 0.9)',
          padding: '0.6rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ color: 'white', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>—</button>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>□</button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontWeight: 700 }}>×</button>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function FileGridItem({ icon, name, size, onClick }: { icon: string; name: string; size: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      data-cursor="pointer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '0.6rem 0.8rem',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--red)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div>
        <div style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{name}</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{size}</div>
      </div>
    </div>
  );
}

function StartMenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      data-cursor="pointer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(200,16,46,0.25)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
