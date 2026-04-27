import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AppVersion {
  id: number;
  version: string;
  platform: string;
  fileName: string;
}

const DownloadPage: React.FC = () => {
  const [apps, setApps] = useState<AppVersion[]>([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await axios.get('/apps');
      setApps(response.data);
    } catch (error) {
      console.error('Error fetching apps:', error);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await axios.get(`/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `app_${id}.ipa`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Download Apps</h2>
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
                  className="btn btn-primary"
                  onClick={() => handleDownload(app.id)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DownloadPage;