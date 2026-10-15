/**
 * CENTRALIZED API ENDPOINT CONFIGURATION
 * ----------------------------------------
 * Change your backend route paths here ONLY.
 * Nothing else in the app should hardcode a URL string.
 * Set VITE_API_BASE_URL to the backend API URL in each deployment environment.
 */

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
export const BASE_URL = (configuredBaseUrl || (
  import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'
)).replace(/\/+$/, '');
 
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
