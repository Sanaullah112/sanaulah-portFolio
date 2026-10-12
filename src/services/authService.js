import api from './api';
import { ENDPOINTS } from '../config/endpoints';

export const authService = {
  login: (credentials) => api.post(ENDPOINTS.auth.login, credentials),
  logout: () => api.post(ENDPOINTS.auth.logout),
  me: () => api.get(ENDPOINTS.auth.me),
};
