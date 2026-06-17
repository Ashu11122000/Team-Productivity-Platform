import { fastapiClient } from '@/services/fastapi/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import { Note } from '../types/note.types';
import { CreateNoteRequest } from '../types/create-note.types';

export async function createNote(data: CreateNoteRequest): Promise<Note> {
  const response = await fastapiClient.post<Note>(API_ROUTES.NOTES.BASE, data);

  return response.data;
}
