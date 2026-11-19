import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studymate_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

// Turn API errors into a readable message
export const errorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.error || (err?.request ? 'Unable to reach the server' : fallback);

export default api;
