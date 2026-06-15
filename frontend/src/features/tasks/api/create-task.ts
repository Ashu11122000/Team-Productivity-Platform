import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import type { CreateTaskRequest } from '../types/create-task.types';
import type { Task } from '../types/task.types';

interface CreateTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export async function createTask(
  payload: CreateTaskRequest,
): Promise<Task> {
  const response =
    await nestjsClient.post<CreateTaskResponse>(
      API_ROUTES.TASKS,
      payload,
    );

  return response.data.data;
}