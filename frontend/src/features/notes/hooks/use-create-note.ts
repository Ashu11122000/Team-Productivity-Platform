'use client';

import { useRouter } from 'next/navigation';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import { createNote } from '../api/create-note';

export function useCreateNote() {
  const router =
    useRouter();

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.notes,
      });

      toast.success(
        'Note created successfully',
      );

      router.push('/notes');
    },

    onError: () => {
      toast.error(
        'Failed to create note',
      );
    },
  });
}