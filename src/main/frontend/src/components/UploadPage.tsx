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
    if (!window.confirm('Are you sure you want to delete this app?')) return;
    try {
      await axios.delete(`/upload/apps/${id}`);
      setApps(apps.filter(app => app.id !== id));
      alert('App deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed!');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
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
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', platform);
    formData.append('version', version);

    try {
      await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });
      alert('Upload successful!');
      fetchApps(); // Refresh the list
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed!');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload App</h2>
      <div className="mb-3">
        <label htmlFor="version" className="form-label">Version</label>
        <input
          type="text"
          className="form-control"
          id="version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="platform" className="form-label">Platform</label>
        <select
          id="platform"
          className="form-select"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="file" className="form-label">Select File</label>
        <input
          type="file"
          className="form-control"
          id="file"
          onChange={handleFileChange}
        />
      </div>
      {plistData && (
        <div className="mb-3">
          <h3>Plist Data</h3>
          <pre>{JSON.stringify(plistData, null, 2)}</pre>
        </div>
      )}
      <button className="btn btn-primary" onClick={handleUpload} disabled={!file || !version}>
        Upload
      </button>
      {uploadProgress > 0 && (
        <div className="mt-3">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${uploadProgress}%` }}
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {uploadProgress}%
            </div>
          </div>
        </div>
      )}
      <h3 className="mt-5">Uploaded Apps</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Version</th>
            <th>Platform</th>
            <th>File Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.version}</td>
              <td>{app.platform}</td>
              <td>{app.fileName}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(app.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadPage;