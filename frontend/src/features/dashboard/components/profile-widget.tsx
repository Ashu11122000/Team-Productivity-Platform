'use client';

import Link from 'next/link';

import {
  User,
  Shield,
  CheckCircle2,
  Settings,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  CurrentUser,
} from '../types/dashboard.types';

interface Props {
  user: CurrentUser;
}

export function ProfileWidget({
  user,
}: Props) {
  const initials =
    user.email
      ?.charAt(0)
      .toUpperCase() ?? 'U';

  return (
    <Card
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>
              Profile
            </CardTitle>

            <CardDescription>
              Account overview
            </CardDescription>
          </div>

          <Button
            asChild
            size="sm"
            variant="outline"
          >
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-indigo-100
              text-lg
              font-semibold
              text-indigo-700
            "
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">
              {user.email}
            </p>

            <p className="text-sm text-slate-500">
              Team Productivity Platform
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-slate-100
              p-3
            "
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600" />

              <span className="text-sm text-slate-600">
                Role
              </span>
            </div>

            <Badge
              className="
                bg-indigo-100
                text-indigo-700
              "
            >
              {user.role}
            </Badge>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-slate-100
              p-3
            "
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />

              <span className="text-sm text-slate-600">
                Status
              </span>
            </div>

            <Badge
              className={
                user.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }
            >
              {user.is_active
                ? 'Active'
                : 'Inactive'}
            </Badge>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-slate-100
              p-3
            "
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500" />

              <span className="text-sm text-slate-600">
                Account
              </span>
            </div>

            <span className="text-sm font-medium text-slate-900">
              Verified
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            asChild
          >
            <Link href="/settings">
              Edit Profile
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            asChild
          >
            <Link href="/settings">
              Preferences
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}