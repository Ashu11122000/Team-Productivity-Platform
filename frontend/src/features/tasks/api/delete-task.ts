// features/tasks/api/delete-task.ts

import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/constants/api-routes';

export async function deleteTask(
  id: string,
): Promise<void> {
  await nestjsClient.delete(
    `${API_ROUTES.TASKS}/${id}`,
  );
}