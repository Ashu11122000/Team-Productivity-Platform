'use client';

import * as React from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { LogOut, Menu } from 'lucide-react';

import { navigation } from '@/lib/constants/navigation';
import { hasRole } from '@/lib/rbac';

import { useAuthStore } from '@/store/auth-store';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function AppHeader() {
  const pathname = usePathname();

  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  const [open, setOpen] = React.useState(false);

  const visibleNavigation = React.useMemo(() => {
    return navigation.filter((item) => {
      if (!item.roles?.length) {
        return true;
      }

      return hasRole(user?.role, item.roles);
    });
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'flex h-24 items-center justify-between',
        'border-b border-slate-800/60',
        'bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-indigo-950/95',
        'px-8',
        'backdrop-blur-2xl',
        'supports-[backdrop-filter]:bg-slate-950/80',
        'shadow-[0_10px_40px_rgba(15,23,42,0.35)]',
      )}
    >
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Open navigation menu"
              className={cn(
                'md:hidden',
                'border-slate-700/60',
                'bg-slate-900/60',
                'text-slate-200',
                'backdrop-blur-xl',
                'transition-all duration-300',
                'hover:border-indigo-500/40',
                'hover:bg-indigo-500/10',
                'hover:text-indigo-100',
                'focus-visible:ring-2',
                'focus-visible:ring-indigo-500',
              )}
            >
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className={cn(
              'w-80 p-0',
              'border-slate-800',
              'bg-gradient-to-b',
              'from-slate-950',
              'via-slate-900',
              'to-indigo-950',
            )}
          >
            <SheetHeader className="border-b border-slate-800 px-6 py-5">
              <SheetTitle className="bg-gradient-to-r from-indigo-200 via-violet-200 to-cyan-200 bg-clip-text text-left text-2xl font-bold text-transparent">
                Team Productivity Platform
              </SheetTitle>
            </SheetHeader>

            <nav
              className="flex flex-col gap-2 p-4"
              aria-label="Mobile Navigation"
            >
              {visibleNavigation.map((item) => {
                const Icon = item.icon;

                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300',
                      active
                        ? [
                            'bg-gradient-to-r',
                            'from-indigo-500',
                            'to-violet-500',
                            'text-white',
                            'shadow-[0_12px_30px_rgba(99,102,241,0.35)]',
                          ]
                        : [
                            'text-slate-300',
                            'hover:translate-x-1',
                            'hover:bg-white/5',
                            'hover:text-white',
                          ],
                    )}
                  >
                    <Icon className="size-4 shrink-0" />

                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-col">
          <h1 className="bg-gradient-to-r from-indigo-200 via-violet-200 to-cyan-200 bg-clip-text text-lg font-bold tracking-tight text-transparent md:text-xl">
            Team Productivity Platform
          </h1>

          <span className="hidden text-xs font-medium uppercase tracking-[0.25em] text-slate-400 md:block">
            Productivity Workspace
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.email && (
          <div
            className={cn(
              'hidden md:flex',
              'items-center',
              'rounded-full',
              'border border-indigo-500/20',
              'bg-indigo-500/10',
              'px-3 py-1.5',
              'backdrop-blur-xl',
            )}
          >
            <span className="max-w-[220px] truncate text-sm font-medium text-indigo-100">
              {user.email}
            </span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          aria-label="Logout"
          className={cn(
            'gap-2',
            'border-rose-500/20',
            'bg-rose-500/10',
            'text-rose-200',
            'backdrop-blur-xl',
            'transition-all duration-300',
            'hover:border-rose-500/40',
            'hover:bg-rose-500/20',
            'hover:text-rose-100',
            'hover:shadow-[0_10px_25px_rgba(244,63,94,0.25)]',
            'focus-visible:ring-2',
            'focus-visible:ring-rose-500',
          )}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}