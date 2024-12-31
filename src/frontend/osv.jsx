import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const OSV = () => {
  const [query, setQuery] = useState('');
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
      const response = await fetch('https://api.osv.dev/v1/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vulnerabilities.');
      }

      const data = await response.json();
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
        <button onClick={() => navigate('/osv')}>Fetch OSV</button>
        {/* Add more buttons for other features here */}
      </nav>
      <div className="content">
        <h1>Vulnerability Search</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query"
        />
        <button onClick={fetchVulnerabilities}>Search</button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {vulnerabilities.map((vuln, index) => (
            <li key={index}>{vuln.summary}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OSV;