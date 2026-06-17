'use client';

import Link from 'next/link';

import {
  Grid3X3,
  Heart,
  Star,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface AppFooterProps {
  className?: string;
}

export function AppFooter({
  className,
}: AppFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'relative overflow-hidden border-t border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 backdrop-blur-xl',
        className,
      )}
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative w-full px-8 py-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_auto_auto] xl:items-center">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
                <Grid3X3 className="h-5 w-5 text-cyan-400" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Team Productivity Platform
                </h3>

                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                  Productivity Workspace
                </p>
              </div>
            </div>

            <p className="max-w-lg text-sm text-slate-400">
              A modern productivity platform for managing notes, tasks,
              categories, analytics, notifications, activity logs,
              and team workflows.
            </p>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-cyan-400" />

                <span className="text-sm text-slate-300">
                  Version 1.0.0
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span className="text-sm text-slate-300">
                Next.js 16 + React 19
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span className="text-sm text-slate-300">
                FastAPI + NestJS
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span className="text-sm text-slate-300">
                PostgreSQL
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/settings"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {currentYear} Team Productivity Platform. All rights
            reserved.
          </div>

          <div className="flex items-center gap-2">
            <span>Built with</span>

            <Heart className="h-4 w-4 text-rose-500" />

            <span>
              using Next.js, FastAPI, NestJS & PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}