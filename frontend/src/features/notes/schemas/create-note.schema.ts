import { z } from 'zod';

export const createNoteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    content: z.string().optional(),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;