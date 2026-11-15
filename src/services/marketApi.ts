import { TokenMarketItem } from '../types/onchain';

export const BASELINE_TOKENS: TokenMarketItem[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    sector: 'Layer 1',
    priceUsd: 91240.0,
    change24h: 1.84,
    volume24hUsd: 42850000000,
    marketCapUsd: 1804000000000,
    whaleNetFlow24hUsd: 184500000,
    whaleSignal: '機構吸籌',
    institutionalHolders: ['BlackRock IBIT', 'Coinbase Prime', 'Binance Cold'],
    sparkline7d: [87200, 88100, 89450, 88900, 90120, 90680, 91240],
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    sector: 'Layer 1',
    priceUsd: 3150.4,
    change24h: 2.35,
    volume24hUsd: 24100000000,
    marketCapUsd: 379500000000,
    whaleNetFlow24hUsd: 96400000,
    whaleSignal: '機構吸籌',
    institutionalHolders: ['BlackRock IBIT', 'Ethereum Foundation', 'Jump Trading'],
    sparkline7d: [2980, 3015, 3042, 3090, 3078, 3120, 3150.4],
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    sector: 'Layer 1',
    priceUsd: 215.2,
    change24h: 4.12,
    volume24hUsd: 7840000000,
    marketCapUsd: 101800000000,
    whaleNetFlow24hUsd: 34200000,
    whaleSignal: '淨流入',
    institutionalHolders: ['Jump Crypto', 'Binance SOL Hot'],
    sparkline7d: [198, 202, 206, 204, 209, 212, 215.2],
  },
  {
    id: 'sui',
    symbol: 'SUI',
    name: 'Sui',
    sector: 'Layer 1',
    priceUsd: 3.31,
    change24h: 5.48,
    volume24hUsd: 1680000000,
    marketCapUsd: 9420000000,
    whaleNetFlow24hUsd: 18900000,
    whaleSignal: '機構吸籌',
    institutionalHolders: ['Mysten Labs Treasury', 'Coinbase Prime'],
    sparkline7d: [2.88, 2.95, 3.04, 3.11, 3.18, 3.24, 3.31],
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    sector: 'Layer 1',
    priceUsd: 620.8,
    change24h: -0.62,
    volume24hUsd: 1920000000,
    marketCapUsd: 89400000000,
    whaleNetFlow24hUsd: -14500000,
    whaleSignal: '中性觀望',
    institutionalHolders: ['Binance BSC Hot', 'Binance Cold'],
    sparkline7d: [632, 628, 625, 629, 624, 622, 620.8],
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    sector: '基礎設施',
    priceUsd: 14.85,
    change24h: 3.15,
    volume24hUsd: 540000000,
    marketCapUsd: 9310000000,
    whaleNetFlow24hUsd: 12400000,
    whaleSignal: '淨流入',
    institutionalHolders: ['Wintermute', 'Binance Hot #8'],
    sparkline7d: [13.9, 14.1, 14.0, 14.3, 14.5, 14.6, 14.85],
  },
  {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    sector: 'DeFi 核心',
    priceUsd: 178.4,
    change24h: 1.92,
    volume24hUsd: 385000000,
    marketCapUsd: 2680000000,
    whaleNetFlow24hUsd: 8600000,
    whaleSignal: '淨流入',
    institutionalHolders: ['Paradigm', 'Aave Treasury'],
    sparkline7d: [168, 170, 172, 171, 174, 176, 178.4],
  },
  {
    id: 'ondo-finance',
    symbol: 'ONDO',
    name: 'Ondo Finance',
    sector: 'RWA 與機構級',
    priceUsd: 0.98,
    change24h: 6.24,
    volume24hUsd: 412000000,
    marketCapUsd: 1410000000,
    whaleNetFlow24hUsd: 21300000,
    whaleSignal: '機構吸籌',
    institutionalHolders: ['BlackRock IBIT', 'Coinbase Prime'],
    sparkline7d: [0.86, 0.88, 0.91, 0.90, 0.93, 0.95, 0.98],
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    sector: 'DeFi 核心',
    priceUsd: 9.14,
    change24h: -1.45,
    volume24hUsd: 310000000,
    marketCapUsd: 5490000000,
    whaleNetFlow24hUsd: -6200000,
    whaleSignal: '大戶派發',
    institutionalHolders: ['Wintermute', 'Paradigm'],
    sparkline7d: [9.6, 9.5, 9.42, 9.38, 9.29, 9.21, 9.14],
  },
];

interface CoinGeckoMarketResponse {
  id: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d?: { price?: number[] };
}

export interface MarketFetchResult {
  tokens: TokenMarketItem[];
  source: 'live-coingecko' | 'baseline';
  updatedAt: string;
}

export async function fetchLiveMarketTokens(): Promise<MarketFetchResult> {
  const ids = BASELINE_TOKENS.map((t) => t.id).join(',');
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`;

  const nowStr = new Date().toLocaleTimeString('zh-TW', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    window.clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as CoinGeckoMarketResponse[];
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Empty market response');
    }

    const byId = new Map(data.map((item) => [item.id, item]));
    const merged = BASELINE_TOKENS.map((base) => {
      const live = byId.get(base.id);
      if (!live) return base;
      const rawSpark = live.sparkline_in_7d?.price ?? [];
      const sampledSpark =
        rawSpark.length >= 12
          ? rawSpark.filter((_, idx) => idx % Math.max(1, Math.floor(rawSpark.length / 16)) === 0)
          : base.sparkline7d;

      return {
        ...base,
        priceUsd: live.current_price ?? base.priceUsd,
        change24h: live.price_change_percentage_24h ?? base.change24h,
        volume24hUsd: live.total_volume ?? base.volume24hUsd,
        marketCapUsd: live.market_cap ?? base.marketCapUsd,
        sparkline7d: sampledSpark,
      };
    });

    return {
      tokens: merged,
      source: 'live-coingecko',
      updatedAt: nowStr,
    };
  } catch {
    return {
      tokens: BASELINE_TOKENS,
      source: 'baseline',
      updatedAt: nowStr,
    };
  }
}
