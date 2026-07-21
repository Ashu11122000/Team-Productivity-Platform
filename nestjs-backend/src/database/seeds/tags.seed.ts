/*
 * ============================================================================
 * File: tags.seed.ts
 * ============================================================================
 *
 * Default Tags Seeder
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide default task tags.
 * - Used only for development/testing environments.
 * - Requires existing FastAPI userId.
 *
 * Important:
 * ----------------------------------------------------------------------------
 * Users are managed by FastAPI.
 * This seeder does NOT create users.
 *
 * ============================================================================
 */

export interface TagSeed {
  name: string;

  color?: string;

  userId: string;
}

export const tagsSeed = (userId: string): TagSeed[] => [
  {
    name: 'Urgent',

    color: '#DC2626',

    userId,
  },

  {
    name: 'Backend',

    color: '#2563EB',

    userId,
  },

  {
    name: 'Frontend',

    color: '#7C3AED',

    userId,
  },

  {
    name: 'Bug',

    color: '#EA580C',

    userId,
  },

  {
    name: 'Feature',

    color: '#16A34A',

    userId,
  },

  {
    name: 'Learning',

    color: '#0891B2',

    userId,
  },
];
