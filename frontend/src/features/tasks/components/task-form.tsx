'use client';

import { UseFormReturn } from 'react-hook-form';

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useCategories } from '@/features/categories/hooks/use-categories';

import { TaskFormValues } from '../schemas/task.schema';

interface TaskFormProps {
  form: UseFormReturn<TaskFormValues>;
}

export function TaskForm({
  form,
}: TaskFormProps) {
  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useCategories();

  const categories =
    categoriesData?.data ?? [];

  console.log(
    'categoriesData:',
    categoriesData,
  );

  console.log(
    'categories:',
    categories,
  );

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter task title"
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
                  rows={5}
                  placeholder="Enter task description"
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category
              </FormLabel>

              <Select
                value={
                  field.value ??
                  '__none__'
                }
                onValueChange={(
                  value,
                ) =>
                  field.onChange(
                    value ===
                      '__none__'
                      ? null
                      : value,
                  )
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="__none__">
                    No Category
                  </SelectItem>

                  {isLoading && (
                    <SelectItem
                      value="loading"
                      disabled
                    >
                      Loading...
                    </SelectItem>
                  )}

                  {isError && (
                    <SelectItem
                      value="error"
                      disabled
                    >
                      Failed to load
                      categories
                    </SelectItem>
                  )}

                  {!isLoading &&
                    !isError &&
                    categories.map(
                      (
                        category,
                      ) => (
                        <SelectItem
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </SelectItem>
                      ),
                    )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status
              </FormLabel>

              <FormControl>
                <select
                  className="w-full rounded-md border p-2"
                  {...field}
                >
                  <option value="TODO">
                    To Do
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Priority
              </FormLabel>

              <FormControl>
                <select
                  className="w-full rounded-md border p-2"
                  {...field}
                >
                  <option value="LOW">
                    Low
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>
                </select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Due Date
              </FormLabel>

              <FormControl>
                <Input
                  type="datetime-local"
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
      </div>
    </Form>
  );
}