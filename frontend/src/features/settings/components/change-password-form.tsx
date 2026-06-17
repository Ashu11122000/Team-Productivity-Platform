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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const Label = ({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-slate-700"
  >
    {children}
  </label>
);

export function ChangePasswordForm() {
  const mutation =
    useChangePassword();

  const form =
    useForm<PasswordFormValues>({
      resolver:
        zodResolver(
          passwordSchema
        ),
      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    });

  const onSubmit = (
    values: PasswordFormValues
  ) => {
    mutation.mutate(
      {
        currentPassword:
          values.currentPassword,

        newPassword:
          values.newPassword,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <Card
      className="
        rounded-3xl
        border-slate-200
        shadow-sm
      "
    >
      <CardHeader>
        <CardTitle>
          Change Password
        </CardTitle>

        <CardDescription>
          Update your account password
          to keep your account secure.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>
              Current Password
            </Label>

            <Input
              type="password"
              placeholder="Enter current password"
              {...form.register(
                'currentPassword'
              )}
            />

            {form.formState.errors
              .currentPassword && (
              <p className="text-sm text-red-500">
                {
                  form.formState.errors
                    .currentPassword
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              New Password
            </Label>

            <Input
              type="password"
              placeholder="Enter new password"
              {...form.register(
                'newPassword'
              )}
            />

            {form.formState.errors
              .newPassword && (
              <p className="text-sm text-red-500">
                {
                  form.formState.errors
                    .newPassword
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Confirm Password
            </Label>

            <Input
              type="password"
              placeholder="Confirm new password"
              {...form.register(
                'confirmPassword'
              )}
            />

            {form.formState.errors
              .confirmPassword && (
              <p className="text-sm text-red-500">
                {
                  form.formState.errors
                    .confirmPassword
                    .message
                }
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              mutation.isPending
            }
            className="w-full sm:w-auto"
          >
            {mutation.isPending
              ? 'Updating...'
              : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}