import { fastapiClient } from '@/services/fastapi/client';
import { API_ROUTES } from '@/constants/api-routes';

import { Note } from '../types/note.types';

export async function getNotes(): Promise<Note[]> {
    const response = await fastapiClient.get<Note[]>(API_ROUTES.NOTES);
    return response.data;
}