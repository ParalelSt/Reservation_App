'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { Avatar } from '@/components/shared/Avatar';

interface Props {
  user: { name?: string; picture?: string; email?: string };
}

export function ProfileDropdown({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isOutside = dropdownRef.current && !dropdownRef.current.contains(target);

      if (isOutside) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const avatarContent = <Avatar src={user.picture} alt={user.name ?? 'Korisnik'} size="sm" />;

  const menuItemClassName = mergeClassNames(
    'flex w-full items-center gap-3',
    'px-4 py-2.5',
    'text-sm text-gray-700',
    'transition-all duration-150 ease-out',
    'hover:bg-gray-50',
    'focus:outline-none focus:bg-gray-50',
  );

  const dropdown = isOpen ? (
    <div
      className={mergeClassNames(
        'absolute right-0 top-full mt-2',
        'w-56 overflow-hidden',
        'rounded-xl border border-gray-200',
        'bg-white shadow-lg',
        'z-50',
      )}
    >
      <div className="border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
        <p className="truncate text-xs text-gray-500">{user.email}</p>
      </div>

      <div className="py-1">
        <Link
          href="/profile"
          className={menuItemClassName}
          aria-label="Profil"
          onClick={closeDropdown}
        >
          <User className="h-4 w-4 text-gray-400" />
          Profil
        </Link>
      </div>

      <div className="border-t border-gray-100">
        <a
          href="/auth/logout"
          className={mergeClassNames(
            'flex w-full items-center gap-3',
            'px-4 py-2.5',
            'text-sm text-red-600',
            'transition-all duration-150 ease-out',
            'hover:bg-red-50',
            'focus:outline-none focus:bg-red-50',
          )}
          aria-label="Odjava"
        >
          <LogOut className="h-4 w-4 text-red-400" />
          Odjava
        </a>
      </div>
    </div>
  ) : null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label="Korisnički izbornik"
        className={mergeClassNames(
          'flex items-center gap-2',
          'rounded-lg px-2 py-1.5',
          'transition-all duration-150 ease-out',
          'hover:bg-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        )}
      >
        {avatarContent}
        <span className="hidden text-sm font-medium text-gray-700 sm:inline">
          {user.name}
        </span>
      </button>

      {dropdown}
    </div>
  );
}
