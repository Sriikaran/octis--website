import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence.
 * Used by all Shadcn UI components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
