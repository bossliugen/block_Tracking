import { KnownEntity, SupportedChain } from '../types/onchain';

export const KNOWN_ENTITIES: KnownEntity[] = [
  {
    id: 'blackrock-ibit',
    name: 'BlackRock IBIT Custody (Coinbase Prime)',
    shortLabel: 'BlackRock 貝萊德託管',
    category: 'ETF 與資產管理',
    chain: 'Ethereum',
    address: '0x503828976D22510aad0201ac7EC88293211D23Da',
    balanceUsd: 4820000000,
    netFlow24hUsd: 142500000,
    primaryAsset: 'ETH / WBTC / USDC',
    lastAction: '自 Coinbase Prime 接收 18,400 ETH 機構申購部位',
    explorerUrl: 'https://etherscan.io/address/0x503828976D22510aad0201ac7EC88293211D23Da',
    verified: true,
  },
  {
    id: 'binance-cold-1',
    name: 'Binance Cold Wallet 1',
    shortLabel: 'Binance 冷錢包 #1',
    category: '交易所冷熱錢包',
    chain: 'Ethereum',
    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    balanceUsd: 11450000000,
    netFlow24hUsd: -64200000,
    primaryAsset: 'ETH / USDT / USDC',
    lastAction: '向熱錢包調撥 22,000,000 USDT 流動性儲備',
    explorerUrl: 'https://etherscan.io/address/0x28C6c06298d514Db089934071355E5743bf21d60',
    verified: true,
  },
  {
    id: 'binance-hot-8',
    name: 'Binance Hot Wallet 8',
    shortLabel: 'Binance 熱錢包 #8',
    category: '交易所冷熱錢包',
    chain: 'Ethereum',
    address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
    balanceUsd: 3290000000,
    netFlow24hUsd: 38900000,
    primaryAsset: 'ETH / LINK / AAVE',
    lastAction: '多筆大戶提幣結算完成',
    explorerUrl: 'https://etherscan.io/address/0xF977814e90dA44bFA03b6295A0616a897441aceC',
    verified: true,
  },
  {
    id: 'coinbase-prime',
    name: 'Coinbase Prime Custody',
    shortLabel: 'Coinbase Prime 託管',
    category: '交易所冷熱錢包',
    chain: 'Ethereum',
    address: '0x71660c4005BA85c37ccec55d0C4493E66Fe775d3',
    balanceUsd: 6180000000,
    netFlow24hUsd: 89400000,
    primaryAsset: 'ETH / USDC / ONDO',
    lastAction: '向貝萊德託管位址轉出機構買盤資產',
    explorerUrl: 'https://etherscan.io/address/0x71660c4005BA85c37ccec55d0C4493E66Fe775d3',
    verified: true,
  },
  {
    id: 'wintermute',
    name: 'Wintermute Trading',
    shortLabel: 'Wintermute 做市商',
    category: '做市商 / 量化機構',
    chain: 'Ethereum',
    address: '0xDBF5E9c5206d0dB70a90108bf936DA60221dC080',
    balanceUsd: 892000000,
    netFlow24hUsd: -27300000,
    primaryAsset: 'ETH / ARB / UNI',
    lastAction: '向 Binance 熱錢包轉入 4,500 ETH 進行對沖平衡',
    explorerUrl: 'https://etherscan.io/address/0xDBF5E9c5206d0dB70a90108bf936DA60221dC080',
    verified: true,
  },
  {
    id: 'jump-trading',
    name: 'Jump Trading',
    shortLabel: 'Jump Trading 量化',
    category: '做市商 / 量化機構',
    chain: 'Ethereum',
    address: '0xf584F8728B874a6a5c7A8d4d387C9aae9172D621',
    balanceUsd: 540000000,
    netFlow24hUsd: 16800000,
    primaryAsset: 'ETH / USDC / LDO',
    lastAction: '自 Lido 解除質押並收回 3,200 ETH',
    explorerUrl: 'https://etherscan.io/address/0xf584F8728B874a6a5c7A8d4d387C9aae9172D621',
    verified: true,
  },
  {
    id: 'tether-treasury',
    name: 'Tether Treasury',
    shortLabel: 'Tether 國庫',
    category: '穩定幣發行商',
    chain: 'Ethereum',
    address: '0x5754284f345afc66a98fbB0a0Afe71e0F007B949',
    balanceUsd: 2450000000,
    netFlow24hUsd: 250000000,
    primaryAsset: 'USDT',
    lastAction: '授權鑄造 250,000,000 USDT 備用庫存',
    explorerUrl: 'https://etherscan.io/address/0x5754284f345afc66a98fbB0a0Afe71e0F007B949',
    verified: true,
  },
  {
    id: 'circle-treasury',
    name: 'Circle USDC Treasury',
    shortLabel: 'Circle USDC 國庫',
    category: '穩定幣發行商',
    chain: 'Ethereum',
    address: '0x55FE002aefF02F77364de339a1292923A15844B8',
    balanceUsd: 1620000000,
    netFlow24hUsd: 110000000,
    primaryAsset: 'USDC',
    lastAction: '向機構清算通道發行 60,000,000 USDC',
    explorerUrl: 'https://etherscan.io/address/0x55FE002aefF02F77364de339a1292923A15844B8',
    verified: true,
  },
  {
    id: 'vitalik-buterin',
    name: 'Vitalik Buterin (vitalik.eth)',
    shortLabel: 'Vitalik Buterin',
    category: '公鏈基金會 / 創辦人',
    chain: 'Ethereum',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    balanceUsd: 785000000,
    netFlow24hUsd: -1200000,
    primaryAsset: 'ETH / USDC',
    lastAction: '向公共財資助合約轉入 400 ETH',
    explorerUrl: 'https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    verified: true,
  },
  {
    id: 'ethereum-foundation',
    name: 'Ethereum Foundation',
    shortLabel: '以太坊基金會',
    category: '公鏈基金會 / 創辦人',
    chain: 'Ethereum',
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    balanceUsd: 910000000,
    netFlow24hUsd: -3100000,
    primaryAsset: 'ETH',
    lastAction: '定期撥付生態系研究補助 1,000 ETH',
    explorerUrl: 'https://etherscan.io/address/0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    verified: true,
  },
  {
    id: 'paradigm',
    name: 'Paradigm Capital',
    shortLabel: 'Paradigm 創投',
    category: 'ETF 與資產管理',
    chain: 'Ethereum',
    address: '0xC61b9BB3A7a0767E3179713f3A5c7a9aeDCE193C',
    balanceUsd: 430000000,
    netFlow24hUsd: 19400000,
    primaryAsset: 'ETH / MKR / LDO',
    lastAction: '增持 LDO 與 MKR 治理部位',
    explorerUrl: 'https://etherscan.io/address/0xC61b9BB3A7a0767E3179713f3A5c7a9aeDCE193C',
    verified: true,
  },
  {
    id: 'binance-sol-hot',
    name: 'Binance Solana Hot Wallet',
    shortLabel: 'Binance SOL 熱錢包',
    category: '交易所冷熱錢包',
    chain: 'Solana',
    address: '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9',
    balanceUsd: 1840000000,
    netFlow24hUsd: 47600000,
    primaryAsset: 'SOL / USDC / JUP',
    lastAction: '大額 SOL 提領出金至未知託管錢包',
    explorerUrl: 'https://solscan.io/account/5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9',
    verified: true,
  },
  {
    id: 'jump-crypto-sol',
    name: 'Jump Crypto Solana Vault',
    shortLabel: 'Jump Crypto (SOL)',
    category: '做市商 / 量化機構',
    chain: 'Solana',
    address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    balanceUsd: 620000000,
    netFlow24hUsd: 21800000,
    primaryAsset: 'SOL / JitoSOL',
    lastAction: '新增質押 95,000 SOL 至流動性質押池',
    explorerUrl: 'https://solscan.io/account/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    verified: true,
  },
  {
    id: 'binance-bsc-hot',
    name: 'Binance BSC Hot Wallet',
    shortLabel: 'Binance BSC 熱錢包',
    category: '交易所冷熱錢包',
    chain: 'BSC',
    address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
    balanceUsd: 960000000,
    netFlow24hUsd: -14500000,
    primaryAsset: 'BNB / USDT',
    lastAction: '跨鏈橋接調撥 18,500 BNB',
    explorerUrl: 'https://bscscan.com/address/0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
    verified: true,
  },
  {
    id: 'mysten-treasury',
    name: 'Mysten Labs Foundation Treasury',
    shortLabel: 'Mysten Labs 基金會',
    category: '公鏈基金會 / 創辦人',
    chain: 'Sui',
    address: '0x2a14f8a9c4b1e7d6c3a90f8b5e4d2c1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c',
    balanceUsd: 510000000,
    netFlow24hUsd: 12400000,
    primaryAsset: 'SUI / USDC',
    lastAction: '生態流動性激勵合約撥款 4,200,000 SUI',
    explorerUrl: 'https://suiscan.xyz/mainnet/account/0x2a14f8a9c4b1e7d6c3a90f8b5e4d2c1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c',
    verified: true,
  },
];

const ENTITY_MAP = new Map<string, KnownEntity>(
  KNOWN_ENTITIES.map((e) => [e.address.toLowerCase(), e])
);

export function resolveEntity(address: string): KnownEntity | undefined {
  return ENTITY_MAP.get(address.toLowerCase());
}

export function truncateAddress(addr: string, head = 6, tail = 4): string {
  if (!addr || addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
}

export function getExplorerTxUrl(chain: SupportedChain, txHash: string): string {
  switch (chain) {
    case 'Ethereum':
      return `https://etherscan.io/tx/${txHash}`;
    case 'Solana':
      return `https://solscan.io/tx/${txHash}`;
    case 'BSC':
      return `https://bscscan.com/tx/${txHash}`;
    case 'Sui':
      return `https://suiscan.xyz/mainnet/tx/${txHash}`;
  }
}

export function formatUsdCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}
