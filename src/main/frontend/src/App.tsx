import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import DownloadPage from './components/DownloadPage';
import './App.css';

function App() {
  return (
      <Router>
        <div className="App">
          <header className="top-nav">
            <div className="brand">
              <div className="brand-logo">A</div>
              <div>
                <h1>App Manager</h1>
                <span>Mobile release dashboard</span>
              </div>
            </div>

            <nav className="nav-links">
              <NavLink to="/upload" className={({ isActive }) => isActive ? 'active' : ''}>
                Upload
              </NavLink>
              <NavLink to="/download" className={({ isActive }) => isActive ? 'active' : ''}>
                Download
              </NavLink>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/download" element={<DownloadPage />} />
              <Route path="/" element={<Navigate to="/upload" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;