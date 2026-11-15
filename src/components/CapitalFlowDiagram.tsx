import React, { useMemo, useState } from 'react';
import { InspectionRecord } from '../types/onchain';
import { formatUsdCompact, resolveEntity, truncateAddress } from '../data/entities';

interface CapitalFlowDiagramProps {
  transactions: InspectionRecord[];
  onInspect: (record: InspectionRecord) => void;
}

interface FlowNode {
  id: string;
  label: string;
  totalUsd: number;
  y: number;
}

export const CapitalFlowDiagram: React.FC<CapitalFlowDiagramProps> = ({
  transactions,
  onInspect,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Take top 6 largest USD transfers for clean, legible editorial topology
  const topFlows = useMemo(() => {
    return [...transactions]
      .filter((t) => t.usdValue > 0)
      .sort((a, b) => b.usdValue - a.usdValue)
      .slice(0, 6);
  }, [transactions]);

  const { leftNodes, rightNodes, links, maxUsd } = useMemo(() => {
    const leftMap = new Map<string, { label: string; totalUsd: number }>();
    const rightMap = new Map<string, { label: string; totalUsd: number }>();

    const getLabel = (addr: string) => {
      if (addr === '0x0000000000000000000000000000000000000000') return '國庫鑄造 / 發行合約';
      const ent = resolveEntity(addr);
      return ent ? ent.shortLabel : truncateAddress(addr, 5, 4);
    };

    topFlows.forEach((tx) => {
      const fLabel = getLabel(tx.fromAddress);
      const tLabel = getLabel(tx.toAddress);

      const curL = leftMap.get(tx.fromAddress) ?? { label: fLabel, totalUsd: 0 };
      curL.totalUsd += tx.usdValue;
      leftMap.set(tx.fromAddress, curL);

      const curR = rightMap.get(tx.toAddress) ?? { label: tLabel, totalUsd: 0 };
      curR.totalUsd += tx.usdValue;
      rightMap.set(tx.toAddress, curR);
    });

    const buildNodes = (map: Map<string, { label: string; totalUsd: number }>): FlowNode[] => {
      const arr = Array.from(map.entries());
      const usableHeight = 260;
      const step = arr.length > 1 ? usableHeight / (arr.length - 1) : 0;
      return arr.map(([id, info], idx) => ({
        id,
        label: info.label,
        totalUsd: info.totalUsd,
        y: arr.length === 1 ? 150 : 30 + idx * step,
      }));
    };

    const lNodes = buildNodes(leftMap);
    const rNodes = buildNodes(rightMap);
    const lById = new Map(lNodes.map((n) => [n.id, n]));
    const rById = new Map(rNodes.map((n) => [n.id, n]));

    const maxVal = Math.max(1, ...topFlows.map((t) => t.usdValue));
    const computedLinks = topFlows.map((tx) => ({
      tx,
      fromNode: lById.get(tx.fromAddress)!,
      toNode: rById.get(tx.toAddress)!,
    }));

    return { leftNodes: lNodes, rightNodes: rNodes, links: computedLinks, maxUsd: maxVal };
  }, [topFlows]);

  if (topFlows.length === 0) {
    return (
      <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13.5 }}>
        目前篩選條件下無大額資金流向可供繪製拓撲圖。
      </div>
    );
  }

  const getStrokeColor = (severity: InspectionRecord['severity']) => {
    if (severity === 'high') return '#991B1B';
    if (severity === 'warn') return '#B45309';
    return '#1B4332';
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 308"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
        role="img"
        aria-label="鏈上大額資金流向拓撲圖"
      >
        {/* Subtle column headers */}
        <text x="16" y="14" fontSize="11" fill="#78716C" fontWeight="600">
          資金發送端 (From)
        </text>
        <text x="844" y="14" fontSize="11" fill="#78716C" fontWeight="600" textAnchor="end">
          資金接收端 (To)
        </text>

        {/* Curved Bezier Flow Paths */}
        {links.map(({ tx, fromNode, toNode }) => {
          const isHovered = hoveredId === tx.id;
          const isDimmed = hoveredId !== null && !isHovered;
          const strokeWidth = Math.max(2, Math.round((tx.usdValue / maxUsd) * 14));
          const x1 = 216;
          const y1 = fromNode.y;
          const x2 = 644;
          const y2 = toNode.y;
          const cx1 = x1 + 160;
          const cx2 = x2 - 160;
          const pathD = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
          const color = getStrokeColor(tx.severity);

          return (
            <g
              key={tx.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredId(tx.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onInspect(tx)}
            >
              {/* Invisible wider hit area for easy hovering */}
              <path d={pathD} stroke="transparent" strokeWidth={18} fill="none" />
              <path
                d={pathD}
                stroke={color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeOpacity={isDimmed ? 0.14 : isHovered ? 0.85 : 0.42}
                fill="none"
                strokeLinecap="round"
                style={{ transition: 'stroke-opacity 180ms ease, stroke-width 180ms ease' }}
              />
              {isHovered && (
                <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 12})`}>
                  <rect
                    x="-76"
                    y="-14"
                    width="152"
                    height="24"
                    rx="5"
                    fill="#1C1917"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#FFFFFF"
                    fontWeight="600"
                  >
                    {tx.tokenSymbol} · {formatUsdCompact(tx.usdValue)}（點擊檢視）
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Left Nodes */}
        {leftNodes.map((node) => (
          <g key={`l-${node.id}`} transform={`translate(16, ${node.y - 16})`}>
            <rect
              width="200"
              height="32"
              rx="6"
              fill="#FBF9F5"
              stroke="#DFD9CE"
              strokeWidth="1"
            />
            <text x="10" y="14" fontSize="12" fontWeight="600" fill="#1C1917">
              {node.label}
            </text>
            <text x="10" y="26" fontSize="10.5" fill="#57534E">
              流出 {formatUsdCompact(node.totalUsd)}
            </text>
            <circle cx="200" cy="16" r="3.5" fill="#1C1917" />
          </g>
        ))}

        {/* Right Nodes */}
        {rightNodes.map((node) => (
          <g key={`r-${node.id}`} transform={`translate(644, ${node.y - 16})`}>
            <rect
              width="200"
              height="32"
              rx="6"
              fill="#FFFFFF"
              stroke="#DFD9CE"
              strokeWidth="1"
            />
            <circle cx="0" cy="16" r="3.5" fill="#1B4332" />
            <text x="12" y="14" fontSize="12" fontWeight="600" fill="#1C1917">
              {node.label}
            </text>
            <text x="12" y="26" fontSize="10.5" fill="#57534E">
              流入 {formatUsdCompact(node.totalUsd)}
            </text>
          </g>
        ))}
      </svg>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid var(--border-hairline)',
          fontSize: 12,
          color: 'var(--ink-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, backgroundColor: '#1B4332', display: 'inline-block', borderRadius: 2 }} />
            機構增持 / 國庫 / 正常歸集
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, backgroundColor: '#B45309', display: 'inline-block', borderRadius: 2 }} />
            做市商調撥 / 交易所異動
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, backgroundColor: '#991B1B', display: 'inline-block', borderRadius: 2 }} />
            高風險異常授權 / 警示
          </span>
        </div>
        <span>線條粗細代表美元估值規模，點擊連線可直接開啟明細抽屜</span>
      </div>
    </div>
  );
};
