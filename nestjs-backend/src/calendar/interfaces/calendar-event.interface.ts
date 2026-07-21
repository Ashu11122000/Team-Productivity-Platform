/*
 * ============================================================================
 * File: calendar-event.interface.ts
 * ============================================================================
 *
 * Enterprise Calendar Event Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents the internal calendar event model.
 * - Acts as the contract between providers and CalendarMapper.
 * - Keeps provider implementations independent from API DTOs.
 * - Supports events originating from multiple sources.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Interface only
 * - Strongly typed
 * - No business logic
 * - Provider independent
 * - Reusable across services and providers
 *
 * Notes
 * ----------------------------------------------------------------------------
 * This interface is never returned directly by controllers.
 * CalendarMapper converts CalendarEvent objects into CalendarEventDto
 * before sending responses to clients.
 * ============================================================================
 */

export interface CalendarEvent {
  /**
   * Unique event identifier.
   */
  id: string;

  /**
   * Event title.
   */
  title: string;

  /**
   * Optional event description.
   */
  description?: string;

  /**
   * Event date and time.
   */
  date: Date;

  /**
   * Business event type.
   */
  type: 'HOLIDAY' | 'TASK' | 'REMINDER' | 'NOTIFICATION' | 'CUSTOM';

  /**
   * Event display color.
   */
  color: string;

  /**
   * Whether the event lasts the entire day.
   */
  allDay: boolean;

  /**
   * Optional URL for navigation.
   */
  url?: string;

  /**
   * Additional provider-specific metadata.
   */
  metadata?: Record<string, unknown>;
}
