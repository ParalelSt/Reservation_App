import Image from 'next/image';
import { User } from 'lucide-react';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

const SIZE_STYLES = {
  sm: { container: 'h-8 w-8', icon: 'h-4 w-4', pixels: 32 },
  md: { container: 'h-10 w-10', icon: 'h-5 w-5', pixels: 40 },
  lg: { container: 'h-20 w-20', icon: 'h-8 w-8', pixels: 80 },
} as const;

type Size = keyof typeof SIZE_STYLES;

interface Props {
  src?: string;
  alt: string;
  size?: Size;
}

/** Avatar with fallback icon when no image is available */
export function Avatar({ src, alt, size = 'md' }: Props) {
  const styles = SIZE_STYLES[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={styles.pixels}
        height={styles.pixels}
        className="rounded-full"
      />
    );
  }

  return (
    <div className={mergeClassNames(
      'flex items-center justify-center',
      'rounded-full bg-indigo-100',
      styles.container,
    )}>
      <User className={mergeClassNames('text-indigo-600', styles.icon)} />
    </div>
  );
}
