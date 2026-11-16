import React from 'react';

export type PageTab = 'overview' | 'whales' | 'markets' | 'ledger' | 'media';

interface HeaderProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  marketSource: 'live-coingecko' | 'baseline';
}

const CROSS_SITES = [
  { label: '總門戶', href: 'https://bossliugen.github.io/GENWeb/', current: false },
  { label: '中古車庫', href: 'https://bossliugen.github.io/Used_Cars9918/', current: false },
  { label: '鏈上監測', href: 'https://bossliugen.github.io/block_Tracking/', current: true },
  { label: 'F1 遙測', href: 'https://bossliugen.github.io/GEWEB-F1/', current: false },
];

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
        {/* Top Row: Brand Lockup (Links to GENWeb) + Cross-Site Switcher */}
        <div className="top-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a
              href="https://bossliugen.github.io/GENWeb/"
              className="brand-lockup"
              aria-label="返回 GEN. 總門戶"
              title="返回 GEN. 總門戶"
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
                <circle cx="29" cy="9" r="2.25" fill="#C2593F" />
              </svg>
              <span className="brand-wordmark">
                GEN<span className="brand-dot">.</span>
              </span>
            </a>

            <span className="site-index-tag">01 / ON-CHAIN PULSE</span>
          </div>

          <nav className="cross-site-switcher" aria-label="GEN. 跨站切換">
            {CROSS_SITES.map((site) => (
              <a
                key={site.label}
                href={site.href}
                className={`cross-site-pill ${site.current ? 'is-current' : ''}`}
                aria-current={site.current ? 'page' : undefined}
              >
                {site.current && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#C2593F',
                      display: 'inline-block',
                    }}
                  />
                )}
                <span>{site.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Sub-Row: Internal Sub-Page Tabs + Live Sync Status */}
        <div className="top-header-subnav">
          <nav className="nav-tabs" aria-label="站內功能分頁">
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
      </div>
    </header>
  );
};
