// filepath: /c:/Users/vshak/OneDrive/GitHub/Repositories/Threat-Intelligence-Dashboard/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './frontend/home';
import OSV from './frontend/osv'; // Import the OSV component
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/osv" element={<OSV />} />
      </Routes>
    </Router>
  </React.StrictMode>
);