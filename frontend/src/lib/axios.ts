import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth-store';

const DEFAULT_TIMEOUT = 30_000;

function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;

      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        /**
         * Phase 2:
         * Implement refresh-token flow here.
         *
         * Current behavior:
         * Clear local authentication state.
         */
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    },
  );

  return client;
}

export const fastApi = createApiClient(env.NEXT_PUBLIC_FASTAPI_URL);

export const nestApi = createApiClient(env.NEXT_PUBLIC_NESTJS_URL);
