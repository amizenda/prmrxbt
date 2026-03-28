// Shared wallet tracking types

export type TxType = "swap" | "transfer" | "native";

export interface WalletTransaction {
  hash: string;
  type: TxType;
  amount: string;
  token: string;
  timestamp: string; // ISO8601
  from: string;
  to: string;
}

export interface WalletStats {
  address: string;
  txCount: number;
  netFlowUSD: number;
  gasSpentETH: string;
  lastActive: string; // ISO8601
  transactions: WalletTransaction[];
}

export interface WalletApiParams {
  address: string;
  page?: number;
  limit?: number;
}
