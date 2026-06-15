import { fastapiClient } from '@/services/fastapi/client';
import { API_ROUTES } from '@/lib/constants/api-routes';

import { Note } from '../types/note.types';

export async function getNote(id: number): Promise<Note> {
  const response = await fastapiClient.get<Note>(`${API_ROUTES.NOTES}/${id}`);

  return response.data;
}
