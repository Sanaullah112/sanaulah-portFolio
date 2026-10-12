import api, { uploadRequest } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const lastWorkService = {
  list: (params) => api.get(ENDPOINTS.lastWork.list, { params }),
  getOne: (id) => api.get(ENDPOINTS.lastWork.getOne(id)),
  create: (formData, onProgress) =>
    uploadRequest(ENDPOINTS.lastWork.create, formData, 'post', onProgress),
  update: (id, formData, onProgress) =>
    uploadRequest(ENDPOINTS.lastWork.update(id), formData, 'put', onProgress),
  remove: (id) => api.delete(ENDPOINTS.lastWork.delete(id)),
};
