import React, { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { ChainId, EntityCategory } from '../types/onchain';
import { KNOWN_ENTITIES, formatUsdCompact } from '../data/entities';
import { CopyableAddress } from '../components/CopyableAddress';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface WhaleFlowPageProps {
  selectedChain: ChainId;
  searchQuery: string;
  onSelectEntityAddress: (address: string) => void;
}

type CategoryFilter = 'all' | EntityCategory;

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: '全部機構與大戶' },
  { id: 'ETF 與資產管理', label: 'ETF 與資產管理' },
  { id: '交易所冷熱錢包', label: '交易所冷熱錢包' },
  { id: '做市商 / 量化機構', label: '做市商 / 量化機構' },
  { id: '穩定幣發行商', label: '穩定幣發行商' },
  { id: '公鏈基金會 / 創辦人', label: '公鏈基金會 / 創辦人' },
];

export const WhaleFlowPage: React.FC<WhaleFlowPageProps> = ({
  selectedChain,
  searchQuery,
  onSelectEntityAddress,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const filteredEntities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return KNOWN_ENTITIES.filter((ent) => {
      if (selectedChain !== 'all' && ent.chain !== selectedChain) return false;
      if (categoryFilter !== 'all' && ent.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        ent.name.toLowerCase().includes(q) ||
        ent.shortLabel.toLowerCase().includes(q) ||
        ent.address.toLowerCase().includes(q) ||
        ent.primaryAsset.toLowerCase().includes(q)
      );
    });
  }, [selectedChain, categoryFilter, searchQuery]);

  // Aggregate net flow by category for the editorial SVG bar chart
  const categoryFlows = useMemo(() => {
    const groups = new Map<EntityCategory, number>();
    KNOWN_ENTITIES.forEach((ent) => {
      if (selectedChain !== 'all' && ent.chain !== selectedChain) return;
      groups.set(ent.category, (groups.get(ent.category) ?? 0) + ent.netFlow24hUsd);
    });
    return Array.from(groups.entries()).map(([category, netUsd]) => ({
      category,
      netUsd,
    }));
  }, [selectedChain]);

  const maxAbsFlow = Math.max(1, ...categoryFlows.map((c) => Math.abs(c.netUsd)));

  const totalInstitutionalInflow = KNOWN_ENTITIES.filter(
    (e) => e.netFlow24hUsd > 0 && (selectedChain === 'all' || e.chain === selectedChain)
  ).reduce((acc, e) => acc + e.netFlow24hUsd, 0);

  const totalOutflow = KNOWN_ENTITIES.filter(
    (e) => e.netFlow24hUsd < 0 && (selectedChain === 'all' || e.chain === selectedChain)
  ).reduce((acc, e) => acc + Math.abs(e.netFlow24hUsd), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top 3 Flow Summary Cards */}
      <section className="grid-3">
        <div className="card kpi-card enter-stagger enter-delay-2">
          <span className="kpi-label">24h 機構淨流入總額</span>
          <span className="kpi-value tabular" style={{ color: 'var(--status-safe-fg)' }}>
            +{formatUsdCompact(totalInstitutionalInflow)}
          </span>
          <span className="kpi-sub">ETF 託管、穩定幣國庫與長期質押增持</span>
        </div>

        <div className="card kpi-card enter-stagger enter-delay-3">
          <span className="kpi-label">24h 機構與做市商淨流出</span>
          <span className="kpi-value tabular" style={{ color: 'var(--status-risk-fg)' }}>
            -{formatUsdCompact(totalOutflow)}
          </span>
          <span className="kpi-sub">冷熱錢包調撥與流動性再平衡</span>
        </div>

        <div className="card kpi-card enter-stagger enter-delay-4">
          <span className="kpi-label">已標註公開公鑰數</span>
          <span className="kpi-value tabular">{filteredEntities.length}</span>
          <span className="kpi-sub">支援一鍵複製與鏈上交易紀錄連動查詢</span>
        </div>
      </section>

      {/* Editorial Capital Flow Breakdown */}
      <RevealOnScroll>
        <section className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">各類型機構 24 小時資金淨流向</h2>
              <p className="section-subtitle">
                以已標註之公開託管位址與交易所儲備庫計算淨變動（綠色為淨流入，暗紅為淨流出）。
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
            {categoryFlows.map((item) => {
              const widthPct = Math.max(4, Math.round((Math.abs(item.netUsd) / maxAbsFlow) * 100));
              const isPositive = item.netUsd >= 0;
              return (
                <div
                  key={item.category}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '170px 1fr 110px',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-primary)' }}>
                    {item.category}
                  </span>
                  <div
                    style={{
                      height: 10,
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${widthPct}%`,
                        height: '100%',
                        backgroundColor: isPositive ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                        borderRadius: 999,
                        transition: 'width 400ms var(--ease-editorial)',
                      }}
                    />
                  </div>
                  <span
                    className="tabular"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      textAlign: 'right',
                      color: isPositive ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                    }}
                  >
                    {isPositive ? `+${formatUsdCompact(item.netUsd)}` : formatUsdCompact(item.netUsd)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </RevealOnScroll>

      {/* Known Institutional & Whale Public Key Directory */}
      <RevealOnScroll>
        <section className="card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div>
                <h2 className="section-title">已知大機構與大戶公鑰名錄</h2>
                <p className="section-subtitle">
                  公開可驗證之交易所冷熱錢包、ETF 託管庫、做市商與基金會位址，點擊位址可快速查詢對應交易紀錄。
                </p>
              </div>
              <div className="filter-pills">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`filter-pill ${categoryFilter === c.id ? 'is-active' : ''}`}
                    onClick={() => setCategoryFilter(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>機構 / 大戶名稱</th>
                  <th>分類</th>
                  <th>鏈別</th>
                  <th>公開錢包位址（公鑰）</th>
                  <th style={{ textAlign: 'right' }}>追蹤總資產</th>
                  <th style={{ textAlign: 'right' }}>24h 淨流向</th>
                  <th>近期鏈上動向</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntities.map((ent) => {
                  const pos = ent.netFlow24hUsd >= 0;
                  return (
                    <tr key={ent.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ent.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{ent.primaryAsset}</div>
                      </td>
                      <td>
                        <span className="entity-tag">{ent.category}</span>
                      </td>
                      <td>
                        <span className="status-pill status-neutral">{ent.chain}</span>
                      </td>
                      <td>
                        <CopyableAddress address={ent.address} showEntityTag={false} />
                      </td>
                      <td className="tabular" style={{ textAlign: 'right', fontWeight: 500 }}>
                        {formatUsdCompact(ent.balanceUsd)}
                      </td>
                      <td
                        className="tabular"
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: pos ? 'var(--status-safe-fg)' : 'var(--status-risk-fg)',
                        }}
                      >
                        {pos ? `+${formatUsdCompact(ent.netFlow24hUsd)}` : formatUsdCompact(ent.netFlow24hUsd)}
                      </td>
                      <td style={{ color: 'var(--ink-secondary)', maxWidth: 260 }}>{ent.lastAction}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => onSelectEntityAddress(ent.address)}
                          >
                            查交易紀錄
                          </button>
                          <a
                            href={ent.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                            title="於區塊瀏覽器開啟"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
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
