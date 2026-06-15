import { z } from 'zod';

export const updateNoteSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().optional(),
});

export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;