import { z } from 'zod';

/**
 * =============================================================================
 * Environment Schema
 * =============================================================================
 */

const envSchema = z.object({
  // ===========================================================================
  // Application
  // ===========================================================================

  NEXT_PUBLIC_APP_NAME: z.string().min(1),

  NEXT_PUBLIC_APP_VERSION: z.string().min(1),

  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'test', 'production']),

  NEXT_PUBLIC_APP_URL: z.url(),

  // ===========================================================================
  // Backend Services
  // ===========================================================================

  NEXT_PUBLIC_FASTAPI_URL: z.url(),

  NEXT_PUBLIC_NESTJS_URL: z.url(),

  // ===========================================================================
  // Authentication
  // ===========================================================================

  NEXT_PUBLIC_ACCESS_TOKEN_KEY: z.string().min(1),

  NEXT_PUBLIC_REFRESH_TOKEN_KEY: z.string().min(1),

  // ===========================================================================
  // Analytics
  // ===========================================================================

  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // ===========================================================================
  // Feature Flags
  // ===========================================================================

  NEXT_PUBLIC_ENABLE_ANALYTICS: z.stringbool().default(true),

  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z.stringbool().default(true),

  NEXT_PUBLIC_ENABLE_DARK_MODE: z.stringbool().default(true),

  NEXT_PUBLIC_ENABLE_DEBUG: z.stringbool().default(false),
});

/**
 * =============================================================================
 * Environment Validation
 * =============================================================================
 */

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);

  throw new Error('Invalid environment variables.');
}

/**
 * =============================================================================
 * Environment
 * =============================================================================
 */

export const env = Object.freeze({
  ...parsed.data,

  app: {
    name: parsed.data.NEXT_PUBLIC_APP_NAME,
    version: parsed.data.NEXT_PUBLIC_APP_VERSION,
    environment: parsed.data.NEXT_PUBLIC_APP_ENV,
    url: parsed.data.NEXT_PUBLIC_APP_URL,
  },

  api: {
    fastapi: parsed.data.NEXT_PUBLIC_FASTAPI_URL,
    nestjs: parsed.data.NEXT_PUBLIC_NESTJS_URL,
  },

  auth: {
    accessTokenKey: parsed.data.NEXT_PUBLIC_ACCESS_TOKEN_KEY,

    refreshTokenKey: parsed.data.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
  },

  analytics: {
    googleAnalyticsId: parsed.data.NEXT_PUBLIC_GA_ID,
  },

  features: {
    analytics: parsed.data.NEXT_PUBLIC_ENABLE_ANALYTICS,

    notifications: parsed.data.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,

    darkMode: parsed.data.NEXT_PUBLIC_ENABLE_DARK_MODE,

    debug: parsed.data.NEXT_PUBLIC_ENABLE_DEBUG,
  },

  isDevelopment: parsed.data.NEXT_PUBLIC_APP_ENV === 'development',

  isProduction: parsed.data.NEXT_PUBLIC_APP_ENV === 'production',

  isTest: parsed.data.NEXT_PUBLIC_APP_ENV === 'test',

  isBrowser: typeof window !== 'undefined',

  isServer: typeof window === 'undefined',
});
