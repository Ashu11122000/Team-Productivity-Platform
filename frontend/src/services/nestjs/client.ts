import axios from 'axios';

import { useAuthStore } from '@/store/auth-store';

export const nestjsClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NESTJS_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

nestjsClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

nestjsClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);
