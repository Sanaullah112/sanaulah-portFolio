import api, { uploadRequest } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const resumeService = {
  get: () => api.get(ENDPOINTS.resume.get),
  upload: (formData, onProgress) =>
    uploadRequest(ENDPOINTS.resume.upload, formData, 'post', onProgress),
  update: (id, formData, onProgress) =>
    uploadRequest(ENDPOINTS.resume.update(id), formData, 'put', onProgress),
  remove: (id) => api.delete(ENDPOINTS.resume.delete(id)),
};
