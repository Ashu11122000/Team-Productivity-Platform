import { getTaskStatusAnalytics } from './get-task-status';
import { getTaskPriorityAnalytics } from './get-task-priority';
import { getProductivityAnalytics } from './get-productivity';

export const getOverviewAnalytics = async () => {
  const [
    status,
    priority,
    productivity,
  ] = await Promise.all([
    getTaskStatusAnalytics(),
    getTaskPriorityAnalytics(),
    getProductivityAnalytics(),
  ]);

  return {
    status,
    priority,
    productivity,
  };
};