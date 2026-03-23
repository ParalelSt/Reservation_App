'use client';

import { Menu } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { IconButton } from '@/components/shared/IconButton';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';

interface Props {
  user: { name?: string; picture?: string; email?: string } | null;
}

const APP_NAME = 'ReserveHub';

export function Header({ user }: Props) {
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav);

  const userSection = user ? (
    <ProfileDropdown user={user} />
  ) : (
    <a
      href="/auth/login"
      aria-label="Prijava"
      className={mergeClassNames(
        'inline-flex items-center',
        'rounded-lg px-4 py-2',
        'text-sm font-medium text-white',
        'bg-indigo-600 hover:bg-indigo-700',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      )}
    >
      Prijava
    </a>
  );

  return (
    <header
      className={mergeClassNames(
        'sticky top-0 z-40',
        'flex h-16 items-center justify-between',
        'border-b border-gray-200 bg-white px-4',
        'lg:pl-64',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <IconButton
            aria-label="Otvori navigaciju"
            onClick={toggleMobileNav}
            size="md"
            icon={<Menu className="h-5 w-5" />}
          />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{APP_NAME}</h1>
      </div>

      {userSection}
    </header>
  );
}
