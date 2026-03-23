import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

const VARIANT_STYLES = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
} as const;

const SIZE_STYLES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

const ICON_SIZE_STYLES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

type Variant = keyof typeof VARIANT_STYLES;
type Size = keyof typeof SIZE_STYLES;

export interface IconButtonProps {
  icon: React.ReactNode;
  size?: Size;
  variant?: Variant;
  onClick?: () => void;
  'aria-label': string;
  isDisabled?: boolean;
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  onClick,
  'aria-label': ariaLabel,
  isDisabled = false,
}: IconButtonProps) {
  const buttonClassName = mergeClassNames(
    'inline-flex items-center justify-center',
    'rounded-lg',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-150 ease-out',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
  );

  const iconWrapperClassName = mergeClassNames(ICON_SIZE_STYLES[size]);

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className={iconWrapperClassName}>{icon}</span>
    </button>
  );
}
