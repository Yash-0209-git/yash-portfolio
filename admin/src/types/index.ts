export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  status: string;
  short_description: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  thumbnail_url?: string;
  featured: boolean;
  published: boolean;
  display_order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  credential_id?: string;
  verification_url?: string;
  category?: string;
  image_url?: string;
  visible: boolean;
  display_order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  organization?: string;
  category?: string;
  image_url?: string;
  visible: boolean;
  display_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order?: number;
}

export interface About {
  name?: string;
  role: string;
  tagline: string;
  bio: string;
  profile_photo_url?: string;
}

export interface Settings {
  email: string;
  github_url: string;
  linkedin_url: string;
  instagram_handle: string;
  resume_url?: string;
}

export interface AuthResponse {
  token: string;
}

export interface DashboardStats {
  projects: number;
  published_projects: number;
  certificates: number;
  achievements: number;
}
