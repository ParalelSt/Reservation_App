import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

const VARIANT_STYLES = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
} as const;

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

type Variant = keyof typeof VARIANT_STYLES;
type Size = keyof typeof SIZE_STYLES;

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isDisabled = false,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const buttonClassName = mergeClassNames(
    'inline-flex items-center justify-center',
    'rounded-lg font-medium',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-150 ease-out',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
  );

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
