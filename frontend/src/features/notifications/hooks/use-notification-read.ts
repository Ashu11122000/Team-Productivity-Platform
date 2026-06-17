import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import { markNotificationRead } from '../api/mark-notification-read';

export function useNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications,
      });

      toast.success(
        data.message ||
          'Notification marked as read',
      );
    },

    onError: () => {
      toast.error(
        'Failed to mark notification as read',
      );
    },
  });
}