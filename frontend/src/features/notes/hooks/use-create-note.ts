'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '../api/create-note';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTES,
      });
    },
  });
}
