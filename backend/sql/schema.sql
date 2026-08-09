-- projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  category TEXT DEFAULT 'Web App',
  technologies TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  github_url TEXT,
  live_url TEXT,
  year INTEGER,
  status TEXT DEFAULT 'completed',
  display_order INTEGER DEFAULT 0,
  problem TEXT,
  solution TEXT,
  challenges TEXT,
  results TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  credential_id TEXT,
  verification_url TEXT,
  image_url TEXT,
  category TEXT,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  organization TEXT,
  image_url TEXT,
  category TEXT,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- about table (single row)
CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'C Yashwanth',
  role TEXT DEFAULT 'AI Full Stack Developer',
  tagline TEXT DEFAULT 'Ideas, engineered into reality.',
  bio TEXT DEFAULT 'An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.',
  profile_photo_url TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

-- settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  email TEXT DEFAULT 'yashwanth02092006@gmail.com',
  github_url TEXT DEFAULT 'https://github.com/Yash-0209-git',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/yashwanth-c-918a53317',
  instagram_handle TEXT DEFAULT 'yashhwanth__',
  resume_url TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Disable RLS on all tables so backend API keys can read/write without policy restriction
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE about DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Seed initial data
INSERT INTO about (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (slug, title, short_description, category, technologies, featured, published, github_url, year, status, display_order)
VALUES (
  'leesculpt',
  'LeeSculpt Gym Application',
  'An AI-powered Gym Management System that connects admins, trainers, and members through personalized fitness tracking, workout and diet management, AI-driven guidance, automated notifications, and real-time progress monitoring.',
  'Web App',
  ARRAY['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'Groq API', 'Google Gemini', 'Tailwind CSS', 'SQLAlchemy', 'JWT Authentication', 'WhatsApp API', 'SMTP'],
  true,
  true,
  'https://github.com/Yash-0209-git/gym-management-system',
  2026,
  'completed',
  0
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO skills (name, category, display_order) VALUES
('Python', 'Languages', 0),
('TypeScript', 'Languages', 1),
('FastAPI', 'Backend', 0),
('SQLAlchemy', 'Backend', 1),
('REST APIs', 'Backend', 2),
('JWT Authentication', 'Backend', 3),
('React', 'Frontend', 0),
('Tailwind CSS', 'Frontend', 1),
('PostgreSQL', 'Database', 0),
('Supabase', 'Database', 1),
('AI/LLMs', 'AI & ML', 0),
('RAG', 'AI & ML', 1),
('Groq API', 'AI & ML', 2),
('API Integration', 'Tools', 0),
('Git/GitHub', 'Tools', 1)
ON CONFLICT DO NOTHING;
