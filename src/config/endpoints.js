/**
 * CENTRALIZED API ENDPOINT CONFIGURATION
 * ----------------------------------------
 * Change your backend route paths here ONLY.
 * Nothing else in the app should hardcode a URL string.
 * Set VITE_API_BASE_URL to the backend API URL in each deployment environment.
 */

const rawEnvUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  ''
).trim();

// Normalize URL: remove any trailing slashes
const cleanUrl = rawEnvUrl.replace(/\/+$/, '');

// Ensure BASE_URL for API calls always ends in /api
export const BASE_URL = cleanUrl
  ? (cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`)
  : (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

// BACKEND_ORIGIN for static assets/uploads (e.g. https://xxx.onrender.com or http://localhost:5000)
export const BACKEND_ORIGIN = cleanUrl
  ? cleanUrl.replace(/\/api\/?$/i, '')
  : (import.meta.env.DEV ? 'http://localhost:5000' : '');
 
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  resume: {
    get: '/resume',
    upload: '/resume/upload',
    update: (id) => `/resume/${id}`,
    delete: (id) => `/resume/${id}`,
  },
  projects: {
    list: '/projects',
    create: '/projects',
    update: (id) => `/projects/${id}`,
    delete: (id) => `/projects/${id}`,
    getOne: (id) => `/projects/${id}`,
  },
  testimonials: {
    list: '/testimonials',
    create: '/testimonials',
    update: (id) => `/testimonials/${id}`,
    delete: (id) => `/testimonials/${id}`,
    getOne: (id) => `/testimonials/${id}`,
  },
  lastWork: {
    list: '/last-work',
    create: '/last-work',
    update: (id) => `/last-work/${id}`,
    delete: (id) => `/last-work/${id}`,
    getOne: (id) => `/last-work/${id}`,
  },
  dashboard: {
    stats: '/dashboard/stats',
  },
  contact: {
    submit: '/contact',
  },
};

export const PROJECT_CATEGORIES = [
  'Web Development',
  'E-commerce Website',
  'Mobile App',
  'Game Development',
  'Machine Learning',
  'Food Donation Platform',
  'Data Science',
  'AI Project',
  'Open Source Contribution',
  'Research Project',
  'Hackathon Project',
  'Freelance Project',
  'Personal Project',
  'Team Project',
  'Capstone Project',
  'Thesis Project',
  'Classroom Project',
  'Community Project',
  'Startup Project',
  'Non-profit Project',
  'IoT Project',
  'Blockchain Project',
  'AR/VR Project',
  'Cloud Computing Project',
  'Cybersecurity Project',
  'DevOps Project',
  'Robotics Project',
  'Embedded Systems Project',
  'Networking Project',
  'Database Project',
  'Software Engineering Project',
  'Game Design Project',
  'Digital Marketing Project',
  'Content Creation Project',
  'App Development',
  'UI UX',
  'Dashboard',
  'Landing Page',
  'Portfolio',
  'Graphic Design',
];
