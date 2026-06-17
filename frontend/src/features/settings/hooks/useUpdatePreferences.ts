import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { updatePreferences } from '../api/update-preferences';

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePreferences,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.preferences,
      });

      toast.success('Preferences updated');
    },

    onError: (error: unknown) => {
      const errorResponse = error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

      toast.error(
        errorResponse.response?.data?.detail ?? 'Failed to update preferences',
      );
    },
  });
}
