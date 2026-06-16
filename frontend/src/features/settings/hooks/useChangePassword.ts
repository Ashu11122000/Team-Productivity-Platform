import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePassword } from '../api/change-password';

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      toast.success('Password updated');
    },

    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { detail?: string } };
      };

      toast.error(
        apiError.response?.data?.detail ??
          'Failed to update password'
      );
    },
  });
}