

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('admin_token');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.detail || 'API request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  login: (password: string) => fetchWithAuth('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
  
  // Projects
  getProjects: () => fetchWithAuth('/api/projects'),
  getProject: (id: string) => fetchWithAuth(`/api/projects/${id}`),
  createProject: (data: any) => fetchWithAuth('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => fetchWithAuth(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => fetchWithAuth(`/api/projects/${id}`, { method: 'DELETE' }),

  // Certificates
  getCertificates: () => fetchWithAuth('/api/certificates'),
  getCertificate: (id: string) => fetchWithAuth(`/api/certificates/${id}`),
  createCertificate: (data: any) => fetchWithAuth('/api/certificates', { method: 'POST', body: JSON.stringify(data) }),
  updateCertificate: (id: string, data: any) => fetchWithAuth(`/api/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCertificate: (id: string) => fetchWithAuth(`/api/certificates/${id}`, { method: 'DELETE' }),

  // Achievements
  getAchievements: () => fetchWithAuth('/api/achievements'),
  getAchievement: (id: string) => fetchWithAuth(`/api/achievements/${id}`),
  createAchievement: (data: any) => fetchWithAuth('/api/achievements', { method: 'POST', body: JSON.stringify(data) }),
  updateAchievement: (id: string, data: any) => fetchWithAuth(`/api/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAchievement: (id: string) => fetchWithAuth(`/api/achievements/${id}`, { method: 'DELETE' }),

  // Skills
  getSkills: () => fetchWithAuth('/api/skills'),
  createSkill: (data: any) => fetchWithAuth('/api/skills', { method: 'POST', body: JSON.stringify(data) }),
  deleteSkill: (id: string) => fetchWithAuth(`/api/skills/${id}`, { method: 'DELETE' }),

  // About
  getAbout: () => fetchWithAuth('/api/about'),
  updateAbout: (data: any) => fetchWithAuth('/api/about', { method: 'PUT', body: JSON.stringify(data) }),

  // Settings
  getSettings: () => fetchWithAuth('/api/settings'),
  updateSettings: (data: any) => fetchWithAuth('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Dashboard Stats
  getDashboardStats: () => fetchWithAuth('/api/dashboard/stats'),

  // Media Upload
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetchWithAuth('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
    return response;
  },
};
