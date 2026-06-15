'use client';

import { useQuery } from '@tanstack/react-query';

import { getNotes } from '../api/get-notes';

import { QUERY_KEYS } from '@/constants/query-keys';

export function useNotes() {
    return useQuery({
        queryKey: QUERY_KEYS.NOTES,

        queryFn: getNotes,
    });
}