import React, { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface IncidentAttribution {
  id: string;
  asset: string;
  dropPct: string;
  windowLabel: string;
  priceMove: string;
  track: 'news' | 'onchain';
  trackLabel: string;
  severity: 'high' | 'warn' | 'safe';
  headline: string;
  causes: string[];
  watchPoint: string;
}

const FEATURED_SHORT = {
  id: 'vid-001',
  youtubeId: 'xCqlSeHG6K0',
  title: 'GEN. 急跌與異動事件解析：BTC -12.0%、KAVA -44.1%、INTC -28.6%',
  sourceLabel: 'YouTube Shorts · LOG 01 // 鏈上訊號局',
  publishedAt: '2026-11-15',
  category: '雙軌歸因專題',
  summary:
    '彙整 2026 年 11 月波段急跌超過 10% 之重大市場與系統事故，拆解消息面敘事衝擊與鏈上智能合約／槓桿清算技術面流向。',
  shareUrl: 'https://youtube.com/shorts/xCqlSeHG6K0?feature=share',
};

const INCIDENT_ATTRIBUTIONS: IncidentAttribution[] = [
  {
    id: 'btc-drawdown',
    asset: 'Bitcoin (BTC)',
    dropPct: '-12.0%',
    windowLabel: '2026-11-09 ➔ 2026-11-14',
    priceMove: '$75,572.70 ➔ $66,500.00',
    track: 'news',
    trackLabel: '消息面與資金面雙重衝擊',
    severity: 'warn',
    headline: '機構撤資、通膨升息預期與槓桿斷頭踩踏',
    causes: [
      '消息面：10 月底幣安 $6.3B 駭客案陰影使機構轉趨保守，加上美國期中選舉監管變數與 MSCI 指數調整傳聞，現貨 ETF 連續多日淨流出。',
      '宏觀面：美國 10 月 CPI 月增 0.4% 與 PPI 偏熱，10 年期美債殖利率突破 5%，市場擔憂聯準會延後降息甚至重啟升息。',
      '技術面／鏈上清算：跌破 $70,000 整數防線後引發連環強平，11/13 單日清算達 $1.62B（約 90% 為看多融資單）。',
    ],
    watchPoint: '觀察 $66,500 支撐區能否守穩，以及美國現貨比特幣 ETF 何時停止淨流出。',
  },
  {
    id: 'kava-exploit',
    asset: 'Kava (KAVA)',
    dropPct: '-44.1%',
    windowLabel: '2026-11-14（單日急跌）',
    priceMove: '$0.0680 ➔ $0.0380',
    track: 'onchain',
    trackLabel: '技術面／合約漏洞與跨鏈倒貨',
    severity: 'high',
    headline: '舊版借貸模組定價漏洞，跨鏈倒貨抽乾流動性',
    causes: [
      '技術漏洞：舊版 BUSD 抵押模組價格換算存在異常，攻擊者將抵押品估值人為放大約 24.3 萬倍。',
      '鏈上轉移：自借貸池合法借出 5,520 萬枚 KAVA，隨即將約 4,800 萬枚跨鏈轉入 BSC 直接拋售變現約 $2.1M（協議整體受損約 $3.8M）。',
    ],
    watchPoint: '團隊已確認無無限印幣；Upbit、Bithumb 已暫停充提並凍結跨鏈橋，等待修補完成。',
  },
  {
    id: 'intc-gap',
    asset: 'Intel (INTC)',
    dropPct: '-28.6%',
    windowLabel: '2026-10-29 ➔ 2026-10-30',
    priceMove: '$92.07 ➔ $65.76（盤中低點 $63.20）',
    track: 'news',
    trackLabel: '消息面／財報與財測衝擊',
    severity: 'warn',
    headline: '第四季財測低迷與晶圓廠擴建現金流壓力',
    causes: [
      '消息面：第三季財報公布後，Q4 營收與獲利指引遠低於市場共識。',
      '基本面壓力：先進製程供應卡關，加上晶圓廠擴建與 AI 資本支出燒錢速度過快，引發短期現金流疑慮。',
    ],
    watchPoint: '觀察 $63.20 財報日低點支撐力道，以及下一季毛利率回穩訊號。',
  },
];

export const MediaNewsPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const newsTrackItems = INCIDENT_ATTRIBUTIONS.filter((i) => i.track === 'news');
  const onchainTrackItems = INCIDENT_ATTRIBUTIONS.filter((i) => i.track === 'onchain');

  const renderAttributionCard = (item: IncidentAttribution) => {
    const pillClass =
      item.severity === 'high'
        ? 'status-pill status-risk'
        : item.severity === 'warn'
          ? 'status-pill status-warn'
          : 'status-pill status-safe';

    return (
      <div
        key={item.id}
        className="card"
        style={{
          padding: 18,
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15.5 }}>{item.asset}</span>
            <span className={`${pillClass} tabular`} style={{ fontWeight: 600 }}>
              {item.dropPct}
            </span>
          </div>
          <span className="tabular" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
            {item.windowLabel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span className="entity-tag">{item.trackLabel}</span>
          <span className="tabular" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-primary)' }}>
            {item.priceMove}
          </span>
        </div>

        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-primary)' }}>
          {item.headline}
        </div>

        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--ink-secondary)' }}>
          {item.causes.map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>

        <div
          style={{
            marginTop: 4,
            padding: '8px 12px',
            borderRadius: 8,
            backgroundColor: 'var(--status-safe-bg)',
            color: 'var(--status-safe-fg)',
            fontSize: 12.5,
            fontWeight: 500,
          }}
        >
          後續觀察：{item.watchPoint}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Section 1: 9:16 Shorts Player + Brief */}
      <RevealOnScroll>
        <section className="card enter-stagger enter-delay-2" style={{ padding: 24 }}>
          <div className="section-header" style={{ marginBottom: 18 }}>
            <div>
              <h1 className="section-title">影音相關消息專區</h1>
              <p className="section-subtitle">
                結合 9:16 短影音快訊與雙軌事件歸因分析，協助您快速對照消息面敘事與鏈上真實資金流向。
              </p>
            </div>
            <span className="status-pill status-safe">站內影音與稽核連動</span>
          </div>

          <div className="media-feature-grid">
            {/* 9:16 Vertical YouTube Shorts Player */}
            <div
              style={{
                width: '100%',
                maxWidth: 340,
                aspectRatio: '9 / 16',
                borderRadius: 12,
                border: '1px solid var(--border-hairline)',
                backgroundColor: '#1C1917',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${FEATURED_SHORT.youtubeId}?autoplay=1&rel=0`}
                  title={FEATURED_SHORT.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                    display: 'block',
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label={`播放 ${FEATURED_SHORT.title}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'block',
                  }}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${FEATURED_SHORT.youtubeId}/oar2.jpg`}
                    onError={(e) => {
                      e.currentTarget.src = `https://i.ytimg.com/vi/${FEATURED_SHORT.youtubeId}/hqdefault.jpg`;
                    }}
                    alt={FEATURED_SHORT.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: 0.9,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(28, 25, 23, 0.72) 0%, rgba(28, 25, 23, 0.15) 50%, rgba(28, 25, 23, 0.1) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-hairline)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ink-primary)',
                      }}
                    >
                      <Play size={22} fill="#1C1917" style={{ marginLeft: 2 }} />
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.94)',
                        color: '#1C1917',
                        padding: '5px 12px',
                        borderRadius: 999,
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      點擊直接播放 Shorts
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Editorial Details & Social Funnel Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="entity-tag">{FEATURED_SHORT.sourceLabel}</span>
                <span className="status-pill status-neutral">{FEATURED_SHORT.category}</span>
                <span className="tabular" style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>
                  {FEATURED_SHORT.publishedAt}
                </span>
              </div>

              <h2 style={{ fontSize: 20 }}>{FEATURED_SHORT.title}</h2>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-secondary)', lineHeight: 1.7 }}>
                {FEATURED_SHORT.summary}
              </p>

              {/* Quick Summary KPI Strip for the Video */}
              <div className="grid-3">
                <div className="card" style={{ padding: 12, backgroundColor: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>BTC 5 日波段</div>
                  <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--status-warn-fg)' }}>
                    -12.0%
                  </div>
                  <div className="tabular" style={{ fontSize: 11.5, color: 'var(--ink-secondary)' }}>
                    $1.62B 槓桿清算
                  </div>
                </div>
                <div className="card" style={{ padding: 12, backgroundColor: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>KAVA 單日異常</div>
                  <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--status-risk-fg)' }}>
                    -44.1%
                  </div>
                  <div className="tabular" style={{ fontSize: 11.5, color: 'var(--ink-secondary)' }}>
                    5,520 萬枚借貸漏洞
                  </div>
                </div>
                <div className="card" style={{ padding: 12, backgroundColor: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>INTC 財報跳空</div>
                  <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--status-warn-fg)' }}>
                    -28.6%
                  </div>
                  <div className="tabular" style={{ fontSize: 11.5, color: 'var(--ink-secondary)' }}>
                    $92.07 ➔ $65.76
                  </div>
                </div>
              </div>

              {/* Action & Community Funnel */}
              <div
                className="card"
                style={{
                  padding: 16,
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)' }}>
                  影音頻道與 GEN. 生態系導流
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {!isPlaying && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        backgroundColor: 'var(--ink-primary)',
                        color: '#FFFFFF',
                        borderColor: 'var(--ink-primary)',
                      }}
                      onClick={() => setIsPlaying(true)}
                    >
                      <Play size={13} fill="#FFFFFF" />
                      立即於此頁播放
                    </button>
                  )}
                  <a
                    href={FEATURED_SHORT.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    YouTube 原片觀看
                    <ExternalLink size={13} />
                  </a>
                  <a
                    href="https://www.youtube.com/@hibossgen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    訂閱 YouTube（@hibossgen）
                    <ExternalLink size={13} />
                  </a>
                  <a
                    href="https://www.instagram.com/hiboss.gen/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    追蹤 IG（@hiboss.gen）
                    <ExternalLink size={13} />
                  </a>
                  <a
                    href="https://bossliugen.github.io/GENWeb/"
                    className="btn-secondary"
                  >
                    返回 GEN. 總門戶
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Section 2: Dual-Track Attribution (消息面 vs 技術面) */}
      <RevealOnScroll>
        <section className="grid-2">
          <div className="card" style={{ padding: 20, backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 17 }}>消息面／敘事事件歸因</h2>
                <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--ink-secondary)' }}>
                  宏觀通膨數據、機構信任撤資與企業財測下修
                </p>
              </div>
              <span className="status-pill status-warn">敘事與資金撤離</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {newsTrackItems.map(renderAttributionCard)}
            </div>
          </div>

          <div className="card" style={{ padding: 20, backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 17 }}>技術面／鏈上資金轉移歸因</h2>
                <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--ink-secondary)' }}>
                  智能合約定價漏洞、跨鏈橋拋售與高槓桿連環強平
                </p>
              </div>
              <span className="status-pill status-risk">合約與清算異動</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {onchainTrackItems.map(renderAttributionCard)}
              <div className="card" style={{ padding: 16, backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 6 }}>
                  鏈上清算與異常監測對照
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.65 }}>
                  KAVA 事件顯示「舊版廢棄合約模組」常成為攻擊破口；建議於本系統「總覽與異常監控」分頁持續追蹤未驗證合約授權（<span className="mono">UNVERIFIED_SPENDER_UNLIMITED_APPROVAL</span>）與跨鏈熱錢包大額異常轉入。
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
};
