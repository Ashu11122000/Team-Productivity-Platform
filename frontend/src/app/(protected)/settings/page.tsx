import {
  ProfileCard,
  ProfileForm,
  ChangePasswordForm,
  PreferencesForm,
} from '@/features/settings';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <ProfileCard />
      <ProfileForm />
      <ChangePasswordForm />
      <PreferencesForm />
    </div>
  );
}