/***
 * ============================================================================
 * File: dashboard-widget.interface.ts
 * ============================================================================
 *
 * Enterprise Dashboard Widget Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the internal structure of a dashboard widget.
 * - Represents reusable dashboard cards, charts, metrics, or summaries.
 * - Acts as a business contract between the Repository and Service layers.
 * - Keeps widget definitions independent of HTTP and persistence concerns.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Interface Segregation Principle (ISP)
 * - Strong Typing
 * - Clean Architecture
 * - Framework Agnostic
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Repository implementations populate these widgets.
 * - Services may enrich widget data with business rules.
 * - Mapper converts these widgets into response DTOs.
 * - Controllers should never expose this interface directly.
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 *
 * Future Enhancements
 * ----------------------------------------------------------------------------
 * TODO:
 * - Support configurable widget layouts.
 * - Add widget permissions.
 * - Support lazy-loaded widgets.
 * - Support custom user widgets.
 * - Add widget refresh metadata.
 * ============================================================================
 */

/**
 * Supported dashboard widget types.
 */
export type DashboardWidgetType =
  'stat' | 'chart' | 'progress' | 'calendar' | 'notification' | 'reminder';

/**
 * Dashboard widget metadata.
 */
export interface DashboardWidget {
  /**
   * Unique widget identifier.
   */
  id: string;

  /**
   * Widget title displayed in the UI.
   */
  title: string;

  /**
   * Widget category/type.
   */
  type: DashboardWidgetType;

  /**
   * Primary value displayed by the widget.
   *
   * Examples:
   * - Total Tasks
   * - 87%
   * - 15
   */
  value: string | number;

  /**
   * Optional secondary description.
   */
  description?: string;

  /**
   * Optional icon identifier.
   *
   * Example:
   * - check-circle
   * - calendar
   * - bell
   * - activity
   */
  icon?: string;

  /**
   * Optional color identifier.
   *
   * Example:
   * - success
   * - warning
   * - danger
   * - info
   */
  color?: string;

  /**
   * Percentage change compared to the previous period.
   */
  change?: number;

  /**
   * Indicates whether the change is positive.
   */
  isPositive?: boolean;

  /**
   * Sort order for dashboard rendering.
   */
  order?: number;

  /**
   * Whether the widget should be visible.
   */
  visible?: boolean;

  /**
   * Additional widget-specific data.
   *
   * Examples:
   * - Chart datasets
   * - Calendar events
   * - Notification list
   */
  metadata?: Record<string, unknown>;
}
