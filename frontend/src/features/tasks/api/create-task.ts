// features/tasks/api/create-task.ts

import { nestjsClient } from '@/services/nestjs/client';

import { API_ROUTES } from '@/constants/api-routes';

import {
  CreateTaskRequest,
} from '../types/create-task.types';

import {
  Task,
} from '../types/task.types';

export async function createTask(
  data: CreateTaskRequest,
): Promise<Task> {
  const response =
    await nestjsClient.post<Task>(
      API_ROUTES.TASKS,
      data,
    );

  return response.data;
}