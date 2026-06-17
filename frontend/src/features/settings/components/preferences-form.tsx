'use client';

import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  preferencesSchema,
  type PreferencesFormValues,
} from '../schemas/preferences.schema';

import { usePreferences } from '../hooks/usePreferences';

import { useUpdatePreferences } from '../hooks/useUpdatePreferences';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Switch } from '@/components/ui/switch';

export function PreferencesForm() {
  const {
    data,
    isLoading,
  } = usePreferences();

  const mutation =
    useUpdatePreferences();

  const form =
    useForm<PreferencesFormValues>({
      resolver:
        zodResolver(
          preferencesSchema
        ),
      defaultValues: {
        notificationsEnabled:
          false,
      },
    });

  useEffect(() => {
    if (!data) return;

    form.reset(data);
  }, [data, form]);

  const notificationsEnabled =
    form.watch(
      'notificationsEnabled'
    );

  const onSubmit = (
    values: PreferencesFormValues
  ) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <Card
        className="
          rounded-3xl
          border
          border-slate-200
          shadow-sm
        "
      >
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">
            Loading preferences...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="
        rounded-3xl
        border
        border-slate-200
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
      "
    >
      <CardHeader>
        <CardTitle>
          Preferences
        </CardTitle>

        <CardDescription>
          Manage your personal
          application preferences.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="space-y-6"
        >
          <div
            className="
              flex items-center
              justify-between
              rounded-2xl
              border
              border-slate-200
              p-4
            "
          >
            <div>
              <p className="font-medium text-slate-900">
                Notifications
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Receive reminders,
                updates, and activity
                notifications.
              </p>
            </div>

            <Switch
              checked={
                notificationsEnabled
              }
              disabled={
                mutation.isPending
              }
              onCheckedChange={(
                value
              ) =>
                form.setValue(
                  'notificationsEnabled',
                  value,
                  {
                    shouldDirty:
                      true,
                  }
                )
              }
            />
          </div>

          <Button
            type="submit"
            disabled={
              mutation.isPending ||
              !form.formState
                .isDirty
            }
            className="
              w-full
              sm:w-auto
            "
          >
            {mutation.isPending
              ? 'Saving...'
              : 'Save Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}