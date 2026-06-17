'use client';

import { useQuery } from '@tanstack/react-query';

import { getNotes } from '../api/get-notes';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useNotes() {
  return useQuery({
    queryKey: QUERY_KEYS.notes,

    queryFn: getNotes,
  });
}
