/*
 * ============================================================================
 * File: timestamp.subscriber.ts
 * ============================================================================
 *
 * TypeORM Timestamp Subscriber
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Automatically maintain createdAt and updatedAt fields.
 * - Remove duplicate timestamp handling from entities.
 * - Apply consistent timestamp behaviour globally.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain business logic.
 * - Call services.
 * - Trigger external integrations.
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - TypeORM 0.3+
 * - NestJS 11
 *
 * ============================================================================
 */

import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class TimestampSubscriber implements EntitySubscriberInterface {
  /**
   * ==========================================================================
   * Before Insert
   * ==========================================================================
   *
   * Automatically sets createdAt and updatedAt.
   */
  beforeInsert(event: InsertEvent<any>): void {
    const entity = event.entity;

    if (!entity) {
      return;
    }

    const now = new Date();

    if ('createdAt' in entity && !entity.createdAt) {
      entity.createdAt = now;
    }

    if ('updatedAt' in entity) {
      entity.updatedAt = now;
    }
  }

  /**
   * ==========================================================================
   * Before Update
   * ==========================================================================
   *
   * Automatically updates updatedAt.
   */
  beforeUpdate(event: UpdateEvent<any>): void {
    const entity = event.entity;

    if (!entity) {
      return;
    }

    if ('updatedAt' in entity) {
      entity.updatedAt = new Date();
    }
  }
}
