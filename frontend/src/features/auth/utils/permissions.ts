export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export function isAdmin(
  role?: string | null,
) {
  return role === ROLES.ADMIN;
}

export function isUser(
  role?: string | null,
) {
  return role === ROLES.USER;
}

export function hasPermission(
  role: string | null | undefined,
  allowedRoles: string[],
) {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(
    role,
  );
}