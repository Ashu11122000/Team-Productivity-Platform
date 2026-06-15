// features/tasks/api/get-task.ts

import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/constants/api-routes';

import { Task } from '../types/task.types';

export async function getTask(
  id: string,
): Promise<Task> {
  const response =
    await nestjsClient.get<Task>(
      `${API_ROUTES.TASKS}/${id}`,
    );

  return response.data;
}