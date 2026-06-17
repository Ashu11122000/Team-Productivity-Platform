'use client';

import * as React from 'react';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';

import { useAuthStore } from '@/store/auth-store';

function getInitials(name?: string | null): string {
  if (!name) {
    return 'U';
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function UserNav() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user) as {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };

  const userImage = user.image ?? undefined;

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto justify-start px-2 py-1.5"
        >
          <div className="flex items-center gap-3">
            <Avatar size="default">
              <AvatarImage
                src={userImage}
                alt={user?.name ?? 'User'}
              />

              <AvatarFallback>
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="hidden min-w-0 text-left md:block">
              <p className="truncate text-sm font-medium">
                {user?.name ?? 'User'}
              </p>

              <p className="text-muted-foreground truncate text-xs">
                {user?.email ?? ''}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">
              {user?.name}
            </span>

            <span className="text-muted-foreground text-xs">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push('/profile')}
          >
            <UserIcon className="size-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push('/settings')}
          >
            <Settings className="size-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <ConfirmDialog
          title="Sign out?"
          description="You will need to log in again to access your workspace."
          confirmText="Sign Out"
          trigger={
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Sign Out
            </DropdownMenuItem>
          }
          onConfirm={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}