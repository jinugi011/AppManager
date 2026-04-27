import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import DownloadPage from './components/DownloadPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>App Manager</h1>
        </header>
        <main>
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/" element={<div>Welcome to App Manager</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;