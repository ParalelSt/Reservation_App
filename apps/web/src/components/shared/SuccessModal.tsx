'use client';

import { CheckCircle, X } from 'lucide-react';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  secondaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

const BACKDROP_OPACITY = 'bg-black/50';

/** Full-screen modal overlay for success confirmations */
export function SuccessModal({ isOpen, onClose, title, message, secondaryAction }: Props) {
  if (!isOpen) {
    return null;
  }

  const secondaryButton = secondaryAction ? (
    <button
      type="button"
      onClick={secondaryAction.onClick}
      aria-label={secondaryAction.label}
      className={mergeClassNames(
        'flex w-full items-center justify-center gap-2',
        'rounded-lg px-4 py-2.5',
        'text-sm font-medium text-indigo-600',
        'border border-indigo-200 bg-white',
        'transition-all duration-150 ease-out',
        'hover:bg-indigo-50',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      )}
    >
      {secondaryAction.icon}
      {secondaryAction.label}
    </button>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className={mergeClassNames(
          'fixed inset-0',
          BACKDROP_OPACITY,
          'transition-all duration-150 ease-out',
        )}
        onClick={onClose}
        aria-label="Zatvori"
      />

      <div
        className={mergeClassNames(
          'relative z-10 w-full max-w-sm',
          'rounded-xl bg-white p-6 shadow-xl',
          'flex flex-col items-center gap-4 text-center',
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Zatvori"
          className={mergeClassNames(
            'absolute right-3 top-3',
            'rounded-lg p-1 text-gray-400',
            'transition-all duration-150 ease-out',
            'hover:bg-gray-100 hover:text-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500',
          )}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{message}</p>

        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="U redu"
            className={mergeClassNames(
              'w-full rounded-lg px-4 py-2.5',
              'text-sm font-medium text-white',
              'bg-indigo-600 hover:bg-indigo-700',
              'transition-all duration-150 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            )}
          >
            U redu
          </button>
          {secondaryButton}
        </div>
      </div>
    </div>
  );
}
