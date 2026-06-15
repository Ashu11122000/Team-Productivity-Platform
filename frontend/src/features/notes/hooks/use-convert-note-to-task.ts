// features/notes/hooks/use-convert-note-to-task.ts

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { convertNoteToTask } from '../api/convert-note-to-task';

import { QUERY_KEYS } from '@/constants/query-keys';

export function useConvertNoteToTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: convertNoteToTask,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.NOTES,
            });

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.TASKS,
            });
        },
    });
}