import { Project, Skill, SkillGroup, About, Settings, Certificate, Achievement } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchProjects failed:', error);
    return [];
  }
};

// Skills — returns flat list, grouped by caller
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/skills`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchSkills failed:', error);
    return [];
  }
};

// Group flat skill list by category
export const groupSkills = (skills: Skill[]): SkillGroup[] => {
  const map: Record<string, string[]> = {};
  skills.forEach((s) => {
    if (!map[s.category]) map[s.category] = [];
    map[s.category].push(s.name);
  });
  return Object.entries(map).map(([category, items]) => ({ category, items }));
};

// Certificates
export const fetchCertificates = async (): Promise<Certificate[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/certificates`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchCertificates failed:', error);
    return [];
  }
};

// Achievements
export const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/achievements`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchAchievements failed:', error);
    return [];
  }
};

// About
export const fetchAbout = async (): Promise<About | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/about`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchAbout failed:', error);
    return null;
  }
};

// Settings (contact info)
export const fetchSettings = async (): Promise<Settings | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/settings`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchSettings failed:', error);
    return null;
  }
};
