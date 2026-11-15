import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { resolveEntity, truncateAddress } from '../data/entities';

interface CopyableAddressProps {
  address: string;
  showEntityTag?: boolean;
  head?: number;
  tail?: number;
}

export const CopyableAddress: React.FC<CopyableAddressProps> = ({
  address,
  showEntityTag = true,
  head = 6,
  tail = 4,
}) => {
  const [copied, setCopied] = useState(false);
  const entity = showEntityTag ? resolveEntity(address) : undefined;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(address).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span className="addr-chip">
      {entity && (
        <span className="entity-tag" title={entity.name}>
          {entity.shortLabel}
        </span>
      )}
      <span className="mono" title={address}>
        {truncateAddress(address, head, tail)}
      </span>
      <button
        type="button"
        className="copy-btn"
        onClick={handleCopy}
        aria-label={`複製位址 ${address}`}
        title={copied ? '已複製' : '複製完整位址'}
      >
        {copied ? <Check size={13} color="#1B4332" /> : <Copy size={13} />}
      </button>
    </span>
  );
};
