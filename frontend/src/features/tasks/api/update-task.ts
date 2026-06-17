import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import type { Task } from '../types/task.types';

import type {
  UpdateTaskRequest,
} from '../types/update-task.types';

interface UpdateTaskResponse {
  success: boolean;

  message: string;

  data: Task;
}

export async function updateTask(
  id: string,
  payload: UpdateTaskRequest,
): Promise<Task> {
  const response =
    await nestjsClient.patch<UpdateTaskResponse>(
      `${API_ROUTES.TASKS.BASE}/${id}`,
      payload,
    );

  return response.data.data;
}