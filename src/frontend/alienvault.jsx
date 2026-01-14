import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const AlienVault = () => {
  const [query, setQuery] = useState('');
  const [checkType, setCheckType] = useState('ip');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAlienVaultReport = async () => {
    if (!query.trim()) {
      setError('Please enter a query.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/alienvault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query, type: checkType }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AlienVault OTX report.');
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
    switch (checkType) {
      case 'ip':
        return 'Enter IP address (e.g., 8.8.8.8)';
      case 'domain':
        return 'Enter domain (e.g., example.com)';
      case 'url':
        return 'Enter URL (e.g., https://example.com)';
      case 'hash':
        return 'Enter file hash (MD5, SHA-1, or SHA-256)';
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
        <h1>AlienVault OTX Threat Intelligence</h1>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <strong>Check Type: </strong>
            <select value={checkType} onChange={(e) => setCheckType(e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
              <option value="ip">IP Address</option>
              <option value="domain">Domain</option>
              <option value="url">URL</option>
              <option value="hash">File Hash</option>
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
        <button onClick={fetchAlienVaultReport}>Check</button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && !result && query && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No threat intelligence found for this indicator.</p>
        )}
        {result && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ padding: '15px', border: '2px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
              <h2>Indicator Information</h2>
              <div style={{ marginBottom: '10px' }}>
                <strong>Indicator:</strong> {result.indicator}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Type:</strong> {result.type}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Reputation Score:</strong> <span style={{ color: result.reputation < 0 ? 'red' : 'green' }}>{result.reputation}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Threat Pulses:</strong> {result.pulse_count}
              </div>
              {result.country !== 'Unknown' && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Location:</strong> {result.city}, {result.country}
                </div>
              )}
              {result.asn !== 'Unknown' && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>ASN:</strong> {result.asn}
                </div>
              )}
            </div>

            {result.pulses && result.pulses.length > 0 && (
              <div>
                <h2>Related Threat Pulses</h2>
                {result.pulses.map((pulse, index) => (
                  <div key={index} style={{ marginBottom: '15px', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ marginTop: '0' }}>{pulse.name}</h3>
                    <p style={{ fontSize: '14px', color: '#555' }}>{pulse.description}</p>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Author:</strong> {pulse.author} | <strong>Created:</strong> {new Date(pulse.created).toLocaleDateString()}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Threat Score:</strong> <span style={{ color: pulse.threat_score > 5 ? 'red' : 'orange' }}>{pulse.threat_score}/10</span>
                    </div>
                    {pulse.tags && pulse.tags.length > 0 && (
                      <div>
                        <strong>Tags:</strong>
                        <div style={{ marginTop: '5px' }}>
                          {pulse.tags.map((tag, i) => (
                            <span key={i} style={{ 
                              display: 'inline-block',
                              padding: '3px 8px',
                              margin: '2px',
                              backgroundColor: '#007bff',
                              color: 'white',
                              borderRadius: '3px',
                              fontSize: '12px'
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlienVault;
