import React, { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ChainId, InspectionRecord } from '../types/onchain';
import { WHALE_TRANSACTIONS } from '../data/monitoring';
import { formatUsdCompact, resolveEntity } from '../data/entities';
import { CopyableAddress } from '../components/CopyableAddress';
import { StatusPill } from '../components/StatusPill';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { CapitalFlowDiagram } from '../components/CapitalFlowDiagram';
import { ActivityHeatmap } from '../components/ActivityHeatmap';

interface TxLedgerPageProps {
  selectedChain: ChainId;
  searchQuery: string;
  onInspect: (record: InspectionRecord) => void;
}

type ThresholdFilter = 'all' | '10m' | 'entities';

export const TxLedgerPage: React.FC<TxLedgerPageProps> = ({
  selectedChain,
  searchQuery,
  onInspect,
}) => {
  const [threshold, setThreshold] = useState<ThresholdFilter>('all');

  const filteredTxs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return WHALE_TRANSACTIONS.filter((tx) => {
      if (selectedChain !== 'all' && tx.chain !== selectedChain) return false;
      if (threshold === '10m' && tx.usdValue < 10_000_000) return false;
      if (threshold === 'entities' && !resolveEntity(tx.fromAddress) && !resolveEntity(tx.toAddress)) {
        return false;
      }
      if (!q) return true;

      const fromEnt = resolveEntity(tx.fromAddress)?.name.toLowerCase() ?? '';
      const toEnt = resolveEntity(tx.toAddress)?.name.toLowerCase() ?? '';
      return (
        tx.txHash.toLowerCase().includes(q) ||
        tx.fromAddress.toLowerCase().includes(q) ||
        tx.toAddress.toLowerCase().includes(q) ||
        tx.tokenSymbol.toLowerCase().includes(q) ||
        tx.eventType.toLowerCase().includes(q) ||
        fromEnt.includes(q) ||
        toEnt.includes(q)
      );
    });
  }, [selectedChain, threshold, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Visual Capital Flow Topology & 24h Whale Activity Heatmap */}
      <section className="card enter-stagger enter-delay-2" style={{ padding: 20 }}>
        <div className="section-header">
          <div>
            <h1 className="section-title">鏈上大額資金流向拓撲圖</h1>
            <p className="section-subtitle">
              視覺化呈現前 6 大機構與大戶位址間的資金流向脈絡，將游標移至連線可檢視規模，點擊可直接展開交易明細。
            </p>
          </div>
          <span className="status-pill status-neutral tabular">
            目前顯示 {Math.min(6, filteredTxs.filter((t) => t.usdValue > 0).length)} 條主要流向
          </span>
        </div>
        <CapitalFlowDiagram transactions={filteredTxs} onInspect={onInspect} />
      </section>

      <RevealOnScroll>
        <section className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">24 小時多鏈大戶交易熱力圖</h2>
              <p className="section-subtitle">
                依 2 小時區間統計各公鏈百萬美元級以上大額異動密度與異常事件分佈。
              </p>
            </div>
          </div>
          <ActivityHeatmap selectedChain={selectedChain} />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div>
                <h2 className="section-title">鏈上大額交易紀錄（機構與大戶流向標註）</h2>
                <p className="section-subtitle">
                  即時彙整單筆超過 $1,000,000 USD 之跨鏈大額轉移，自動比對已知交易所、ETF 託管與做市商公鑰名稱。
                </p>
              </div>
              <div className="filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${threshold === 'all' ? 'is-active' : ''}`}
                  onClick={() => setThreshold('all')}
                >
                  全部大額 (&gt;= $1M)
                </button>
                <button
                  type="button"
                  className={`filter-pill ${threshold === '10m' ? 'is-active' : ''}`}
                  onClick={() => setThreshold('10m')}
                >
                  特大額 (&gt;= $10M)
                </button>
                <button
                  type="button"
                  className={`filter-pill ${threshold === 'entities' ? 'is-active' : ''}`}
                  onClick={() => setThreshold('entities')}
                >
                  僅看已標註機構
                </button>
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>時間 / 區塊高度</th>
                  <th>鏈別</th>
                  <th>流向類型</th>
                  <th>發送方 (From) → 接收方 (To)</th>
                  <th style={{ textAlign: 'right' }}>轉移數量</th>
                  <th style={{ textAlign: 'right' }}>美元估值</th>
                  <th>風險狀態</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--ink-muted)' }}>
                      無符合篩選條件之大額鏈上交易紀錄。
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map((tx) => (
                    <tr key={tx.id} className="is-clickable" onClick={() => onInspect(tx)}>
                      <td>
                        <div className="tabular" style={{ fontWeight: 500 }}>{tx.timestamp}</div>
                        <div className="tabular" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                          #{tx.blockHeight.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <span className="status-pill status-neutral">{tx.chain}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{tx.eventType}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <CopyableAddress address={tx.fromAddress} />
                          <ArrowRight size={14} color="#78716C" />
                          <CopyableAddress address={tx.toAddress} />
                        </div>
                      </td>
                      <td className="tabular" style={{ textAlign: 'right', fontWeight: 500 }}>
                        {tx.tokenAmount}
                      </td>
                      <td className="tabular" style={{ textAlign: 'right', fontWeight: 600 }}>
                        {formatUsdCompact(tx.usdValue)}
                      </td>
                      <td>
                        <StatusPill severity={tx.severity} />
                      </td>
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
