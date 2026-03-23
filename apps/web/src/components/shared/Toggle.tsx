import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

export interface ToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  'aria-label': string;
  isDisabled?: boolean;
}

export function Toggle({
  isEnabled,
  onToggle,
  'aria-label': ariaLabel,
  isDisabled = false,
}: ToggleProps) {
  const trackClassName = mergeClassNames(
    'relative inline-flex shrink-0 cursor-pointer',
    'h-6 w-11 rounded-full',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-150 ease-out',
    isEnabled ? 'bg-indigo-600' : 'bg-gray-200',
  );

  const thumbClassName = mergeClassNames(
    'pointer-events-none inline-block',
    'h-5 w-5 rounded-full bg-white shadow',
    'transform transition-all duration-150 ease-out',
    isEnabled ? 'translate-x-5' : 'translate-x-0.5',
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      aria-label={ariaLabel}
      className={trackClassName}
      disabled={isDisabled}
      onClick={onToggle}
    >
      <span className={thumbClassName} />
    </button>
  );
}
