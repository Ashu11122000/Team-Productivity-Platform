import { fastapiClient } from '@/services/fastapi/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import { Note } from '../types/note.types';
import { UpdateNoteRequest } from '../types/update-note.types';

export async function updateNote(
  id: number,
  data: UpdateNoteRequest,
): Promise<Note> {
  const response = await fastapiClient.put<Note>(
    `${API_ROUTES.NOTES}/${id}`,
    data,
  );

  return response.data;
}
