
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';

  notificationsEnabled: boolean;

  defaultTaskView: 'table' | 'kanban';

  language: string;
}

export interface UpdatePreferencesDto {
  theme: 'light' | 'dark' | 'system';

  notificationsEnabled: boolean;

  defaultTaskView: 'table' | 'kanban';

  language: string;
}