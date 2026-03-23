import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind CSS class names with conflict resolution */
export function mergeClassNames(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
