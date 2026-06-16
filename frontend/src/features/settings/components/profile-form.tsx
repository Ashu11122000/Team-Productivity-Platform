'use client';

import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  profileSchema,
  ProfileFormValues,
} from '../schemas/profile.schema';

import { useProfile } from '../hooks/useProfile';

import { useUpdateProfile } from '../hooks/useUpdateProfile';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

export function ProfileForm() {
  const { data } = useProfile();

  const updateProfile =
    useUpdateProfile();

  const form =
    useForm<ProfileFormValues>({
      resolver:
        zodResolver(profileSchema),

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
        data.avatarUrl || '',
    });
  }, [data, form]);

  const onSubmit = (
    values: ProfileFormValues
  ) => {
    updateProfile.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Update Profile
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
            placeholder="Name"
            {...form.register('name')}
          />

          <Input
            placeholder="Email"
            {...form.register('email')}
          />

          <Input
            placeholder="Avatar URL"
            {...form.register(
              'avatarUrl'
            )}
          />

          <Button
            type="submit"
            disabled={
              updateProfile.isPending
            }
          >
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}