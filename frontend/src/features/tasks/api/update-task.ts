// features/tasks/api/update-task.ts

import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import { UpdateTaskRequest } from '../types/update-task.types';

import { Task } from '../types/task.types';

interface UpdateTaskParams {
  id: string;
  data: UpdateTaskRequest;
}

export async function updateTask({
  id,
  data,
}: UpdateTaskParams): Promise<Task> {
  const response = await nestjsClient.patch<Task>(
    `${API_ROUTES.TASKS}/${id}`,
    data,
  );

  return response.data;
}
