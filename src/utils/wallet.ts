// Re-export wallet types from canonical @/types/wallet location.
// This keeps existing import paths stable.
import type { WalletTransaction, WalletStats } from "@/types/wallet";
export type { WalletTransaction, WalletStats };

// Wallet address validation utilities

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

/**
 * Validates an Ethereum address (0x + 40 hex chars).
 * Returns true if valid, false otherwise.
 */
export function isValidAddress(address: string): boolean {
  if (typeof address !== "string") return false;
  return ADDRESS_REGEX.test(address);
}

/**
 * Normalize address to lowercase (for consistent lookups).
 */
export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

/**
 * Truncate an address for display: 0x1234...abcd
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Truncate a tx hash for display.
 */
export function truncateHash(hash: string, chars = 4): string {
  if (hash.length < 10) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Format a big number string with commas.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format ETH value (up to 6 decimal places, trim trailing zeros).
 */
export function formatETH(value: string | number, decimals = 6): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format USD value.
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
