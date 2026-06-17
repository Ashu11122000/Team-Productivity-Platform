import * as React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Panel */}
        <div className="bg-muted/30 relative hidden overflow-hidden border-r lg:flex">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-cyan-500/5 to-emerald-500/10" />

          <div className="relative flex w-full flex-col justify-between p-12">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Team Productivity Platform
              </h1>

              <p className="text-muted-foreground mt-2 text-sm">
                Organize tasks, notes, analytics, and team workflows in one
                place.
              </p>
            </div>

            <div className="max-w-md">
              <h2 className="text-4xl font-bold tracking-tight">
                Work smarter,
                <br />
                stay organized.
              </h2>

              <p className="text-muted-foreground mt-4 text-lg">
                Manage tasks, collaborate efficiently, track productivity, and
                gain insights with a modern workspace built for teams.
              </p>
            </div>

            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Team Productivity Platform
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
