'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigation } from '@/lib/constants/navigation';
import { hasRole } from '@/lib/rbac';

import { useAuthStore } from '@/store/auth-store';

import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  const user = useAuthStore(
    (state) => state.user,
  );

  const hydrated = useAuthStore(
    (state) => state.hydrated,
  );

  if (!hydrated) {
    return null;
  }

  const visibleItems = navigation.filter(
    (item) =>
      !item.roles?.length ||
      hasRole(user?.role, item.roles),
  );

  return (
    <aside
  className={cn(
    'hidden md:flex md:w-72 md:flex-col',
    'border-r border-slate-800/60',
    'bg-linear-to-b',
    'from-slate-950',
    'via-slate-900',
    'to-indigo-950',
    'backdrop-blur-2xl',
    'shadow-[20px_0_80px_rgba(79,70,229,0.18)]',
  )}
  aria-label="Sidebar Navigation"
>
  {/* Logo */}
  <div className="border-b border-slate-800/60 px-8 py-8">
    <div className="flex flex-col">
      <h2 className="bg-linear-to-r from-cyan-300 via-indigo-300 to-violet-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
        Team Productivity
      </h2>

      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
        Productivity Workspace
      </p>
    </div>
  </div>

  {/* Sidebar Body */}
  <div className="flex flex-1 flex-col justify-between">
    {/* Navigation */}
    <nav
      className="space-y-3 px-5 py-6"
      aria-label="Main Navigation"
    >
      {visibleItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              isActive ? 'page' : undefined
            }
            className={cn(
              'group relative flex items-center gap-3',
              'rounded-2xl px-4 py-3',
              'text-sm font-semibold',
              'transition-all duration-300',

              isActive
                ? [
                    'bg-linear-to-r',
                    'from-indigo-500',
                    'via-violet-500',
                    'to-cyan-500',
                    'text-white',
                    'shadow-[0_12px_30px_rgba(99,102,241,0.35)]',
                  ]
                : [
                    'text-slate-100',
                    'hover:translate-x-1',
                    'hover:bg-white/10',
                    'hover:text-white',
                    'hover:shadow-[0_8px_20px_rgba(99,102,241,0.15)]',
                  ],
            )}
          >
            <Icon
              className={cn(
                'size-5 shrink-0',
                'text-slate-200',
                'transition-all duration-300',
                !isActive &&
                  'group-hover:scale-110 group-hover:text-cyan-300',
              )}
            />

            <span className="truncate">
              {item.title}
            </span>

            {isActive && (
              <>
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl',
                    'bg-linear-to-r',
                    'from-indigo-500/10',
                    'via-violet-500/10',
                    'to-cyan-500/10',
                  )}
                />

                <div
                  className={cn(
                    'absolute right-4',
                    'h-2.5 w-2.5 rounded-full',
                    'bg-white',
                    'shadow-[0_0_15px_rgba(255,255,255,0.95)]',
                  )}
                />
              </>
            )}
          </Link>
        );
      })}
    </nav>

    {/* Workspace Card */}
    <div className="p-6">
      <div
        className={cn(
          'rounded-3xl',
          'border border-indigo-500/20',
          'bg-linear-to-r',
          'from-indigo-500/10',
          'via-violet-500/10',
          'to-cyan-500/10',
          'p-5',
          'backdrop-blur-xl',
          'shadow-[0_10px_30px_rgba(99,102,241,0.12)]',
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Workspace
        </p>

        <p className="mt-2 text-sm font-bold text-slate-100">
          Team Productivity Platform
        </p>

        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Organize notes, tasks, analytics,
          categories, notifications, and team
          activity from one unified workspace.
        </p>
      </div>
    </div>
  </div>
</aside>
  );
}