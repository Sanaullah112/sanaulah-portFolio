import api, { uploadRequest } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const projectService = {
  list: (params) => api.get(ENDPOINTS.projects.list, { params }),
  getOne: (id) => api.get(ENDPOINTS.projects.getOne(id)),
  create: (formData, onProgress) =>
    uploadRequest(ENDPOINTS.projects.create, formData, 'post', onProgress),
  update: (id, formData, onProgress) =>
    uploadRequest(ENDPOINTS.projects.update(id), formData, 'put', onProgress),
  remove: (id) => api.delete(ENDPOINTS.projects.delete(id)),
};
