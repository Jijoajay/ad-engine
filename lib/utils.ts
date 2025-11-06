import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and optimizes them with tailwind-merge
 * This utility helps with conditional class name joining
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
