import React from 'react';
import { ChainId, SupportedChain } from '../types/onchain';
import { KNOWN_ENTITIES, formatUsdCompact } from '../data/entities';

interface InstitutionalHoldingsRankProps {
  selectedChain: ChainId;
  onSelectEntityAddress: (address: string) => void;
}

interface TokenHoldingRankItem {
  rank: number;
  symbol: string;
  name: string;
  chain: SupportedChain;
  totalHoldingsUsd: number;
  change24hUsd: number;
  sharePct: number;
  topEntityIds: string[];
}

const INSTITUTIONAL_HOLDINGS: TokenHoldingRankItem[] = [
  {
    rank: 1,
    symbol: 'ETH',
    name: 'Ethereum',
    chain: 'Ethereum',
    totalHoldingsUsd: 14820000000,
    change24hUsd: 168400000,
    sharePct: 38.4,
    topEntityIds: ['binance-cold-1', 'blackrock-ibit', 'coinbase-prime', 'ethereum-foundation'],
  },
  {
    rank: 2,
    symbol: 'USDT',
    name: 'Tether USD',
    chain: 'Ethereum',
    totalHoldingsUsd: 9640000000,
    change24hUsd: 201500000,
    sharePct: 25.0,
    topEntityIds: ['binance-cold-1', 'tether-treasury', 'binance-hot-8'],
  },
  {
    rank: 3,
    symbol: 'BTC / WBTC',
    name: 'Bitcoin (Wrapped & Custody)',
    chain: 'Ethereum',
    totalHoldingsUsd: 6410000000,
    change24hUsd: 84200000,
    sharePct: 16.6,
    topEntityIds: ['blackrock-ibit', 'coinbase-prime'],
  },
  {
    rank: 4,
    symbol: 'USDC',
    name: 'USD Coin',
    chain: 'Ethereum',
    totalHoldingsUsd: 3890000000,
    change24hUsd: 110000000,
    sharePct: 10.1,
    topEntityIds: ['circle-treasury', 'coinbase-prime', 'jump-trading'],
  },
  {
    rank: 5,
    symbol: 'SOL',
    name: 'Solana',
    chain: 'Solana',
    totalHoldingsUsd: 2460000000,
    change24hUsd: 69400000,
    sharePct: 6.4,
    topEntityIds: ['binance-sol-hot', 'jump-crypto-sol'],
  },
  {
    rank: 6,
    symbol: 'BNB',
    name: 'BNB',
    chain: 'BSC',
    totalHoldingsUsd: 960000000,
    change24hUsd: -14500000,
    sharePct: 2.5,
    topEntityIds: ['binance-bsc-hot'],
  },
  {
    rank: 7,
    symbol: 'SUI',
    name: 'Sui',
    chain: 'Sui',
    totalHoldingsUsd: 510000000,
    change24hUsd: 12400000,
    sharePct: 1.3,
    topEntityIds: ['mysten-treasury'],
  },
  {
    rank: 8,
    symbol: 'LDO / AAVE / ONDO',
    name: 'DeFi 與 RWA 機構配置組合',
    chain: 'Ethereum',
    totalHoldingsUsd: 430000000,
    change24hUsd: 19400000,
    sharePct: 1.1,
    topEntityIds: ['paradigm', 'wintermute'],
  },
];

export const InstitutionalHoldingsRank: React.FC<InstitutionalHoldingsRankProps> = ({
  selectedChain,
  onSelectEntityAddress,
}) => {
  const entityById = new Map(KNOWN_ENTITIES.map((e) => [e.id, e]));

  const visibleItems = INSTITUTIONAL_HOLDINGS.filter(
    (item) => selectedChain === 'all' || item.chain === selectedChain
  );

  return (
    <section className="card">
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <h2 className="section-title">機構持有代幣排行</h2>
            <p className="section-subtitle">
              統計已標註機構與大戶託管庫之各幣種持倉規模、佔比與 24 小時增減，點擊機構標籤可直接查詢其鏈上交易。
            </p>
          </div>
          <span className="status-pill status-neutral tabular">
            涵蓋 {visibleItems.length} 項主流機構資產
          </span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="editorial-table">
          <thead>
            <tr>
              <th style={{ width: 64 }}>排行</th>
              <th>代幣 / 資產類別</th>
              <th style={{ width: 220 }}>機構總持倉佔比</th>
              <th style={{ textAlign: 'right' }}>機構持有總值</th>
              <th style={{ textAlign: 'right' }}>24h 增減淨額</th>
              <th>主要持倉機構（點擊查明細）</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => {
              const pos = item.change24hUsd >= 0;
              return (
                <tr key={item.symbol}>
                  <td className="tabular" style={{ fontWeight: 700, color: 'var(--ink-secondary)' }}>
                    #{item.rank}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.symbol}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{item.name}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-hairline)',
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, item.sharePct * 2.2)}%`,
                            height: '100%',
                            backgroundColor: '#1B4332',
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <span className="tabular" style={{ fontSize: 12.5, fontWeight: 500, width: 44, textAlign: 'right' }}>
                        {item.sharePct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="tabular" style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatUsdCompact(item.totalHoldingsUsd)}
                  </td>
                  <td
                    className="tabular"
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      color: pos ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                    }}
                  >
                    {pos ? `+${formatUsdCompact(item.change24hUsd)}` : formatUsdCompact(item.change24hUsd)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {item.topEntityIds.map((id) => {
                        const ent = entityById.get(id);
                        if (!ent) return null;
                        return (
                          <button
                            key={id}
                            type="button"
                            className="entity-tag"
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSelectEntityAddress(ent.address)}
                            title={`點擊查詢 ${ent.name} 的鏈上交易紀錄`}
                          >
                            {ent.shortLabel}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
