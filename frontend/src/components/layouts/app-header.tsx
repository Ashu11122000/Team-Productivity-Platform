'use client';

import Link from 'next/link';

import { Menu } from 'lucide-react';

import { navigation } from '@/constants/navigation';

import { UserNav } from './user-nav';

import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-64 p-0"
          >
            <div className="border-b p-4">
              <h2 className="font-bold">
                Team Productivity
              </h2>
            </div>

            <nav className="flex flex-col gap-2 p-4">
              {navigation.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                    >
                      <Icon className="h-4 w-4" />

                      {item.title}
                    </Link>
                  );
                },
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold">
          Team Productivity Platform
        </h1>
      </div>

      <UserNav />
    </header>
  );
}