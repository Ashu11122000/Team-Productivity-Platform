import { z } from 'zod';

export const preferencesSchema =
  z.object({
    theme: z.enum([
      'light',
      'dark',
      'system',
    ]),

    notificationsEnabled:
      z.boolean(),

    defaultTaskView: z.enum([
      'table',
      'kanban',
    ]),

    language: z.string(),
  });

export type PreferencesFormValues =
  z.infer<typeof preferencesSchema>;