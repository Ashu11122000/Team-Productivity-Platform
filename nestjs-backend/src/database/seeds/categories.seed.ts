/**
 * ============================================================================
 * File: categories.seed.ts
 * ============================================================================
 *
 * Default Categories Seeder
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide default categories.
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

export interface CategorySeed {
  name: string;

  description?: string;

  color?: string;

  userId: string;
}

export const categoriesSeed = (userId: string): CategorySeed[] => [
  {
    name: 'Work',

    description: 'Professional and work related tasks',

    color: '#2563EB',

    userId,
  },

  {
    name: 'Personal',

    description: 'Personal activities and goals',

    color: '#16A34A',

    userId,
  },

  {
    name: 'Study',

    description: 'Learning and education tasks',

    color: '#9333EA',

    userId,
  },

  {
    name: 'Health',

    description: 'Health and fitness related tasks',

    color: '#DC2626',

    userId,
  },
];
