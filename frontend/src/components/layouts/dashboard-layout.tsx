import type { ReactNode } from 'react';

import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-slate-700 via-slate-600 to-slate-700">
      {/* Main Dashboard Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[160px]" />

          <div className="absolute right-[-150px] top-[15%] h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[160px]" />

          <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[160px]" />
        </div>

        {/* Sidebar */}
        <AppSidebar />

        {/* Right Content */}
        <div className="relative flex flex-1 flex-col">
          <AppHeader />

          <main className="flex-1 overflow-x-hidden">
            <div className="p-8">
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-slate-200/90 via-slate-100/85 to-slate-200/90 shadow-[0_25px_80px_rgba(15,23,42,0.25)] backdrop-blur-3xl">
                {/* Accent Line */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />

                {/* Surface Glow */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

                  <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative p-8">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Full Width Footer */}
      <AppFooter />
    </div>
  );
}