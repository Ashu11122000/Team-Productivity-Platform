import axios, { type AxiosRequestHeaders } from 'axios';

import { useAuthStore } from '@/store/auth-store';

let isLoggingOut = false;

export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,

    timeout: 15000,

    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;

      // ensure headers has a compatible type for Axios (avoid '{}' not assignable to AxiosRequestHeaders)
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,

    (error) => {
      if (error.response?.status === 401 && !isLoggingOut) {
        isLoggingOut = true;

        useAuthStore.getState().logout();

        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }

      return Promise.reject(error);
    },
  );

  return client;
}
