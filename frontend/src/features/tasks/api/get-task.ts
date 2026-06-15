import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import type { Task } from '../types/task.types';

interface GetTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export async function getTask(
  id: string,
): Promise<Task> {
  const response =
    await nestjsClient.get<GetTaskResponse>(
      `${API_ROUTES.TASKS}/${id}`,
    );

  return response.data.data;
}