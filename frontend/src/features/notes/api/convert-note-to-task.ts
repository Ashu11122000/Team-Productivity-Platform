// features/notes/api/convert-note-to-task.ts

import { fastapiClient } from '@/services/fastapi/client';
import { API_ROUTES } from '@/constants/api-routes';

export async function convertNoteToTask( noteId: number ) {
    const response = await fastapiClient.post(
        `${API_ROUTES.NOTES}/${noteId}/convert-to-task`,
    );

    return response.data;
}