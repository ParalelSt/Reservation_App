'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { PWAInstallBanner } from '@/components/layout/PWAInstallBanner';

interface Props {
  children: React.ReactNode;
  user: { name?: string; picture?: string; email?: string } | null;
  isAdmin: boolean;
}

export function AppShell({ children, user, isAdmin }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar pathname={pathname} isAdmin={isAdmin} />
      <MobileNav pathname={pathname} isAdmin={isAdmin} />
      <Header user={user} />

      <main className="lg:pl-60">
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      <PWAInstallBanner />
    </div>
  );
}
