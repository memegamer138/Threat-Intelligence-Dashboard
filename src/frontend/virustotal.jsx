import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const VirusTotal = () => {
  const [query, setQuery] = useState('');
  const [scanType, setScanType] = useState('file');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchVirusTotalReport = async () => {
    if (!query.trim()) {
      setError('Please enter a query.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/virustotal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query, type: scanType }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch VirusTotal report.');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (scanType) {
      case 'file':
        return 'Enter file hash (MD5, SHA-1, or SHA-256)';
      case 'url':
        return 'Enter URL (e.g., https://example.com)';
      case 'domain':
        return 'Enter domain (e.g., example.com)';
      case 'ip':
        return 'Enter IP address (e.g., 8.8.8.8)';
      default:
        return 'Enter query';
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/osv')}>Google OSV</button>
        <button onClick={() => navigate('/virustotal')}>VirusTotal</button>
        <button onClick={() => navigate('/alienvault')}>AlienVault OTX</button>
      </nav>
      <div className="content">
        <h1>VirusTotal Analysis</h1>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <strong>Scan Type: </strong>
            <select value={scanType} onChange={(e) => setScanType(e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
              <option value="file">File Hash</option>
              <option value="url">URL</option>
              <option value="domain">Domain</option>
              <option value="ip">IP Address</option>
            </select>
          </label>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={getPlaceholder()}
          style={{ padding: '8px', width: '400px', marginRight: '10px' }}
        />
        <button onClick={fetchVirusTotalReport}>Analyze</button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && !result && query && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No data found for this query.</p>
        )}
        {result && (
          <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #ddd', borderRadius: '8px' }}>
            <h2>Analysis Results</h2>
            <div style={{ marginBottom: '10px' }}>
              <strong>ID:</strong> {result.id}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Type:</strong> {result.type}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Detection Stats:</strong>
              <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                <div style={{ color: 'red' }}>🔴 Malicious: {result.malicious}</div>
                <div style={{ color: 'orange' }}>🟠 Suspicious: {result.suspicious}</div>
                <div style={{ color: 'green' }}>🟢 Harmless: {result.harmless}</div>
                <div style={{ color: 'gray' }}>⚪ Undetected: {result.undetected}</div>
                <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
                  Total Scans: {result.total_votes}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Reputation Score:</strong> {result.reputation}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Last Analysis:</strong> {new Date(result.last_analysis_date * 1000).toLocaleString()}
            </div>
            {result.categories && Object.keys(result.categories).length > 0 && (
              <div>
                <strong>Categories:</strong>
                <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                  {Object.entries(result.categories).map(([key, value], i) => (
                    <div key={i}>{key}: {value}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VirusTotal;
