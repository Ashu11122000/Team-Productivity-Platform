import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { updateProfile } from '../api/update-profile';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.profile,
      });

      toast.success('Profile updated');
    },

    onError: (error: AxiosError<{ detail: string }>) => {
      toast.error(
        error?.response?.data?.detail ??
          'Failed to update profile'
      );
    },
  });
}