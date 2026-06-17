import { UserRole } from '@/lib/constants/roles';

export const hasRole = (
  userRole: UserRole | undefined,
  allowedRoles: UserRole[],
): boolean => {
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
};
