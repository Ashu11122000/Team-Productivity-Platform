/**
 * ============================================================================
 * File: validation.ts
 * ============================================================================
 *
 * Environment variable validation for the Team Productivity Platform.
 *
 * Responsibilities
 * ----------------
 * - Validate all required environment variables.
 * - Transform environment variables into their correct data types.
 * - Fail fast during application startup if configuration is invalid.
 * - Prevent runtime configuration errors.
 *
 * This file is used by ConfigModule.forRoot({
 *     validate,
 * })
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/config v4
 * - class-validator
 * - class-transformer
 * ============================================================================
 */

import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

/**
 * ============================================================================
 * Node Environment
 * ============================================================================
 */
export enum NodeEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

/**
 * ============================================================================
 * Supported JWT Algorithms
 * ============================================================================
 */
export enum JwtAlgorithm {
  HS256 = 'HS256',
  HS384 = 'HS384',
  HS512 = 'HS512',
}

/**
 * ============================================================================
 * Supported Log Levels
 * ============================================================================
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * ============================================================================
 * Environment Variables Schema
 * ============================================================================
 */
class EnvironmentVariables {
  // ==========================================================================
  // Application
  // ==========================================================================

  @IsString()
  @IsNotEmpty()
  APP_NAME!: string;

  @IsString()
  @IsNotEmpty()
  APP_VERSION!: string;

  @IsEnum(NodeEnvironment)
  NODE_ENV!: NodeEnvironment;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  API_PREFIX!: string;

  // ==========================================================================
  // Database
  // ==========================================================================

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST!: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(65535)
  DATABASE_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USER!: string;

  @IsString()
  DATABASE_PASSWORD!: string;

  @IsString()
  DATABASE_NAME!: string;

  @IsString()
  DATABASE_URL!: string;

  // ==========================================================================
  // JWT
  // ==========================================================================

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsEnum(JwtAlgorithm)
  JWT_ALGORITHM!: JwtAlgorithm;

  @IsString()
  JWT_ISSUER!: string;

  @IsString()
  JWT_AUDIENCE!: string;

  // ==========================================================================
  // FastAPI Integration
  // ==========================================================================

  @IsUrl(
    {
      require_tld: false,
    },
    {
      message: 'FASTAPI_BASE_URL must be a valid URL',
    },
  )
  FASTAPI_BASE_URL!: string;

  // ==========================================================================
  // Frontend
  // ==========================================================================

  @IsUrl(
    {
      require_tld: false,
    },
    {
      message: 'FRONTEND_URL must be a valid URL',
    },
  )
  FRONTEND_URL!: string;

  // ==========================================================================
  // CORS
  // ==========================================================================

  @IsString()
  CORS_ORIGINS!: string;

  // ==========================================================================
  // Logging
  // ==========================================================================

  @IsEnum(LogLevel)
  LOG_LEVEL!: LogLevel;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  LOG_PRETTY!: boolean;

  // ==========================================================================
  // Swagger
  // ==========================================================================

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  SWAGGER_ENABLED!: boolean;

  @IsString()
  SWAGGER_PATH!: string;

  // ==========================================================================
  // Holidays
  // ==========================================================================

  @IsString()
  HOLIDAY_COUNTRY!: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(60)
  HOLIDAY_CACHE_TTL!: number;

  // ==========================================================================
  // Scheduler
  // ==========================================================================

  @IsString()
  REMINDER_CRON!: string;

  @IsString()
  HOLIDAY_SYNC_CRON!: string;

  // ==========================================================================
  // Cache
  // ==========================================================================

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  CACHE_TTL!: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  CACHE_MAX_ITEMS!: number;

  // ==========================================================================
  // Analytics
  // ==========================================================================

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  ANALYTICS_CACHE_TTL!: number;

  // ==========================================================================
  // Optional Future Redis Configuration
  // ==========================================================================

  @IsOptional()
  @IsString()
  REDIS_HOST?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  REDIS_PORT?: number;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;
}

/**
 * ============================================================================
 * Validate Environment Variables
 * ============================================================================
 *
 * This function is executed automatically by ConfigModule.forRoot().
 *
 * It:
 * 1. Converts environment variables into proper types.
 * 2. Validates every variable.
 * 3. Throws an exception before NestJS starts if validation fails.
 * ============================================================================
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : 'Invalid value';

        return `• ${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(
      [
        '',
        '=========================================================',
        'Environment Validation Failed',
        '=========================================================',
        messages,
        '=========================================================',
      ].join('\n'),
    );
  }

  return validatedConfig;
}
