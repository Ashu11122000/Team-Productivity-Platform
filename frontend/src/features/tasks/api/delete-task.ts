import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

export async function deleteTask(
  id: string,
) {
  await nestjsClient.delete(
    `${API_ROUTES.TASKS}/${id}`,
  );
}