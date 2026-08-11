import { Project, Skill, SkillGroup, About, Settings, Certificate, Achievement } from '../types';

export const STATIC_PROJECTS: Project[] = [
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
    thumbnail_url: '/projects/leesculpt.png',
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
    technologies: [
      'Python', 'FastAPI', 'React', 'TypeScript', 'RAG',
      'Groq API', 'Llama 3.3 70B', 'ZIP Parsing', 'AST Parser', 'Tailwind CSS',
    ],
    featured: true,
    published: true,
    display_order: 1,
    problem:
      'Developers and code reviewers spend hours understanding unfamiliar codebases, tracing architectural symbols, detecting hidden bugs, and configuring environment setup.',
    solution:
      'CodeSage AI automates full repository comprehension by parsing uploaded .zip project archives, extracting AST file symbols, detecting architectural type, running automated issue detection, and providing an interactive Deep AI RAG chatbot for immediate repository Q&A.',
    challenges:
      'Efficiently parsing multi-file ZIP archives in memory, extracting AST symbols without code execution, and indexing repository context for low-latency RAG vector search.',
    thumbnail_url: '/projects/code-sage-ai.png',
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
    technologies: [
      'Python', 'FastAPI', 'FAISS', 'Sentence Transformers',
      'Groq', 'Llama 3.3 70B', 'React', 'Vite', 'Three.js',
      'Tailwind CSS', 'PyTorch',
    ],
    featured: true,
    published: true,
    display_order: 2,
    problem:
      'Standard LLMs answer from general training data, producing hallucinations or outdated answers for domain-specific technical queries.',
    solution:
      'Built a full RAG pipeline with query expansion, FAISS vector retrieval, reranking, and context boosting — served through a FastAPI backend and a React + Three.js frontend.',
    challenges:
      'Improving retrieval accuracy on short queries, handling multi-stage RAG pipeline latency, and ensuring consistent grounded generation via Llama 3.3 70B.',
    thumbnail_url: '/projects/rag-tech-bot.png',
  },
];

export const STATIC_SKILLS: Skill[] = [
  { id: '1', name: 'Python', category: 'Languages', display_order: 0 },
  { id: '2', name: 'TypeScript', category: 'Languages', display_order: 1 },
  { id: '3', name: 'FastAPI', category: 'Backend', display_order: 0 },
  { id: '4', name: 'SQLAlchemy', category: 'Backend', display_order: 1 },
  { id: '5', name: 'REST APIs', category: 'Backend', display_order: 2 },
  { id: '6', name: 'JWT Authentication', category: 'Backend', display_order: 3 },
  { id: '7', name: 'React', category: 'Frontend', display_order: 0 },
  { id: '8', name: 'Tailwind CSS', category: 'Frontend', display_order: 1 },
  { id: '9', name: 'PostgreSQL', category: 'Database', display_order: 0 },
  { id: '10', name: 'Supabase', category: 'Database', display_order: 1 },
  { id: '11', name: 'AI/LLMs', category: 'AI & ML', display_order: 0 },
  { id: '12', name: 'RAG', category: 'AI & ML', display_order: 1 },
  { id: '13', name: 'Groq API', category: 'AI & ML', display_order: 2 },
  { id: '14', name: 'API Integration', category: 'Tools', display_order: 0 },
  { id: '15', name: 'Git/GitHub', category: 'Tools', display_order: 1 },
];

export const STATIC_CERTS: Certificate[] = [
  {
    id: 'xmedia-internship',
    title: 'Development Team Internship',
    issuer: 'M/s. Xmedia Solutions, Ambattur',
    issue_date: '24/07/2026',
    credential_id: '241501251',
    category: 'Internship',
    image_url: '/certificates/xmedia_internship.png',
    visible: true,
  },
  {
    id: 'vibe-hack-2',
    title: 'Vibe Hack 2.0 (BuildwithIndia Finale)',
    issuer: 'Hack With India (Finale at Google Office)',
    issue_date: '2026',
    category: 'Hackathon',
    image_url: '/certificates/vibe_hack_2.jpg',
    visible: true,
  },
  {
    id: 'hack-a-cure',
    title: 'Hack A Cure',
    issuer: 'VIT, Chennai (TechnoVIT\'25)',
    issue_date: '28/10/2025',
    category: 'Hackathon',
    image_url: '/certificates/hack_a_cure.jpg',
    visible: true,
  },
];

export const STATIC_ACHIEVEMENTS: Achievement[] = [];

export const STATIC_ABOUT: About = {
  name: 'Yashwanth',
  role: 'AI Full Stack Developer',
  tagline: 'Ideas, engineered into reality.',
  bio: 'An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.',
  profile_photo_url: '/profile.jpg',
};

export const STATIC_SETTINGS: Settings = {
  email: 'yashwanth02092006@gmail.com',
  github_url: 'https://github.com/Yash-0209-git',
  linkedin_url: 'https://www.linkedin.com/in/yashwanth-c-918a53317',
  instagram_handle: 'yashhwanth__',
  resume_url: '/C_Yashwanth_Resume.pdf',
};

export const fetchProjects = async (): Promise<Project[]> => STATIC_PROJECTS;
export const fetchSkills = async (): Promise<Skill[]> => STATIC_SKILLS;
export const fetchCertificates = async (): Promise<Certificate[]> => STATIC_CERTS;
export const fetchAchievements = async (): Promise<Achievement[]> => STATIC_ACHIEVEMENTS;
export const fetchAbout = async (): Promise<About> => STATIC_ABOUT;
export const fetchSettings = async (): Promise<Settings> => STATIC_SETTINGS;

export const groupSkills = (skills: Skill[]): SkillGroup[] => {
  const map: Record<string, string[]> = {};
  skills.forEach((s) => {
    if (!map[s.category]) map[s.category] = [];
    map[s.category].push(s.name);
  });
  return Object.entries(map).map(([category, items]) => ({ category, items }));
};
