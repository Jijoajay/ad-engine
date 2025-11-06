import { config } from '@/config';
import axios from 'axios';
import { useAuthStore } from './auth-store';

const api = axios.create({
  baseURL: config.baseUrl,
});

api.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
