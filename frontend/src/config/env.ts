import { z } from 'zod';

const envSchema = z.object({
  // ============================================================================
  // Application
  // ============================================================================

  NEXT_PUBLIC_APP_NAME: z.string().min(1),

  NEXT_PUBLIC_APP_VERSION: z.string().min(1),

  NEXT_PUBLIC_APP_ENV: z.enum([
    'development',
    'test',
    'production',
  ]),

  NEXT_PUBLIC_APP_URL: z.url(),

  // ============================================================================
  // Backend Services
  // ============================================================================

  NEXT_PUBLIC_FASTAPI_URL: z.url(),

  NEXT_PUBLIC_NESTJS_URL: z.url(),

  // ============================================================================
  // Authentication
  // ============================================================================

  NEXT_PUBLIC_ACCESS_TOKEN_KEY: z.string().min(1),

  NEXT_PUBLIC_REFRESH_TOKEN_KEY: z.string().min(1),

  // ============================================================================
  // Analytics
  // ============================================================================

  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // ============================================================================
  // Feature Flags
  // ============================================================================

  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .stringbool()
    .default(true),

  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z
    .stringbool()
    .default(true),

  NEXT_PUBLIC_ENABLE_DARK_MODE: z
    .stringbool()
    .default(true),

  NEXT_PUBLIC_ENABLE_DEBUG: z
    .stringbool()
    .default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  );

  throw new Error('Invalid environment variables.');
}

export const env = parsed.data;