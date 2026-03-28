import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx — used everywhere a className is built.
 * @example cn("px-4", isActive && "bg-primary")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
