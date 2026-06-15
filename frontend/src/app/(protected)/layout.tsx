import type { ReactNode } from 'react';

import { AuthGuard } from '@/features/auth/components/auth-guard';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}