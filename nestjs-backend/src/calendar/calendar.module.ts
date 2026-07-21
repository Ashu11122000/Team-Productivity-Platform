/*
 * ============================================================================
 * File: calendar.module.ts
 * ============================================================================
 *
 * Enterprise Calendar Module
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Register Calendar feature components.
 * - Configure dependency injection.
 * - Wire Controller, Service, Providers, and Mapper.
 *
 * Architecture
 * ----------------------------------------------------------------------------
 *
 * Controller
 *      |
 *      ▼
 * Service
 *      |
 *      ▼
 * Provider
 *      |
 *      ▼
 * External Integrations
 *
 * Mapper
 *      |
 *      ▼
 * DTO Responses
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - SOLID
 * - Dependency Injection
 * - Provider Pattern
 * - Mapper Pattern
 * - Modular Design
 *
 * Notes
 * ----------------------------------------------------------------------------
 * Calendar does not use:
 *
 * - TypeORM
 * - Repository layer
 * - Entities
 *
 * because calendar data is integration/provider based.
 *
 * ============================================================================
 */

import { Module } from '@nestjs/common';

import { CalendarController } from './controllers/calendar.controller';

import { CalendarMapper } from './mappers/calendar.mapper';

import { CalendarProvider } from './providers/calendar.provider';
import { HolidayProvider } from './providers/holiday.provider';

import { CalendarService } from './services/calendar.service';

@Module({
  controllers: [CalendarController],

  providers: [
    CalendarService,

    CalendarProvider,

    HolidayProvider,

    CalendarMapper,
  ],

  exports: [CalendarService, CalendarProvider, CalendarMapper],
})
export class CalendarModule {}
