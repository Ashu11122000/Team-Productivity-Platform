import { z } from 'zod';

export const registerSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
})
.refine(
    (data) => 
        data.password === data.confirmPassword,
    {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    },
);

export type RegisterFormValues = z.infer<typeof registerSchema>;