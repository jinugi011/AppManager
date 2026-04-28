import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parse } from 'plist';

interface AppVersion {
  id: number;
  version: string;
  platform: string;
  fileName: string;
}

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<string>('ios');
  const [version, setVersion] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [plistData, setPlistData] = useState<any>(null);
  const [apps, setApps] = useState<AppVersion[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await axios.get('/upload/apps');
      setApps(response.data);
    } catch (error) {
      console.error('Error fetching apps:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 앱을 삭제할까요?')) return;

    try {
      await axios.delete(`/upload/apps/${id}`);
      setApps(apps.filter(app => app.id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none';
    const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    setPlistData(null);
    setUploadProgress(0);

    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.name.endsWith('.plist')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = parse(e.target?.result as string);
            setPlistData(data);
          } catch (error) {
            console.error('Error parsing plist:', error);
          }
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !version.trim()) return;

    const formData = new FormData();
    formData.append('appFile', file);
    formData.append('platform', platform.toUpperCase());
    formData.append('version', version.trim());

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });

      alert('업로드가 완료되었습니다.');
      setFile(null);
      setVersion('');
      setPlistData(null);
      setUploadProgress(0);
      fetchApps();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <div className="page-shell">
        <section className="hero-section">
          <div>
            <p className="eyebrow">App Release Manager</p>
            <h2>앱 버전 업로드</h2>
            <p className="hero-description">
              Android APK/AAB 또는 iOS IPA 파일을 업로드하고 배포 버전을 관리하세요.
            </p>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">{apps.length}</span>
            <span className="hero-stat-label">등록된 앱</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel upload-panel">
            <div className="panel-header">
              <div>
                <h3>새 버전 등록</h3>
                <p>버전, 플랫폼, 파일을 선택한 뒤 업로드하세요.</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="version">Version</label>
              <input
                  type="text"
                  className="modern-input"
                  id="version"
                  placeholder="예: 1.0.3"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  required
              />
            </div>

            <div className="form-group">
              <label>Platform</label>
              <div className="platform-toggle">
                <button
                    type="button"
                    className={`platform-option ${platform === 'ios' ? 'active' : ''}`}
                    onClick={() => setPlatform('ios')}
                >
                  <span className="platform-icon"></span>
                  iOS
                </button>
                <button
                    type="button"
                    className={`platform-option ${platform === 'android' ? 'active' : ''}`}
                    onClick={() => setPlatform('android')}
                >
                  <span className="platform-icon">🤖</span>
                  Android
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="file">App File</label>
              <label className="file-dropzone" htmlFor="file">
                <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                />
                <span className="file-dropzone-icon">⬆</span>
                <strong>{file ? file.name : '파일을 선택하거나 클릭하세요'}</strong>
                <small>APK, AAB, IPA, PLIST 파일 업로드 가능</small>
              </label>
            </div>

            {plistData && (
                <div className="plist-preview">
                  <h4>Plist Preview</h4>
                  <pre>{JSON.stringify(plistData, null, 2)}</pre>
                </div>
            )}

            <button
                className="primary-action"
                onClick={handleUpload}
                disabled={!file || !version.trim() || isUploading}
            >
              {isUploading ? '업로드 중...' : '업로드'}
            </button>

            {uploadProgress > 0 && (
                <div className="progress-wrap">
                  <div className="progress-meta">
                    <span>Upload Progress</span>
                    <strong>{uploadProgress}%</strong>
                  </div>
                  <div className="modern-progress">
                    <div
                        className="modern-progress-bar"
                        style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
            )}
          </div>

          <div className="panel list-panel">
            <div className="panel-header">
              <div>
                <h3>업로드된 앱</h3>
                <p>등록된 앱 버전과 플랫폼을 확인할 수 있습니다.</p>
              </div>
              <button className="ghost-button" onClick={fetchApps}>
                새로고침
              </button>
            </div>

            {apps.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h4>등록된 앱이 없습니다</h4>
                  <p>왼쪽 폼에서 첫 번째 앱 버전을 업로드하세요.</p>
                </div>
            ) : (
                <div className="app-card-grid">
                  {apps.map((app) => (
                      <article className="app-card" key={app.id}>
                        <div className="app-icon-wrap">
                          <img
                              src={`/download/icon/${app.id}`}
                              alt={`${app.fileName} icon`}
                              className="app-icon"
                              onError={handleImageError}
                          />
                          <div className="app-icon-fallback">
                            {app.platform === 'IOS' ? '' : '🤖'}
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
                            className="danger-button"
                            onClick={() => handleDelete(app.id)}
                        >
                          삭제
                        </button>
                      </article>
                  ))}
                </div>
            )}
          </div>
        </section>
      </div>
  );
};

export default UploadPage;