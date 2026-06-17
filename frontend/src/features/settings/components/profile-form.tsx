'use client';

import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  profileSchema,
  type ProfileFormValues,
} from '../schemas/profile.schema';

import { useProfile } from '../hooks/useProfile';

import { useUpdateProfile } from '../hooks/useUpdateProfile';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

export function ProfileForm() {
  const {
    data,
    isLoading,
  } = useProfile();

  const updateProfile =
    useUpdateProfile();

  const form =
    useForm<ProfileFormValues>({
      resolver:
        zodResolver(
          profileSchema
        ),

      defaultValues: {
        name: '',
        email: '',
        avatarUrl: '',
      },
    });

  useEffect(() => {
    if (!data) return;

    form.reset({
      name: data.name,
      email: data.email,
      avatarUrl:
        data.avatarUrl ?? '',
    });
  }, [data, form]);

  const onSubmit = (
    values: ProfileFormValues
  ) => {
    updateProfile.mutate(values);
  };

  if (isLoading) {
    return (
      <Card
        className="
          rounded-3xl
          border-slate-200
          shadow-sm
        "
      >
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">
            Loading profile...
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    errors,
  } = form.formState;

  return (
    <Card
      className="
        rounded-3xl
        border-slate-200
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
      "
    >
      <CardHeader>
        <CardTitle>
          Update Profile
        </CardTitle>

        <CardDescription>
          Manage your personal
          information and account
          details.
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
            <p className="text-sm font-medium text-slate-700">
              Full Name
            </p>

            <Input
              placeholder="Enter your name"
              {...form.register(
                'name'
              )}
            />

            {errors.name && (
              <p className="text-sm text-red-500">
                {
                  errors.name
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Email Address
            </p>

            <Input
              placeholder="Enter your email"
              {...form.register(
                'email'
              )}
            />

            {errors.email && (
              <p className="text-sm text-red-500">
                {
                  errors.email
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Avatar URL
            </p>

            <Input
              placeholder="https://..."
              {...form.register(
                'avatarUrl'
              )}
            />

            {errors.avatarUrl && (
              <p className="text-sm text-red-500">
                {
                  errors.avatarUrl
                    .message
                }
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              updateProfile.isPending
            }
            className="
              w-full
              sm:w-auto
            "
          >
            {updateProfile.isPending
              ? 'Saving...'
              : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}