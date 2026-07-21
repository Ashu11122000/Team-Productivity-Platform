/***
 * ============================================================================
 * File: chart-data.interface.ts
 * ============================================================================
 *
 * Chart Data Interface.
 *
 * Responsibilities
 * ----------------
 * - Represent a generic chart data point.
 * - Support bar, line, pie, doughnut, and area charts.
 * - Decouple repository results from presentation-layer DTOs.
 * - Provide a reusable analytics contract.
 *
 * Notes
 * -----
 * - Internal use only.
 * - Shared across repositories, services, and mappers.
 * - Independent of Swagger, TypeORM, and frontend chart libraries.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

export interface ChartData {
  /**
   * Display label.
   *
   * Examples:
   * - COMPLETED
   * - HIGH
   * - January
   * - Work
   */
  readonly label: string;

  /**
   * Numeric value associated with the label.
   */
  readonly value: number;
}
