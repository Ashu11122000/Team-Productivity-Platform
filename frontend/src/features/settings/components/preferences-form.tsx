'use client';

import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  preferencesSchema,
  PreferencesFormValues,
} from '../schemas/preferences.schema';

import { usePreferences } from '../hooks/usePreferences';

import { useUpdatePreferences } from '../hooks/useUpdatePreferences';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Switch } from '@/components/ui/switch';

export function PreferencesForm() {
  const { data } =
    usePreferences();

  const mutation =
    useUpdatePreferences();

  const form =
    useForm<PreferencesFormValues>({
      resolver:
        zodResolver(
          preferencesSchema
        ),
    });

  useEffect(() => {
    if (!data) return;

    form.reset(data);
  }, [data, form]);

  const onSubmit = (
    values: PreferencesFormValues
  ) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Preferences
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <span>
              Notifications
            </span>

            <Switch
              checked={form.watch(
                'notificationsEnabled'
              )}
              onCheckedChange={(
                value
              ) =>
                form.setValue(
                  'notificationsEnabled',
                  value
                )
              }
            />
          </div>

          <Button
            type="submit"
            disabled={
              mutation.isPending
            }
          >
            Save Preferences
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}