import axios from "axios";
import { BASE_URL } from "../config/endpoints";

export { BASE_URL };

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s covers a Render cold start
  headers: { "Content-Type": "application/json" },
});

// Send multipart form data without forcing JSON headers. Axios supplies the
// multipart boundary and reports upload progress when a callback is provided.
export const uploadRequest = (url, formData, method = "post", onProgress) =>
  api.request({
    url,
    method,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onProgress
      ? (event) => {
          if (event.total) {
            onProgress(Math.round((event.loaded * 100) / event.total));
          }
        }
      : undefined,
  });

// Turn every failure into a clean Error with a readable message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;
    if (error.response) {
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status}). Please try again.`;
    } else if (error.code === "ECONNABORTED") {
      message = "The server took too long to respond. Please try again.";
    } else {
      message = "Could not connect to the server. Please try again in a moment.";
    }
    const err = new Error(message);
    err.status = error.response?.status;
    return Promise.reject(err);
  }
);

// Wakes a sleeping Render server. Any response (even 404) is enough, and
// no-cors keeps this from throwing CORS errors in the console.
export const wakeServer = () => {
  try {
    fetch(`${BASE_URL}/health`, { method: "GET", mode: "no-cors" }).catch(() => {});
  } catch {
    /* ignore */
  }
};

export default api;
