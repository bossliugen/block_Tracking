import React, { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface VideoItem {
  id: string;
  youtubeId: string;
  isShort: boolean;
  title: string;
  sourceLabel: string;
  publishedAt: string;
  category: string;
  summary: string;
  shareUrl: string;
}

const FEATURED_VIDEOS: VideoItem[] = [
  {
    id: 'vid-001',
    youtubeId: 'bjz5FPoq2ME',
    isShort: true,
    title: '鏈上資金與市場動態精選短評（YouTube Shorts）',
    sourceLabel: 'YouTube Shorts',
    publishedAt: '今日精選',
    category: '市場快訊',
    summary: '點擊播放器即可於站內直接觀看此部 Shorts 短影音，掌握即時市場動態與觀點解析。',
    shareUrl: 'https://youtube.com/shorts/bjz5FPoq2ME?feature=share',
  },
];

export const MediaNewsPage: React.FC = () => {
  const [playingIds, setPlayingIds] = useState<Record<string, boolean>>({});

  const startPlay = (id: string) => {
    setPlayingIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <RevealOnScroll>
        <section className="card enter-stagger enter-delay-2" style={{ padding: 24 }}>
          <div className="section-header" style={{ marginBottom: 18 }}>
            <div>
              <h1 className="section-title">影音相關消息專區</h1>
              <p className="section-subtitle">
                精選鏈上資金動向與市場快訊短影音，點擊影片卡片即可於網頁內直接播放觀看。
              </p>
            </div>
            <span className="status-pill status-safe">支援站內直接播放</span>
          </div>

          <div className="media-feature-grid">
            {FEATURED_VIDEOS.map((video) => {
              const isPlaying = Boolean(playingIds[video.id]);
              return (
                <React.Fragment key={video.id}>
                  {/* 9:16 Vertical YouTube Shorts Player */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 340,
                      aspectRatio: '9 / 16',
                      borderRadius: 10,
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: '#1C1917',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {isPlaying ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                        title={video.title}
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
                        onClick={() => startPlay(video.id)}
                        aria-label={`播放 ${video.title}`}
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
                          src={`https://i.ytimg.com/vi/${video.youtubeId}/oar2.jpg`}
                          onError={(e) => {
                            e.currentTarget.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
                          }}
                          alt={video.title}
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

                  {/* Editorial Details & Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="entity-tag">{video.sourceLabel}</span>
                      <span className="status-pill status-neutral">{video.category}</span>
                      <span style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>{video.publishedAt}</span>
                    </div>

                    <h2 style={{ fontSize: 20 }}>{video.title}</h2>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-secondary)', lineHeight: 1.7 }}>
                      {video.summary}
                    </p>

                    <div
                      className="card"
                      style={{
                        padding: 16,
                        backgroundColor: 'var(--bg-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        fontSize: 13,
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>影片資訊</div>
                      <div style={{ color: 'var(--ink-secondary)' }}>
                        格式：YouTube Shorts 直式短影音（9:16 比例）
                      </div>
                      <div style={{ color: 'var(--ink-secondary)' }}>
                        影片代碼：<span className="mono">{video.youtubeId}</span>
                      </div>
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
                          onClick={() => startPlay(video.id)}
                        >
                          <Play size={13} fill="#FFFFFF" />
                          立即於此頁播放
                        </button>
                      )}
                      <a
                        href={video.shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        於 YouTube 原頁面開啟
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
};
