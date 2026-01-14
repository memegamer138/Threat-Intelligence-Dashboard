import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const OSV = () => {
  const [query, setQuery] = useState('');
  const [ecosystem, setEcosystem] = useState('PyPI');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchVulnerabilities = async () => {
    if (!query.trim()) {
      setError('Please enter a query.');
      setVulnerabilities([]);
      return;
    }

    setLoading(true);
    setError('');
    setVulnerabilities([]);

    try {
      const response = await fetch('http://localhost:5000/api/osv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ package: query, ecosystem: ecosystem }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vulnerabilities.');
      }

      const data = await response.json();
      console.log('Response data:', data);
      setVulnerabilities(data.vulnerabilities || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
        <h1>Vulnerability Search</h1>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <strong>Ecosystem: </strong>
            <select value={ecosystem} onChange={(e) => setEcosystem(e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
              <option value="PyPI">PyPI (Python)</option>
              <option value="npm">npm (JavaScript/Node.js)</option>
              <option value="Maven">Maven (Java)</option>
              <option value="Go">Go</option>
              <option value="crates.io">Cargo (Rust)</option>
              <option value="NuGet">NuGet (.NET)</option>
              <option value="Packagist">Packagist (PHP)</option>
              <option value="RubyGems">RubyGems (Ruby)</option>
              <option value="Pub">Pub (Dart/Flutter)</option>
              <option value="Hex">Hex (Erlang/Elixir)</option>
              <option value="Linux">Linux (Debian, Alpine, etc.)</option>
            </select>
          </label>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter package name"
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={fetchVulnerabilities}>Search</button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && vulnerabilities.length === 0 && query && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No vulnerabilities found for this package.</p>
        )}
        <div>
          {vulnerabilities.map((vuln, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <h3>{vuln.id}</h3>
              <p><strong>Summary:</strong> {vuln.summary}</p>
              <p><strong>Severity:</strong> {
                Array.isArray(vuln.severity) 
                  ? vuln.severity.map((s, i) => <div key={i}>{s.type}: {s.score}</div>)
                  : vuln.severity || 'Unknown'
              }</p>
              <p><strong>Published:</strong> {vuln.published}</p>
              {vuln.references && vuln.references.length > 0 && (
                <div>
                  <strong>References:</strong>
                  <ul>
                    {vuln.references.map((ref, i) => (
                      <li key={i}><a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OSV;