import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import type {
  Task,
  TaskStatus,
} from '../types/task.types';

interface UpdateTaskStatusParams {
  id: string;
  status: TaskStatus;
}

interface UpdateTaskStatusResponse {
  success: boolean;
  message: string;
  data: Task;
}

export async function updateTaskStatus({
  id,
  status,
}: UpdateTaskStatusParams): Promise<Task> {
  const response =
    await nestjsClient.patch<UpdateTaskStatusResponse>(
      `${API_ROUTES.TASKS.BASE}/${id}`,
      {
        status,
      },
    );

  return response.data.data;
}