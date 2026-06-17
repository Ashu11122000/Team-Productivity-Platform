import type { UserRole } from '@/lib/constants/roles';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}