'use client';

import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

/** Banner recommending users to install the app as a PWA */
export function PWAInstallBanner() {
  const { isVisible, handleInstall, handleDismiss } = usePWAInstall();

  if (!isVisible) {
    return null;
  }

  return (
    <div className={mergeClassNames(
      'fixed bottom-4 left-4 right-4 z-50',
      'mx-auto max-w-lg',
      'flex items-center gap-3',
      'rounded-xl border border-indigo-200 bg-white p-4 shadow-lg',
      'lg:left-64',
    )}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
        <Download className="h-5 w-5 text-indigo-600" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-gray-900">Instaliraj ReserveHub</p>
        <p className="text-xs text-gray-500">Dodajte aplikaciju na početni zaslon za brži pristup.</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleInstall}
          aria-label="Instaliraj aplikaciju"
          className={mergeClassNames(
            'rounded-lg px-3 py-1.5',
            'text-sm font-medium text-white',
            'bg-indigo-600 hover:bg-indigo-700',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          )}
        >
          Instaliraj
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Zatvori"
          className={mergeClassNames(
            'rounded-lg p-1.5',
            'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500',
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
