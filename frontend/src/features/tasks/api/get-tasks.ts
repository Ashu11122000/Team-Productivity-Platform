import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/lib/constants/api-routes';

import type { TasksResponse } from '../types/task.types';
import type { TaskQueryParams } from '../types/task-query.types';

export async function getTasks(
  params?: TaskQueryParams,
): Promise<TasksResponse> {
  const { data } =
    await nestjsClient.get<TasksResponse>(
      API_ROUTES.TASKS.BASE,
      {
        params,
      },
    );

  return data;
}