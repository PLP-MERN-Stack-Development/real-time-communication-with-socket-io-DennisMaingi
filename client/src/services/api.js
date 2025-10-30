import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authAPI = {
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  
  register: (username, password) => 
    api.post('/api/auth/register', { username, password })
};

export default api;