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
 * - Wire Controller, Service, Providers, Mapper and Integrations.
 *
 * ============================================================================
 */

import { Module } from '@nestjs/common';

import { CalendarController } from './controllers/calendar.controller';

import { CalendarMapper } from './mappers/calendar.mapper';

import { CalendarProvider } from './providers/calendar.provider';
import { HolidayProvider } from './providers/holiday.provider';

import { CalendarService } from './services/calendar.service';

import { HolidayApiModule } from '../integrations/holidays/holiday-api.module';

@Module({
  imports: [HolidayApiModule],

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
