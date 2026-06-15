'use client';

import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/store/auth-store';
import { useLogout } from '@/features/auth/hooks/use-logout';

export function UserNav() {
  const user = useAuthStore(
    (state) => state.user,
  );

  const logoutMutation = useLogout();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">
        {user?.email}
      </span>

      <Button
        variant="outline"
        onClick={() =>
          logoutMutation.mutate()
        }
      >
        Logout
      </Button>
    </div>
  );
}