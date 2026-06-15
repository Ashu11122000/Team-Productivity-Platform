import { fastapiClient } from '@/services/fastapi/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

export async function deleteNote(id: number): Promise<void> {
  await fastapiClient.delete(`${API_ROUTES.NOTES}/${id}`);
}
