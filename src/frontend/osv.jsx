// filepath: /c:/Users/vshak/OneDrive/GitHub/Repositories/Threat-Intelligence-Dashboard/src/frontend/osv.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const OSV = () => {
  const [packageName, setPackageName] = useState('');
  const [ecosystem, setEcosystem] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOSVVulnerabilities = async (packageName, ecosystem) => {
    const payload = {
      package: {
        name: packageName,
        ecosystem: ecosystem,
      },
    };

    console.log('Request payload:', payload);

    try {
      const response = await fetch('/v1/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response:', response);

      if (!response.ok) {
        throw new Error('Failed to fetch vulnerabilities.');
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error);
      return null;
    }
  };

  const processVulnerabilities = (vulnData) => {
    if (!vulnData || !vulnData.vulns) {
      console.log('No vulnerabilities found or invalid data');
      return [];
    }

    const vulnerabilities = vulnData.vulns.map((vuln) => ({
      id: vuln.id || 'N/A',
      summary: vuln.summary || 'No summary available',
      severity: vuln.severity || 'Unknown',
      published: vuln.published || 'Unknown date',
      references: vuln.references ? vuln.references.map((ref) => ref.url) : [],
    }));

    return vulnerabilities;
  };

  const fetchAndProcessVulnerabilities = async () => {
    if (!packageName.trim() || !ecosystem.trim()) {
      setError('Please enter both package name and ecosystem.');
      setVulnerabilities([]);
      return;
    }

    setLoading(true);
    setError('');
    setVulnerabilities([]);

    const vulnData = await fetchOSVVulnerabilities(packageName, ecosystem);

    if (vulnData) {
      const processedVulns = processVulnerabilities(vulnData);
      setVulnerabilities(processedVulns);
    } else {
      setError('Failed to fetch vulnerabilities.');
    }

    setLoading(false);
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
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="Enter package name"
        />
        <input
          type="text"
          value={ecosystem}
          onChange={(e) => setEcosystem(e.target.value)}
          placeholder="Enter ecosystem"
        />
        <button onClick={fetchAndProcessVulnerabilities}>Search</button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {vulnerabilities.map((vuln, index) => (
            <li key={index}>
              <p><strong>Vulnerability ID:</strong> {vuln.id}</p>
              <p><strong>Summary:</strong> {vuln.summary}</p>
              <p><strong>Severity:</strong> {vuln.severity}</p>
              <p><strong>Published:</strong> {vuln.published}</p>
              <p><strong>References:</strong> {vuln.references.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OSV;