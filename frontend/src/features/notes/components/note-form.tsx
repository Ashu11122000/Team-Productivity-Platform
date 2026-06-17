'use client';

import { FileText, PenSquare } from 'lucide-react';

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

export interface NoteFormValues {
  title: string;
  content: string;
}

interface NoteFormProps {
  form: UseFormReturn<NoteFormValues>;
}

export function NoteForm({
  form,
}: NoteFormProps) {
  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                <FileText
                  className="
                    h-4
                    w-4
                    text-indigo-500
                  "
                />
                Title
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter note title"
                  {...field}
                  className="
                    h-12
                    rounded-2xl
                    border-slate-300
                    bg-white/80
                    shadow-sm
                    backdrop-blur-xl
                    transition-all
                    duration-300

                    placeholder:text-slate-400

                    hover:border-slate-400

                    focus:border-cyan-500
                    focus:ring-2
                    focus:ring-cyan-500/20
                  "
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                <PenSquare
                  className="
                    h-4
                    w-4
                    text-cyan-500
                  "
                />
                Content
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={8}
                  placeholder="Write your thoughts, meeting notes, ideas, research, or important information..."
                  {...field}
                  value={
                    field.value ?? ''
                  }
                  className="
                    min-h-[220px]
                    resize-y

                    rounded-3xl
                    border-slate-300

                    bg-white/80

                    shadow-sm
                    backdrop-blur-xl

                    transition-all
                    duration-300

                    placeholder:text-slate-400

                    hover:border-slate-400

                    focus:border-cyan-500
                    focus:ring-2
                    focus:ring-cyan-500/20
                  "
                />
              </FormControl>

              <div
                className="
                  text-xs
                  text-slate-400
                "
              >
                Capture ideas, meeting
                summaries, project notes,
                or anything important.
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}