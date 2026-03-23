'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { IconButton } from '@/components/shared/IconButton';
import {
  NAVIGATION_ITEMS,
  INFO_NAVIGATION_ITEMS,
  FACILITY_NAVIGATION_ITEMS,
  ADMIN_NAVIGATION_ITEMS,
} from '@/lib/constants/navigation';
import type { NavigationItem } from '@/lib/constants/navigation';

interface Props {
  pathname: string;
  isAdmin: boolean;
}

const BACKDROP_OPACITY = 'bg-black/50';

function MobileNavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  const linkClassName = mergeClassNames(
    'flex items-center gap-3',
    'px-4 py-3',
    'text-base font-medium',
    'rounded-lg transition-all duration-150 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500',
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  );

  return (
    <Link href={item.href} className={linkClassName} onClick={onClick} aria-label={item.label}>
      <Icon className="h-5 w-5 shrink-0" />
      {item.label}
    </Link>
  );
}

function MobileNavSection({
  title,
  items,
  pathname,
  onClose,
}: {
  title: string;
  items: NavigationItem[];
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="mt-6">
      <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </p>
      <nav aria-label={title} className="flex flex-col gap-1">
        {items.map((item) => (
          <MobileNavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            onClick={onClose}
          />
        ))}
      </nav>
    </div>
  );
}

export function MobileNav({ pathname, isAdmin }: Props) {
  const isMobileNavOpen = useUIStore((state) => state.isMobileNavOpen);
  const closeMobileNav = useUIStore((state) => state.closeMobileNav);

  const adminSection = isAdmin ? (
    <MobileNavSection title="Upravljanje" items={ADMIN_NAVIGATION_ITEMS} pathname={pathname} onClose={closeMobileNav} />
  ) : null;

  if (!isMobileNavOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className={mergeClassNames(
          'fixed inset-0',
          BACKDROP_OPACITY,
          'transition-all duration-150 ease-out',
        )}
        onClick={closeMobileNav}
        aria-label="Zatvori navigaciju"
      />

      <div
        className={mergeClassNames(
          'fixed inset-y-0 left-0 w-72',
          'bg-white shadow-xl',
          'flex flex-col',
          'overflow-y-auto p-4',
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Izbornik</span>
          <IconButton
            aria-label="Zatvori navigaciju"
            onClick={closeMobileNav}
            size="md"
            icon={<X className="h-5 w-5" />}
          />
        </div>

        <nav aria-label="Mobilna navigacija" className="flex flex-col gap-1">
          {NAVIGATION_ITEMS.map((item) => (
            <MobileNavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onClick={closeMobileNav}
            />
          ))}
        </nav>

        <MobileNavSection title="Objekti" items={FACILITY_NAVIGATION_ITEMS} pathname={pathname} onClose={closeMobileNav} />
        <MobileNavSection title="Informacije" items={INFO_NAVIGATION_ITEMS} pathname={pathname} onClose={closeMobileNav} />

        {adminSection}
      </div>
    </div>
  );
}
