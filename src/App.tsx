import React, { useCallback, useEffect, useState } from 'react';
import { ChainId, InspectionRecord, TokenMarketItem } from './types/onchain';
import { BASELINE_TOKENS, fetchLiveMarketTokens } from './services/marketApi';
import { Header, PageTab } from './components/Header';
import { ChainSearchBar } from './components/ChainSearchBar';
import { InspectionDrawer } from './components/InspectionDrawer';
import { OverviewPage } from './pages/OverviewPage';
import { WhaleFlowPage } from './pages/WhaleFlowPage';
import { PriceTrackerPage } from './pages/PriceTrackerPage';
import { TxLedgerPage } from './pages/TxLedgerPage';
import { MediaNewsPage } from './pages/MediaNewsPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageTab>('overview');
  const [selectedChain, setSelectedChain] = useState<ChainId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedRecord, setInspectedRecord] = useState<InspectionRecord | null>(null);

  const [tokens, setTokens] = useState<TokenMarketItem[]>(BASELINE_TOKENS);
  const [marketSource, setMarketSource] = useState<'live-coingecko' | 'baseline'>('baseline');
  const [updatedAt, setUpdatedAt] = useState<string>('初始化中');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const refreshMarket = useCallback(async () => {
    setIsRefreshing(true);
    const result = await fetchLiveMarketTokens();
    setTokens(result.tokens);
    setMarketSource(result.source);
    setUpdatedAt(result.updatedAt);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    refreshMarket();
    const timer = window.setInterval(refreshMarket, 60_000);
    return () => window.clearInterval(timer);
  }, [refreshMarket]);

  const handleSelectEntityAddress = (address: string) => {
    setSearchQuery(address);
    setActiveTab('ledger');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        marketSource={marketSource}
      />

      <main className="app-shell">
        <ChainSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedChain={selectedChain}
          onSelectChain={setSelectedChain}
        />

        {activeTab === 'overview' && (
          <OverviewPage
            selectedChain={selectedChain}
            searchQuery={searchQuery}
            onInspect={setInspectedRecord}
          />
        )}

        {activeTab === 'whales' && (
          <WhaleFlowPage
            selectedChain={selectedChain}
            searchQuery={searchQuery}
            onSelectEntityAddress={handleSelectEntityAddress}
          />
        )}

        {activeTab === 'markets' && (
          <PriceTrackerPage
            tokens={tokens}
            marketSource={marketSource}
            updatedAt={updatedAt}
            isRefreshing={isRefreshing}
            onRefresh={refreshMarket}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'ledger' && (
          <TxLedgerPage
            selectedChain={selectedChain}
            searchQuery={searchQuery}
            onInspect={setInspectedRecord}
          />
        )}

        {activeTab === 'media' && <MediaNewsPage />}
      </main>

      <InspectionDrawer
        record={inspectedRecord}
        onClose={() => setInspectedRecord(null)}
      />

      <footer className="site-footer">
        <span>© 2026 HIBOSS GEN. · 台灣</span>
        <div className="footer-links">
          <a href="https://bossliugen.github.io/GENWeb/" className="footer-link">
            總門戶
          </a>
          <a
            href="https://www.youtube.com/@hibossgen"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            YouTube
          </a>
          <a
            href="https://www.instagram.com/hiboss.gen/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
