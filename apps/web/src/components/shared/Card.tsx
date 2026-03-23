import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

const PADDING_STYLES = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

type Padding = keyof typeof PADDING_STYLES;

export interface CardProps {
  children: React.ReactNode;
  padding?: Padding;
}

export function Card({ children, padding = 'md' }: CardProps) {
  const cardClassName = mergeClassNames(
    'rounded-xl border border-gray-200',
    'bg-white shadow-sm',
    PADDING_STYLES[padding],
  );

  return <div className={cardClassName}>{children}</div>;
}
