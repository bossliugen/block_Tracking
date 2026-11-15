import React from 'react';

export type PageTab = 'overview' | 'whales' | 'markets' | 'ledger' | 'media';

interface HeaderProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  marketSource: 'live-coingecko' | 'baseline';
}

const NAV_ITEMS: { id: PageTab; label: string }[] = [
  { id: 'overview', label: '總覽與異常監控' },
  { id: 'whales', label: '資金流向與大戶追蹤' },
  { id: 'markets', label: '幣種挑選與價格追蹤' },
  { id: 'ledger', label: '鏈上交易紀錄' },
  { id: 'media', label: '影音相關消息' },
];

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, marketSource }) => {
  return (
    <header className="top-header enter-stagger enter-delay-0">
      <div className="top-header-inner">
        <button
          type="button"
          className="brand-lockup"
          onClick={() => onSelectTab('overview')}
          aria-label="返回 GEN. 總覽"
        >
          {/* Tight-cropped landscape 2D vector icon, zero outer padding */}
          <svg
            width="36"
            height="18"
            viewBox="0 0 36 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="3"
              width="12"
              height="12"
              rx="2.5"
              stroke="#1C1917"
              strokeWidth="1.75"
            />
            <rect
              x="23"
              y="3"
              width="12"
              height="12"
              rx="2.5"
              stroke="#1C1917"
              strokeWidth="1.75"
            />
            <path
              d="M13 9H16L18 4.5L20 13.5L22 9H23"
              stroke="#1C1917"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="29" cy="9" r="2.25" fill="#1B4332" />
          </svg>
          <span className="brand-wordmark">
            GEN<span className="brand-dot">.</span>
          </span>
        </button>

        <nav className="nav-tabs" aria-label="主功能分頁">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-tab ${activeTab === item.id ? 'is-active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-status" title="節點與報價狀態">
          <span className="header-status-dot" />
          <span>{marketSource === 'live-coingecko' ? '即時節點與報價同步中' : '節點同步中（基準報價）'}</span>
        </div>
      </div>
    </header>
  );
};
