import React from 'react';
import { SeverityLevel } from '../types/onchain';

interface StatusPillProps {
  severity: SeverityLevel;
  customLabel?: string;
}

const LABELS: Record<SeverityLevel, string> = {
  high: '高風險',
  warn: '異動提醒',
  safe: '正常紀錄',
};

export const StatusPill: React.FC<StatusPillProps> = ({ severity, customLabel }) => {
  const cls =
    severity === 'high'
      ? 'status-pill status-risk'
      : severity === 'warn'
        ? 'status-pill status-warn'
        : 'status-pill status-safe';

  return <span className={cls}>{customLabel ?? LABELS[severity]}</span>;
};
