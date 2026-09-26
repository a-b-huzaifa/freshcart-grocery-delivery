import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL !== undefined 
  ? process.env.REACT_APP_API_URL 
  : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (if we have one) to every outgoing request. Reading
// from localStorage here means callers never have to think about
// auth headers -- they just call client.get/post/etc.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
