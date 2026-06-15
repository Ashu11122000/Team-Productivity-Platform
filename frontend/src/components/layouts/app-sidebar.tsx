'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigation } from '@/lib/constants/navigation';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-background hidden border-r md:flex md:w-64 md:flex-col">
      <div className="border-b p-4">
        <h2 className="font-bold">Team Productivity</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
