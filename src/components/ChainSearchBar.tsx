import React from 'react';
import { Search, X } from 'lucide-react';
import { ChainId } from '../types/onchain';

interface ChainSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedChain: ChainId;
  onSelectChain: (c: ChainId) => void;
}

const CHAINS: { id: ChainId; label: string }[] = [
  { id: 'all', label: '全部鏈別' },
  { id: 'Ethereum', label: 'Ethereum' },
  { id: 'Solana', label: 'Solana' },
  { id: 'Sui', label: 'Sui' },
  { id: 'BSC', label: 'BSC' },
];

export const ChainSearchBar: React.FC<ChainSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedChain,
  onSelectChain,
}) => {
  return (
    <section className="search-bar-section enter-stagger enter-delay-1" aria-label="鏈別篩選與位址查詢">
      <div className="search-input-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜尋錢包位址、TX Hash、合約或機構名稱（如 BlackRock、Wintermute、Binance）..."
          aria-label="搜尋錢包位址、交易雜湊或機構名稱"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="清除搜尋"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="chain-pills" role="group" aria-label="區塊鏈網路篩選">
        {CHAINS.map((chain) => (
          <button
            key={chain.id}
            type="button"
            className={`chain-pill ${selectedChain === chain.id ? 'is-active' : ''}`}
            onClick={() => onSelectChain(chain.id)}
          >
            {chain.label}
          </button>
        ))}
      </div>
    </section>
  );
};
