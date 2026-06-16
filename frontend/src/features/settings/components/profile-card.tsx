'use client';

import { useProfile } from '../hooks/useProfile';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ProfileCard() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
          {profile?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>

        <div>
          <h3 className="font-semibold">
            {profile?.name}
          </h3>

          <p className="text-muted-foreground text-sm">
            {profile?.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}