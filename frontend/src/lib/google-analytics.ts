// src/lib/google-analytics.ts

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Track page views
 */
export const pageView = (url: string): void => {
  if (
    typeof window === 'undefined' ||
    !window.gtag ||
    !GA_ID
  ) {
    return;
  }

  window.gtag('config', GA_ID, {
    page_path: url,
  });
};

/**
 * Track custom GA4 events
 */
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
): void => {
  if (
    typeof window === 'undefined' ||
    !window.gtag
  ) {
    return;
  }

  const params: Record<string, string | number> = {};

  if (category) {
    params.event_category = category;
  }

  if (label) {
    params.event_label = label;
  }

  if (value !== undefined) {
    params.value = value;
  }

  window.gtag('event', action, params);
};

/**
 * Strongly-typed helper for common events
 */
export const AnalyticsEvents = {
  // Notes
  CREATE_NOTE: 'create_note',
  UPDATE_NOTE: 'update_note',
  DELETE_NOTE: 'delete_note',
  CONVERT_NOTE_TO_TASK: 'convert_note_to_task',

  // Tasks
  CREATE_TASK: 'create_task',
  UPDATE_TASK: 'update_task',
  DELETE_TASK: 'delete_task',

  // Categories
  CREATE_CATEGORY: 'create_category',
  UPDATE_CATEGORY: 'update_category',
  DELETE_CATEGORY: 'delete_category',

  // Notifications
  OPEN_NOTIFICATIONS: 'open_notifications',
  MARK_NOTIFICATION_READ: 'mark_notification_read',

  // Analytics
  VIEW_ANALYTICS: 'view_analytics',

  // Open Library
  SEARCH_BOOK: 'search_book',

  // Holidays
  VIEW_HOLIDAYS: 'view_holidays',

  // Settings
  UPDATE_PROFILE: 'update_profile',
  CHANGE_PASSWORD: 'change_password',
  UPDATE_PREFERENCES: 'update_preferences',
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];