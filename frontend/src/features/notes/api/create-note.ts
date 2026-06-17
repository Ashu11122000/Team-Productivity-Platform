import { fastapiClient } from '@/services/fastapi/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import {
  CreateNoteInput,
  Note,
} from '../types/note.types';

export async function createNote(
  payload: CreateNoteInput,
): Promise<Note> {
  const response =
    await fastapiClient.post<Note>(
      API_ROUTES.NOTES.BASE,
      payload,
    );

  return response.data;
}