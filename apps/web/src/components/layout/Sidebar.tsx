'use client';

import Link from 'next/link';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
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

function NavLink({ item, isActive }: { item: NavigationItem; isActive: boolean }) {
  const Icon = item.icon;

  const linkClassName = mergeClassNames(
    'flex items-center gap-3',
    'px-3 py-2.5',
    'text-sm font-medium',
    'rounded-lg transition-all duration-150 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500',
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  );

  return (
    <Link href={item.href} className={linkClassName} aria-label={item.label}>
      <Icon className="h-5 w-5 shrink-0" />
      {item.label}
    </Link>
  );
}

function NavSection({ title, items, pathname }: { title: string; items: NavigationItem[]; pathname: string }) {
  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </p>
      <nav aria-label={title} className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(item.href + '?')}
          />
        ))}
      </nav>
    </div>
  );
}

export function Sidebar({ pathname, isAdmin }: Props) {
  const adminSection = isAdmin ? (
    <NavSection title="Upravljanje" items={ADMIN_NAVIGATION_ITEMS} pathname={pathname} />
  ) : null;

  return (
    <aside
      className={mergeClassNames(
        'hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0',
        'border-r border-gray-200 bg-white',
        'px-4 pb-6 pt-20',
        'overflow-y-auto',
      )}
    >
      <div className="flex flex-1 flex-col gap-6">
        <nav aria-label="Glavna navigacija" className="flex flex-col gap-1">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        <NavSection title="Objekti" items={FACILITY_NAVIGATION_ITEMS} pathname={pathname} />
        <NavSection title="Informacije" items={INFO_NAVIGATION_ITEMS} pathname={pathname} />

        {adminSection}
      </div>
    </aside>
  );
}
