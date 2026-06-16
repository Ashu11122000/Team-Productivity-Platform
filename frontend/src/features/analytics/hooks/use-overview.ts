import { useTaskStatus } from './use-task-status';
import { useTaskPriority } from './use-task-priority';
import { useProductivity } from './use-productivity';

export const useOverview = () => {
  const status = useTaskStatus();
  const priority = useTaskPriority();
  const productivity = useProductivity();

  return {
    status: status.data,
    priority: priority.data,
    productivity: productivity.data,

    isLoading:
      status.isLoading ||
      priority.isLoading ||
      productivity.isLoading,

    isError:
      status.isError ||
      priority.isError ||
      productivity.isError,
  };
};