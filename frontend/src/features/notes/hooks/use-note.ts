'use client';

import { useQuery } from '@tanstack/react-query';

import { getNote } from '../api/get-note';

import { QUERY_KEYS } from '@/constants/query-keys';

export function useNote(id: number) {
    return useQuery({
        queryKey: [...QUERY_KEYS.NOTES, id],

        queryFn: () => getNote(id),

        enabled: !!id,
    });
}