import api, { uploadRequest } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const testimonialService = {
  list: (params) => api.get(ENDPOINTS.testimonials.list, { params }),
  getOne: (id) => api.get(ENDPOINTS.testimonials.getOne(id)),
  create: (formData, onProgress) =>
    uploadRequest(ENDPOINTS.testimonials.create, formData, 'post', onProgress),
  update: (id, formData, onProgress) =>
    uploadRequest(ENDPOINTS.testimonials.update(id), formData, 'put', onProgress),
  remove: (id) => api.delete(ENDPOINTS.testimonials.delete(id)),
};
