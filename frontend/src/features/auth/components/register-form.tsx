'use client';

import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { registerSchema, type RegisterFormValues } from '../schemas/register.schema';

import { useRegister } from '../hooks/use-register';

export function RegisterForm() {
    const router = useRouter();

    const registerMutation = useRegister();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver:
            zodResolver(registerSchema),
    });

    async function onSubmit(
        values: RegisterFormValues,
    ) {
        await registerMutation.mutateAsync( values );
        router.push('/login');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input type="email" placeholder="Email" {...register('email')} />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <Input type="password" placeholder="Password" {...register('password')} />

                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <Input type="password" placeholder="Confirm Password" {...register( 'confirmPassword' )} />

                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                        { errors.confirmPassword.message } 
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={ registerMutation.isPending } >
                {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
        </form>
    );
}