import React, { useState } from 'react';
import { ChainId, SupportedChain } from '../types/onchain';
import { formatUsdCompact } from '../data/entities';

interface ActivityHeatmapProps {
  selectedChain: ChainId;
}

interface HeatmapCell {
  chain: SupportedChain;
  hourSlot: string;
  txCount: number;
  volumeUsd: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  hasAnomaly?: boolean;
}

const TIME_SLOTS = [
  '00:00',
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
];

const CHAINS_ORDER: SupportedChain[] = ['Ethereum', 'Solana', 'Sui', 'BSC'];

// Deterministic 24h multi-chain institutional & whale activity matrix
const HEATMAP_DATA: HeatmapCell[] = [
  // Ethereum
  { chain: 'Ethereum', hourSlot: '00:00', txCount: 4, volumeUsd: 18400000, intensity: 2 },
  { chain: 'Ethereum', hourSlot: '02:00', txCount: 2, volumeUsd: 6200000, intensity: 1 },
  { chain: 'Ethereum', hourSlot: '04:00', txCount: 3, volumeUsd: 11500000, intensity: 1 },
  { chain: 'Ethereum', hourSlot: '06:00', txCount: 6, volumeUsd: 34800000, intensity: 2 },
  { chain: 'Ethereum', hourSlot: '08:00', txCount: 9, volumeUsd: 78200000, intensity: 3 },
  { chain: 'Ethereum', hourSlot: '10:00', txCount: 14, volumeUsd: 371800000, intensity: 4, hasAnomaly: true },
  { chain: 'Ethereum', hourSlot: '12:00', txCount: 7, volumeUsd: 49300000, intensity: 3 },
  { chain: 'Ethereum', hourSlot: '14:00', txCount: 5, volumeUsd: 26100000, intensity: 2 },
  { chain: 'Ethereum', hourSlot: '16:00', txCount: 8, volumeUsd: 61400000, intensity: 3 },
  { chain: 'Ethereum', hourSlot: '18:00', txCount: 6, volumeUsd: 41200000, intensity: 2 },
  { chain: 'Ethereum', hourSlot: '20:00', txCount: 11, volumeUsd: 124500000, intensity: 4 },
  { chain: 'Ethereum', hourSlot: '22:00', txCount: 7, volumeUsd: 52900000, intensity: 3 },

  // Solana
  { chain: 'Solana', hourSlot: '00:00', txCount: 3, volumeUsd: 9400000, intensity: 1 },
  { chain: 'Solana', hourSlot: '02:00', txCount: 1, volumeUsd: 2100000, intensity: 1 },
  { chain: 'Solana', hourSlot: '04:00', txCount: 0, volumeUsd: 0, intensity: 0 },
  { chain: 'Solana', hourSlot: '06:00', txCount: 4, volumeUsd: 15800000, intensity: 2 },
  { chain: 'Solana', hourSlot: '08:00', txCount: 7, volumeUsd: 38200000, intensity: 3 },
  { chain: 'Solana', hourSlot: '10:00', txCount: 9, volumeUsd: 51600000, intensity: 3 },
  { chain: 'Solana', hourSlot: '12:00', txCount: 5, volumeUsd: 19400000, intensity: 2 },
  { chain: 'Solana', hourSlot: '14:00', txCount: 4, volumeUsd: 14200000, intensity: 2 },
  { chain: 'Solana', hourSlot: '16:00', txCount: 6, volumeUsd: 27900000, intensity: 2 },
  { chain: 'Solana', hourSlot: '18:00', txCount: 8, volumeUsd: 44100000, intensity: 3 },
  { chain: 'Solana', hourSlot: '20:00', txCount: 5, volumeUsd: 21500000, intensity: 2 },
  { chain: 'Solana', hourSlot: '22:00', txCount: 4, volumeUsd: 12800000, intensity: 1 },

  // Sui
  { chain: 'Sui', hourSlot: '00:00', txCount: 1, volumeUsd: 2400000, intensity: 1 },
  { chain: 'Sui', hourSlot: '02:00', txCount: 0, volumeUsd: 0, intensity: 0 },
  { chain: 'Sui', hourSlot: '04:00', txCount: 1, volumeUsd: 1900000, intensity: 1 },
  { chain: 'Sui', hourSlot: '06:00', txCount: 2, volumeUsd: 5100000, intensity: 1 },
  { chain: 'Sui', hourSlot: '08:00', txCount: 3, volumeUsd: 8900000, intensity: 2 },
  { chain: 'Sui', hourSlot: '10:00', txCount: 4, volumeUsd: 13860000, intensity: 2 },
  { chain: 'Sui', hourSlot: '12:00', txCount: 2, volumeUsd: 4700000, intensity: 1 },
  { chain: 'Sui', hourSlot: '14:00', txCount: 1, volumeUsd: 2100000, intensity: 1 },
  { chain: 'Sui', hourSlot: '16:00', txCount: 3, volumeUsd: 9200000, intensity: 2 },
  { chain: 'Sui', hourSlot: '18:00', txCount: 2, volumeUsd: 6300000, intensity: 1 },
  { chain: 'Sui', hourSlot: '20:00', txCount: 3, volumeUsd: 10400000, intensity: 2 },
  { chain: 'Sui', hourSlot: '22:00', txCount: 1, volumeUsd: 2800000, intensity: 1 },

  // BSC
  { chain: 'BSC', hourSlot: '00:00', txCount: 2, volumeUsd: 5200000, intensity: 1 },
  { chain: 'BSC', hourSlot: '02:00', txCount: 1, volumeUsd: 1800000, intensity: 1 },
  { chain: 'BSC', hourSlot: '04:00', txCount: 2, volumeUsd: 4600000, intensity: 1 },
  { chain: 'BSC', hourSlot: '06:00', txCount: 3, volumeUsd: 8400000, intensity: 2 },
  { chain: 'BSC', hourSlot: '08:00', txCount: 5, volumeUsd: 19200000, intensity: 2 },
  { chain: 'BSC', hourSlot: '10:00', txCount: 4, volumeUsd: 11470000, intensity: 2, hasAnomaly: true },
  { chain: 'BSC', hourSlot: '12:00', txCount: 3, volumeUsd: 7800000, intensity: 1 },
  { chain: 'BSC', hourSlot: '14:00', txCount: 2, volumeUsd: 4100000, intensity: 1 },
  { chain: 'BSC', hourSlot: '16:00', txCount: 4, volumeUsd: 14600000, intensity: 2 },
  { chain: 'BSC', hourSlot: '18:00', txCount: 3, volumeUsd: 9500000, intensity: 2 },
  { chain: 'BSC', hourSlot: '20:00', txCount: 5, volumeUsd: 16800000, intensity: 2 },
  { chain: 'BSC', hourSlot: '22:00', txCount: 2, volumeUsd: 5900000, intensity: 1 },
];

const INTENSITY_COLORS: Record<HeatmapCell['intensity'], string> = {
  0: '#FBF9F5',
  1: '#E7EFEA',
  2: '#B7D5C4',
  3: '#407A5B',
  4: '#1B4332',
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ selectedChain }) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const visibleChains = selectedChain === 'all' ? CHAINS_ORDER : [selectedChain];

  return (
    <div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ minWidth: 620 }}>
          {/* Time Header Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '96px repeat(12, minmax(0, 1fr))',
              gap: 6,
              marginBottom: 8,
            }}
          >
            <div />
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot}
                className="tabular"
                style={{ fontSize: 11, color: 'var(--ink-muted)', textAlign: 'center' }}
              >
                {slot}
              </div>
            ))}
          </div>

          {/* Chain Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {visibleChains.map((chain) => {
              const cells = HEATMAP_DATA.filter((d) => d.chain === chain);
              return (
                <div
                  key={chain}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '96px repeat(12, minmax(0, 1fr))',
                    gap: 6,
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-primary)' }}>
                    {chain}
                  </span>
                  {cells.map((cell) => {
                    const isActive =
                      hoveredCell?.chain === cell.chain && hoveredCell?.hourSlot === cell.hourSlot;
                    return (
                      <div
                        key={`${cell.chain}-${cell.hourSlot}`}
                        onMouseEnter={() => setHoveredCell(cell)}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          height: 28,
                          borderRadius: 5,
                          backgroundColor: INTENSITY_COLORS[cell.intensity],
                          border: isActive
                            ? '1.5px solid #1C1917'
                            : '1px solid var(--border-hairline)',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'border-color 120ms ease, transform 120ms ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={`${cell.chain} ${cell.hourSlot} — ${cell.txCount} 筆大額 (${formatUsdCompact(cell.volumeUsd)})`}
                      >
                        {cell.hasAnomaly && (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#991B1B',
                              border: '1px solid #FFFFFF',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Legend & Live Hover Readout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid var(--border-hairline)',
          fontSize: 12.5,
        }}
      >
        <div style={{ color: 'var(--ink-primary)', fontWeight: 500 }}>
          {hoveredCell ? (
            <span className="tabular">
              <strong>{hoveredCell.chain}</strong> · {hoveredCell.hourSlot} 時段：{hoveredCell.txCount} 筆大額轉移，合計{' '}
              <strong>{formatUsdCompact(hoveredCell.volumeUsd)}</strong>
              {hoveredCell.hasAnomaly ? '（含高風險異常警示）' : ''}
            </span>
          ) : (
            <span style={{ color: 'var(--ink-muted)' }}>
              將游標移至任一時段方格，即可檢視該鏈別 2 小時區間之大額交易筆數與美元總量。
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-muted)', fontSize: 11.5 }}>
          <span>低活躍</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: INTENSITY_COLORS[lvl as HeatmapCell['intensity']],
                border: '1px solid var(--border-hairline)',
                display: 'inline-block',
              }}
            />
          ))}
          <span>高密集</span>
          <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#991B1B',
                display: 'inline-block',
              }}
            />
            含異常事件
          </span>
        </div>
      </div>
    </div>
  );
};
