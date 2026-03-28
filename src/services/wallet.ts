/**
 * Wallet Service — fetches transaction data from Basescan free API
 * and computes wallet stats.
 *
 * No API key required for Basescan free tier.
 * Rate limit: be respectful (max ~5 req/sec).
 */

import type { WalletTransaction, WalletStats } from "@/types/wallet";
import { normalizeAddress } from "@/utils/wallet";

// ─── Constants ───────────────────────────────────────────────────────────────

const BASESCAN_BASE = "https://api.basescan.io/api";
// Basescan free endpoint: module=account, action=txlist, address=$addr, sort=desc
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY ?? "";

const ETHER_VALUE_DIVISOR = 1_000_000_000_000_000_000n; // 10^18 WEI per ETH
const ETH_PRICE_FALLBACK = 3500; // USD/ETH if price fetch fails
const MAX_TRANSACTIONS = 1000;   // cap to prevent runaway loops

// ─── Types ───────────────────────────────────────────────────────────────────

interface BasescanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;   // in WEI
  gasUsed: string;
  gasPrice: string; // in WEI
  isError: string;  // "0" = success, "1" = error
  input: string;
  methodLabel?: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenDecimal?: string;
  tokenValue?: string;
  contractAddress?: string;
}

interface BasescanEthPriceResponse {
  status: string;
  message: string;
  result: string; // e.g. "3542.00"
}

interface BasescanTxListResponse {
  status: string;
  message: string;
  result: string | BasescanTx[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Fetch with timeout + basic error handling */
async function safeFetch<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const mergedSignal = signal ?? controller.signal;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "base-everything-wallet-tracker/1.0",
      },
      signal: mergedSignal,
      next: { revalidate: 60 }, // cache for 60s (ISR-style)
    });

    clearTimeout(timeout);

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Infer transaction type from Basescan tx data.
 * - If tokenSymbol / tokenDecimal present → ERC-20 transfer
 * - If methodLabel contains "swap" → swap
 * - Otherwise → native ETH transfer
 */
function inferTxType(tx: BasescanTx): "swap" | "transfer" | "native" {
  const methodLabel = tx.methodLabel?.toLowerCase() ?? "";
  const input = tx.input ?? "";

  // ERC-20 token transfer (check for transfer method signature)
  if (tx.tokenSymbol && tx.tokenDecimal) return "transfer";

  // Swap detection (common swap method selectors)
  const swapMethods = ["swap", "exactinput", "exactoutput", "multicall"];
  if (swapMethods.some((m) => methodLabel.includes(m) || input.startsWith(m))) {
    return "swap";
  }

  // If there's a contract address and no value, it's likely a contract interaction
  if (!tx.value || tx.value === "0") return "transfer";

  return "native";
}

/**
 * Compute gas spent in ETH from gasUsed × gasPrice.
 */
function computeGasETH(gasUsed: string, gasPrice: string): string {
  try {
    const gas = BigInt(gasUsed || "0");
    const price = BigInt(gasPrice || "0");
    const wei = gas * price;
    const eth = Number(wei) / Number(ETHER_VALUE_DIVISOR);
    return eth.toFixed(8);
  } catch {
    return "0";
  }
}

/**
 * Get ETH price in USD from Basescan.
 */
async function getEthPriceUSD(): Promise<number> {
  const url = `${BASESCAN_BASE}?module=stats&action=ethprice${BASESCAN_API_KEY ? `&apikey=${BASESCAN_API_KEY}` : ""}`;
  const data = await safeFetch<BasescanEthPriceResponse>(url);
  if (data?.status === "1" && data?.result) {
    const parsed = parseFloat(data.result);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return ETH_PRICE_FALLBACK;
}

// ─── Main fetch function ─────────────────────────────────────────────────────

export interface FetchWalletParams {
  address: string;
  page?: number;
  limit?: number;
}

export interface FetchWalletResult {
  stats: WalletStats;
  rawTxs: BasescanTx[]; // internal, for debugging
}

/**
 * Fetch wallet transactions + stats from Basescan.
 * Uses the free txlist endpoint (no API key required, rate-limited).
 */
export async function fetchWalletData(
  params: FetchWalletParams,
  signal?: AbortSignal
): Promise<FetchWalletResult> {
  const { address, page = 1, limit = 20 } = params;
  const normalized = normalizeAddress(address);

  const offset = (Math.max(1, page) - 1) * Math.min(limit, 100);

  // Fetch tx list + ETH price in parallel
  const [txData, ethPrice] = await Promise.all([
    safeFetch<BasescanTxListResponse>(
      `${BASESCAN_BASE}?module=account&action=txlist&address=${normalized}&startblock=0&endblock=99999999&page=1&offset=${MAX_TRANSACTIONS}&sort=desc${BASESCAN_API_KEY ? `&apikey=${BASESCAN_API_KEY}` : ""}`,
      signal
    ),
    getEthPriceUSD(),
  ]);

  let rawTxs: BasescanTx[] = [];

  if (txData?.status === "1" && Array.isArray(txData.result)) {
    rawTxs = txData.result;
  } else if (txData?.status === "1" && typeof txData.result === "string") {
    // Empty result
    rawTxs = [];
  } else {
    // Try fetching internal tx list as fallback
    const internalData = await safeFetch<BasescanTxListResponse>(
      `${BASESCAN_BASE}?module=account&action=txlistinternal&address=${normalized}&startblock=0&endblock=99999999&page=1&offset=${MAX_TRANSACTIONS}&sort=desc${BASESCAN_API_KEY ? `&apikey=${BASESCAN_API_KEY}` : ""}`,
      signal
    );
    if (internalData?.status === "1" && Array.isArray(internalData.result)) {
      rawTxs = internalData.result;
    }
  }

  // Filter out errored transactions
  const validTxs = rawTxs.filter((tx) => tx.isError === "0");

  // Slice for pagination
  const pageTxs = validTxs.slice(offset, offset + Math.min(limit, 100));

  // Build normalized transaction list
  const transactions: WalletTransaction[] = pageTxs.map((tx) => {
    const valueEth =
      Number(BigInt(tx.value || "0")) / Number(ETHER_VALUE_DIVISOR);

    return {
      hash: tx.hash,
      type: inferTxType(tx),
      amount: valueEth > 0 ? valueEth.toFixed(6) : "0",
      token: tx.tokenSymbol ?? "ETH",
      timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
      from: tx.from,
      to: tx.to ?? "",
    };
  });

  // Compute gas spent (ETH)
  const totalGasETH = validTxs.reduce((sum, tx) => {
    return sum + parseFloat(computeGasETH(tx.gasUsed, tx.gasPrice));
  }, 0);

  const gasSpentETH = totalGasETH.toFixed(8);

  // Compute net flow USD
  // Sum of ETH received (as recipient) minus ETH sent (as sender), in USD
  let netFlowUSD = 0;
  for (const tx of validTxs) {
    const valueEth =
      Number(BigInt(tx.value || "0")) / Number(ETHER_VALUE_DIVISOR);
    if (tx.to?.toLowerCase() === normalized) {
      // Incoming
      netFlowUSD += valueEth * ethPrice;
    }
    if (tx.from?.toLowerCase() === normalized) {
      // Outgoing (gas excluded from value here; gas shown separately)
      // Only subtract if it's not a self-send
      if (tx.to?.toLowerCase() !== normalized) {
        netFlowUSD -= valueEth * ethPrice;
      }
    }
  }

  // Last active timestamp
  const lastActive =
    validTxs.length > 0
      ? new Date(Number(validTxs[0].timeStamp) * 1000).toISOString()
      : new Date().toISOString();

  const stats: WalletStats = {
    address: normalized,
    txCount: validTxs.length,
    netFlowUSD: Math.round(netFlowUSD * 100) / 100,
    gasSpentETH,
    lastActive,
    transactions,
  };

  return { stats, rawTxs };
}
