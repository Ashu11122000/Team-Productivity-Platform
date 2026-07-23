import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth-store';

/**
 * =============================================================================
 * Constants
 * =============================================================================
 */

const DEFAULT_TIMEOUT = 30_000;

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
} as const;

/**
 * =============================================================================
 * Types
 * =============================================================================
 */

interface RequestMetadata {
  requestStartedAt: number;
}

type ApiRequestConfig = InternalAxiosRequestConfig & {
  metadata?: RequestMetadata;
};

/**
 * =============================================================================
 * Module State
 * =============================================================================
 */

let isLoggingOut = false;

/**
 * =============================================================================
 * Helpers
 * =============================================================================
 */

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
}

function logDebug(...messages: unknown[]) {
  if (env.features.debug) {
    console.warn('[API]', ...messages);
  }
}

/**
 * =============================================================================
 * API Client Factory
 * =============================================================================
 */

export function createApiClient(baseURL: string): AxiosInstance {
  if (!baseURL.trim()) {
    throw new Error('API base URL is not configured.');
  }

  const client = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
    headers: DEFAULT_HEADERS,
  });

  /**
   * ===========================================================================
   * Request Interceptor
   * ===========================================================================
   */

  client.interceptors.request.use(
    (config: ApiRequestConfig) => {
      config.metadata = {
        requestStartedAt: Date.now(),
      };

      config.headers.set('X-Request-ID', generateRequestId());

      const accessToken = useAuthStore.getState().accessToken;

      if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`);
      }

      const method = config.method?.toUpperCase() ?? 'GET';

      const url = `${config.baseURL ?? ''}${config.url ?? ''}`;

      logDebug('➡️', method, url);

      return config;
    },

    (error: AxiosError) => {
      logDebug('❌ Request Error', error);

      return Promise.reject(error);
    },
  );

  /**
   * ===========================================================================
   * Response Interceptor
   * ===========================================================================
   */

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const started =
        (response.config as ApiRequestConfig).metadata?.requestStartedAt ?? Date.now();

      const duration = Date.now() - started;

      logDebug(
        '✅',
        response.config.method?.toUpperCase() ?? 'GET',
        response.config.url ?? '',
        `${duration}ms`,
      );

      return response;
    },

    async (error: AxiosError) => {
      const status = error.response?.status;

      const requestUrl = error.config?.url ?? '';

      const isAuthRequest =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/refresh');

      /**
       * ===============================================================
       * Unauthorized
       * ===============================================================
       */

      if (status === 401 && !isAuthRequest && !isLoggingOut) {
        isLoggingOut = true;

        logDebug('Unauthorized request. Logging out user.');

        /**
         * Token refresh will be implemented
         * during auth-store refactoring.
         */

        useAuthStore.getState().logout();

        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }

      /**
       * ===============================================================
       * Forbidden
       * ===============================================================
       */

      if (status === 403) {
        logDebug('Forbidden request.');
      }

      /**
       * ===============================================================
       * Not Found
       * ===============================================================
       */

      if (status === 404) {
        logDebug('Resource not found.');
      }

      /**
       * ===============================================================
       * Validation Error
       * ===============================================================
       */

      if (status === 422) {
        logDebug('Validation error.', error.response?.data);
      }

      /**
       * ===============================================================
       * Server Error
       * ===============================================================
       */

      if (status !== undefined && status >= 500) {
        logDebug('Internal server error.', error.response?.data);
      }

      return Promise.reject(error);
    },
  );

  return client;
}
