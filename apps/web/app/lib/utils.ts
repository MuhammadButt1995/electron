import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function camelToNormalText(text) {
  const result = text
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();

  return result.replace(/\b(\w)/g, (s) => s.toUpperCase());
}
