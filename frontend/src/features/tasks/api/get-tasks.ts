import { nestjsClient } from '@/services/nestjs/client';

import type { Task } from '../types/task.types';
import type { TaskQueryParams } from '../types/task-query.types';

export interface TasksResponse {
  data: Task[];
}

export async function getTasks(
  params?: TaskQueryParams,
): Promise<TasksResponse> {
  const response =
    await nestjsClient.get(
      '/tasks',
      {
        params,
      },
    );

  return response.data;
}