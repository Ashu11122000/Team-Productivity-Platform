import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/constants/api-routes';

import {
  Task,
  TaskStatus,
} from '../types/task.types';

interface UpdateTaskStatusParams {
  id: string;
  status: TaskStatus;
}

export async function updateTaskStatus({
  id,
  status,
}: UpdateTaskStatusParams): Promise<Task> {
  const response =
    await nestjsClient.patch<Task>(
      `${API_ROUTES.TASKS}/${id}`,
      {
        status,
      },
    );

  return response.data;
}