import { nestjsClient } from '@/services/nestjs/client';

import type {
  TasksResponse,
} from '../types/task.types';

import type {
  TaskQueryParams,
} from '../types/task-query.types';

export async function getTasks(
  params?: TaskQueryParams,
): Promise<TasksResponse> {
  const response =
    await nestjsClient.get<TasksResponse>(
      '/tasks',
      {
        params,
      },
    );

  return response.data;
}