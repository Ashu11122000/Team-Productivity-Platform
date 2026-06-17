import {
  ProfileCard,
  ProfileForm,
  ChangePasswordForm,
  PreferencesForm,
} from '@/features/settings';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account, preferences, and security settings.
        </p>
      </div>

      <ProfileCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm />

        <PreferencesForm />
      </div>

      <ChangePasswordForm />
    </div>
  );
}