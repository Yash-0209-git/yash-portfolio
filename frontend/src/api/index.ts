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
  name: 'C Yashwanth',
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
