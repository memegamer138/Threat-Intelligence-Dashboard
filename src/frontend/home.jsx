import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Import the CSS file for styling

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/osv')}>Google OSV</button>
        <button onClick={() => navigate('/virustotal')}>VirusTotal</button>
        <button onClick={() => navigate('/alienvault')}>AlienVault OTX</button>
      </nav>
      <div className="content">
        <h1>Threat Intelligence Dashboard</h1>
        <p>A dashboard that aggregates and visualizes real-time cybersecurity threat data.</p>
        <h2>Services Used:</h2>
        <ul>
          <li>
            <strong>Google OSV (Open Source Vulnerabilities):</strong>
            <p>The Open Source Vulnerabilities (OSV) database is a platform designed to provide reliable and actionable information about vulnerabilities in open-source software packages.</p>
          </li>
          <li>
            <strong>VirusTotal:</strong>
            <p>VirusTotal is a popular service used for analyzing files, URLs, domains, and IP addresses to detect malware, suspicious activities, and malicious content. It is widely used by cybersecurity professionals, developers, and organizations for threat intelligence and analysis.</p>
          </li>
        </ul>
        <h2>How to Use</h2>
        <p>Run the following command to start the application:</p>
        <p>In terminal 1:</p>
        <code>python src/main/app.py</code>
        <p>In terminal 2:</p>
        <code>npm install</code>
        <code>npm start</code>
      </div>
    </div>
  );
};

export default Home;