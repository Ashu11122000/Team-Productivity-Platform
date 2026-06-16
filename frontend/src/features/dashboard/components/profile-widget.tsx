import { Card } from '@/components/ui/card';

import {
  CurrentUser,
} from '../types/dashboard.types';

interface Props {
  user: CurrentUser;
}

export function ProfileWidget({
  user,
}: Props) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold">
        Profile
      </h3>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          Email: {user.email}
        </p>

        <p>
          Role: {user.role}
        </p>

        <p>
          Status:{' '}
          {user.is_active
            ? 'Active'
            : 'Inactive'}
        </p>
      </div>
    </Card>
  );
}