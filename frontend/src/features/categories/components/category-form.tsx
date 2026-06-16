'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  categorySchema,
  type CategoryFormValues,
} from '../schemas/category.schema';

import type { Category } from '../types/category.types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CategoryFormProps {
  defaultValues?: Partial<Category>;

  onSubmit: (
    values: CategoryFormValues,
  ) => void | Promise<void>;

  isLoading?: boolean;
}

export function CategoryForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),

    defaultValues: {
      name: defaultValues?.name ?? '',
      description:
        defaultValues?.description ?? '',
      color:
        defaultValues?.color ?? '#3b82f6',
    },
  });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      name: defaultValues.name ?? '',
      description:
        defaultValues.description ?? '',
      color:
        defaultValues.color ?? '#3b82f6',
    });
  }, [defaultValues, form]);

  const handleSubmit = async (
    values: CategoryFormValues,
  ) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          handleSubmit,
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter category name"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Enter category description"
                  className="min-h-[120px]"
                  disabled={isLoading}
                  {...field}
                  value={
                    field.value ?? ''
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Color
              </FormLabel>

              <FormControl>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    className="h-10 w-20 p-1"
                    disabled={isLoading}
                    {...field}
                    value={
                      field.value ??
                      '#3b82f6'
                    }
                  />

                  <Input
                    placeholder="#3b82f6"
                    disabled={isLoading}
                    value={
                      field.value ??
                      ''
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value,
                      )
                    }
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            isLoading ||
            !form.formState.isValid
          }
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Category'
          )}
        </Button>
      </form>
    </Form>
  );
}