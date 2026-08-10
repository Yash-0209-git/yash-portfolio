// API response types — match the FastAPI backend snake_case fields

export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  year: number;
  status: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  thumbnail_url?: string;
  featured?: boolean;
  published?: boolean;
  display_order?: number;
  problem?: string;
  solution?: string;
  challenges?: string;
  results?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  credential_id?: string;
  verification_url?: string;
  image_url?: string;
  category?: string;
  visible: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  organization?: string;
  image_url?: string;
  category?: string;
  visible: boolean;
}

export interface About {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  profile_photo_url?: string;
}

export interface Settings {
  email?: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_handle?: string;
  resume_url?: string;
}

// Grouped skills for display
export interface SkillGroup {
  category: string;
  items: string[];
}
