import axios from 'axios';
import { BASE_URL } from '../config/endpoints';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || (
      error?.response
        ? error?.message || 'The server could not complete the request.'
        : 'Could not connect to the server. Check that the backend is running and its API URL is configured correctly.'
    );

    if (status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    error.message = message;
    error.status = status;
    return Promise.reject(error);
  }
);

export const uploadRequest = (url, formData, method = 'post', onProgress) => {
  return api.request({
    url,
    method,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });
};

export default api;
