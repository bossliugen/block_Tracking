export type ChainId = 'all' | 'Ethereum' | 'Solana' | 'Sui' | 'BSC';

export type SupportedChain = Exclude<ChainId, 'all'>;

export type SeverityLevel = 'high' | 'warn' | 'safe';

export type EntityCategory =
  | '交易所冷熱錢包'
  | 'ETF 與資產管理'
  | '做市商 / 量化機構'
  | '穩定幣發行商'
  | '公鏈基金會 / 創辦人';

export interface KnownEntity {
  id: string;
  name: string;
  shortLabel: string;
  category: EntityCategory;
  chain: SupportedChain;
  address: string;
  balanceUsd: number;
  netFlow24hUsd: number;
  primaryAsset: string;
  lastAction: string;
  explorerUrl: string;
  verified: boolean;
}

export interface RiskCheckItem {
  label: string;
  status: SeverityLevel;
  detail: string;
}

export interface InspectionRecord {
  id: string;
  timestamp: string;
  blockHeight: number;
  chain: SupportedChain;
  eventType: string;
  severity: SeverityLevel;
  primaryAddress: string;
  fromAddress: string;
  toAddress: string;
  txHash: string;
  tokenSymbol: string;
  tokenAmount: string;
  usdValue: number;
  gasFee: string;
  summary: string;
  riskScore: number;
  riskChecks: RiskCheckItem[];
  rawPayload: Record<string, unknown>;
}

export interface TokenMarketItem {
  id: string;
  symbol: string;
  name: string;
  sector: 'Layer 1' | 'DeFi 核心' | 'RWA 與機構級' | '基礎設施';
  priceUsd: number;
  change24h: number;
  volume24hUsd: number;
  marketCapUsd: number;
  whaleNetFlow24hUsd: number;
  whaleSignal: '機構吸籌' | '淨流入' | '中性觀望' | '大戶派發';
  institutionalHolders: string[];
  sparkline7d: number[];
}
