'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
    const router = useRouter();

    const loginMutation = useLogin();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit( values: LoginFormValues ) {
        await loginMutation.mutateAsync(values);
        router.push('/');
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

            <Button type="submit" className="w-full" disabled={loginMutation.isPending} >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Button>
        </form>
    );
}