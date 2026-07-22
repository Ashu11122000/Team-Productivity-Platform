/*
 * ============================================================================
 * File: holiday-api.module.ts
 * ============================================================================
 *
 * Holiday Integration Module
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Register Holiday API integration services.
 * - Configure HTTP client.
 * - Export HolidayApiService for feature modules.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * Calendar Module
 *        │
 *        ▼
 * HolidayApiModule
 *        │
 *        ├── HolidayApiService
 *        └── HolidayApiClient
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * * - @nestjs/axios
 * ============================================================================
 */

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HolidayApiClient } from './holiday-api.client';
import { HolidayApiService } from './holiday-api.service';

@Module({
  imports: [HttpModule],

  providers: [HolidayApiClient, HolidayApiService],

  exports: [HolidayApiService],
})
export class HolidayApiModule {}
