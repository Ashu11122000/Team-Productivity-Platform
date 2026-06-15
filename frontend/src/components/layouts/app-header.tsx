'use client';

import { UserNav } from './user-nav';

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">
        Team Productivity Platform
      </h1>

      <UserNav />
    </header>
  );
}