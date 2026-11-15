import React, { useEffect, useState } from 'react';
import { ArrowDown, ExternalLink, X } from 'lucide-react';
import { InspectionRecord } from '../types/onchain';
import { formatUsdCompact, getExplorerTxUrl, resolveEntity } from '../data/entities';
import { CopyableAddress } from './CopyableAddress';
import { StatusPill } from './StatusPill';

interface InspectionDrawerProps {
  record: InspectionRecord | null;
  onClose: () => void;
}

type DrawerTab = 'flow' | 'risk' | 'payload';

export const InspectionDrawer: React.FC<InspectionDrawerProps> = ({ record, onClose }) => {
  const [tab, setTab] = useState<DrawerTab>('flow');

  useEffect(() => {
    setTab('flow');
  }, [record?.id]);

  useEffect(() => {
    if (!record) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [record, onClose]);

  if (!record) return null;

  const fromEntity = resolveEntity(record.fromAddress);
  const toEntity = resolveEntity(record.toAddress);

  return (
    <div
      className="drawer-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="交易與合約風險檢視"
    >
      <aside className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <StatusPill severity={record.severity} />
              <span className="status-pill status-neutral">{record.chain}</span>
              <span className="tabular" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                區塊 #{record.blockHeight.toLocaleString()}
              </span>
            </div>
            <h2 style={{ fontSize: 18 }}>{record.eventType} — 鏈上明細檢視</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-secondary)' }}>
              {record.summary}
            </p>
          </div>
          <button
            type="button"
            className="copy-btn"
            onClick={onClose}
            aria-label="關閉檢視面板"
            style={{ padding: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'flow'}
            className={`drawer-tab ${tab === 'flow' ? 'is-active' : ''}`}
            onClick={() => setTab('flow')}
          >
            交易流向與實體
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'risk'}
            className={`drawer-tab ${tab === 'risk' ? 'is-active' : ''}`}
            onClick={() => setTab('risk')}
          >
            風險拆解 ({record.riskScore}/100)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'payload'}
            className={`drawer-tab ${tab === 'payload' ? 'is-active' : ''}`}
            onClick={() => setTab('payload')}
          >
            原始 Payload
          </button>
        </div>

        <div className="drawer-body">
          {tab === 'flow' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 16, backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>發送方 (From)</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  {fromEntity ? `${fromEntity.name}（${fromEntity.category}）` : '未標註外部位址 / 合約'}
                </div>
                <CopyableAddress address={record.fromAddress} showEntityTag={false} head={12} tail={10} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0', color: 'var(--ink-muted)' }}>
                  <ArrowDown size={15} />
                  <span className="tabular" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)' }}>
                    {record.tokenAmount}
                    {record.usdValue > 0 ? ` (${formatUsdCompact(record.usdValue)})` : ''}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>接收方 / 目標合約 (To)</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  {toEntity ? `${toEntity.name}（${toEntity.category}）` : '未標註位址 / 智能合約'}
                </div>
                <CopyableAddress address={record.toAddress} showEntityTag={false} head={12} tail={10} />
              </div>

              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-secondary)' }}>時間戳記</span>
                  <span className="tabular">{record.timestamp} (UTC+8)</span>

                  <span style={{ color: 'var(--ink-secondary)' }}>交易雜湊</span>
                  <CopyableAddress address={record.txHash} showEntityTag={false} head={10} tail={8} />

                  <span style={{ color: 'var(--ink-secondary)' }}>網路手續費</span>
                  <span className="tabular">{record.gasFee}</span>

                  <span style={{ color: 'var(--ink-secondary)' }}>估值規模</span>
                  <span className="tabular" style={{ fontWeight: 600 }}>
                    {record.usdValue > 0 ? `$${record.usdValue.toLocaleString()}` : '合約部署 / 無直接轉帳'}
                  </span>
                </div>
              </div>

              <div>
                <a
                  href={getExplorerTxUrl(record.chain, record.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  於 {record.chain} 區塊瀏覽器查看
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

          {tab === 'risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>綜合異常風險評分</div>
                  <div className="tabular" style={{ fontSize: 28, fontWeight: 700, marginTop: 2 }}>
                    {record.riskScore} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink-muted)' }}>/ 100</span>
                  </div>
                </div>
                <StatusPill severity={record.severity} />
              </div>

              {record.riskChecks.map((chk, idx) => (
                <div key={idx} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{chk.label}</span>
                    <StatusPill
                      severity={chk.status}
                      customLabel={chk.status === 'high' ? '異常警告' : chk.status === 'warn' ? '需留意' : '通過'}
                    />
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-secondary)' }}>{chk.detail}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'payload' && (
            <div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-secondary)', marginBottom: 8 }}>
                節點解析原始交易 Payload 與特徵標籤：
              </div>
              <pre className="payload-box">{JSON.stringify(record.rawPayload, null, 2)}</pre>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
