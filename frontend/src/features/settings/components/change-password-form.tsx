'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  passwordSchema,
  PasswordFormValues,
} from '../schemas/password.schema';

import { useChangePassword } from '../hooks/useChangePassword';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

export function ChangePasswordForm() {
  const mutation =
    useChangePassword();

  const form =
    useForm<PasswordFormValues>({
      resolver:
        zodResolver(
          passwordSchema
        ),
    });

  const onSubmit = (
    values: PasswordFormValues
  ) => {
    mutation.mutate({
      currentPassword:
        values.currentPassword,

      newPassword:
        values.newPassword,
    });

    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Change Password
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <Input
            type="password"
            placeholder="Current Password"
            {...form.register(
              'currentPassword'
            )}
          />

          <Input
            type="password"
            placeholder="New Password"
            {...form.register(
              'newPassword'
            )}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            {...form.register(
              'confirmPassword'
            )}
          />

          <Button
            type="submit"
            disabled={
              mutation.isPending
            }
          >
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}