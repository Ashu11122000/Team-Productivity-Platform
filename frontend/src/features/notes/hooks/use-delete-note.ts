'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteNote } from '../api/delete-note';

import { QUERY_KEYS } from '@/constants/query-keys';

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTES,
      });
    },
  });
}