'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateNote } from '../api/update-note';

import { UpdateNoteRequest } from '../types/update-note.types';

import { QUERY_KEYS } from '@/constants/query-keys';

interface UpdateNotePayload {
    id: number;
    data: UpdateNoteRequest;
}

export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: UpdateNotePayload) =>
            updateNote(id, data),

            onSuccess: () => {
                queryClient.invalidateQueries({
                        queryKey: QUERY_KEYS.NOTES,
                    });
                },
            });
}