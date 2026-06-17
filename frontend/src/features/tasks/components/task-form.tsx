'use client';

import { UseFormReturn } from 'react-hook-form';

import {
  CalendarDays,
  ClipboardList,
  FolderKanban,
  Flag,
  FileText,
} from 'lucide-react';

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

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ClipboardList className="h-4 w-4 text-indigo-500" />
                Title
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter task title..."
                  className="h-12 rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-500/30"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText className="h-4 w-4 text-violet-500" />
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Describe your task..."
                  className="rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-500/30"
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

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FolderKanban className="h-4 w-4 text-cyan-500" />
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
                  <SelectTrigger className="h-12 rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="rounded-2xl border-white/20 bg-white/90 backdrop-blur-xl">
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
                      Failed to load categories
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

        {/* Status + Priority */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ClipboardList className="h-4 w-4 text-cyan-500" />
                  Status
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border-white/20 bg-white/90 backdrop-blur-xl">
                    <SelectItem value="TODO">
                      To Do
                    </SelectItem>

                    <SelectItem value="IN_PROGRESS">
                      In Progress
                    </SelectItem>

                    <SelectItem value="COMPLETED">
                      Completed
                    </SelectItem>

                    <SelectItem value="BLOCKED">
                      Blocked
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Flag className="h-4 w-4 text-rose-500" />
                  Priority
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border-white/20 bg-white/90 backdrop-blur-xl">
                    <SelectItem value="LOW">
                      Low
                    </SelectItem>

                    <SelectItem value="MEDIUM">
                      Medium
                    </SelectItem>

                    <SelectItem value="HIGH">
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                Due Date
              </FormLabel>

              <FormControl>
                <Input
                  type="datetime-local"
                  className="h-12 rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-500/30"
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