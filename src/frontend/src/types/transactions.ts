export interface Transaction {
  id: string;
  amount: number;
  sender?: string;
  timestamp: string;
  source: string;
  rawText: string;
}

export interface ParsedTransaction {
  amount: number;
  sender?: string;
  timestamp?: string;
  source: string;
}
