import api from './api';
import { ENDPOINTS } from '../config/endpoints';

export const dashboardService = {
  stats: () => api.get(ENDPOINTS.dashboard.stats),
};
