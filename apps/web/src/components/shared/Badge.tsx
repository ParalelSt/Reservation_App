import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

const VARIANT_STYLES = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
} as const;

type Variant = keyof typeof VARIANT_STYLES;

export interface BadgeProps {
  label: string;
  variant?: Variant;
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const badgeClassName = mergeClassNames(
    'inline-flex items-center',
    'rounded-full px-2.5 py-0.5',
    'text-xs font-medium',
    VARIANT_STYLES[variant],
  );

  return <span className={badgeClassName}>{label}</span>;
}
