import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AppVersion {
  id: number;
  version: string;
  platform: string;
  fileName: string;
}

type Filter = 'ALL' | 'IOS' | 'ANDROID';

const DownloadPage: React.FC = () => {
  const [apps, setApps] = useState<AppVersion[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [downloading, setDownloading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/upload/apps');
      setApps(response.data);
    } catch (err: any) {
      console.error('Error fetching apps:', err);
      setError(err?.response?.data?.message ?? err?.message ?? '앱 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (app: AppVersion) => {
    try {
      setDownloading(app.id);
      const response = await axios.get(`/download/app/${app.id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', app.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    } finally {
      setDownloading(null);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none';
    const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
    if (fallback) fallback.style.display = 'flex';
  };

  const filteredApps = filter === 'ALL' ? apps : apps.filter(a => a.platform === filter);
  const iosCount = apps.filter(a => a.platform === 'IOS').length;
  const androidCount = apps.filter(a => a.platform === 'ANDROID').length;

  return (
    <div className="page-shell">
      <section className="hero-section">
        <div>
          <p className="eyebrow">App Release Manager</p>
          <h2>앱 다운로드</h2>
          <p className="hero-description">
            등록된 앱 버전을 확인하고 원하는 버전을 다운로드하세요.
          </p>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-number">{apps.length}</span>
          <span className="hero-stat-label">등록된 앱</span>
        </div>
      </section>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>앱 목록</h3>
            <p>다운로드할 앱 버전을 선택하세요.</p>
          </div>
          <div className="filter-row" style={{ flex: '0 0 auto' }}>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilter('ALL')}
              >
                전체 {apps.length > 0 && <span style={{ opacity: 0.65 }}>({apps.length})</span>}
              </button>
              <button
                className={`filter-tab ${filter === 'IOS' ? 'active' : ''}`}
                onClick={() => setFilter('IOS')}
              >
                 iOS {iosCount > 0 && <span style={{ opacity: 0.65 }}>({iosCount})</span>}
              </button>
              <button
                className={`filter-tab ${filter === 'ANDROID' ? 'active' : ''}`}
                onClick={() => setFilter('ANDROID')}
              >
                🤖 Android {androidCount > 0 && <span style={{ opacity: 0.65 }}>({androidCount})</span>}
              </button>
            </div>
            <button className="ghost-button" onClick={fetchApps}>
              새로고침
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h4>불러오는 중...</h4>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h4>앱 목록을 불러오지 못했습니다</h4>
            <p style={{ color: 'var(--danger)', fontFamily: 'monospace', fontSize: '0.82rem', marginTop: '0.5rem' }}>{error}</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h4>앱이 없습니다</h4>
            <p>
              {filter === 'ALL'
                ? '업로드된 앱이 없습니다. 업로드 페이지에서 먼저 등록하세요.'
                : `등록된 ${filter} 앱이 없습니다.`}
            </p>
          </div>
        ) : (
          <div className="app-card-grid">
            {filteredApps.map((app) => (
              <article className="app-card" key={app.id}>
                <div className="app-icon-wrap">
                  <img
                    src={`/download/icon/${app.id}`}
                    alt={`${app.fileName} icon`}
                    className="app-icon"
                    onError={handleImageError}
                  />
                  <div className="app-icon-fallback">
                    {app.platform === 'IOS' ? '' : '🤖'}
                  </div>
                </div>

                <div className="app-info">
                  <div className="app-title-row">
                    <h4>{app.fileName}</h4>
                    <span className={`platform-badge ${app.platform.toLowerCase()}`}>
                      {app.platform}
                    </span>
                  </div>
                  <p>Version {app.version}</p>
                  <small>ID #{app.id}</small>
                </div>

                <button
                  className="dl-btn"
                  onClick={() => handleDownload(app)}
                  disabled={downloading === app.id}
                >
                  {downloading === app.id ? (
                    <>⏳ 받는 중</>
                  ) : (
                    <>⬇ 다운로드</>
                  )}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
