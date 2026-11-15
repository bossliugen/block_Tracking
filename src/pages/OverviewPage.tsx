import React, { useMemo, useState } from 'react';
import { ChainId, InspectionRecord, SeverityLevel } from '../types/onchain';
import { DETECTION_EVENTS } from '../data/monitoring';
import { resolveEntity } from '../data/entities';
import { CopyableAddress } from '../components/CopyableAddress';
import { StatusPill } from '../components/StatusPill';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface OverviewPageProps {
  selectedChain: ChainId;
  searchQuery: string;
  onInspect: (record: InspectionRecord) => void;
}

type SeverityFilter = 'all' | SeverityLevel;

const SEVERITY_FILTERS: { id: SeverityFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'high', label: '高風險' },
  { id: 'warn', label: '異動提醒' },
  { id: 'safe', label: '正常紀錄' },
];

export const OverviewPage: React.FC<OverviewPageProps> = ({
  selectedChain,
  searchQuery,
  onInspect,
}) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DETECTION_EVENTS.filter((item) => {
      if (selectedChain !== 'all' && item.chain !== selectedChain) return false;
      if (severityFilter !== 'all' && item.severity !== severityFilter) return false;
      if (!q) return true;

      const entityPrimary = resolveEntity(item.primaryAddress)?.name.toLowerCase() ?? '';
      const entityFrom = resolveEntity(item.fromAddress)?.name.toLowerCase() ?? '';
      const entityTo = resolveEntity(item.toAddress)?.name.toLowerCase() ?? '';
      return (
        item.primaryAddress.toLowerCase().includes(q) ||
        item.txHash.toLowerCase().includes(q) ||
        item.eventType.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        entityPrimary.includes(q) ||
        entityFrom.includes(q) ||
        entityTo.includes(q)
      );
    });
  }, [selectedChain, severityFilter, searchQuery]);

  const highRiskCount = DETECTION_EVENTS.filter((e) => e.severity === 'high').length;
  const warnCount = DETECTION_EVENTS.filter((e) => e.severity === 'warn').length;

  return (
    <div>
      {/* Summary KPI Strip — 4 hairline-bordered white cards */}
      <section className="kpi-grid" aria-label="核心監控指標">
        <div className="card kpi-card enter-stagger enter-delay-2">
          <span className="kpi-label">監控中位址數</span>
          <span className="kpi-value tabular">18,420</span>
          <span className="kpi-sub tabular">含 15 組已驗證機構與大戶託管庫</span>
        </div>

        <div className="card kpi-card enter-stagger enter-delay-3">
          <span className="kpi-label">24h 異常警示</span>
          <span className="kpi-value tabular" style={{ color: 'var(--status-risk-fg)' }}>
            {highRiskCount + warnCount + 32}
          </span>
          <span className="kpi-sub tabular">
            高風險 {highRiskCount + 6} 件 · 異動提醒 {warnCount + 26} 件
          </span>
        </div>

        <div className="card kpi-card enter-stagger enter-delay-4">
          <span className="kpi-label">節點偵測延遲</span>
          <span className="kpi-value tabular" style={{ color: 'var(--status-safe-fg)' }}>
            142 ms
          </span>
          <span className="kpi-sub">Ethereum / Solana / Sui / BSC 同步中</span>
        </div>

        <div className="card kpi-card enter-stagger enter-delay-5">
          <span className="kpi-label">網路基礎 Gas / TPS</span>
          <span className="kpi-value tabular">14.2 Gwei</span>
          <span className="kpi-sub tabular">多鏈平均吞吐量 2,840 TPS</span>
        </div>
      </section>

      {/* Live Detection Feed (Clean Tabular List) */}
      <RevealOnScroll>
        <section className="card" aria-label="即時異常偵測紀錄">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div>
                <h1 className="section-title">即時異常偵測與監控紀錄</h1>
                <p className="section-subtitle">
                  點擊任一列即可展開右側檢視面板，查看完整資金流向、風險拆解與原始 Payload。
                </p>
              </div>
              <div className="filter-pills" role="group" aria-label="風險等級篩選">
                {SEVERITY_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`filter-pill ${severityFilter === f.id ? 'is-active' : ''}`}
                    onClick={() => setSeverityFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th style={{ width: 96 }}>時間</th>
                  <th style={{ width: 116 }}>事件類型</th>
                  <th style={{ width: 280 }}>關聯位址</th>
                  <th style={{ width: 108 }}>狀態</th>
                  <th>摘要說明</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--ink-muted)' }}>
                      目前篩選條件下無符合的監控紀錄。
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((row) => (
                    <tr
                      key={row.id}
                      className="is-clickable"
                      onClick={() => onInspect(row)}
                    >
                      <td className="tabular" style={{ color: 'var(--ink-secondary)' }}>
                        {row.timestamp}
                      </td>
                      <td style={{ fontWeight: 500 }}>{row.eventType}</td>
                      <td>
                        <CopyableAddress address={row.primaryAddress} />
                      </td>
                      <td>
                        <StatusPill severity={row.severity} />
                      </td>
                      <td style={{ color: 'var(--ink-secondary)' }}>{row.summary}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
};
