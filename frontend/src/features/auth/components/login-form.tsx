'use client';

import { Loader2 } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  loginSchema,
  type LoginFormValues,
} from '../schemas/login.schema';

import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(
      loginSchema,
    ),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(
    values: LoginFormValues,
  ) {
    await loginMutation.mutateAsync(
      values,
    );
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
          <p
            className="
              text-sm
              text-red-500
            "
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          className="rounded-xl"
          {...register(
            'password',
          )}
        />

        {errors.password && (
          <p
            className="
              text-sm
              text-red-500
            "
          >
            {
              errors.password
                .message
            }
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          loginMutation.isPending
        }
        className="
          w-full
          bg-indigo-600
          hover:bg-indigo-700
        "
      >
        {loginMutation.isPending ? (
          <>
            <Loader2
              className="
                mr-2
                h-4
                w-4
                animate-spin
              "
            />

            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}