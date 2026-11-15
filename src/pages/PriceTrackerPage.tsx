import React, { useMemo, useState } from 'react';
import { RefreshCw, Star } from 'lucide-react';
import { TokenMarketItem } from '../types/onchain';
import { formatUsdCompact } from '../data/entities';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface PriceTrackerPageProps {
  tokens: TokenMarketItem[];
  marketSource: 'live-coingecko' | 'baseline';
  updatedAt: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  searchQuery: string;
}

type SectorFilter = 'all' | 'watchlist' | TokenMarketItem['sector'];
type SortBy = 'marketCap' | 'change24h' | 'whaleFlow';

const SECTORS: { id: SectorFilter; label: string }[] = [
  { id: 'all', label: '全部幣種' },
  { id: 'watchlist', label: '我的自選' },
  { id: 'Layer 1', label: 'Layer 1' },
  { id: 'DeFi 核心', label: 'DeFi 核心' },
  { id: 'RWA 與機構級', label: 'RWA 與機構級' },
  { id: '基礎設施', label: '基礎設施' },
];

const SparklineSvg: React.FC<{ data: number[]; positive: boolean; width?: number; height?: number }> = ({
  data,
  positive,
  width = 104,
  height = 28,
}) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - 2 - ((v - min) / range) * (height - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline
        points={points}
        stroke={positive ? '#1B4332' : '#991B1B'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PriceTrackerPage: React.FC<PriceTrackerPageProps> = ({
  tokens,
  marketSource,
  updatedAt,
  isRefreshing,
  onRefresh,
  searchQuery,
}) => {
  const [sector, setSector] = useState<SectorFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('marketCap');
  const [selectedId, setSelectedId] = useState<string>('ethereum');
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gen_watchlist_tokens');
      return saved ? (JSON.parse(saved) as string[]) : ['bitcoin', 'ethereum', 'solana', 'sui'];
    } catch {
      return ['bitcoin', 'ethereum', 'solana', 'sui'];
    }
  });

  const toggleWatchlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('gen_watchlist_tokens', JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const filteredTokens = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = tokens.filter((t) => {
      if (sector === 'watchlist' && !watchlist.includes(t.id)) return false;
      if (sector !== 'all' && sector !== 'watchlist' && t.sector !== sector) return false;
      if (!q) return true;
      return (
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.institutionalHolders.some((h) => h.toLowerCase().includes(q))
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'change24h') return b.change24h - a.change24h;
      if (sortBy === 'whaleFlow') return b.whaleNetFlow24hUsd - a.whaleNetFlow24hUsd;
      return b.marketCapUsd - a.marketCapUsd;
    });
  }, [tokens, sector, sortBy, searchQuery, watchlist]);

  const activeToken = tokens.find((t) => t.id === selectedId) ?? filteredTokens[0] ?? tokens[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Selected Token Spotlight */}
      {activeToken && (
        <section className="card enter-stagger enter-delay-2" style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="entity-tag">{activeToken.sector}</span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>
                  追蹤幣種焦點 · {marketSource === 'live-coingecko' ? 'CoinGecko 即時報價' : '基準報價'} ({updatedAt})
                </span>
              </div>
              <h1 style={{ fontSize: 22 }}>
                {activeToken.name} ({activeToken.symbol})
              </h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
                <span className="tabular" style={{ fontSize: 30, fontWeight: 700 }}>
                  ${activeToken.priceUsd.toLocaleString(undefined, { maximumFractionDigits: activeToken.priceUsd < 10 ? 4 : 2 })}
                </span>
                <span
                  className="tabular"
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: activeToken.change24h >= 0 ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                  }}
                >
                  {activeToken.change24h >= 0 ? `+${activeToken.change24h.toFixed(2)}%` : `${activeToken.change24h.toFixed(2)}%`} (24h)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>7 日價格走勢</div>
                <div style={{ marginTop: 6 }}>
                  <SparklineSvg
                    data={activeToken.sparkline7d}
                    positive={activeToken.change24h >= 0}
                    width={180}
                    height={44}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={13} />
                {isRefreshing ? '更新中...' : '刷新報價'}
              </button>
            </div>
          </div>

          <div
            className="grid-3"
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid var(--border-hairline)',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>24h 機構與大戶淨流向</div>
              <div
                className="tabular"
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginTop: 2,
                  color: activeToken.whaleNetFlow24hUsd >= 0 ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                }}
              >
                {activeToken.whaleNetFlow24hUsd >= 0
                  ? `+${formatUsdCompact(activeToken.whaleNetFlow24hUsd)}`
                  : formatUsdCompact(activeToken.whaleNetFlow24hUsd)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>24h 全球成交量</div>
              <div className="tabular" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>
                {formatUsdCompact(activeToken.volume24hUsd)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>主要機構持倉關聯</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {activeToken.institutionalHolders.map((h) => (
                  <span key={h} className="entity-tag">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Screener & Price Table */}
      <RevealOnScroll>
        <section className="card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="section-title">幣種挑選與即時價格追蹤</h2>
                <p className="section-subtitle">
                  依板塊與大戶籌碼訊號篩選標的，點擊任一列可切換上方焦點走勢與機構持倉明細。
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12.5, color: 'var(--ink-secondary)' }}>排序：</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: 6,
                    padding: '6px 10px',
                    fontSize: 13,
                    color: 'var(--ink-primary)',
                  }}
                >
                  <option value="marketCap">總市值高低</option>
                  <option value="change24h">24h 漲跌幅</option>
                  <option value="whaleFlow">24h 大戶淨流入</option>
                </select>
              </div>
            </div>

            <div className="filter-pills">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`filter-pill ${sector === s.id ? 'is-active' : ''}`}
                  onClick={() => setSector(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrap">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th style={{ width: 42 }}>自選</th>
                  <th>幣種名稱</th>
                  <th>板塊</th>
                  <th style={{ textAlign: 'right' }}>即時價格 (USD)</th>
                  <th style={{ textAlign: 'right' }}>24h 漲跌</th>
                  <th>7 日走勢</th>
                  <th style={{ textAlign: 'right' }}>24h 大戶淨流向</th>
                  <th>籌碼訊號</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((t) => {
                  const isStarred = watchlist.includes(t.id);
                  const pos = t.change24h >= 0;
                  const whalePos = t.whaleNetFlow24hUsd >= 0;
                  const signalClass =
                    t.whaleSignal === '機構吸籌' || t.whaleSignal === '淨流入'
                      ? 'status-safe'
                      : t.whaleSignal === '大戶派發'
                        ? 'status-risk'
                        : 'status-neutral';

                  return (
                    <tr
                      key={t.id}
                      className="is-clickable"
                      onClick={() => setSelectedId(t.id)}
                      style={{
                        backgroundColor: activeToken?.id === t.id ? 'var(--bg-subtle)' : undefined,
                      }}
                    >
                      <td>
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={(e) => toggleWatchlist(t.id, e)}
                          aria-label={isStarred ? `移除 ${t.symbol} 自選` : `加入 ${t.symbol} 自選`}
                        >
                          <Star
                            size={15}
                            fill={isStarred ? '#B45309' : 'none'}
                            color={isStarred ? '#B45309' : '#78716C'}
                          />
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {t.symbol} <span style={{ fontWeight: 400, color: 'var(--ink-secondary)' }}>· {t.name}</span>
                        </div>
                        <div className="tabular" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                          市值 {formatUsdCompact(t.marketCapUsd)}
                        </div>
                      </td>
                      <td>
                        <span className="entity-tag">{t.sector}</span>
                      </td>
                      <td className="tabular" style={{ textAlign: 'right', fontWeight: 600 }}>
                        ${t.priceUsd.toLocaleString(undefined, { maximumFractionDigits: t.priceUsd < 10 ? 4 : 2 })}
                      </td>
                      <td
                        className="tabular"
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: pos ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                        }}
                      >
                        {pos ? `+${t.change24h.toFixed(2)}%` : `${t.change24h.toFixed(2)}%`}
                      </td>
                      <td>
                        <SparklineSvg data={t.sparkline7d} positive={pos} />
                      </td>
                      <td
                        className="tabular"
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: whalePos ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                        }}
                      >
                        {whalePos ? `+${formatUsdCompact(t.whaleNetFlow24hUsd)}` : formatUsdCompact(t.whaleNetFlow24hUsd)}
                      </td>
                      <td>
                        <span className={`status-pill ${signalClass}`}>{t.whaleSignal}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
};
