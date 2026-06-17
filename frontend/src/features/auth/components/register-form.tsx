'use client';

import { Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas/register.schema';

import { useRegister } from '../hooks/use-register';

export function RegisterForm() {
  const router = useRouter();

  const registerMutation =
    useRegister();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(
      registerSchema,
    ),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(
    values: RegisterFormValues,
  ) {
    await registerMutation.mutateAsync(
      values,
    );

    router.push('/login');
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          className="rounded-xl"
          {...register('email')}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          className="rounded-xl"
          {...register(
            'password',
          )}
        />

        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          className="rounded-xl"
          {...register(
            'confirmPassword',
          )}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {
              errors
                .confirmPassword
                .message
            }
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          registerMutation.isPending
        }
        className="
          w-full
          bg-indigo-600
          hover:bg-indigo-700
        "
      >
        {registerMutation.isPending ? (
          <>
            <Loader2
              className="
                mr-2
                h-4
                w-4
                animate-spin
              "
            />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
}